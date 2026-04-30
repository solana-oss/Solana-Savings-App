import { motion } from 'framer-motion'
import { Globe, Zap, BarChart3, TrendingUp } from 'lucide-react'
import { SOLANA_VAULTS } from '../solana/vaults'

const F    = "'Outfit', system-ui, sans-serif"
const FNUM = "'DM Mono', 'Fira Code', monospace"

export default function HeroStats() {
  const avgApy = SOLANA_VAULTS.reduce((s, v) => s + v.apy, 0) / SOLANA_VAULTS.length

  const items = [
    { label: 'Protocol TVL',    value: '$2.9B+',            icon: BarChart3,  accent: '#D6FF34', isNum: true },
    { label: 'Network',         value: 'Solana Mainnet',    icon: Globe,      accent: '#9945FF', isNum: false },
    { label: 'Active Vaults',   value: `${SOLANA_VAULTS.length}`,  icon: Zap, accent: '#00FF8B', isNum: true },
    { label: 'Avg Portfolio APY', value: `~${avgApy.toFixed(0)}%`, icon: TrendingUp, accent: '#FFB800', isNum: true },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}
      className="hero-stats-grid">
      {items.map(({ label, value, icon: Icon, accent, isNum }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'rgba(13,17,23,0.7)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16, padding: '14px 16px',
            position: 'relative', overflow: 'hidden',
            backdropFilter: 'blur(12px)',
            fontFamily: F, transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'}
        >
          <div aria-hidden style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={13} color={accent} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          </div>
          <p style={{ fontFamily: isNum ? FNUM : F, fontSize: 18, fontWeight: isNum ? 600 : 700, color: '#fff', letterSpacing: isNum ? '-0.02em' : '-0.01em', margin: '8px 0 0' }}>
            {value}
          </p>
        </motion.div>
      ))}

      <style>{`
        @media (max-width: 900px) { .hero-stats-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .hero-stats-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
