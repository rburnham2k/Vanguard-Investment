import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { GenerateRequest, GenerateResponse, Length, Mode, Tone } from './types';
import { deleteHistory, fetchHistory, generate, saveHistory } from './services/api';

interface HistoryEntry {
  id: string;
  topic: string;
  title: string;
  mode: Mode;
  tone: Tone;
  length: Length;
  keywords?: string[];
  metaDescription?: string;
  createdAtMs?: number;
}

interface Toast {
  id: number;
  message: string;
}

const MODE_HELP: Record<Mode, string> = {
  title: 'Generate multiple SEO-friendly headline options.',
  outline: 'Create a clean article structure with H1/H2/H3 hierarchy.',
  article: 'Write a full, polished article ready for editing or publishing.',
};

const LENGTH_HELP: Record<Length, string> = {
  short: '350-600 words',
  medium: '800-1100 words',
  long: '1400-1800 words',
};

const TONE_LABELS: Record<Tone, string> = {
  professional: 'Professional',
  casual: 'Casual',
  persuasive: 'Persuasive',
};

const TONE_OPTIONS: Tone[] = ['professional', 'casual', 'persuasive'];
const LENGTH_OPTIONS: Length[] = ['short', 'medium', 'long'];
const MODE_OPTIONS: Mode[] = ['title', 'outline', 'article'];
const TOPIC_MAX = 140;

let toastId = 0;

function Badge({ children }: { children: ReactNode }) {
  return <span className="badge">{children}</span>;
}

function StatTile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="stat-tile">
      <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-brand-muted">{hint}</p> : null}
    </div>
  );
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
  labels,
  disabled,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
  disabled?: boolean;
}) {
  return (
    <div className="pill-group" role="tablist">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            className={`pill ${active ? 'pill-active' : ''}`}
            onClick={() => onChange(option)}
          >
            {labels[option]}
          </button>
        );
      })}
    </div>
  );
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function GeneratingSkeleton() {
  return (
    <div className="mt-6 space-y-3" aria-live="polite">
      <div className="skeleton-line w-2/3" />
      <div className="skeleton-line w-full" />
      <div className="skeleton-line w-5/6" />
      <div className="skeleton-line w-4/5" />
      <div className="skeleton-line w-full" />
      <div className="skeleton-line w-3/4" />
    </div>
  );
}

