export type Tone = 'professional' | 'casual' | 'persuasive';
export type Length = 'short' | 'medium' | 'long';
export type Mode = 'title' | 'outline' | 'article';

export interface GenerateRequest {
  topic: string;
  keywords: string[];
  tone: Tone;
  length: Length;
  mode: Mode;
  audience?: string;
}

export interface Readability {
  fleschScore: number;
  gradeLevel: string;
  wordCount: number;
  sentenceCount: number;
}

export interface GenerateResponse {
  mode: Mode;
  title: string;
  metaDescription: string;
  content: string;
  alternatives?: string[];
  readability: Readability;
  seoScore: number;
  seoSuggestions: string[];
}