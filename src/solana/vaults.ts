// ─────────────────────────────────────────────────────────────────────────────
// Solana Vault Configuration for YoVest
// All vaults on Solana — static config for Phase 1.
// Live APY data can be fetched from Kamino/Meteora APIs in Phase 2.
// ─────────────────────────────────────────────────────────────────────────────

export type RiskLevel = 'safe' | 'balanced' | 'ultra'
export type Protocol  = 'kamino-lend' | 'kamino-liquidity' | 'meteora' | 'jito' | 'sanctum' | 'marinade'

export interface SolanaVault {
  id:          string
  name:        string
  protocol:    Protocol
  protocolLabel: string
  asset:       string          // primary deposit asset symbol
  asset2?:     string          // second asset for LP pairs
  description: string
  apy:         number          // latest realistic APY (%)
  apyLabel:    string          // e.g. "~7%" or "7-10%"
  tvl:         string          // display TVL
  riskLevel:   RiskLevel
  accentColor: string
  externalUrl: string
  howItWorks:  string          // one-sentence explanation for consumer
  yieldSource: string          // where the yield comes from
  tokenIn:     string          // what user deposits
  tokenOut:    string          // what user receives (vault share token)
}

export const SOLANA_VAULTS: SolanaVault[] = [
  // SAFE TIER
  {
    id:            'kamino-usdc-lend',
    name:          'USDC Savings',
    protocol:      'kamino-lend',
    protocolLabel: 'Kamino Lend',
    asset:         'USDC',
    description:   'Earn stable yield by supplying USDC to Kamino lending market. Your USDC is lent to verified borrowers.',
    apy:           7,
    apyLabel:      '~7%',
    tvl:           '$124M',
    riskLevel:     'safe',
    accentColor:   '#00FF8B',
    externalUrl:   'https://app.kamino.finance/lending',
    howItWorks:    'Deposit USDC, earn interest from borrowers, withdraw anytime.',
    yieldSource:   'Borrower interest payments on Kamino lending markets',
    tokenIn:       'USDC',
    tokenOut:      'kUSDC (Kamino Lending Share)',
  },
  {
    id:            'kamino-usds-optimizer',
    name:          'USDS Optimizer',
    protocol:      'kamino-lend',
    protocolLabel: 'Kamino Lend',
    asset:         'USDS',
    description:   'Actively managed USDS vault that routes capital to highest-yielding Kamino lending strategies.',
    apy:           12,
    apyLabel:      '~12%',
    tvl:           '$48M',
    riskLevel:     'safe',
    accentColor:   '#D6FF34',
    externalUrl:   'https://app.kamino.finance/earn',
    howItWorks:    'Deposit USDS, vault auto-routes to best lending rate, earn optimized yield.',
    yieldSource:   'Automated allocation across Kamino lending markets (Elemental / Steakhouse curators)',
    tokenIn:       'USDS',
    tokenOut:      'kUSDSv (Kamino Vault Share)',
  },
  {
    id:            'jito-sol-staking',
    name:          'SOL Staking',
    protocol:      'jito',
    protocolLabel: 'Jito',
    asset:         'SOL',
    description:   'Stake SOL and earn native Solana staking rewards plus MEV capture. Liquid - withdraw anytime via jitoSOL.',
    apy:           8,
    apyLabel:      '~8%',
    tvl:           '$2.1B',
    riskLevel:     'safe',
    accentColor:   '#9945FF',
    externalUrl:   'https://jito.network',
    howItWorks:    'Deposit SOL, get jitoSOL, earn staking + MEV rewards, swap jitoSOL back to SOL.',
    yieldSource:   'Solana validator staking rewards + MEV (Maximal Extractable Value) capture',
    tokenIn:       'SOL',
    tokenOut:      'jitoSOL',
  },
  {
    id:            'sanctum-inf',
    name:          'LST Aggregator',
    protocol:      'sanctum',
    protocolLabel: 'Sanctum INF',
    asset:         'SOL',
    description:   'INF pools liquidity across every Solana LST and earns extra yield from swap fees between them.',
    apy:           10,
    apyLabel:      '9-12%',
    tvl:           '$340M',
    riskLevel:     'safe',
    accentColor:   '#FFB800',
    externalUrl:   'https://sanctum.so/inf',
    howItWorks:    'Deposit SOL, get INF (LST-of-LSTs), earn staking rewards + swap fee income.',
    yieldSource:   'Aggregated LST staking rewards + trading fees from inter-LST swaps',
    tokenIn:       'SOL',
    tokenOut:      'INF',
  },

  // BALANCED TIER
  {
    id:            'meteora-usdc-vault',
    name:          'USDC Dynamic Vault',
    protocol:      'meteora',
    protocolLabel: 'Meteora',
    asset:         'USDC',
    description:   'Meteora dynamic vault auto-routes USDC across Solana lending markets (Kamino, MarginFi, Drift) to chase the best rate.',
    apy:           10,
    apyLabel:      '8-12%',
    tvl:           '$89M',
    riskLevel:     'balanced',
    accentColor:   '#4E6FFF',
    externalUrl:   'https://app.meteora.ag/vaults',
    howItWorks:    'Deposit USDC, vault rebalances hourly across 5+ lending markets, withdraw anytime.',
    yieldSource:   'Best available lending APY across Solana (auto-routed)',
    tokenIn:       'USDC',
    tokenOut:      'mUSDC (Meteora Vault LP)',
  },
  {
    id:            'kamino-sol-usdc-lp',
    name:          'SOL-USDC Liquidity',
    protocol:      'kamino-liquidity',
    protocolLabel: 'Kamino Earn',
    asset:         'SOL',
    asset2:        'USDC',
    description:   'Provide concentrated liquidity to the SOL/USDC market. Kamino auto-rebalances your position and compounds fees daily.',
    apy:           25,
    apyLabel:      '15-35%',
    tvl:           '$210M',
    riskLevel:     'balanced',
    accentColor:   '#00D2FF',
    externalUrl:   'https://app.kamino.finance/liquidity',
    howItWorks:    'Deposit SOL + USDC, auto-managed CLMM position, earn trading fees, auto-compounded.',
    yieldSource:   'DEX trading fees from SOL/USDC volume on Orca / Raydium',
    tokenIn:       'SOL + USDC',
    tokenOut:      'kToken (Kamino LP Share)',
  },

  // ULTRA TIER
  {
    id:            'kamino-msol-multiply',
    name:          'mSOL Multiply',
    protocol:      'kamino-liquidity',
    protocolLabel: 'Kamino Multiply',
    asset:         'SOL',
    description:   'Leveraged yield loop: stake SOL as mSOL, use as collateral to borrow SOL, re-stake repeatedly. Auto-managed.',
    apy:           12,
    apyLabel:      '10-15%',
    tvl:           '$56M',
    riskLevel:     'ultra',
    accentColor:   '#FF6B35',
    externalUrl:   'https://app.kamino.finance/multiply',
    howItWorks:    'Deposit SOL, auto-creates leveraged staking loop (mSOL borrow), higher yield, managed liquidation.',
    yieldSource:   'Leveraged SOL staking yield (3-4x amplified via Kamino Multiply)',
    tokenIn:       'SOL',
    tokenOut:      'kMultiply Share',
  },
]

// Helpers
export const VAULT_BY_ID = Object.fromEntries(SOLANA_VAULTS.map(v => [v.id, v]))

export const RISK_LABELS: Record<RiskLevel, string> = {
  safe:     'Safe',
  balanced: 'Balanced',
  ultra:    'Ultra',
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  safe:     '#00FF8B',
  balanced: '#FFB800',
  ultra:    '#FF6B35',
}

export const PROTOCOL_LABELS: Record<Protocol, string> = {
  'kamino-lend':      'Kamino Lend',
  'kamino-liquidity': 'Kamino Earn',
  'meteora':          'Meteora',
  'jito':             'Jito',
  'sanctum':          'Sanctum',
  'marinade':         'Marinade',
}
