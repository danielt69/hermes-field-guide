import { useState } from 'react';
import { Command } from '@heroui-pro/react';
import { chapters } from '../data/guide';
import { searchChapters } from '../lib/guide';
import { Icon } from './Icon';
export function SearchPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState('');
  const results = searchChapters(chapters, query);
  return <Command><Command.Backdrop isOpen={open} onOpenChange={onOpenChange} variant="opaque">
    <Command.Container className="guide-command"><Command.Dialog aria-label="Search the field guide" inputValue={query} onInputChange={setQuery} filter={() => true}>
      <Command.InputGroup aria-label="Search chapters"><Command.InputGroup.Prefix><Icon name="search" /></Command.InputGroup.Prefix>
        <Command.InputGroup.Input aria-label="Search chapters" placeholder="Search chapters, commands, capabilities…" />
        <Command.InputGroup.ClearButton aria-label="Clear search" /><Command.InputGroup.Suffix><kbd>esc</kbd></Command.InputGroup.Suffix>
      </Command.InputGroup>
      <div className="command-results-scroll" tabIndex={0} role="region" aria-label="Scrollable search results"><Command.List aria-label="Search results" items={results} onAction={key => { window.location.hash = `/${key}`; onOpenChange(false); }} renderEmptyState={() => <div className="search-empty"><strong>No matching chapter.</strong><p>Try “memory”, “MCP”, or “Kanban”. Search checks every chapter’s full text.</p></div>}>
        {chapter => <Command.Item id={chapter.id} textValue={chapter.title} className="search-result"><span className="result-number">{chapter.number}</span><div><strong>{chapter.title}</strong><p>{chapter.description}</p></div><Icon name="arrow" /></Command.Item>}
      </Command.List></div>
      <Command.Footer className="search-footer"><span>{results.length} {results.length === 1 ? 'chapter' : 'chapters'}</span><span>↑↓ navigate <span aria-hidden="true">·</span> Enter open</span></Command.Footer>
    </Command.Dialog></Command.Container>
  </Command.Backdrop></Command>;
}
