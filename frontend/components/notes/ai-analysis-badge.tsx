import { Badge } from '@/components/ui/badge'
import type { AIAnalysisStatus } from '@/types/models'

interface AIAnalysisBadgeProps {
	status?: AIAnalysisStatus
}

export function AIAnalysisBadge({ status }: AIAnalysisBadgeProps) {
	if (!status) return null

	const variants = {
		pending: { variant: 'warning' as const, label: 'Analyzing...' },
		completed: { variant: 'success' as const, label: 'Analyzed' },
		failed: { variant: 'destructive' as const, label: 'Failed' },
	}

	const config = variants[status]

	return (
		<Badge variant={config.variant} className="text-xs">
			{config.label}
		</Badge>
	)
}

