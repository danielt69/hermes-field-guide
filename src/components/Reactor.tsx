export function Reactor() {
  return <div className="reactor" role="img" aria-label="Hermes connects reasoning to tools, memory, skills, and context, then verifies the result.">
    <svg viewBox="0 0 360 360" aria-hidden="true">
      <defs><radialGradient id="coreGlow"><stop stopColor="currentColor" stopOpacity=".13"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></radialGradient></defs>
      <circle cx="180" cy="180" r="158" fill="url(#coreGlow)"/>
      <g fill="none" stroke="currentColor">
        <circle className="reactor-orbit" cx="180" cy="180" r="140" strokeOpacity=".24" strokeWidth="1" strokeDasharray="2 6"/>
        <circle cx="180" cy="180" r="128" strokeOpacity=".18"/>
        <circle className="reactor-inner" cx="180" cy="180" r="119" strokeOpacity=".85" strokeWidth="2" strokeDasharray="144 30 55 15 90 100" transform="rotate(-60 180 180)"/>
        <circle cx="180" cy="180" r="108" strokeOpacity=".22" strokeWidth="8" strokeDasharray="1 10"/>
        <path d="m180 99 70 40v82l-70 40-70-40v-82Z" strokeOpacity=".45"/>
        <path d="m180 106 64 37v74l-64 37-64-37v-74Z" strokeOpacity=".1"/>
        <path d="M180 28v30m0 244v30M28 180h30m244 0h30" strokeOpacity=".5"/>
        <path d="M48 107h40l25 18m199 128h-40l-25-18M48 253h40l25-18m199-128h-40l-25 18" strokeOpacity=".35"/>
      </g>
      <g fill="currentColor"><circle cx="180" cy="52" r="3"/><circle cx="308" cy="180" r="3"/><circle cx="180" cy="308" r="3"/><circle cx="52" cy="180" r="3"/></g>
      <text x="180" y="174" textAnchor="middle" className="reactor-name">HERMES</text>
      <text x="180" y="194" textAnchor="middle" className="reactor-sub">AGENT CORE</text>
      <text x="39" y="96" className="reactor-label">MEMORY</text><text x="319" y="96" textAnchor="end" className="reactor-label">TOOLS</text>
      <text x="39" y="274" className="reactor-label">CONTEXT</text><text x="319" y="274" textAnchor="end" className="reactor-label">SKILLS</text>
    </svg>
    <span className="reactor-caption">Reason <i>→</i> Act <i>→</i> Verify</span>
  </div>;
}
