import { useState } from 'react';
import { Button } from '@heroui/react';
import { Icon } from './Icon';
export function CopyBlock({ code, language = 'text' }: { code: string; language?: string }) {
  const [state, setState] = useState<'ready' | 'copied' | 'error'>('ready');
  async function copy() {
    try { await navigator.clipboard.writeText(code); setState('copied'); }
    catch { setState('error'); }
  }
  return <div className="code-block">
    <div className="code-toolbar"><span>{language === 'bash' || language === 'sh' ? 'Terminal' : language}</span>
      <Button size="sm" variant="ghost" onPress={() => void copy()} aria-label={state === 'copied' ? 'Copied code' : 'Copy code'}>
        <Icon name={state === 'copied' ? 'check' : 'copy'}/>{state === 'copied' ? 'Copied' : 'Copy'}
      </Button>
    </div>
    <pre tabIndex={0} aria-label={`${language} code`}><code>{code}</code></pre>
    <span role="status" className={state === 'error' ? 'copy-error' : 'sr-only'}>{state === 'error' ? 'Clipboard unavailable. Select and copy the code above.' : state === 'copied' ? 'Code copied to clipboard.' : ''}</span>
  </div>;
}
