export function analyzeSeo(params: { title: string; meta: string; content: string; keywords: string[] }) {
  const { title, meta, content, keywords } = params;
  const words = content.toLowerCase().replace(/[^a-z0-9\\s]/g,' ').split(/\\s+/).filter(Boolean);
  const wordCount = words.length || 1;
  const headingCount = (content.match(/^#{1,6}\\s+/gm) || []).length;
  const keywordDensity: Record<string, number> = {};
  let score = 100;
  const suggestions: string[] = [];

  if(title.length<30 || title.length>65){ suggestions.push('Title length should be 30-65 chars'); score-=10 }
  if(meta.length<120 || meta.length>160){ suggestions.push('Meta description should be 120-160 chars'); score-=10 }
  if(wordCount<600){ suggestions.push('Content is short; aim for 600+ words'); score-=15 }
  if(headingCount<2){ suggestions.push('Add more subheadings (H2/H3)'); score-=10 }

  for(const kw of keywords){
    const k = kw.toLowerCase().trim();
    if(!k) continue;
    const count = words.filter(w=>w===k).length;
    const density = Number(((count/wordCount)*100).toFixed(2));
    keywordDensity[kw]=density;
    if(density===0){ suggestions.push(`Keyword \"${kw}\" not found`); score-=10}
    else if(density>3){ suggestions.push(`Keyword \"${kw}\" density (${density}%) may be high`); score-=5}
  }

  score=Math.max(0,Math.min(100,score));
  return { wordCount, headingCount, keywordDensity, score, suggestions };
}