/* Forma orgânica de pétalas do Briefing — ornamento flat de fundo */
export default function Petal({ size = 220, className = '', style }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cx="50" cy="23" rx="12" ry="20" transform={`rotate(${angle} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="9" />
      </g>
    </svg>
  )
}
