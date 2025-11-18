'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AIAnalysisBadge } from '@/components/notes/ai-analysis-badge'
import type { NotePreview } from '@/types/models'

interface NoteCardProps {
	note: NotePreview
}

export function NoteCard({ note }: NoteCardProps) {
	return (
		<Link href={`/notes/${note.id}`}>
			<Card className="mb-4 transition-shadow hover:shadow-md">
				<CardHeader>
					<div className="flex items-start justify-between">
						<h3 className="text-lg font-semibold">{note.title}</h3>
					</div>
				</CardHeader>
				<CardContent>
					<p className="mb-3 text-sm text-muted-foreground line-clamp-2">
						{note.preview}
					</p>
					<div className="flex flex-wrap items-center gap-2 text-sm">
						{note.categoryName && (
							<Badge variant="secondary">{note.categoryName}</Badge>
						)}
						{note.tags.map((tag) => (
							<Badge key={tag} variant="outline">
								#{tag}
							</Badge>
						))}
						{note.keywords.slice(0, 3).map((keyword) => (
							<Badge key={keyword} variant="outline" className="text-xs">
								{keyword}
							</Badge>
						))}
					</div>
					<div className="mt-3 text-xs text-muted-foreground">
						{format(new Date(note.createdAt), 'MMM d, yyyy')}
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}

