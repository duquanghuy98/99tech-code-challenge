import { useQuery } from '@tanstack/react-query'

interface PriceEntry {
  currency: string
  date: string
  price: number
}

export interface Token {
  currency: string
  price: number
}

const PRICES_URL = 'https://interview.switcheo.com/prices.json'

async function fetchPrices(): Promise<Token[]> {
  const res = await fetch(PRICES_URL)
  if (!res.ok) throw new Error('Failed to fetch prices')
  const data: PriceEntry[] = await res.json()

  // Group by currency and take the entry with the most recent date
  const latest = new Map<string, PriceEntry>()
  for (const entry of data) {
    const existing = latest.get(entry.currency)
    if (!existing || new Date(entry.date) > new Date(existing.date)) {
      latest.set(entry.currency, entry)
    }
  }

  return Array.from(latest.values())
    .filter((e) => e.price > 0)
    .map((e) => ({ currency: e.currency, price: e.price }))
    .sort((a, b) => a.currency.localeCompare(b.currency))
}

export function useTokenPrices() {
  return useQuery({
    queryKey: ['token-prices'],
    queryFn: fetchPrices,
    staleTime: 1000 * 60 * 5,
  })
}

export function getTokenIconUrl(currency: string) {
  return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`
}
