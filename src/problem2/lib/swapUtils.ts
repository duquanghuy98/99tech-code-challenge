import { type Token } from '../hooks/useTokenPrices'

export {
  formatTokenAmount,
  formatUsd,
  ceilToDecimals,
  calcSwapOutput,
} from '@/lib/formatNumbers'

const TRENDING_PRIORITY = [
  'ETH',
  'BTC',
  'USDC',
  'USDT',
  'LINK',
  'SWTH',
  'RUNE',
  'DAI',
  'BUSD',
  'WBTC',
]

const NETWORK_KEYS: Record<string, string> = {
  ETH: 'problem2.networks.ETH',
  BTC: 'problem2.networks.BTC',
  USDC: 'problem2.networks.ETH',
  USDT: 'problem2.networks.ETH',
  LINK: 'problem2.networks.ETH',
  DAI: 'problem2.networks.ETH',
  BUSD: 'problem2.networks.BSC',
  WBTC: 'problem2.networks.ETH',
  SWTH: 'problem2.networks.Neo',
  RUNE: 'problem2.networks.THORChain',
}

export function getTrendingTokens(tokens: Token[], count = 8): Token[] {
  const picked: Token[] = []
  for (const symbol of TRENDING_PRIORITY) {
    const token = tokens.find((t) => t.currency === symbol)
    if (token) picked.push(token)
  }
  for (const token of tokens) {
    if (!picked.some((t) => t.currency === token.currency) && picked.length < count) {
      picked.push(token)
    }
  }
  return picked.slice(0, count)
}

export function getNetworkLabel(
  currency: string,
  t: (key: string) => string,
): string {
  const key = NETWORK_KEYS[currency]
  return key ? t(key) : currency
}

/** Tokens ranked by USD price (highest first). Excludes plain USD fiat. */
export function getTopTokensByPrice(tokens: Token[], limit = 10): Token[] {
  return [...tokens]
    .filter((t) => t.price > 0 && t.currency !== 'USD')
    .sort((a, b) => b.price - a.price)
    .slice(0, limit)
}
