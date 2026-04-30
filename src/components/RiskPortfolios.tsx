import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Shield, Flame, X, ExternalLink } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { SOLANA_VAULTS } from '../solana/vaults'

const F    = "'Outfit', system-ui, sans-serif"
const FNUM = "'DM Mono', 'Fira Code', monospace"

const PROFILES = [
  {
    id: 'conservative', title: 'Conservative', icon: Shield, color: '#00FF8B',
    desc: 'Focus on stability. 80% USDC Savings, 20% SOL Staking.',
    allocations: [{ vaultId: 'kamino-usdc-lend', pct: 80 }, { vaultId: 'jito-sol-staking', pct: 20 }]
  },
  {
    id: 'balanced', title: 'Balanced', icon: Zap, color: '#D6FF34',
    desc: 'Perfect balance. 50% stable yield, 50% LST staking.',
    allocations: [{ vaultId: 'meteora-usdc-vault', pct: 50 }, { vaultId: 'sanctum-inf', pct: 50 }]
  },
  {
    id: 'aggressive', title: 'Ultra Yield', icon: Flame, color: '#FF6B35',
    desc: 'High growth potential. USDC LP + mSOL Multiply.',
    allocations: [{ vaultId: 'kamino-sol-usdc-lp', pct: 60 }, { vaultId: 'kamino-msol-multiply', pct: 40 }]
  }
]


export default function RiskPortfolios() {
  const [selectedProfile, setSelectedProfile] = useState<typeof PROFILES[0] | null>(null)

  return (
    <>
      <div style={{ marginBottom: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
            One-Click Portfolios
          </h2>
          <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: 13, fontWeight: 400, margin: '0 0 14px' }}>
            Diversify instantly based on your risk tolerance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="port-grid">
          {PROFILES.map((prof) => (
            <motion.div
              key={prof.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedProfile(prof)}
              style={{
                background: 'rgba(13,17,23,0.75)', border: `1px solid ${prof.color}40`, borderRadius: 20,
                padding: '24px', backdropFilter: 'blur(12px)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.2s',
                boxShadow: `0 8px 32px ${prof.color}10`
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(13,17,23,0.75)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 16, background: `${prof.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <prof.icon size={22} color={prof.color} />
              </div>
              <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{prof.title}</h3>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 12, lineHeight: 1.5, margin: '0 0 20px', minHeight: 40 }}>{prof.desc}</p>
              
              <div style={{ width: '100%', height: 6, borderRadius: 3, display: 'flex', overflow: 'hidden', marginBottom: 20 }}>
                {prof.allocations.map((a, i) => {
                  const vColor = a.vaultId === 'yoUSD' ? '#00FF8B' : '#627EEA'
                  return <div key={i} style={{ width: `${a.pct}%`, background: vColor, borderRight: i === 0 ? '1px solid #111' : 'none' }} />
                })}
              </div>

              <button style={{
                background: 'transparent', border: `1px solid ${prof.color}60`, borderRadius: 10, color: prof.color,
                padding: '8px 16px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', width: '100%', cursor: 'pointer', fontFamily: F
              }}>
                Invest
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedProfile && (
        <BundleModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}

      <style>{`
        @media (max-width: 768px) { .port-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  )
}

function BundleModal({ profile, onClose }: { profile: any; onClose: () => void }) {
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [amount, setAmount] = useState('')
  const numeric = parseFloat(amount) || 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
          style={{ width: '100%', maxWidth: 460, background: 'rgba(13,17,23,0.97)', border: `1px solid ${profile.color}40`, borderRadius: 24, padding: 24, fontFamily: F, boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <profile.icon size={20} color={profile.color} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>{profile.title} Portfolio</h2>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          {/* Amount input */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: 8 }}>Total Investment (USD)</label>
            <input type="number" placeholder="1000" value={amount} onChange={e => setAmount(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 20, outline: 'none', fontFamily: FNUM }}
            />
          </div>

          {/* Allocations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {profile.allocations.map((a: any) => {
              const vault = SOLANA_VAULTS.find(v => v.id === a.vaultId)
              if (!vault) return null
              const splitUsd = numeric > 0 ? (numeric * a.pct / 100).toFixed(2) : 'â€”'
              return (
                <div key={a.vaultId} style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 3px' }}>{vault.name}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{vault.protocolLabel} Â· {vault.apyLabel} APY</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: profile.color, fontFamily: FNUM }}>{a.pct}%</span>
                    {numeric > 0 && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', fontFamily: FNUM }}>${splitUsd}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Protocol links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>Deposit on protocol</p>
            {profile.allocations.map((a: any) => {
              const vault = SOLANA_VAULTS.find(v => v.id === a.vaultId)
              if (!vault) return null
              return (
                <a key={a.vaultId} href={vault.externalUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: `${profile.color}08`, border: `1px solid ${profile.color}25`, textDecoration: 'none', color: '#fff', fontSize: 12, fontWeight: 600 }}>
                  <span>{vault.protocolLabel} â€“ {vault.name}</span>
                  <ExternalLink size={13} color={profile.color} />
                </a>
              )
            })}
          </div>

          {!connected ? (
            <button onClick={() => setVisible(true)} style={{ width: '100%', padding: 16, background: '#D6FF34', border: 'none', borderRadius: 14, color: '#000', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', fontFamily: F }}>
              Connect Wallet
            </button>
          ) : (
            <button onClick={onClose} style={{ width: '100%', padding: 16, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F }}>
              Visit each protocol above to deposit
            </button>
          )}
        </motion.div>
      </motion.div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </AnimatePresence>
  )
}

