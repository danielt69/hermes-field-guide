export interface Heading { id: string; text: string; depth: number; line: number }
export function extractHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let fence = '';
  for (const [index, line] of body.split('\n').entries()) {
    const marker = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = '';
      continue;
    }
    if (fence) continue;
    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*$/);
    if (!match) continue;
    const text = match[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '');
    const slug = text.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
    const occurrence = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, occurrence);
    headings.push({ id: occurrence === 1 ? slug : `${slug}-${occurrence}`, text, depth: match[1].length, line: index + 1 });
  }
  return headings;
}
