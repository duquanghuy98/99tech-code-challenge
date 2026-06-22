import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

interface ProblemBadgeProps {
  problem: 1 | 2 | 3
  className?: string
}

export default function ProblemBadge({ problem, className }: ProblemBadgeProps) {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className={className ?? 'text-xs'}>
      {t(`nav.problem${problem}`)}
    </Badge>
  )
}
