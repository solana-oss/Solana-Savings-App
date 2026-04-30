import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Target, Zap, Menu, X, PieChart, Gift, Wallet, Copy, LogOut, ChevronDown } from 'lucide-react'

const NAV = [
  { href: '/',           label: 'Vaults',           icon: Zap },
  { href: '/dashboard',  label: 'My Savings',        icon: LayoutDashboard },
  { href: '/portfolios', label: 'Portfolio Baskets',  icon: PieChart },
  { href: '/sip',        label: 'Smart SIP',          icon: Target },
  { href: '/gift',       label: 'Yo-Gifts',           icon: Gift },
]

const F = "'Outfit', system-ui, sans-serif"

function shortAddr(addr: string) {
  return addr.slice(0, 4) + '…' + addr.slice(-4)
}

function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [menuOpen, setMenuOpen] = useState(false)
  const addr = publicKey?.toBase58() ?? ''

  if (!connected || !publicKey) {
    return (
      <button
        onClick={() => setVisible(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 16px', borderRadius: 10,
          background: '#D6FF34', border: 'none',
          color: '#05070A', fontFamily: F,
          fontSize: 12, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          cursor: 'pointer', transition: 'box-shadow 0.2s',
          boxShadow: '0 0 16px rgba(214,255,52,0.2)',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(214,255,52,0.4)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 16px rgba(214,255,52,0.2)')}
      >
        <Wallet size={13} />
        Connect Wallet
      </button>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setMenuOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px', borderRadius: 10,
          background: 'rgba(214,255,52,0.06)',
          border: '1px solid rgba(214,255,52,0.2)',
          color: '#D6FF34', fontFamily: F,
          fontSize: 12, fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s',
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D6FF34', boxShadow: '0 0 6px rgba(214,255,52,0.8)' }} />
        {shortAddr(addr)}
        <ChevronDown size={12} style={{ opacity: 0.7 }} />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 200, borderRadius: 14,
              background: 'rgba(13,17,23,0.97)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              overflow: 'hidden', zIndex: 100,
            }}
          >
            <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' }}>Connected</p>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#fff', margin: 0 }}>{shortAddr(addr)}</p>
            </div>
            {[
              {
                icon: Copy, label: 'Copy Address',
                onClick: () => { navigator.clipboard.writeText(addr); setMenuOpen(false) }
              },
              {
                icon: LogOut, label: 'Disconnect',
                onClick: () => { disconnect(); setMenuOpen(false) },
                danger: true
              },
            ].map(({ icon: Icon, label, onClick, danger }) => (
              <button
                key={label}
                onClick={onClick}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', border: 'none', background: 'transparent',
                  color: danger ? '#f87171' : 'rgba(255,255,255,0.8)',
                  fontFamily: F, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#05070A', fontFamily: F, display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(5,7,10,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #D6FF34 0%, #9945FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(153,69,255,0.25)' }}>
              <Zap size={18} color="#05070A" />
            </div>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>YoVest</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#9945FF', textTransform: 'uppercase', letterSpacing: '0.15em', marginLeft: 6 }}>Solana</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden-mobile">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  to={href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 14px', borderRadius: 10,
                    fontSize: 13, fontWeight: 500,
                    textDecoration: 'none',
                    color: active ? '#D6FF34' : 'rgba(255,255,255,0.75)',
                    background: active ? 'rgba(214,255,52,0.07)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(214,255,52,0.15)' : 'transparent'}`,
                    transition: 'all 0.18s',
                    fontFamily: F,
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)' } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.75)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' } }}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <WalletButton />
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              style={{ display: 'none', width: 36, height: 36, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
              className="show-mobile"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {NAV.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href
                  return (
                    <Link
                      key={href}
                      to={href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 14px', borderRadius: 12,
                        fontSize: 14, fontWeight: 500,
                        textDecoration: 'none',
                        color: active ? '#D6FF34' : 'rgba(255,255,255,0.75)',
                        background: active ? 'rgba(214,255,52,0.07)' : 'transparent',
                        transition: 'all 0.18s',
                        fontFamily: F,
                      }}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Page ── */}
      <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '16px 24px 32px' }}>
        {children}
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: F }}>
          Powered by{' '}
          <a href="https://kamino.finance" target="_blank" rel="noopener noreferrer" style={{ color: '#D6FF34', textDecoration: 'none', fontWeight: 500 }}>Kamino</a>
          {' '}·{' '}
          <a href="https://meteora.ag" target="_blank" rel="noopener noreferrer" style={{ color: '#9945FF', textDecoration: 'none', fontWeight: 500 }}>Meteora</a>
          {' '}·{' '}
          <a href="https://jito.network" target="_blank" rel="noopener noreferrer" style={{ color: '#00FF8B', textDecoration: 'none', fontWeight: 500 }}>Jito</a>
          {' '}· Built on Solana
        </span>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
