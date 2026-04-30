import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, ArrowUpRight, ArrowDownLeft, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { type SolanaVault } from '../solana/vaults'

const F    = "'Outfit', system-ui, sans-serif"
const FNUM = "'DM Mono', 'Fira Code', monospace"

export default function DepositModal({
  vault,
  accentColor,
  onClose,
  initialAction = 'deposit',
}: {
  vault: SolanaVault
  accentColor: string
  onClose: () => void
  initialAction?: 'deposit' | 'withdraw'
}) {
  const [action, setAction] = useState<'deposit' | 'withdraw'>(initialAction)
  const [amount, setAmount] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { publicKey, connected } = useWallet()
  const { setVisible }           = useWalletModal()

  const numericAmount = parseFloat(amount)
  const isValid       = !isNaN(numericAmount) && numericAmount > 0

  // ── Yearly projection ──────────────────────────────────────────────────────
  const yearlyEarnings = isValid
    ? (numericAmount * vault.apy / 100).toFixed(2)
    : null

  const handleSubmit = () => {
    if (!connected) { setVisible(true); return }
    if (!isValid) return
    // Phase 1: redirect to protocol's UI since on-chain integration is Phase 2
    setSubmitted(true)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%', maxWidth: 440,
            maxHeight: 'calc(100vh - 40px)', overflowY: 'auto',
            background: 'rgba(13,17,23,0.98)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 24,
            boxShadow: `0 40px 80px rgba(0,0,0,0.85), 0 0 0 1px ${accentColor}18`,
            fontFamily: F, scrollbarWidth: 'none',
          }}
          className="hide-scrollbar"
        >
          {/* ── Header ── */}
          <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: `${accentColor}15`, border: `1px solid ${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color={accentColor} />
              </div>
              <div>
                <h2 style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', margin: '0 0 2px' }}>
                  {vault.name}
                </h2>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>
                  {action === 'deposit' ? 'Deposit' : 'Withdraw'} · {vault.protocolLabel} · Solana
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── Success state ── */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '20px 0 8px' }}
              >
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${accentColor}15`, border: `1px solid ${accentColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={32} color={accentColor} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Ready to Deposit!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: '0 0 6px', lineHeight: 1.55 }}>
                    You're depositing <strong style={{ color: '#fff' }}>{amount} {vault.asset}</strong> into the <strong style={{ color: accentColor }}>{vault.name}</strong>.
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
                    Expected yearly earnings: ~<strong style={{ color: accentColor }}>{yearlyEarnings} {vault.asset}</strong> ({vault.apyLabel} APY)
                  </p>
                </div>

                {/* ── Phase 1: Redirect to protocol ── */}
                <div style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 12px', lineHeight: 1.5 }}>
                    On-chain execution will be integrated in the next update. For now, you can complete the deposit directly on {vault.protocolLabel}.
                  </p>
                  <a
                    href={vault.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '10px 20px', borderRadius: 10,
                      background: accentColor, color: '#05070A',
                      fontFamily: F, fontSize: 12, fontWeight: 700,
                      textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}
                  >
                    Open {vault.protocolLabel} <ExternalLink size={13} />
                  </a>
                </div>

                <button
                  onClick={onClose}
                  style={{ width: '100%', height: 44, borderRadius: 12, border: '1px solid rgba(255,255,255,0.09)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontFamily: F, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                {/* ── Toggle ── */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 4 }}>
                  {(['deposit', 'withdraw'] as const).map(a => (
                    <button
                      key={a}
                      onClick={() => { setAction(a); setAmount('') }}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                        fontFamily: F, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.2s',
                        background: action === a ? (a === 'deposit' ? 'rgba(214,255,52,0.1)' : 'rgba(255,255,255,0.08)') : 'transparent',
                        color: action === a ? (a === 'deposit' ? '#D6FF34' : '#fff') : 'rgba(148,163,184,0.6)',
                      }}
                    >
                      {a === 'deposit' ? <ArrowUpRight size={12} style={{ display: 'inline', marginRight: 5 }} /> : <ArrowDownLeft size={12} style={{ display: 'inline', marginRight: 5 }} />}
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                  ))}
                </div>

                {/* ── Amount input ── */}
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: 'rgba(148,163,184,0.45)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 9, display: 'block' }}>
                    {action === 'deposit' ? `Amount to deposit (${vault.tokenIn})` : `Amount to withdraw (${vault.tokenOut})`}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      style={{
                        width: '100%', height: 68, boxSizing: 'border-box',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 14, padding: '0 110px 0 16px',
                        fontFamily: FNUM, fontSize: 24, fontWeight: 400, color: '#fff',
                        outline: 'none', transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = accentColor + '55'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}
                    />
                    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, padding: '5px 10px' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor }} />
                      <span style={{ fontFamily: FNUM, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                        {action === 'deposit' ? vault.asset : vault.tokenOut.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Yield projection ── */}
                {isValid && action === 'deposit' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
                  >
                    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13 }}>
                      <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(148,163,184,0.4)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 7px' }}>Expected APY</p>
                      <p style={{ fontFamily: FNUM, fontSize: 18, fontWeight: 700, color: accentColor, margin: 0 }}>{vault.apyLabel}</p>
                    </div>
                    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13 }}>
                      <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(148,163,184,0.4)', textTransform: 'uppercase', letterSpacing: '0.18em', margin: '0 0 7px' }}>Yearly Earnings</p>
                      <p style={{ fontFamily: FNUM, fontSize: 18, fontWeight: 700, color: '#10b981', margin: 0 }}>~{yearlyEarnings} {vault.asset}</p>
                    </div>
                  </motion.div>
                )}

                {/* ── Yield source info ── */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '11px 13px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
                  <AlertCircle size={13} color="rgba(255,255,255,0.35)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.55 }}>
                    <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Yield source:</strong> {vault.yieldSource}
                  </p>
                </div>

                {/* ── CTA ── */}
                {!connected ? (
                  <button
                    onClick={() => setVisible(true)}
                    style={{
                      width: '100%', height: 52, borderRadius: 14, border: 'none',
                      background: '#D6FF34', color: '#05070A',
                      fontFamily: F, fontSize: 13, fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: 'pointer', transition: 'box-shadow 0.2s',
                      boxShadow: '0 0 24px rgba(214,255,52,0.18)',
                    }}
                  >
                    Connect Wallet to Continue
                  </button>
                ) : (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    whileTap={{ scale: 0.975 }}
                    style={{
                      width: '100%', height: 52, borderRadius: 14, border: 'none',
                      cursor: isValid ? 'pointer' : 'not-allowed',
                      background: action === 'deposit' ? '#D6FF34' : '#fff',
                      color: '#05070A',
                      fontFamily: F, fontSize: 13, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                      transition: 'box-shadow 0.25s, opacity 0.2s',
                      boxShadow: action === 'deposit' ? '0 0 24px rgba(214,255,52,0.16)' : '0 0 24px rgba(255,255,255,0.16)',
                      opacity: isValid ? 1 : 0.35, marginTop: 2,
                    }}
                  >
                    {action === 'deposit' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    {action === 'deposit' ? 'Preview Deposit' : 'Preview Withdraw'}
                  </motion.button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type='number'] { -moz-appearance:textfield; }
      `}</style>
    </AnimatePresence>
  )
}
