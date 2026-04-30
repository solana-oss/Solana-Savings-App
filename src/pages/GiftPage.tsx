import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Send, Loader2, CheckCircle2, Info, ExternalLink } from 'lucide-react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { SOLANA_VAULTS } from '../solana/vaults'

const FNUM = "'DM Mono', 'Fira Code', monospace"
const F    = "'Outfit', system-ui, sans-serif"

const THEMES = [
  { id: 'classic', name: 'Classic Blue', color: '#627EEA', emoji: '🎁' },
  { id: 'gold',    name: 'Golden',       color: '#FFAF4F', emoji: '✨' },
  { id: 'energy',  name: 'Nitro Green',  color: '#d6ff34', emoji: '⚡' },
  { id: 'love',    name: 'With Love',    color: '#FF5E5E', emoji: '❤️' },
]

export default function GiftPage() {
  const { publicKey, connected } = useWallet()
  const { setVisible }           = useWalletModal()

  const [recipient, setRecipient] = useState('')
  const [vaultId,   setVaultId]   = useState(SOLANA_VAULTS[0].id)
  const [amount,    setAmount]    = useState('')
  const [message,   setMessage]   = useState('')
  const [theme,     setTheme]     = useState(THEMES[0])
  const [isSending, setIsSending] = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState('')

  const vault = SOLANA_VAULTS.find(v => v.id === vaultId) ?? SOLANA_VAULTS[0]
  const address = publicKey?.toBase58() ?? ''

  const handleSendGift = async () => {
    if (!connected) { setVisible(true); return }
    if (!address) { setError('Please connect your wallet'); return }
    const isAmountValid = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0
    if (!recipient || recipient.length < 32) { setError('Please enter a valid Solana wallet address'); return }
    if (!isAmountValid) { setError('Please enter a valid amount'); return }

    setIsSending(true)
    setError('')
    try {
      // Phase 1: save gift metadata only (on-chain transfer comes in Phase 2)
      const res  = await fetch('/api/gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderAddress:    address,
          recipientAddress: recipient.toLowerCase(),
          vaultId,
          amount,
          message,
          theme: theme.id,
        })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to save gift metadata')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px', fontFamily: F }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ display: 'inline-flex', padding: 12, borderRadius: 20, background: 'rgba(214,255,52,0.1)', border: '1px solid rgba(214,255,52,0.2)', marginBottom: 20 }}
        >
          <Gift size={32} color="#d6ff34" />
        </motion.div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 10px' }}>Yo-Gift</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, margin: 0 }}>Send a savings gift to a friend on Solana.</p>

        {/* Solana note */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 14px', borderRadius: 100, background: 'rgba(153,69,255,0.08)', border: '1px solid rgba(153,69,255,0.18)', marginTop: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9945FF', display: 'inline-block' }} />
          <span style={{ fontSize: 10, fontWeight: 600, color: '#9945FF', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Now on Solana</span>
        </div>
      </div>

      {!success ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(13,17,23,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Recipient */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>
                Recipient Solana Address
              </label>
              <input
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                placeholder="Solana address (44 chars)..."
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, color: '#fff', fontSize: 14, outline: 'none', fontFamily: FNUM }}
              />
            </div>

            {/* Amount & Vault */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Amount (USD)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, color: '#fff', fontSize: 18, outline: 'none', fontFamily: FNUM }}
                />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Vault</label>
                <select
                  value={vaultId}
                  onChange={e => setVaultId(e.target.value)}
                  style={{ width: '100%', height: 54, boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '0 12px', color: '#fff', fontSize: 13, outline: 'none', appearance: 'none', cursor: 'pointer' }}
                >
                  {SOLANA_VAULTS.map(v => (
                    <option key={v.id} value={v.id} style={{ background: '#0a0d11' }}>{v.asset} · {v.protocolLabel}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Personal Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Hope this grows fast! Happy Birthday! 🎉"
                rows={3}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16, color: '#fff', fontSize: 14, outline: 'none', resize: 'none', fontFamily: F }}
              />
            </div>

            {/* Themes */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 10 }}>Card Theme</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    style={{
                      padding: '12px 4px', borderRadius: 12, border: '1px solid', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                      borderColor: theme.id === t.id ? t.color : 'rgba(255,255,255,0.05)',
                      background: theme.id === t.id ? `${t.color}20` : 'rgba(255,255,255,0.02)',
                      fontFamily: F,
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{t.emoji}</div>
                    {t.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Recipient gets</span>
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{vault.tokenOut.split(' ')[0]} ({vault.protocolLabel})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Expected APY</span>
                <span style={{ fontSize: 12, color: vault.accentColor, fontWeight: 600 }}>{vault.apyLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Card Theme</span>
                <span style={{ fontSize: 12, color: theme.color, fontWeight: 600 }}>{theme.name} {theme.emoji}</span>
              </div>
            </div>

            {error && (
              <div style={{ padding: 12, background: 'rgba(255,94,94,0.1)', border: '1px solid rgba(255,94,94,0.2)', borderRadius: 12, color: '#FF5E5E', fontSize: 12, fontFamily: F }}>
                {error}
              </div>
            )}

            {/* CTA */}
            {!connected ? (
              <button
                onClick={() => setVisible(true)}
                style={{ width: '100%', padding: 18, borderRadius: 16, background: '#D6FF34', color: '#000', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', border: 'none', fontFamily: F }}
              >
                Connect Wallet to Send Gift
              </button>
            ) : (
              <button
                onClick={handleSendGift}
                disabled={isSending}
                style={{ width: '100%', padding: 18, borderRadius: 16, background: '#d6ff34', color: '#000', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: isSending ? 'not-allowed' : 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', opacity: isSending ? 0.6 : 1, fontFamily: F }}
              >
                {isSending ? <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={18} />}
                {isSending ? 'Sending Gift…' : 'Send Yo-Gift'}
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', background: 'rgba(13,17,23,0.7)', border: '1px solid #d6ff3440', borderRadius: 24, padding: '48px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
        >
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(214,255,52,0.1)', border: '1px solid #d6ff3430', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} color="#d6ff34" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Gift Registered!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.65, marginBottom: 16 }}>
            Your gift notification is saved. To complete the transfer on-chain,{' '}
            visit <b style={{ color: '#D6FF34' }}>{vault.protocolLabel}</b> and send{' '}
            <b style={{ color: '#fff', fontFamily: FNUM }}>{vault.tokenOut.split(' ')[0]}</b> to the recipient's address.
          </p>
          <a
            href={vault.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: '#D6FF34', color: '#000', fontWeight: 700, textDecoration: 'none', fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16, fontFamily: F }}
          >
            Open {vault.protocolLabel} <ExternalLink size={14} />
          </a>
          <br />
          <button
            onClick={() => { setSuccess(false); setRecipient(''); setAmount(''); setMessage('') }}
            style={{ padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontFamily: F }}
          >
            Send Another Gift
          </button>
        </motion.div>
      )}

      {/* Info */}
      <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 10, padding: 16, background: 'rgba(214,255,52,0.03)', borderRadius: 16, border: '1px solid rgba(214,255,52,0.08)' }}>
        <Info size={16} color="#d6ff34" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5, fontFamily: F }}>
          Yo-Gifts let you send yield-bearing Solana tokens (jitoSOL, kUSDC, INF) directly to a friend. On-chain transfer is handled via the protocol UI. <b>Your friend earns interest the moment they receive it.</b>
        </p>
      </div>

      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