function GeneratorForm({
  onResult,
  onSaved,
  onGeneratingChange,
  notify,
}: {
  onResult: (r: GenerateResponse) => void;
  onSaved: () => Promise<void> | void;
  onGeneratingChange: (loading: boolean) => void;
  notify: (message: string) => void;
}) {
  const { user, loading, signIn, logOut } = useAuth();
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [length, setLength] = useState<Length>('medium');
  const [mode, setMode] = useState<Mode>('article');
  const [audience, setAudience] = useState('');
  const [loadingGen, setLoadingGen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!user) return;
    if (!topic.trim()) {
      setError('Please add a topic first.');
      return;
    }

    setError(null);
    setLoadingGen(true);
    onGeneratingChange(true);

    try {
      const req: GenerateRequest = {
        topic,
        keywords: keywords
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean),
        tone,
        length,
        mode,
        audience: audience.trim() || undefined,
      };

      const res = await generate(req);
      onResult(res);
      await saveHistory(req, res);
      await onSaved();
      notify('Content generated and saved to history.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed.');
    } finally {
      setLoadingGen(false);
      onGeneratingChange(false);
    }
  }

  return (
    <section className="panel relative overflow-hidden">
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <Badge>AI Blog Studio</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Sophisticated blog generation powered by OpenAI and Firebase.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-brand-muted sm:text-base">
            Create title sets, outlines, and full articles with tone control, SEO suggestions, keyword integration,
            readability scoring, and Google sign-in for saved history.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge>Professional / Casual / Persuasive</Badge>
            <Badge>Short / Medium / Long</Badge>
            <Badge>SEO + Readability</Badge>
            <Badge>Google Email Login</Badge>
          </div>
        </div>

        <div className="flex min-w-[240px] flex-col items-stretch gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur transition hover:border-brand-gold/30">
          {loading ? (
            <p className="text-sm text-brand-muted">Checking sign-in status…</p>
          ) : user ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-brand-muted">Signed in as</p>
                <p className="mt-1 text-sm font-semibold text-white">{user.displayName || user.email}</p>
                <p className="text-xs text-brand-muted">{user.email}</p>
              </div>
              <button type="button" className="btn-secondary" onClick={logOut}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-brand-muted">Sign in with Google to generate and save content.</p>
              <button type="button" className="btn-primary" onClick={signIn}>
                Continue with Google
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-3">
        <StatTile label="Modes" value="3" hint="Title, outline, article" />
        <StatTile label="Tones" value="3" hint="Professional, casual, persuasive" />
        <StatTile label="Lengths" value="3" hint="Short, medium, long" />
      </div>

      <div className="relative z-10 mt-8 grid gap-4 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <label className="field-label" htmlFor="topic">
              Topic
            </label>
            <span className="text-[0.65rem] text-brand-muted">
              {topic.length}/{TOPIC_MAX}
            </span>
          </div>
          <input
            id="topic"
            className="input-field"
            value={topic}
            maxLength={TOPIC_MAX}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. How to choose the right retirement strategy"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="keywords">
            Keywords
          </label>
          <input
            id="keywords"
            className="input-field"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="comma separated keywords"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="audience">
            Audience
          </label>
          <input
            id="audience"
            className="input-field"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            placeholder="target reader or buyer persona"
          />
        </div>
      </div>

      <div className="relative z-10 mt-6 grid gap-5 sm:grid-cols-3">
        <div>
          <p className="field-label mb-2">Tone</p>
          <PillGroup options={TONE_OPTIONS} value={tone} onChange={setTone} labels={TONE_LABELS} />
        </div>
        <div>
          <p className="field-label mb-2">Length</p>
          <PillGroup
            options={LENGTH_OPTIONS}
            value={length}
            onChange={setLength}
            labels={{ short: 'Short', medium: 'Medium', long: 'Long' }}
          />
        </div>
        <div>
          <p className="field-label mb-2">Output</p>
          <PillGroup
            options={MODE_OPTIONS}
            value={mode}
            onChange={setMode}
            labels={{ title: 'Title', outline: 'Outline', article: 'Article' }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-brand-muted transition">
        <p className="font-semibold text-white">{MODE_HELP[mode]}</p>
        <p className="mt-1">
          Suggested length: {LENGTH_HELP[length]} · Tone: {TONE_LABELS[tone]}
        </p>
      </div>

      {error ? <p className="relative z-10 mt-4 text-sm text-red-300">{error}</p> : null}

      <button
        type="button"
        className="btn-primary relative z-10 mt-6 w-full"
        onClick={handleGenerate}
        disabled={loadingGen || loading || !user}
      >
        {loadingGen ? (
          <span className="flex items-center justify-center gap-2">
            <span className="spinner" />
            Generating…
          </span>
        ) : user ? (
          'Generate content'
        ) : (
          'Sign in to generate'
        )}
      </button>
    </section>
  );
}

function ResultPanel({ result, generating, notify }: { result: GenerateResponse | null; generating: boolean; notify: (message: string) => void }) {
  async function copyText(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      notify(`Copied ${label}.`);
    } catch {
      notify('Copy failed — please copy manually.');
    }
  }

  if (generating) {
    return (
      <section className="panel h-full">
        <Badge>Working…</Badge>
        <h2 className="mt-4 text-2xl font-semibold text-white">Generating your content</h2>
        <p className="mt-2 text-sm text-brand-muted">This usually takes a few seconds.</p>
        <GeneratingSkeleton />
      </section>
    );
  }

  if (!result) {
    return (
      <section className="panel h-full">
        <Badge>Preview</Badge>
        <h2 className="mt-4 text-2xl font-semibold text-white">Your generated content will appear here.</h2>
        <p className="mt-3 text-sm leading-6 text-brand-muted">
          Once you sign in and submit a topic, you’ll get a polished title, SEO recommendations, readability data,
          and a clean exportable draft.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <StatTile label="SEO" value="Live" hint="Title, meta, and keyword checks" />
          <StatTile label="Readability" value="Live" hint="Flesch score and grade level" />
          <StatTile label="History" value="Saved" hint="Firestore for signed-in users" />
        </div>
      </section>
    );
  }

  const hasTitles = result.mode === 'title' && (result.alternatives?.length || 0) > 0;

  return (
    <section className="panel h-full fade-in">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge>Latest result</Badge>
          <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{result.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-brand-muted">{result.metaDescription}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => copyText('content', result.content)}>
            Copy content
          </button>
          <button type="button" className="btn-secondary" onClick={() => copyText('meta description', result.metaDescription)}>
            Copy meta
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatTile label="Flesch" value={result.readability.fleschScore} hint={result.readability.gradeLevel} />
        <StatTile label="Words" value={result.readability.wordCount} hint={`${result.readability.sentenceCount} sentences`} />
        <StatTile label="SEO score" value={`${result.seoScore}/100`} hint="Heuristic analysis" />
      </div>

      {hasTitles ? (
        <div className="mt-6">
          <p className="field-label">Title options</p>
          <div className="mt-3 grid gap-2">
            {(result.alternatives || []).map((title, index) => (
              <button
                type="button"
                key={`${title}-${index}`}
                className="title-option"
                onClick={() => copyText('title', title)}
              >
                <span className="mr-2 text-brand-gold">0{index + 1}.</span>
                {title}
              </button>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-brand-muted">
            <p className="font-semibold text-white">Recommendation</p>
            <p className="mt-2 whitespace-pre-wrap">{result.content}</p>
          </div>
        </div>
      ) : (
        <article className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-white whitespace-pre-wrap">
          {result.content}
        </article>
      )}

      {result.seoSuggestions.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-brand-gold/20 bg-brand-gold/10 p-5">
          <p className="field-label">SEO suggestions</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/90">
            {result.seoSuggestions.map((suggestion, index) => (
              <li key={`${suggestion}-${index}`}>{suggestion}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function HistoryPanel({
  items,
  loading,
  signedIn,
  onDelete,
}: {
  items: HistoryEntry[];
  loading: boolean;
  signedIn: boolean;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <section className="panel h-full">
      <Badge>History</Badge>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-white">Recent generations</h3>
          <p className="mt-2 text-sm text-brand-muted">
            {signedIn ? 'Saved to Firestore with your Google account.' : 'Sign in to preserve generation history.'}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? <p className="text-sm text-brand-muted">Loading history…</p> : null}

        {!loading && items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-brand-muted">
            No saved generations yet.
          </p>
        ) : null}

        {items.map((item) => (
          <article key={item.id} className="history-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand-muted">{item.mode}</p>
                <h4 className="mt-1 font-semibold text-white">{item.title}</h4>
                <p className="mt-1 text-sm text-brand-muted">{item.topic}</p>
              </div>

              <button
                type="button"
                className="text-xs text-brand-gold transition hover:text-white"
                onClick={async () => {
                  if (window.confirm('Delete this saved generation?')) {
                    await onDelete(item.id);
                  }
                }}
              >
                Delete
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs text-brand-muted">
              <Badge>{TONE_LABELS[item.tone]}</Badge>
              <Badge>{item.length}</Badge>
              <Badge>{item.keywords?.length ? `${item.keywords.length} keywords` : 'No keywords'}</Badge>
            </div>

            {item.metaDescription ? <p className="mt-3 text-sm text-brand-muted">{item.metaDescription}</p> : null}

            {item.createdAtMs ? <p className="mt-3 text-xs text-brand-muted">{new Date(item.createdAtMs).toLocaleString()}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const notify = (message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message }]);
    toastTimers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      delete toastTimers.current[id];
    }, 2600);
  };

  useEffect(() => {
    return () => {
      Object.values(toastTimers.current).forEach(clearTimeout);
    };
  }, []);

  const loadHistory = async () => {
    if (!user) {
      setHistory([]);
      return;
    }

    setLoadingHistory(true);
    try {
      const saved = await fetchHistory();
      setHistory(saved as HistoryEntry[]);
    } catch {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    void loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id: string) => {
    await deleteHistory(id);
    await loadHistory();
    notify('Deleted from history.');
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <GeneratorForm
          onResult={setResult}
          onSaved={loadHistory}
          onGeneratingChange={setGenerating}
          notify={notify}
        />

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <ResultPanel result={result} generating={generating} notify={notify} />
          <HistoryPanel items={history} loading={loadingHistory} signedIn={Boolean(user)} onDelete={handleDelete} />
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </main>
  );
}

export default function AppShell() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
