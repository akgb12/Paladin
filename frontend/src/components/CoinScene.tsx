export default function CoinScene() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '600px' }}>
      <div className="relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        <SpinningCoin />
        <Gem color="#fbbf24" angle={0} radius={110} delay="0s" />
        <Gem color="#34d399" angle={120} radius={110} delay="-2.2s" />
        <Gem color="#f472b6" angle={240} radius={110} delay="-4.4s" />
        <div
          className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-28 h-3 rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.45) 0%, transparent 70%)' }}
        />
      </div>
    </div>
  )
}

function SpinningCoin() {
  return (
    <div style={{ width: 110, height: 110, transformStyle: 'preserve-3d', animation: 'coin-spin 4s linear infinite' }}>
      <style>{`
        @keyframes coin-spin {
          0%   { transform: rotateY(0deg)   rotateX(12deg); }
          100% { transform: rotateY(360deg) rotateX(12deg); }
        }
        @keyframes gem-orbit {
          0%   { transform: rotateZ(var(--start)) translateX(var(--r)) rotateZ(calc(-1 * var(--start))); }
          100% { transform: rotateZ(calc(var(--start) + 360deg)) translateX(var(--r)) rotateZ(calc(-1 * (var(--start) + 360deg))); }
        }
        @keyframes gem-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-8px) scale(1.08); }
        }
      `}</style>

      {/* Front face */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'conic-gradient(from 0deg, #fbbf24, #f59e0b, #d97706, #fbbf24, #fde68a, #f59e0b, #fbbf24)',
        border: '3px solid #92400e',
        boxShadow: '0 0 24px rgba(245,158,11,0.6)',
        transform: 'translateZ(8px)',
      }}>
        <div style={{
          position: 'absolute', inset: 10, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}>
          <img src="/paladin-logo.png" alt="" style={{ width: 56, height: 56, objectFit: 'contain', opacity: 0.92 }} />
        </div>
      </div>

      {/* Edge band */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'linear-gradient(135deg, #92400e, #d97706, #92400e)',
          transform: `translateZ(${-1 + i * 0.85}px)`,
        }} />
      ))}

      {/* Back face */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle, #d97706 0%, #92400e 100%)',
        border: '3px solid #78350f',
        transform: 'translateZ(-8px)',
      }} />
    </div>
  )
}

function Gem({ color, angle, radius, delay }: { color: string; angle: number; radius: number; delay: string }) {
  const rad = (angle * Math.PI) / 180
  const x = Math.cos(rad) * radius
  const y = Math.sin(rad) * radius * 0.35
  return (
    <div
      style={{
        position: 'absolute',
        width: 18, height: 18,
        left: `calc(50% + ${x}px - 9px)`,
        top: `calc(50% + ${y}px - 9px)`,
        borderRadius: 4,
        background: color,
        border: '2px solid rgba(0,0,0,0.4)',
        boxShadow: `0 0 14px ${color}99, 0 4px 8px rgba(0,0,0,0.3)`,
        transform: 'rotate(45deg)',
        animation: `gem-float ${3.2 + Math.random() * 1.2}s ease-in-out infinite ${delay}`,
      }}
    />
  )
}
