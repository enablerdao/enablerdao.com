# Lessons Learned - EnablerDAO

## 2026-02-26: Solscan API deprecation (ED-6)
- **Problem**: Solscan API v2 (`api.solscan.io/v2/...`) and public API (`public-api.solscan.io/...`) are unreachable (DNS failure). EBR holder count always returned 0.
- **Solution**: Switched to Solana RPC (`api.mainnet-beta.solana.com`) direct calls:
  - `getProgramAccounts` with Token program + mint filter for holder count
  - `getTokenLargestAccounts` for top holders
  - `getTokenSupply` for supply
- **Note**: Solana public RPC has rate limits (429). For production stability, consider a dedicated RPC provider (Helius, QuickNode) if rate limiting becomes an issue.
- **Files changed**: `src/app/api/metrics/route.ts`, `src/app/api/dashboard/analytics/route.ts`, `src/components/TokenStats.tsx`
