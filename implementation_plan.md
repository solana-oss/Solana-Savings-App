# YoVest Solana — Super Savings App: Full Build Plan

## Background

YoVest was previously built on **Yo Protocol + Base Chain**. We are now migrating it to **Solana**, leveraging native Solana vault and yield protocols. The goal is a **premium consumer savings super-app** that:
1. Generates the highest possible yield by routing across multiple Solana protocols.
2. Is dead-simple for consumers — just "Deposit & Earn."
3. Preserves all the great features built (SIP, Goals, Gifting, Risk Profiles) and makes them better.

---

## The Solana Yield Ecosystem — Every Protocol You Can Use

Below is a complete map of all vault/yield integrations relevant to this app:

---

### 🏦 Tier 1 — Core Yield Pillars (Must Integrate)

| Protocol | Type | What it Does | APY Range | SDK |
|---|---|---|---|---|
| **Kamino Lend** | Lending | Supply USDC/SOL to earn interest from borrowers | 5–25% | `@kamino-finance/klend-sdk` |
| **Kamino Liquidity Vaults** | Automated LP | Auto-manages CLMM positions on Orca/Raydium, auto-compounds fees | 10–80%+ | `@kamino-finance/kliquidity-sdk` |
| **Meteora Dynamic Vaults** | Yield Aggregator | Routes USDC/SOL across lending protocols to always find best rate | 8–20% | `@meteora-ag/vault-sdk` |
| **Meteora DLMM** | Concentrated LP | Bin-based liquidity, dynamic fees in volatile markets | 30–200%+ | `@meteora-ag/dlmm` |
| **JitoSOL (Jito)** | LST (Liquid Staking) | Stake SOL, earn staking rewards + MEV capture | ~8–9% | Direct on-chain / `@jito-foundation/jito-ts` |
| **Sanctum INF** | LST Aggregator | "LST of LSTs" — earns from multiple LSTs + swap fees | ~9–12% | `@sanctumso/sanctum-sdk` |

---

### 🚀 Tier 2 — Yield Boosters (Should Integrate)

| Protocol | Type | What it Does | APY Enhancement | SDK |
|---|---|---|---|---|
| **Kamino Multiply Vaults** | Leveraged Yield Loop | Auto-borrows & reinvest for 2–4x leveraged yield | Multiplies base yield | `@kamino-finance/klend-sdk` |
| **MarginFi** | Lending | Alternative lending market, often better rates for certain assets | 5–20% | `@mrgnlabs/marginfi-client-v2` |
| **Orca Whirlpools** | CLMM LP | Concentrated liquidity DEX, earn trading fees | 15–100%+ | `@orca-so/whirlpools-sdk` |
| **Raydium CLMM** | CLMM LP | Another major CLMM DEX | 10–80%+ | `@raydium-io/raydium-sdk` |
| **mSOL (Marinade)** | LST | Liquid SOL staking with broad ecosystem integration | ~7–8% | `@marinade-finance/marinade-ts-sdk` |

---

### ⚡ Tier 3 — Infrastructure (Critical for High-Yield Routing)

| Protocol | Type | What it does |
|---|---|---|
| **Jupiter** | DEX Aggregator | Best-price swaps when routing between tokens; essential for zapping in/out of any vault | `@jup-ag/api` |
| **Helius RPC** | RPC + Indexer | Fast, reliable RPC + webhook triggers + DAS API for NFT/token account reads | `helius-sdk` |
| **Squads Protocol** | Multisig | Optional: For DAO/team savings vaults with multi-sig control | `@sqds/multisig` |

---

## Layered Yield Architecture

This is how the app intelligently **stacks** yield for users:

