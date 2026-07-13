import type { Readability } from '../types';

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const reduced = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const matches = reduced.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function analyzeReadability(text: string): Readability {
  const cleaned = text.replace(/[#*_>`~-]/g, ' ').trim();
  const sentences = cleaned.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean);
  const words = cleaned.split(/\s+/).filter(Boolean);
  const sentenceCount = Math.max(sentences.length,1);
  const wordCount = Math.max(words.length,1);
  const syllables = words.reduce((s,w)=>s+countSyllables(w),0);
  const avgWordsPerSentence = wordCount/sentenceCount;
  const avgSyllablesPerWord = syllables/wordCount;
  const fleschRaw = 206.835 - 1.015*avgWordsPerSentence - 84.6*avgSyllablesPerWord;
  const flesch = Math.max(0,Math.min(100,Math.round(fleschRaw)));
  let grade = 'Graduate';
  if(flesch>=90) grade='5th Grade';
  else if(flesch>=80) grade='6th Grade';
  else if(flesch>=70) grade='7th Grade';
  else if(flesch>=60) grade='8th-9th Grade';
  else if(flesch>=50) grade='10th-12th Grade';
  else if(flesch>=30) grade='College';
  return { fleschScore: flesch, gradeLevel: grade, wordCount, sentenceCount };
}