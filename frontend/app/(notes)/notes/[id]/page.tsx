'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'
import { getNote, updateNote, deleteNote, analyzeNote } from '@/lib/api/notes'
import { shareNote } from '@/lib/api/sharing'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { ShareNoteDialog } from '@/components/notes/share-note-dialog'
import { AIAnalysisBadge } from '@/components/notes/ai-analysis-badge'
import { Trash2, Edit, Share2, RefreshCw } from 'lucide-react'

export default function NoteDetailPage() {
	const params = useParams()
	const id = params.id as string
	const router = useRouter()
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['note', id],
		queryFn: () => getNote(id),
	})

	const deleteMutation = useMutation({
		mutationFn: () => deleteNote(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] })
			toast({
				title: 'Note deleted',
				description: 'The note has been permanently deleted',
			})
			router.push('/notes')
		},
		onError: (error: { statusCode?: number; message?: string }) => {
			toast({
				title: 'Failed to delete note',
				description: error.message || 'An error occurred',
				variant: 'destructive',
			})
		},
	})

	const analyzeMutation = useMutation({
		mutationFn: () => analyzeNote(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['note', id] })
			toast({
				title: 'Analysis started',
				description: 'AI analysis has been restarted',
			})
		},
		onError: (error: { statusCode?: number; message?: string }) => {
			toast({
				title: 'Failed to start analysis',
				description: error.message || 'An error occurred',
				variant: 'destructive',
			})
		},
	})

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (!data?.note) {
		return <div>Note not found</div>
	}

	const note = data.note
	const isOwner = true // TODO: Check if current user is owner

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<Button variant="ghost" onClick={() => router.back()}>
					← Back
				</Button>
				{isOwner && (
					<div className="flex gap-2">
						<Button variant="outline" size="icon">
							<Edit className="h-4 w-4" />
						</Button>
						<ShareNoteDialog noteId={id} />
						{note.aiAnalysisStatus === 'failed' && (
							<Button
								variant="outline"
								size="icon"
								onClick={() => analyzeMutation.mutate()}
								disabled={analyzeMutation.isPending}
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						)}
						<Button
							variant="destructive"
							size="icon"
							onClick={() => deleteMutation.mutate()}
							disabled={deleteMutation.isPending}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				)}
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<CardTitle className="text-2xl">{note.content.text.split('\n')[0]}</CardTitle>
						<AIAnalysisBadge status={note.aiAnalysisStatus} />
					</div>
				</CardHeader>
				<CardContent>
					<div className="prose max-w-none">
						<ReactMarkdown>{note.content.text}</ReactMarkdown>
					</div>

					{note.content.images.length > 0 && (
						<div className="my-4">
							{note.content.images.map((image, idx) => (
								<img
									key={idx}
									src={image.url}
									alt={image.filename}
									className="max-w-full rounded-lg"
								/>
							))}
						</div>
					)}

					{note.content.links.length > 0 && (
						<div className="my-4">
							<h3 className="mb-2 font-semibold">Links</h3>
							<ul className="list-disc pl-5">
								{note.content.links.map((link, idx) => (
									<li key={idx}>
										<a
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline"
										>
											{link}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}

					<div className="mt-6 flex flex-wrap gap-2">
						{note.categoryName && (
							<Badge variant="secondary">{note.categoryName}</Badge>
						)}
						{note.tags.map((tag) => (
							<Badge key={tag} variant="outline">
								#{tag}
							</Badge>
						))}
						{note.keywords.map((keyword) => (
							<Badge key={keyword} variant="outline" className="text-xs">
								{keyword}
							</Badge>
						))}
					</div>

					<div className="mt-4 text-sm text-muted-foreground">
						<p>Created: {format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}</p>
						<p>Updated: {format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

