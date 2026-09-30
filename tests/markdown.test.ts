import { expect, it } from 'vitest';
import { extractHeadings } from '../src/lib/markdown';
it('builds unique anchors without indexing headings inside code fences', () => {
  const md = '## Memory & context\n\n```md\n## Example heading\n```\n## Memory & context\n### A **safe** start';
  expect(extractHeadings(md)).toEqual([
    { id: 'memory-context', text: 'Memory & context', depth: 2, line: 1 },
    { id: 'memory-context-2', text: 'Memory & context', depth: 2, line: 6 },
    { id: 'a-safe-start', text: 'A safe start', depth: 3, line: 7 },
  ]);
});
