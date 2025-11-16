import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
	message?: string
	className?: string
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
	if (!message) return null

	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive',
				className
			)}
			role="alert"
		>
			<AlertCircle className="h-4 w-4" />
			<span>{message}</span>
		</div>
	)
}

