const legacyRoutes: Record<string, string> = { tools: 'tools-skills', 'add-next': 'learning-path', working: 'workflows', settings: 'profiles-models', mac: 'local-workbench', recipes: 'workflows', roadmap: 'learning-path' };
export function parseRoute(hash: string, ids: string[]) {
  try {
    const [raw, anchor = ''] = decodeURIComponent(hash.replace(/^#\/?/, '')).split('/');
    const chapter = legacyRoutes[raw] ?? raw;
    return ids.includes(chapter) ? { chapter, anchor } : { chapter: 'overview', anchor: '' };
  } catch { return { chapter: 'overview', anchor: '' }; }
}
export function readProgress(raw: string | null, legacy: string | null, ids: string[]): string[] {
  try {
    if (raw !== null) {
      const saved: unknown = JSON.parse(raw);
      return Array.isArray(saved) ? [...new Set(saved.filter((id): id is string => typeof id === 'string' && ids.includes(id)))] : [];
    }
    const old: unknown = JSON.parse(legacy ?? '[]');
    return Array.isArray(old) && ['baseline','chat','control','memory'].every(id => old.includes(id)) && ids.includes('first-session') ? ['first-session'] : [];
  } catch { return []; }
}
export interface SearchDocument { id: string; title: string; description: string; body: string }
export function searchChapters<T extends SearchDocument>(chapters: T[], query: string): T[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return chapters.filter(chapter => {
    const text = `${chapter.title} ${chapter.description} ${chapter.body}`.toLocaleLowerCase();
    return terms.every(term => text.includes(term));
  });
}
