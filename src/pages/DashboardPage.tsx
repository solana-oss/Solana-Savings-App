import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import MilestoneModal from '../components/MilestoneModal'
import YieldCalculator from '../components/YieldCalculator'
import DepositModal from '../components/DepositModal'
import { Link } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { ArrowUpRight, TrendingUp, Zap, BarChart3, Wallet, PieChart, Activity, Target, Calculator, X } from 'lucide-react'
import { SOLANA_VAULTS, VAULT_BY_ID, type SolanaVault } from '../solana/vaults'

const F    = "'Outfit', system-ui, sans-serif"
const FNUM = "'DM Mono', 'Fira Code', monospace"

const THEMES = [
  { id: 'classic', name: 'Classic Blue',        color: '#627EEA', emoji: '🎁' },
  { id: 'gold',    name: 'Golden Celebration',   color: '#FFAF4F', emoji: '✨' },
  { id: 'energy',  name: 'Nitro Green',          color: '#D6FF34', emoji: '⚡' },
  { id: 'love',    name: 'With Love',            color: '#FF5E5E', emoji: '❤️' },
]

const CARD: React.CSSProperties = {
  background: 'rgba(13,17,23,0.75)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 20,
  backdropFilter: 'blur(12px)',
}
const LABEL: React.CSSProperties = {
  fontSize: 9, fontWeight: 600,
  color: 'rgba(255,255,255,0.7)',
  textTransform: 'uppercase', letterSpacing: '0.2em',
}

// Demo positions for when wallet is connected (Phase 1 — no on-chain read yet)
function buildDemoPositions(vaults: typeof SOLANA_VAULTS) {
  return vaults.slice(0, 3).map(v => ({
    vaultId:     v.id,
    vault:       v,
    name:        v.name,
    symbol:      v.asset,
    shareSymbol: v.tokenOut.split(' ')[0],
    accent:      v.accentColor,
    tokenAmount: '0',
    tokenNum:    0,
    usdValue:    0,
    apy:         v.apy,
    apyLabel:    v.apyLabel,
  }))
}

const DonutChart = ({ slices }: { slices: { pct: number; color: string }[] }) => {
  const r = 40, circ = 2 * Math.PI * r
  let cumulative = 0
  return (
    <svg width={100} height={100} viewBox="0 0 100 100">
      {slices.length === 0 ? (
        <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12} />
      ) : slices.map((s, i) => {
        const dash   = (s.pct / 100) * circ
        const offset = -(cumulative / 100) * circ + circ / 4
        cumulative  += s.pct
        return <circle key={i} cx={50} cy={50} r={r} fill="none" stroke={s.color} strokeWidth={12} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={offset} />
      })}
      <circle cx={50} cy={50} r={35} fill="rgba(13,17,23,0.95)" />
    </svg>
  )
}

