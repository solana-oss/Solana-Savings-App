import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { TrendingUp, Zap, Shield, Flame } from 'lucide-react'
import VaultCard from '../components/VaultCard'
import { SOLANA_VAULTS, type RiskLevel } from '../solana/vaults'
import { useState } from 'react'

const F = "'Outfit', system-ui, sans-serif"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const RISK_TABS: { label: string; value: RiskLevel | 'all'; icon: typeof Shield; color: string }[] = [
  { label: 'All Vaults',  value: 'all',      icon: Zap,     color: '#D6FF34' },
  { label: 'Safe',        value: 'safe',      icon: Shield,  color: '#00FF8B' },
  { label: 'Balanced',    value: 'balanced',  icon: TrendingUp, color: '#FFB800' },
  { label: 'Ultra',       value: 'ultra',     icon: Flame,   color: '#FF6B35' },
]

const STATS = [
  { label: 'Total Protocol TVL', value: '$2.9B+', sub: 'Secured across Kamino, Meteora & Jito' },
  { label: 'Best Safe APY',      value: '~12%',   sub: 'USDS Optimizer on Kamino Lend' },
  { label: 'Best Ultra APY',     value: '25%+',   sub: 'SOL-USDC LP on Kamino Earn' },
]

export default function VaultsPage() {
  const { publicKey } = useWallet()
  const [activeRisk, setActiveRisk] = useState<RiskLevel | 'all'>('all')

  const filtered = activeRisk === 'all'
    ? SOLANA_VAULTS
    : SOLANA_VAULTS.filter(v => v.riskLevel === activeRisk)

  return (
    <div style={{ fontFamily: F }}>

      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ textAlign: 'center', padding: '32px 16px 24px', position: 'relative' }}
      >
        {/* Dual ambient glow */}
        <div aria-hidden style={{ position: 'absolute', top: '0%', left: '30%', width: 400, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(214,255,52,0.06) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />
        <div aria-hidden style={{ position: 'absolute', top: '0%', right: '25%', width: 300, height: 180, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(153,69,255,0.07) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(20px)' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '5px 14px', borderRadius: 100, background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)', marginBottom: 16 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9945FF', display: 'inline-block', boxShadow: '0 0 6px rgba(153,69,255,0.9)' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#9945FF', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Built on Solana</span>
          <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Powered by Kamino & Meteora</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 14px' }}>
          High Yield{' '}
          <span style={{ background: 'linear-gradient(135deg, #D6FF34 0%, #9945FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Savings</span>
          {' '}on Solana.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: 400, margin: '0 auto 28px', maxWidth: 520, lineHeight: 1.65 }}>
          Deposit any asset. Earn optimized yield from Kamino, Meteora, Jito & Sanctum — automatically compounded.
        </p>

        {/* Stat strip */}
        <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', gap: 1, maxWidth: 640, margin: '0 auto 0', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', textAlign: 'center' }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 600, color: '#D6FF34', margin: '0 0 3px', letterSpacing: '-0.02em' }}>{s.value}</p>
              <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 2px' }}>{s.label}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Risk Filter Tabs ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '28px 0 24px', flexWrap: 'wrap' }}>
        {RISK_TABS.map(({ label, value, icon: Icon, color }) => {
          const active = activeRisk === value
          return (
            <button
              key={value}
              onClick={() => setActiveRisk(value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 18px', borderRadius: 100,
                border: `1px solid ${active ? color + '40' : 'rgba(255,255,255,0.08)'}`,
                background: active ? color + '12' : 'rgba(255,255,255,0.02)',
                color: active ? color : 'rgba(255,255,255,0.6)',
                fontFamily: F, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                letterSpacing: '0.05em',
              }}
            >
              <Icon size={13} />
              {label}
            </button>
          )
        })}
      </div>

      {/* ── Vault Grid ── */}
      <section style={{ marginBottom: 40 }}>
        <motion.div
          key={activeRisk}
          variants={container}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          className="vault-grid"
        >
          {filtered.map(vault => (
            <VaultCard key={vault.id} vault={vault} walletAddress={publicKey?.toBase58()} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.35)' }}>
            <p style={{ fontSize: 14 }}>No vaults in this category yet.</p>
          </div>
        )}
      </section>

      <style>{`
        @keyframes vaultPulse { 0%,100%{opacity:.4} 50%{opacity:.7} }
        @media (max-width: 1024px) { .vault-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px)  { .vault-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
