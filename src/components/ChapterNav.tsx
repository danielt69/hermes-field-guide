import { chapters } from '../data/guide';
import { Icon } from './Icon';
interface Props { active: string; completed: string[]; onNavigate?: () => void }
export function ChapterNav({ active, completed, onNavigate }: Props) {
  return <nav aria-label="Chapters" className="chapter-nav">
    {['Foundations', 'In practice', 'Build the system'].map(group => <div className="nav-group" key={group}>
      <p className="nav-group-label">{group}</p>
      {chapters.filter(chapter => chapter.group === group).map(chapter => <a
        href={`#/${chapter.id}`} key={chapter.id} onClick={onNavigate}
        aria-current={active === chapter.id ? 'page' : undefined}
        className={`nav-item ${chapter.group === 'Build the system' ? 'nav-build' : ''}`}>
        <span className="nav-number">{completed.includes(chapter.id) ? <Icon name="check" /> : chapter.number}</span>
        <span>{chapter.shortTitle}</span>
        {chapter.group === 'Build the system' && <Icon name="arrow" className="nav-arrow" />}
      </a>)}
    </div>)}
  </nav>;
}
