import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Article } from '../src/components/Article';
import { chapters } from '../src/data/guide';
it('keeps every heading aligned with the TOC during strict rendering', () => {
  const chapter = chapters[0];
  const { rerender } = render(<StrictMode><Article chapter={chapter} /></StrictMode>);
  for (const h of chapter.headings) expect(screen.getByRole('heading', {name: h.text})).toHaveAttribute('id', h.id);
  rerender(<StrictMode><Article chapter={chapters[1]} /></StrictMode>);
  for (const h of chapters[1].headings) expect(screen.getByRole('heading', {name: h.text})).toHaveAttribute('id', h.id);
});
