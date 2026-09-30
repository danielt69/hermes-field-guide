import type { CSSProperties } from 'react';
const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6"/>,
  left: <path d="M19 12H5m6-6-6 6 6 6"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
  moon: <path d="M20.5 14A9 9 0 0 1 10 3.5a9 9 0 1 0 10.5 10.5Z"/>,
  settings: <><path d="M4 6h16M4 12h16M4 18h16"/><path d="M8 3v6m8 0v6m-6 0v6"/></>,
  book: <><path d="M12 5v15M3 4h5l4 2 4-2h5v15h-5l-4 2-4-2H3z"/></>,
  home: <><path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/></>,
  check: <path d="m5 12 4.5 4.5L19 7"/>,
  circle: <circle cx="12" cy="12" r="8"/>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 8V3H3v13h5"/></>,
  external: <><path d="M14 3h7v7m0-7L10 14M9 4H4v16h16v-5"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
  bolt: <path d="m13 2-9 12h7l-1 8 10-13h-8z"/>,
  github: <><path d="M8 21v-4c-3 0-5-2-5-5 0-2 1-4 3-5L5 3l5 2h4l5-2-1 4c2 1 3 3 3 5 0 3-2 5-5 5v4"/><path d="M8 19c-3 1-5-1-6-3"/></>,
};
export type IconName = keyof typeof paths;
export function Icon({ name, className, style }: { name: IconName; className?: string; style?: CSSProperties }) {
  return <svg aria-hidden="true" className={className} style={style} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
export function Mark() {
  return <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className="hermes-mark"><path d="M10 8v24M30 8v24M10 20h20M4 8l6 6M36 8l-6 6M5 16l5 5M35 16l-5 5" stroke="currentColor" strokeWidth="2.5"/><path d="m10 8 10-5 10 5M10 32l10 5 10-5" stroke="currentColor" strokeOpacity=".4"/></svg>;
}
