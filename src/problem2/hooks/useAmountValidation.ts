import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface UseAmountValidationOptions {
  amount: string
  touched: boolean
  extraError?: (amountNum: number) => string
  extraSubmitCheck?: (amountNum: number) => string
}

export function useAmountValidation({
  amount,
  touched,
  extraError,
  extraSubmitCheck,
}: UseAmountValidationOptions) {
  const { t } = useTranslation()
  const amountNum = parseFloat(amount)

  const baseError = useMemo(() => {
    if (!amount) return t('problem2.errors.required')
    if (isNaN(amountNum)) return t('problem2.errors.invalid')
    if (amountNum <= 0) return t('problem2.errors.positive')
    return ''
  }, [amount, amountNum, t])

  const error = useMemo(() => {
    if (!touched) return ''
    if (baseError) return baseError
    return extraError?.(amountNum) ?? ''
  }, [touched, baseError, extraError, amountNum])

  const submitBlockedReason = useMemo(() => {
    if (baseError) return baseError
    return extraSubmitCheck?.(amountNum) ?? ''
  }, [baseError, extraSubmitCheck, amountNum])

  const canSubmit =
    Boolean(amount) &&
    !isNaN(amountNum) &&
    amountNum > 0 &&
    !submitBlockedReason

  return { amountNum, error, submitBlockedReason, canSubmit }
}
