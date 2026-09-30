import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { extractHeadings } from '../src/lib/markdown.ts';
const root = new URL('../', import.meta.url);
const read = (file: string) => readFile(new URL(file, root), 'utf8');
const chapters = JSON.parse(await read('src/data/chapters.json')) as { id: string; file: string }[];
assert.equal(chapters.length, 14, 'Expected the fourteen-chapter guide');
assert.equal(new Set(chapters.map(c => c.id)).size, chapters.length);
assert.equal(chapters.at(-2)?.id, 'jarvis');
assert.equal(chapters.at(-1)?.id, 'startup-team');
const bodies = new Map(await Promise.all(chapters.map(async c => [c.id, await read(`content/${c.file}`)] as const)));
const sources = new Set<string>();
let templateLinks = 0, internalLinks = 0, headingCount = 0;
for (const chapter of chapters) {
  const body = bodies.get(chapter.id)!;
  assert.ok(body.length > 500, `${chapter.file}: missing content`);
  assert.ok(/^### Sources/m.test(body), `${chapter.file}: missing sources`);
  assert.ok(!/^# /m.test(body), `${chapter.file}: H1 belongs to application`);
  assert.equal((body.match(/^```/gm) ?? []).length % 2, 0, `${chapter.file}: unbalanced fence`);
  const headings = extractHeadings(body);
  headingCount += headings.length;
  assert.equal(new Set(headings.map(h => h.id)).size, headings.length);
  for (const match of body.matchAll(/https:\/\/hermes-agent\.nousresearch\.com\/docs[^\s)\]>]*/g)) sources.add(match[0]);
  for (const [, path] of body.matchAll(/\]\((templates\/[^)]+)\)/g)) {
    await access(new URL(`public/${path}`, root)); templateLinks++;
  }
  for (const [, id, anchor] of body.matchAll(/\]\(#\/([^/)]+)(?:\/([^)]+))?\)/g)) {
    assert.ok(bodies.has(id), `Unknown route ${id}`);
    if (anchor) assert.ok(extractHeadings(bodies.get(id)!).some(h => h.id === anchor), `Unknown anchor ${id}/${anchor}`);
    internalLinks++;
  }
}
const templates = await readdir(new URL('public/templates/', root));
for (const file of templates) {
  const text = await read(`public/templates/${file}`);
  assert.ok(!/(?:ghp_|sk-ant-)[A-Za-z0-9_-]{20,}/.test(text), `${file}: possible credential`);
}
console.log(JSON.stringify({ chapters: chapters.length, headings: headingCount, officialSources: sources.size, templates: templates.length, templateLinks, internalLinks, status: 'passed' }, null, 2));
