// @ts-nocheck
// Original code provided in the challenge- kept verbatim for reference.
// See WalletPage.tsx for the refactored version and Problem3Page.tsx for the analysis.
//
//
// ⚠️  Issue #3: WalletBalance is missing the 'blockchain' field
interface WalletBalance {
  currency: string;
  amount: number;
  // blockchain field is absent -> getPriority(balance.blockchain) always gets undefined
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
//
interface Props extends BoxProps {

}
//
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props; // ⚠️  Issue #7: children destructured but never rendered below
  const balances = useWalletBalances();
  const prices = usePrices();
  //
  // ⚠️  Issue #11: getPriority defined inside the component -> recreated on every render
  //               Issue #13: blockchain typed as `any` instead of string
  const getPriority = (blockchain: any): number => {
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
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        if (lhsPriority > -99) {        // ⚠️  Issue #1: lhsPriority is undefined -> ReferenceError
          if (balance.amount <= 0) {    // ⚠️  Issue #2: inverted condition, should be > 0
            return true;
          }
        }
        return false
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // ⚠️  Issue #4: no return for equal case; implicit undefined -> sort is broken
        // ⚠️  Issue #10: getPriority called twice per comparison inside sort
      })
  }, [balances, prices]); // ⚠️  Issue #8: prices listed but never used inside the memo

  // ⚠️  Issue #9: formattedBalances is computed but never actually used below
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  // ⚠️  Issue #9: rows iterates sortedBalances, not formattedBalances
  // ⚠️  Issue #5: typed as FormattedWalletBalance but items have no .formatted -> undefined
  // ⚠️  Issue #14: formattedBalances and rows recomputed on every render (no memoization)
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount; // ⚠️  Issue #6: missing price -> NaN
    return (
      <WalletRow
        className={classes.row}
        key={index}              // ⚠️  Issue #12: unstable key -> broken reconciliation
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted} // ⚠️  undefined at runtime
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
