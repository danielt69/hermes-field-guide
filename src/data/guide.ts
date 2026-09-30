import catalogue from './chapters.json';
import { extractHeadings } from '../lib/markdown';
const markdown = import.meta.glob<string>('../../content/*.md', { query: '?raw', import: 'default', eager: true });
export const chapters = catalogue.map((chapter, index) => {
  const body = markdown[`../../content/${chapter.file}`] ?? '';
  return { ...chapter, number: String(index + 1).padStart(2, '0'), body, minutes: Math.max(1, Math.ceil(body.split(/\s+/).length / 210)), headings: extractHeadings(body) };
});
export type Chapter = typeof chapters[number];
export const chapterIds = chapters.map(chapter => chapter.id);
export const sourceCount = new Set(chapters.flatMap(chapter => chapter.body.match(/https:\/\/hermes-agent\.nousresearch\.com\/docs[^\s)\]>]*/g) ?? [])).size;
export const REVIEWED = '30 Sep 2026';
