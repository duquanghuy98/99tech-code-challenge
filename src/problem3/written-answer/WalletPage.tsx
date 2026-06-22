// @ts-nocheck
// Refactored version- all issues from the original have been addressed.
// This file uses @ts-nocheck because useWalletBalances, usePrices, WalletRow,
// BoxProps and classes are external dependencies not present in this repo.
//
// ✅  Fix #3: blockchain field added to WalletBalance
interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string
}
//
interface Props extends BoxProps {}
//
// ✅  Fix #11: getPriority hoisted outside the component -> created once, not per-render
// ✅  Fix #13: blockchain typed as string instead of any
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
      return 20
    case 'Neo':
      return 20
    default:
      return -99
  }
}
//
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props
  const balances = useWalletBalances()
  const prices = usePrices()
  //
  // ✅  Fix #1, #2, #4, #8, #10: correct filter, stable sort, no unused deps, priority computed once
  const sortedBalances = useMemo(() => {
    const prioritized = balances.map((balance: WalletBalance) => ({
      balance,
      priority: getPriority(balance.blockchain),
    }))
    return prioritized
      .filter(({ balance, priority }) => priority > -99 && balance.amount > 0)
      .sort((a, b) => b.priority - a.priority)
      .map(({ balance }) => balance)
  }, [balances])
  //
  // ✅  Fix #9, #14: formattedBalances memoized and actually consumed
  const formattedBalances = useMemo(
    (): FormattedWalletBalance[] =>
      sortedBalances.map((balance: WalletBalance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      })),
    [sortedBalances],
  )
  //
  // ✅  Fix #5, #6, #12, #14: correct source, types, composite key, rows memoized
  const rows = useMemo(
    () =>
      formattedBalances.map((balance: FormattedWalletBalance) => {
        const price = prices[balance.currency] ?? 0 // ✅  Fix #6: guard missing price
        const usdValue = price * balance.amount
        return (
          <WalletRow
            className={classes.row}
            key={`${balance.blockchain}-${balance.currency}`} // ✅  Fix #12: stable composite key
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        )
      }),
    [formattedBalances, prices],
  )

  return (
    <div {...rest}>
      {children} {/* ✅  Fix #7: children forwarded */}
      {rows}
    </div>
  )
}

export default WalletPage