const Skeleton = ({ width, height, borderRadius = 8 }: { width: string | number; height: string | number; borderRadius?: number }) => (
  <div style={{ width, height, borderRadius, background: 'rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
    <motion.div
      animate={{ x: ['-100%', '100%'] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}
    />
  </div>
)

export default function DashboardPage() {
  const { publicKey, connected }  = useWallet()
  const { setVisible }            = useWalletModal()
  const address                   = publicKey?.toBase58() ?? ''

  // For Phase 1 we show the vault list as "available to start saving" when connected.
  // Real on-chain positions will be fetched in Phase 2.
  const positions = connected ? buildDemoPositions(SOLANA_VAULTS) : []
  const isLoading = false

  const [milestones, setMilestones] = useState<any[]>([])
  const [activeMilestoneVault, setActiveMilestoneVault] = useState<any>(null)
  const [editableMilestone, setEditableMilestone] = useState<any>(null)
  const [activeGift, setActiveGift] = useState<any>(null)
  const [showCalculator, setShowCalculator] = useState(false)
  const [activeDepositVault, setActiveDepositVault] = useState<SolanaVault | null>(null)
  const [modalAction, setModalAction] = useState<'deposit' | 'withdraw'>('deposit')

  const fetchMilestones = async () => {
    if (!address) return
    try {
      const res  = await fetch(`/api/milestone?userAddress=${address}`)
      const data = await res.json()
      if (data.success) setMilestones(data.data)
    } catch (e) { console.error(e) }
  }

  const fetchGifts = async () => {
    if (!address) return
    try {
      const res  = await fetch(`/api/gift?recipientAddress=${address.toLowerCase()}`)
      const data = await res.json()
      if (data.success && data.data.length > 0) {
        setActiveGift(data.data[0])
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 1000 })
      }
    } catch (e) { console.error(e) }
  }

  const markGiftClaimed = async (id: string) => {
    try { await fetch(`/api/gift?id=${id}`, { method: 'PUT' }) } catch (e) { console.error(e) }
  }

  useEffect(() => {
    fetchMilestones()
    fetchGifts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const avgApy = SOLANA_VAULTS.reduce((s, v) => s + v.apy, 0) / SOLANA_VAULTS.length

  // ── Not connected ─────────────────────────────────────────────────────────
  if (!connected) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: 24, fontFamily: F }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Wallet size={28} color="#9945FF" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>Connect your Solana wallet</h2>
        <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: 14, maxWidth: 340, lineHeight: 1.65, margin: '0 auto 24px' }}>
          See your savings portfolio, yield analytics, and vault allocations. Supports Phantom, Backpack, and Solflare.
        </p>
        <button
          onClick={() => setVisible(true)}
          style={{ padding: '13px 28px', borderRadius: 12, background: '#D6FF34', border: 'none', color: '#05070A', fontFamily: F, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 24px rgba(214,255,52,0.2)' }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  )

  // ── Connected ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: F }}>
      {/* Header */}
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', borderRadius: 100, background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.2)', marginBottom: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9945FF', display: 'inline-block', boxShadow: '0 0 6px rgba(153,69,255,0.8)' }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: '#9945FF', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Solana · Connected</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.022em', margin: 0 }}>Financial Overview</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: '4px 0 0', fontFamily: "'DM Mono', monospace" }}>
            {address.slice(0, 8)}…{address.slice(-6)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowCalculator(true)}
            style={{ height: 38, padding: '0 16px', borderRadius: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', fontFamily: F, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Calculator size={13} /> Yield Calculator
          </button>
          <Link to="/sip" style={{ height: 38, padding: '0 16px', borderRadius: 11, background: '#D6FF34', color: '#05070A', fontFamily: F, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={13} />New Savings Plan
          </Link>
        </div>
      </header>

      {/* ── Top Metrics ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }} className="dash-metric-grid">
        {[
          {
            label: 'Net Savings Value', Icon: TrendingUp, accent: '#D6FF34',
            value: <span style={{ color: 'rgba(255,255,255,0.3)' }}>$0.00</span>,
            sub: <span style={{ color: 'rgba(148,163,184,0.5)' }}>Start depositing to earn</span>,
          },
          {
            label: 'Active Positions', Icon: Zap, accent: '#9945FF',
            value: <span style={{ color: '#fff' }}>0</span>,
            sub: <span style={{ color: 'rgba(148,163,184,0.5)' }}>Vaults active</span>,
          },
          {
            label: 'Best Available APY', Icon: BarChart3, accent: '#10b981',
            value: <span style={{ color: '#10b981' }}>~12%</span>,
            sub: <span style={{ color: 'rgba(148,163,184,0.5)' }}>USDS Optimizer</span>,
          },
          {
            label: 'Available Vaults', Icon: PieChart, accent: '#FFB800',
            value: <span style={{ color: '#FFB800' }}>{SOLANA_VAULTS.length}</span>,
            sub: <span style={{ color: 'rgba(148,163,184,0.5)' }}>Across Kamino, Meteora, Jito</span>,
          },
        ].map(({ label, Icon, accent, value, sub }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06 }}
            style={{ ...CARD, padding: '22px 22px', position: 'relative', overflow: 'hidden' }}>
            <div aria-hidden style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${accent}12 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} color="rgba(148,163,184,0.6)" />
              </div>
              <span style={LABEL}>{label}</span>
            </div>
            <p style={{ fontFamily: FNUM, fontSize: 28, fontWeight: 500, letterSpacing: '-0.025em', margin: '0 0 6px' }}>{value}</p>
            <p style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Vault List ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 100, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 6 }}>
              <Zap size={10} color="#D6FF34" />
              <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(148,163,184,0.8)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Available Yield Vaults</span>
            </div>
            <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', margin: 0 }}>Start Earning Today</h3>
          </div>
          <Link to="/" style={{ fontSize: 12, fontWeight: 600, color: '#D6FF34', textDecoration: 'none', letterSpacing: '0.05em' }}>
            View All Vaults →
          </Link>
        </div>

        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 100px', padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 8 }}>
            {['Vault', 'Asset', 'APY', 'Protocol', 'Action'].map(h => (
              <span key={h} style={LABEL}>{h}</span>
            ))}
          </div>

          {SOLANA_VAULTS.map((vault, i) => {
            const ms = milestones.find(m => m.vaultId === vault.id)
            return (
              <motion.div key={vault.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 100px', padding: '15px 20px', alignItems: 'center', borderBottom: i < SOLANA_VAULTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', gap: 8, transition: 'background 0.18s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                {/* Vault */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: `${vault.accentColor}14`, border: `1px solid ${vault.accentColor}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={15} color={vault.accentColor} />
                  </div>
                  <div>
                    <p style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>{vault.name}</p>
                    <p style={{ fontFamily: F, fontSize: 9, color: 'rgba(148,163,184,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{vault.tokenIn} → {vault.tokenOut.split(' ')[0]}</p>
                  </div>
                </div>
                {/* Asset */}
                <div>
                  <p style={{ fontFamily: FNUM, fontSize: 13, color: '#fff', margin: 0 }}>{vault.asset}{vault.asset2 ? `+${vault.asset2}` : ''}</p>
                </div>
                {/* APY */}
                <div>
                  <p style={{ fontFamily: FNUM, fontSize: 14, color: vault.accentColor, fontWeight: 700, margin: 0 }}>{vault.apyLabel}</p>
                  <p style={{ fontSize: 9, color: 'rgba(148,163,184,0.5)', margin: '2px 0 0', textTransform: 'uppercase' }}>Est. APY</p>
                </div>
                {/* Protocol */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{vault.protocolLabel}</span>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => { setActiveDepositVault(vault); setModalAction('deposit') }}
                    style={{ flex: 1, height: 30, borderRadius: 8, background: `${vault.accentColor}14`, border: `1px solid ${vault.accentColor}28`, color: vault.accentColor, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                  >
                    <Zap size={10} /> Save
                  </button>
                  {!ms && (
                    <button
                      onClick={() => setActiveMilestoneVault({ vaultId: vault.id, name: vault.name, symbol: vault.asset, accent: vault.accentColor })}
                      title="Set Goal"
                      style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Target size={11} />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Yield Calculator Modal */}
      <AnimatePresence>
        {showCalculator && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(5,7,10,0.85)', backdropFilter: 'blur(12px)' }}
            onClick={e => { if (e.target === e.currentTarget) setShowCalculator(false) }}
          >
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} style={{ width: '100%', maxWidth: 800, position: 'relative' }}>
              <button onClick={() => setShowCalculator(false)} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
              <YieldCalculator avgApy={avgApy} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {activeMilestoneVault && (
        <MilestoneModal
          vaultId={activeMilestoneVault.vaultId}
          vault={{ name: activeMilestoneVault.name, asset: { symbol: activeMilestoneVault.symbol } }}
          accentColor={activeMilestoneVault.accent}
          onClose={() => setActiveMilestoneVault(null)}
          onSuccess={fetchMilestones}
        />
      )}

      {editableMilestone && (
        <MilestoneModal
          vaultId={editableMilestone.vaultId}
          vault={{ name: editableMilestone.vault?.name, asset: { symbol: editableMilestone.vault?.symbol } }}
          accentColor={editableMilestone.vault?.accent ?? '#D6FF34'}
          initialName={editableMilestone.name}
          initialAmount={editableMilestone.targetAmount?.toString()}
          onClose={() => setEditableMilestone(null)}
          onSuccess={fetchMilestones}
        />
      )}

      {activeDepositVault && (
        <DepositModal
          vault={activeDepositVault}
          accentColor={activeDepositVault.accentColor}
          initialAction={modalAction}
          onClose={() => setActiveDepositVault(null)}
        />
      )}

      {/* Gift Surprise Modal */}
      <AnimatePresence>
        {activeGift && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(5,7,10,0.85)', backdropFilter: 'blur(12px)' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ width: '100%', maxWidth: 400, background: 'rgba(13,17,23,0.95)', border: `2px solid ${THEMES.find(t => t.id === activeGift.theme)?.color || '#D6FF34'}40`, borderRadius: 28, padding: 32, textAlign: 'center', boxShadow: '0 30px 100px rgba(0,0,0,0.8)' }}
            >
              <div style={{ fontSize: 50, marginBottom: 16 }}>{THEMES.find(t => t.id === activeGift.theme)?.emoji || '🎁'}</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>You have a Gift!</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                <b style={{ color: '#fff' }}>{activeGift.senderAddress.slice(0, 6)}…{activeGift.senderAddress.slice(-4)}</b> sent you{' '}
                <b style={{ color: '#D6FF34' }}>${activeGift.amount}</b> in savings!
              </p>
              {activeGift.message && (
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 24, fontStyle: 'italic' }}>
                  "{activeGift.message}"
                </div>
              )}
              <button onClick={() => { markGiftClaimed(activeGift._id); setActiveGift(null) }} style={{ width: '100%', padding: 16, borderRadius: 14, background: '#D6FF34', color: '#000', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', border: 'none' }}>
                Accept Gift
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portfolio is coming notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ marginTop: 24, padding: '16px 20px', borderRadius: 16, background: 'rgba(153,69,255,0.05)', border: '1px solid rgba(153,69,255,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <Activity size={16} color="#9945FF" />
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
          <strong style={{ color: '#9945FF' }}>Live portfolio tracking</strong> coming in the next update — your on-chain vault positions will appear here automatically once you deposit via Kamino, Meteora, or Jito.
        </p>
      </motion.div>

      <style>{`
        @media (max-width: 900px) { .dash-metric-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .dash-metric-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
