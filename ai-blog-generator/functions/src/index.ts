import * as functions from 'firebase-functions';

interface GenerateRequest {
  topic: string;
  keywords: string[];
  tone: 'professional' | 'casual' | 'persuasive';
  length: 'short' | 'medium' | 'long';
  mode: 'title' | 'outline' | 'article';
  audience?: string;
}

interface GenerateResponse {
  title: string;
  metaDescription: string;
  content: string;
  alternatives: string[];
}

const LENGTH_WORD_TARGET: Record<GenerateRequest['length'], string> = {
  short: '350-600 words',
  medium: '800-1100 words',
  long: '1400-1800 words',
};

function buildPrompt(req: GenerateRequest) {
  const keywordList = req.keywords.length ? req.keywords.join(', ') : 'none';
  const audience = req.audience || 'a general audience';
  const wordTarget = LENGTH_WORD_TARGET[req.length];

  return [
    `Topic: ${req.topic}`,
    `Tone: ${req.tone}`,
    `Mode: ${req.mode}`,
    `Audience: ${audience}`,
    `Target length: ${wordTarget}`,
    `Keywords to weave in naturally: ${keywordList}`,
    req.mode === 'title'
      ? 'Create 5 strong SEO-friendly title options. Choose the best one as the title. The content field should explain why the selected title works.'
      : req.mode === 'outline'
        ? 'Create a markdown outline with an H1 title, H2/H3 sections, and clear bullet points for each section.'
        : 'Write a full markdown article with an H1 title, engaging intro, structured body, and strong conclusion.',
    'Return JSON only. Do not include markdown fences.',
  ].join('\n');
}

function safeJsonParse(raw: string): Partial<GenerateResponse> {
  try {
    return JSON.parse(raw) as Partial<GenerateResponse>;
  } catch {
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    return {
      title: titleMatch?.[1]?.trim() || 'Generated content',
      metaDescription: '',
      content: raw,
      alternatives: [],
    };
  }
}

export const generateBlog = functions
  .runWith({ secrets: ['OPENAI_API_KEY'] })
  .https.onCall(async (data: GenerateRequest, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Sign in with Google to generate content.');
    }

    if (!data?.topic || !data.topic.trim()) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing topic');
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Missing OPENAI_API_KEY secret');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.75,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are an expert SEO content strategist. Return valid JSON only with keys: title (string), metaDescription (string between 120 and 160 characters), content (markdown string), alternatives (array of 5 strings for title mode, otherwise empty array).',
          },
          {
            role: 'user',
            content: buildPrompt(data),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      functions.logger.error('OpenAI error', errorText);
      throw new functions.https.HttpsError('internal', 'OpenAI request failed');
    }

    const json = (await response.json()) as any;
    const raw = json.choices?.[0]?.message?.content ?? '{}';
    const parsed = safeJsonParse(raw);

    const title = parsed.title?.trim() || data.topic;
    const metaDescription = parsed.metaDescription?.trim() || `${title} — ${data.tone} blog content for ${data.audience || 'your audience'}.`;
    const content = parsed.content?.trim() || raw;
    const alternatives = Array.isArray(parsed.alternatives)
      ? parsed.alternatives.map((item) => String(item).trim()).filter(Boolean).slice(0, 5)
      : [];

    return {
      title,
      metaDescription,
      content,
      alternatives,
    } satisfies GenerateResponse;
  });