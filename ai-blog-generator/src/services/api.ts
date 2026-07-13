import { httpsCallable } from 'firebase/functions';
import { functions, auth, db } from '../firebaseConfig';
import type { GenerateRequest, GenerateResponse } from '../types';
import { analyzeReadability } from '../utils/readability';
import { analyzeSeo } from '../utils/seo';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';

interface GeneratePayload {
  mode: GenerateRequest['mode'];
  title: string;
  metaDescription: string;
  content: string;
  alternatives?: string[];
}

const generateCallable = httpsCallable<GenerateRequest, GeneratePayload>(functions, 'generateBlog');

export async function generate(req: GenerateRequest): Promise<GenerateResponse> {
  const res = await generateCallable(req);
  const { mode, title, metaDescription, content, alternatives } = res.data;
  const readability = analyzeReadability(content);
  const seo = analyzeSeo({ title, meta: metaDescription, content, keywords: req.keywords });
  return {
    mode,
    title,
    metaDescription,
    content,
    alternatives,
    readability,
    seoScore: seo.score,
    seoSuggestions: seo.suggestions
  };
}

const HISTORY_COL = 'blogHistory';

export async function saveHistory(req: GenerateRequest, resp: GenerateResponse) {
  const user = auth.currentUser;
  if (!user) return;
  await addDoc(collection(db, HISTORY_COL), {
    userId: user.uid,
    topic: req.topic,
    keywords: req.keywords,
    tone: req.tone,
    length: req.length,
    mode: req.mode,
    title: resp.title,
    metaDescription: resp.metaDescription,
    content: resp.content,
    alternatives: resp.alternatives || [],
    readability: resp.readability,
    seo: { score: resp.seoScore, suggestions: resp.seoSuggestions },
    createdAt: serverTimestamp(),
    createdAtMs: Date.now()
  });
}

export async function fetchHistory() {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(collection(db, HISTORY_COL), where('userId', '==', user.uid), orderBy('createdAtMs', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteHistory(id: string) {
  await deleteDoc(doc(db, HISTORY_COL, id));
}