```
Consumer deposits USDC or SOL
            │
            ▼
  ┌──────────────────────────────────────┐
  │     YoVest Smart Routing Engine      │
  │  (Based on user's Risk Profile)      │
  └──────────────────────────────────────┘
            │
    ┌───────┴───────────┐
    ▼                   ▼
STABLE STACK        SOL STACK
(USDC/USDT)         (SOL/jitoSOL)
    │                   │
    ├─ Kamino Lend       ├─ JitoSOL (Jito)
    ├─ Meteora Vault     ├─ Sanctum INF
    ├─ MarginFi Supply   ├─ Kamino Liquidity Vault
    └─ Meteora DLMM LP  └─ Kamino Multiply Vault
                                
    Auto-compounds every 24h
    Rebalances when APY delta > 2%
```

**Yield Stacking Example (Ultra Mode):**
1. User deposits 100 USDC
2. App swaps 50% → jitoSOL via Jupiter (earns staking + MEV yields ~9%)
3. jitoSOL is supplied to Kamino Lending as collateral
4. Against that collateral, borrows USDC at low rate
5. Borrowed USDC goes into Meteora Dynamic Vault (earns ~12%)
6. Net effective yield: **20–35%** on original USDC

---

## Consumer App Features

### Core Features (All ported from YoVest Base)

| Feature | Solana Implementation |
|---|---|
| **Goal-Based Savings** | Vault positions tagged with goals, progress tracked via Helius indexer |
| **Risk Profiles** | Conservative → Kamino Lend only; Balanced → Kamino + Meteora; Aggressive → DLMM + Leverage |
| **SIP (Systematic Investment Plan)** | One-click "Execute SIP" button, same pattern but via Solana wallet adapter |
| **Yield Calculator** | Live APY data fetched from Kamino/Meteora SDKs |
| **Yo-Gift** | Send yield-bearing positions to any Solana address |
| **Bank vs. DeFi Comparison** | Same concept — show vs. 0.5% savings account rate |

### New Solana-Native Features

| Feature | Description |
|---|---|
| **LST Savings Account** | "Stake and forget" — user deposits SOL, gets jitoSOL or Sanctum INF, earns 9-12% passively |
| **Auto-Compounder** | Backend keeper bot harvests Kamino/Meteora rewards daily and re-deposits |
| **Yield Mode Switcher** | UI toggle: Safe / Balanced / Ultra — auto-switches vault allocations |
| **Real-Time APY Race** | Live leaderboard showing which vault is winning the APY race right now |
| **One-Click Zap** | Enter any vault with any token — Jupiter routes automatically |
| **Solana Pay Integration** | Merchant checkout flow that auto-deposits change into savings vault |
| **Mobile-First PWA** | Phantom Mobile deep-link support, mobile wallet adapter |

---

## Tech Stack

```
Frontend:  Vite + React + TypeScript
Styling:   Vanilla CSS (dark, glassmorphism, SOL-purple gradient)
Wallet:    @solana/wallet-adapter-react + Phantom/Backpack/Solflare
RPC:       Helius RPC (helius-sdk)
Swaps:     @jup-ag/api (Jupiter V6)
Yield Core: @kamino-finance/klend-sdk + @kamino-finance/kliquidity-sdk
Yield Alt:  @meteora-ag/vault-sdk + @meteora-ag/dlmm
LST:       JitoSOL / Sanctum INF (via on-chain program calls)
Backend:   Node.js + Express (existing api/ folder) — add /yields, /positions endpoints
DB:        MongoDB (existing) — add SIP schedules, goals, gift metadata
```

---

## 4-Phase Build Roadmap

### 🔵 Phase 1 — Foundation & Safe Yield (2–3 weeks)
> **Goal**: Get users earning yield safely. No complexity.

- [ ] Setup Solana Wallet Adapter (Phantom, Backpack, Solflare)
- [ ] Integrate Helius RPC for all reads
- [ ] Integrate Kamino Lend SDK — show live APY, allow USDC deposit/withdraw
- [ ] Integrate Meteora Dynamic Vaults — show live APY, allow USDC deposit/withdraw
- [ ] Build **Vault selector UI** — card-based grid showing each vault with live APY
- [ ] Build **Portfolio Dashboard** — aggregated positions, total value, earned yield
- [ ] Rebuild SIP module for Solana (same UX, Solana transactions)
- [ ] Port **Goal-Based Savings** feature

