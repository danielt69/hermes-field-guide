import { Children, isValidElement, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Chapter } from '../data/guide';
import { CopyBlock } from './CopyBlock';
export const Article = memo(function Article({ chapter }: { chapter: Chapter }) {
  const heading = (level: 2 | 3, children: React.ReactNode, line?: number) => {
    const id = chapter.headings.find(item => item.line === line)?.id;
    const Tag = level === 2 ? 'h2' : 'h3';
    return <Tag id={id}><a href={`#/${chapter.id}/${id}`} className="heading-link">{children}<span aria-hidden="true">#</span></a></Tag>;
  };
  return <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    h2: ({ children, node }) => heading(2, children, node?.position?.start.line),
    h3: ({ children, node }) => heading(3, children, node?.position?.start.line),
    pre: ({ children }) => {
      const child = Children.toArray(children)[0];
      if (isValidElement<{ children?: string; className?: string }>(child)) {
        return <CopyBlock code={String(child.props.children ?? '').replace(/\n$/, '')} language={child.props.className?.replace('language-', '')} />;
      }
      return <pre>{children}</pre>;
    },
    table: ({ children }) => <div className="table-scroll" tabIndex={0} role="region" aria-label="Reference table"><table>{children}</table></div>,
    a: ({ href, children }) => {
      const download = href?.startsWith('templates/');
      const target = download ? `${import.meta.env.BASE_URL}${href}` : href;
      const external = href?.startsWith('https://');
      return <a href={target} {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})} {...(download ? { download: '' } : {})}>{children}{external && <span className="external-mark" aria-hidden="true">↗</span>}</a>;
    },
  }}>{chapter.body}</ReactMarkdown></div>;
});
