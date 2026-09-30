import { describe, expect, it } from 'vitest';
import { searchChapters, parseRoute, readProgress } from '../src/lib/guide';
const docs = [
  { id: 'memory', title: 'Memory & context', description: 'Continuity', body: 'Profiles are isolated. Team knowledge is deliberate.' },
  { id: 'team', title: 'Startup team', description: 'A shared objective', body: 'Kanban handoffs and artifacts report to JARVIS.' },
];
describe('progress', () => {
  it('recovers malformed storage, filters unknown IDs, deduplicates, and imports completed legacy onboarding', () => {
    expect(readProgress('{oops', '[]', ['overview'])).toEqual([]);
    expect(readProgress('["overview","overview","unknown"]', '[]', ['overview'])).toEqual(['overview']);
    expect(readProgress(null, '["baseline","chat","control","memory"]', ['overview','first-session'])).toEqual(['first-session']);
    expect(readProgress('[]', '["baseline","chat","control","memory"]', ['first-session'])).toEqual([]);
  });
});
describe('routes', () => {
  it('resolves chapter anchors, retains legacy links, and rejects malformed routes', () => {
    const ids = ['overview', 'first-session', 'tools-skills'];
    expect(parseRoute('#/first-session/baseline', ids)).toEqual({ chapter: 'first-session', anchor: 'baseline' });
    expect(parseRoute('#tools', ids)).toEqual({ chapter: 'tools-skills', anchor: '' });
    expect(parseRoute('#/%ZZ', ids)).toEqual({ chapter: 'overview', anchor: '' });
    expect(parseRoute('#/not-a-chapter', ids)).toEqual({ chapter: 'overview', anchor: '' });
  });
});
describe('full-content search', () => {
  it('finds terms in chapter bodies and ignores case and whitespace', () => {
    expect(searchChapters(docs, '  KANBAN  ').map(x => x.id)).toEqual(['team']);
    expect(searchChapters(docs, 'isolated').map(x => x.id)).toEqual(['memory']);
  });
});