**Deliverable:** Users can deposit USDC into Kamino/Meteora and watch it grow.

---

### 🟡 Phase 2 — LST Integration & Multi-Asset (2 weeks)
> **Goal**: Add SOL-native savings and multi-token support.

- [ ] Integrate JitoSOL minting (deposit SOL → get jitoSOL)
- [ ] Integrate Sanctum INF as "LST Savings Account"
- [ ] Integrate Jupiter for seamless token swaps ("Zap in with any token")
- [ ] Build **Risk Profile selector**: Safe / Balanced / Ultra
- [ ] Build **Yield Mode** — UI shows current allocation and APY per mode
- [ ] Build **One-Click Portfolio Switcher** (like risk rebalancing in YoVest)

**Deliverable:** Users can choose their risk level and get optimal yield automatically.

---

### 🟠 Phase 3 — Advanced Yield & Automation (2–3 weeks)
> **Goal**: Maximize yields for power users.

- [ ] Integrate Kamino Liquidity Vaults (automated CLMM LP)
- [ ] Integrate Meteora DLMM (concentration liquidity for fee maximization)
- [ ] Integrate Kamino Multiply Vaults (leveraged yield loop for "Ultra" mode)
- [ ] Build **APY Race Dashboard** — live comparison of all integrated vaults
- [ ] Build **Smart Rebalancing Alerts** — detect APY drift, suggest moves
- [ ] Integrate MarginFi as alternative lending fallback
- [ ] Build backend yield aggregation API (`GET /api/yields`) for all protocols

**Deliverable:** App now routes money to the absolute highest-yield sources.

---

### 🟢 Phase 4 — Consumer Polish & Super-App Features (2 weeks)
> **Goal**: Make it feel like a premium fintech product.

- [ ] Port **Yo-Gift** to Solana (send vault positions to any `.sol` address)
- [ ] **Bank vs. DeFi** comparison dashboard
- [ ] **Mobile-first PWA** — Phantom Mobile deep-link, mobile wallet adapter
- [ ] **Solana Pay integration** — micro-save on every purchase
- [ ] Push notifications (via Helius webhooks) when yield changes significantly
- [ ] **Confetti animations** for goal completions
- [ ] Social sharing cards ("I earned X% this month on YoVest")

**Deliverable:** Full consumer super-app shipped.

---

## Yield Comparison Summary

| Asset | Protocol | Estimated APY | Risk Level |
|---|---|---|---|
| USDC | Meteora Dynamic Vault | 8–15% | 🟢 Low |
| USDC | Kamino Lend | 10–25% | 🟢 Low |
| USDC | Meteora DLMM (stable pair) | 15–40% | 🟡 Medium |
| SOL | JitoSOL staking | 8–9% | 🟢 Low |
| SOL | Sanctum INF | 9–12% | 🟢 Low |
| SOL | Kamino Liquidity Vault | 20–80% | 🟠 Medium-High |
| USDC+SOL | Kamino Multiply (leveraged) | 30–60% | 🔴 High |
| SOL | Meteora DLMM (volatile pair) | 50–200%+ | 🔴 Very High |

> [!IMPORTANT]
> Higher yields always come with higher risk. "Ultra Mode" should have clear risk disclosures.

---

## Open Questions for You

> [!NOTE]
> Please review and answer these before we start building:

1. **Starting Point**: Should we start fresh (new Vite project) or migrate the existing `src/` folder from the current YoVest Base project?
2. **Phase Priority**: Should we start with Phase 1 (safe yield) or jump straight to the full multi-protocol integration?
3. **Target User**: Crypto-native users (connect Phantom) or non-crypto consumers (embedded wallet with email login)? This affects the UX complexity significantly.
4. **Backend**: Do you want to keep the existing Express + MongoDB `api/` backend or switch to something else?
5. **"Ultra Mode" Leverage**: Do you want us to include leveraged vaults (Kamino Multiply) or keep it to non-leveraged strategies for v1?
