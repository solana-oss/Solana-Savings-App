import { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

// ── Import Solana Wallet Adapter default styles ──────────────────────────────
import '@solana/wallet-adapter-react-ui/styles.css'

interface SolanaProviderProps {
  children: React.ReactNode
}

export default function SolanaProvider({ children }: SolanaProviderProps) {
  const network   = WalletAdapterNetwork.Mainnet
  const endpoint  = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
