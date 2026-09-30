import { useEffect, useRef, useState } from 'react';
import { Button, Chip, Tooltip } from '@heroui/react';
import { chapters, chapterIds, REVIEWED, sourceCount } from './data/guide';
import { parseRoute, readProgress } from './lib/guide';
import { ChapterNav } from './components/ChapterNav';
import { Article } from './components/Article';
import { Icon, Mark } from './components/Icon';
import type { IconName } from './components/Icon';
import { Reactor } from './components/Reactor';
import { SearchPalette } from './components/SearchPalette';
import { GuideSheet } from './components/GuideSheet';

const PROGRESS_KEY = 'hermes-guide-v2-progress';
function getStored(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function store(key: string, value: string) { try { localStorage.setItem(key, value); return true; } catch { return false; } }

function IconButton({ label, icon, onPress }: { label: string; icon: IconName; onPress: () => void }) {
  return <Tooltip delay={250}><Button variant="ghost" isIconOnly aria-label={label} onPress={onPress}><Icon name={icon} /></Button><Tooltip.Content>{label}</Tooltip.Content></Tooltip>;
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash, chapterIds));
  const [completed, setCompleted] = useState(() => readProgress(getStored(PROGRESS_KEY), getStored('hermes-daniel-checks'), chapterIds));
  const [theme, setTheme] = useState(() => getStored('hermes-daniel-theme') === 'light' ? 'light' : 'dark');
  const [density, setDensity] = useState(() => getStored('hermes-daniel-density') === 'compact' ? 'compact' : 'comfortable');
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [reading, setReading] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const index = chapters.findIndex(chapter => chapter.id === route.chapter);
  const chapter = chapters[index];
  const isOverview = chapter.id === 'overview';
  const read = completed.includes(chapter.id);
  const next = chapters[index + 1];
  const previous = chapters[index - 1];
  const continueChapter = chapters.find(item => !completed.includes(item.id) && item.id !== 'overview') ?? chapters[1];
  const progress = Math.round(completed.length / chapters.length * 100);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash, chapterIds));
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setSearchOpen(open => !open);
      }
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('hashchange', onHash); window.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.dataset.density = density;
    const savedTheme = store('hermes-daniel-theme', theme);
    const savedDensity = store('hermes-daniel-density', density);
    const savedProgress = store(PROGRESS_KEY, JSON.stringify(completed));
    setStorageError(!savedTheme || !savedDensity || !savedProgress);
  }, [theme, density, completed]);

  useEffect(() => {
    document.title = `${chapter.title} · Hermes Field Guide`;
    setActiveHeading(route.anchor || chapter.headings[0]?.id || '');
    const frame = requestAnimationFrame(() => {
      if (route.anchor) {
        const target = document.getElementById(route.anchor);
        if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 100, behavior: 'instant' });
      } else { window.scrollTo({ top: 0, behavior: 'instant' }); }
    });
    return () => cancelAnimationFrame(frame);
  }, [route, chapter]);

  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setReading(height > 0 ? Math.min(100, Math.max(0, window.scrollY / height * 100)) : 100);
      let current = chapter.headings[0]?.id ?? '';
      for (const heading of chapter.headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= 160) current = heading.id;
      }
      setActiveHeading(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [chapter]);

  function toggleRead() { setCompleted(items => read ? items.filter(id => id !== chapter.id) : [...items, chapter.id]); }

  return <>
    <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); mainRef.current?.focus(); }}>Skip to content</a>
    <aside className="sidebar">
      <a href="#/overview" className="brand" aria-label="Hermes field guide home"><Mark /><span><strong>HERMES</strong><small>Field guide <b>/</b> J.A.R.V.I.S. edition</small></span></a>
      <ChapterNav active={chapter.id} completed={completed} />
      <div className="sidebar-bottom">
        <div className="progress-label"><span>Your reading progress</span><span>{completed.length}<i> / {chapters.length}</i></span></div>
        <div className="progress-track" role="progressbar" aria-label="Chapters read" aria-valuenow={completed.length} aria-valuemin={0} aria-valuemax={chapters.length}><span style={{ width: `${progress}%` }} /></div>
        <a className="continue-link" href={`#/${continueChapter.id}`}>Continue reading <Icon name="arrow" /></a>
        <div className="sidebar-credit"><span className="small-core" aria-hidden="true" />A field guide. Not a live agent.</div>
      </div>
    </aside>

    <div className="workspace">
      <header className="topbar">
        <a className="mobile-brand" href="#/overview" aria-label="Hermes home"><Mark /><span>HERMES</span></a>
        <div className="breadcrumbs"><span>Field manual</span><span aria-hidden="true">/</span><span>{chapter.shortTitle}</span></div>
        <div className="header-actions">
          <Button variant="secondary" className="search-trigger" aria-label="Search the guide" onPress={() => setSearchOpen(true)}><Icon name="search" /><span>Search the guide…</span><kbd>⌘ K</kbd></Button>
          <span className="desktop-controls"><IconButton label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} icon={theme === 'dark' ? 'sun' : 'moon'} onPress={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} />
            <IconButton label="Reading preferences" icon="settings" onPress={() => setSettingsOpen(true)} />
          </span>
          <a href="https://github.com/danielt69/hermes-field-guide" className="github-link" target="_blank" rel="noreferrer" aria-label="View source on GitHub"><Icon name="github" /></a>
        </div>
        <div className="reading-line" aria-hidden="true" style={{ transform: `scaleX(${reading / 100})` }} />
      </header>

      <main id="main-content" ref={mainRef} tabIndex={-1} className={`main-content ${isOverview ? 'is-overview' : ''}`}>
        {isOverview ? <>
          <section className="hero" aria-labelledby="page-title">
            <div className="hero-copy">
              <div className="eyebrow"><span className="edition-bracket">[ H / 02 ]</span> The personal agent field manual</div>
              <h1 id="page-title">Your intelligence.<br /><span>Your operating system.</span></h1>
              <p>A practical path from your first Hermes session to a persistent J.A.R.V.I.S.—and a team of agents that work together.</p>
              <div className="hero-actions"><a className="button button--primary" href="#/first-session">Start the guide <Icon name="arrow" /></a><a className="button button--outline" href="#/jarvis">Build J.A.R.V.I.S.</a></div>
              <span className="hero-note">Built for builders. Grounded in the official docs.</span>
            </div>
            <Reactor />
          </section>
          <div className="edition-rail">
            <div><strong>{String(chapters.length).padStart(2, '0')}</strong><span>Practical chapters</span></div>
            <div><strong>02</strong><span>End-to-end build guides</span></div>
            <div><strong>{String(sourceCount).padStart(2, '0')}</strong><span>Official references</span></div>
            <div className="edition-date"><span>Source snapshot</span><strong>{REVIEWED}</strong></div>
          </div>
          <section className="mission-section" aria-labelledby="missions-title">
            <div className="section-kicker"><span>Choose your path</span><span className="mono">From understanding to orchestration</span></div>
            <h2 id="missions-title" className="sr-only">Choose your path</h2>
            <div className="mission-list">
              <a href="#/first-session"><span className="mission-index">01</span><div><h3>Learn the harness</h3><p>Tools, skills, memory, and the habits of reliable agent work.</p></div><span className="mission-kind">Start here</span><Icon name="arrow" /></a>
              <a href="#/jarvis"><span className="mission-index">02</span><div><h3>Build your J.A.R.V.I.S.</h3><p>One capable assistant. Persistent memory. Deliberate autonomy.</p></div><span className="mission-kind">Personal system</span><Icon name="arrow" /></a>
              <a href="#/startup-team"><span className="mission-index">03</span><div><h3>Assemble your startup team</h3><p>Specialists, shared context, and an accountable lead agent.</p></div><span className="mission-kind">Multi-agent system</span><Icon name="arrow" /></a>
            </div>
          </section>
        </> : <header className="chapter-header">
          <div className="eyebrow"><span className="edition-bracket">[ {chapter.number} / {String(chapters.length).padStart(2, '0')} ]</span> {chapter.group}</div>
          <h1 id="page-title">{chapter.title}</h1>
          <p>{chapter.description}</p>
          <div className="chapter-meta"><Chip size="sm" color="accent" variant="soft">{chapter.group === 'Build the system' ? 'Build guide' : 'Field notes'}</Chip><span>~{chapter.minutes} min read</span><span>Reviewed {REVIEWED}</span></div>
          {chapter.group === 'Build the system' && <div className="tutorial-note"><Icon name="book" /><span>This is a setup tutorial—not a connection to your agents. Review commands and replace placeholders before running them.</span></div>}
        </header>}

        <div className="reading-layout">
          <div className="article-column">
            <Article chapter={chapter} />
            <div className="chapter-completion"><div><strong>{read ? 'Chapter marked as read.' : 'Ready for the next step?'}</strong><p>Your progress stays in this browser. It doesn’t verify your setup.</p></div><Button variant={read ? 'secondary' : 'outline'} onPress={toggleRead} aria-pressed={read}><Icon name={read ? 'check' : 'circle'} />{read ? 'Marked as read' : 'Mark as read'}</Button></div>
            <nav className="chapter-pagination" aria-label="Previous and next chapter">
              {previous ? <a href={`#/${previous.id}`}><Icon name="left" /><div><small>Previous</small><strong>{previous.shortTitle}</strong></div></a> : <span />}
              {next ? <a href={`#/${next.id}`} className="next-chapter"><div><small>Up next</small><strong>{next.shortTitle}</strong></div><Icon name="arrow" /></a> : <a href="#/overview" className="next-chapter"><div><small>Keep building</small><strong>Back to overview</strong></div><Icon name="arrow" /></a>}
            </nav>
          </div>
          <aside className="page-toc" aria-label="On this page"><div className="toc-sticky"><p className="toc-title">In this chapter</p><nav aria-label="Chapter sections">{chapter.headings.filter(heading => heading.depth === 2).map(heading => <a className={activeHeading === heading.id ? 'active' : ''} href={`#/${chapter.id}/${heading.id}`} key={heading.id}>{heading.text}</a>)}</nav><div className="toc-footnote"><Icon name="book" /><p>Learn the pattern.<br />Verify the result.<br />Keep the evidence.</p></div></div></aside>
        </div>
        <footer className="site-footer"><span>Hermes field guide <i>/</i> Built for Daniel, open to everyone.</span><a href="#/sources">Sources & provenance <Icon name="external" /></a></footer>
      </main>
    </div>

    <nav className="mobile-bottom-nav" aria-label="Quick navigation">
      <a href="#/overview" aria-current={isOverview ? 'page' : undefined}><Icon name="home" /><span>Overview</span></a>
      <Button variant="ghost" onPress={() => setNavOpen(true)}><Icon name="book" /><span>Chapters</span></Button>
      <Button variant="ghost" onPress={() => setSearchOpen(true)}><Icon name="search" /><span>Search</span></Button>
      <Button variant="ghost" onPress={() => setSettingsOpen(true)}><Icon name="settings" /><span>Preferences</span></Button>
    </nav>

    <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    <GuideSheet title="Explore the chapters" open={navOpen} onOpenChange={setNavOpen}><ChapterNav active={chapter.id} completed={completed} onNavigate={() => setNavOpen(false)} /></GuideSheet>
    <GuideSheet title="Reading preferences" open={settingsOpen} onOpenChange={open => { setSettingsOpen(open); setResetConfirm(false); }}>
      <div className="preferences">
        <div className="preference-row"><div><strong>Appearance</strong><p>A midnight HUD or a quiet paper surface.</p></div><div className="choice-group" role="group" aria-label="Appearance"><Button variant={theme === 'dark' ? 'primary' : 'outline'} aria-pressed={theme === 'dark'} onPress={() => setTheme('dark')}>Dark</Button><Button variant={theme === 'light' ? 'primary' : 'outline'} aria-pressed={theme === 'light'} onPress={() => setTheme('light')}>Light</Button></div></div>
        <div className="preference-row"><div><strong>Reading density</strong><p>Compact spacing keeps the same readable text size.</p></div><div className="choice-group" role="group" aria-label="Reading density"><Button variant={density === 'comfortable' ? 'primary' : 'outline'} aria-pressed={density === 'comfortable'} onPress={() => setDensity('comfortable')}>Comfortable</Button><Button variant={density === 'compact' ? 'primary' : 'outline'} aria-pressed={density === 'compact'} onPress={() => setDensity('compact')}>Compact</Button></div></div>
        <div className="preference-row"><div><strong>Reading progress</strong><p>{completed.length} of {chapters.length} chapters marked as read.</p></div>{resetConfirm ? <div className="choice-group"><Button variant="danger-soft" onPress={() => { setCompleted([]); setResetConfirm(false); }}>Confirm reset</Button><Button variant="ghost" onPress={() => setResetConfirm(false)}>Cancel</Button></div> : <Button variant="outline" onPress={() => setResetConfirm(true)}>Reset progress</Button>}</div>
        <p className="preferences-note">Preferences are saved only in this browser. No account, analytics, or connection to your Hermes instance.</p>
        {storageError && <p role="status" className="storage-warning">Browser storage is unavailable. Your changes work for this visit but won’t survive a reload.</p>}
      </div>
    </GuideSheet>
  </>;
}
