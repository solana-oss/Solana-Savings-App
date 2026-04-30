import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, ArrowUpRight, Wallet, Target, ExternalLink,
  Shield, Flame, Zap,
} from 'lucide-react'
import { type SolanaVault, RISK_COLORS, RISK_LABELS } from '../solana/vaults'
import DepositModal from './DepositModal'
import MilestoneModal from './MilestoneModal'

const F    = "'Outfit', system-ui, sans-serif"
const FNUM = "'DM Mono', 'Fira Code', monospace"

const RISK_ICONS = { safe: Shield, balanced: TrendingUp, ultra: Flame }

const card = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.38 } },
}

export default function VaultCard({
  vault,
  walletAddress,
}: {
  vault: SolanaVault
  walletAddress?: string
}) {
  const [modalOpen, setModalOpen]       = useState(false)
  const [milestoneOpen, setMilestoneOpen] = useState(false)

  const RiskIcon  = RISK_ICONS[vault.riskLevel]
  const riskColor = RISK_COLORS[vault.riskLevel]
  const accent    = vault.accentColor

  return (
    <>
      <motion.div
        variants={card}
        whileHover={{ y: -5, borderColor: accent + '45', boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20` }}
        transition={{ duration: 0.22 }}
        style={{
          background: 'rgba(13,17,23,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 22, padding: '22px 22px 20px',
          display: 'flex', flexDirection: 'column', gap: 16,
          position: 'relative', overflow: 'hidden',
          backdropFilter: 'blur(16px)',
          fontFamily: F, cursor: 'default',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Accent glow top-right */}
        <div aria-hidden style={{ position: 'absolute', top: -50, right: -50, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.015) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Icon */}
            <div style={{ width: 46, height: 46, borderRadius: 14, flexShrink: 0, background: `${accent}14`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color={accent} />
            </div>
            <div>
              <h3 style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', margin: '0 0 3px' }}>
                {vault.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {vault.protocolLabel}
                </span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {vault.asset}{vault.asset2 ? `+${vault.asset2}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Risk badge + Goal button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {walletAddress && (
              <button
                onClick={e => { e.stopPropagation(); setMilestoneOpen(true) }}
                title="Set Savings Goal"
                style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                <Target size={14} color={accent} />
              </button>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, background: riskColor + '12', border: `1px solid ${riskColor}28` }}>
              <RiskIcon size={10} color={riskColor} />
              <span style={{ fontSize: 9, fontWeight: 700, color: riskColor, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {RISK_LABELS[vault.riskLevel].split(' ')[1]}
              </span>
            </div>
          </div>
        </div>

        {/* ── APY + TVL ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ padding: '13px 15px', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 7px' }}>
              Est. APY
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: FNUM, fontSize: 22, fontWeight: 700, color: accent, letterSpacing: '-0.02em' }}>{vault.apyLabel}</span>
            </div>
          </div>
          <div style={{ padding: '13px 15px', borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 7px' }}>
              TVL
            </p>
            <p style={{ fontFamily: FNUM, fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em', margin: 0 }}>
              {vault.tvl}
            </p>
          </div>
        </div>

        {/* ── How it works ── */}
        <div style={{ borderRadius: 12, padding: '11px 13px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <Zap size={10} color={accent} />
            <p style={{ fontSize: 9, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.16em', margin: 0 }}>
              How it works
            </p>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.55 }}>
            {vault.howItWorks}
          </p>
        </div>

        {/* ── Token flow ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 13px', borderRadius: 12, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 3px' }}>You deposit</p>
            <p style={{ fontFamily: FNUM, fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>{vault.tokenIn}</p>
          </div>
          <ArrowUpRight size={16} color={accent} style={{ opacity: 0.7 }} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 3px' }}>You receive</p>
            <p style={{ fontFamily: FNUM, fontSize: 11, fontWeight: 600, color: accent, margin: 0, maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vault.tokenOut}</p>
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setModalOpen(true)}
            disabled={!walletAddress}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none',
              cursor: walletAddress ? 'pointer' : 'not-allowed',
              background: '#D6FF34', color: '#05070A',
              fontFamily: F, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.22s',
              boxShadow: walletAddress ? '0 0 20px rgba(214,255,52,0.14)' : 'none',
              opacity: walletAddress ? 1 : 0.3,
            }}
            onMouseEnter={e => { if (walletAddress) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(214,255,52,0.35)' }}
            onMouseLeave={e => { if (walletAddress) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(214,255,52,0.14)' }}
          >
            {walletAddress ? <><span>Deposit & Earn</span><ArrowUpRight size={13} /></> : <><Wallet size={13} /><span>Connect Wallet</span></>}
          </button>
          <a
            href={vault.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`View on ${vault.protocolLabel}`}
            style={{
              width: 44, height: 44, borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.09)',
              background: 'rgba(255,255,255,0.03)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s', textDecoration: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.5)' }}
          >
            <ExternalLink size={15} />
          </a>
        </div>
      </motion.div>

      {modalOpen && (
        <DepositModal
          vault={vault}
          accentColor={accent}
          onClose={() => setModalOpen(false)}
        />
      )}

      {milestoneOpen && (
        <MilestoneModal
          vaultId={vault.id}
          vault={vault}
          accentColor={accent}
          onClose={() => setMilestoneOpen(false)}
          onSuccess={() => setMilestoneOpen(false)}
        />
      )}

      <style>{`
        @keyframes cardPulse { 0%,100%{opacity:.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.15)} }
      `}</style>
    </>
  )
}
