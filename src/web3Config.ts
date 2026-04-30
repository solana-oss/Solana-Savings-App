// ─────────────────────────────────────────────────────────────────────────────
// Solana Connection Config for YoVest
// ─────────────────────────────────────────────────────────────────────────────

import { clusterApiUrl } from '@solana/web3.js'

export const SOLANA_ENDPOINT = clusterApiUrl('mainnet-beta')

// Optional: Helius RPC for better performance (uncomment and add key when ready)
// export const SOLANA_ENDPOINT = 'https://mainnet.helius-rpc.com/?api-key=YOUR_KEY'
