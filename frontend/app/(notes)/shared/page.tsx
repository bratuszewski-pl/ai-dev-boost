'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { getSharedNotes } from '@/lib/api/sharing'
import { NoteCard } from '@/components/notes/note-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default function SharedNotesPage() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery({
		queryKey: ['shared-notes'],
		queryFn: ({ pageParam }) =>
			getSharedNotes({
				cursor: pageParam,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore ? lastPage.pagination.nextCursor : undefined,
		initialPageParam: undefined as string | undefined,
	})

	if (isLoading) {
		return (
			<div>
				<h1 className="mb-6 text-2xl font-bold">Shared Notes</h1>
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-32 w-full" />
					))}
				</div>
			</div>
		)
	}

	const notes = data?.pages.flatMap((page) => page.notes) ?? []

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Shared Notes</h1>
			{notes.length === 0 ? (
				<div className="py-12 text-center text-muted-foreground">
					<p>No shared notes yet.</p>
				</div>
			) : (
				<div>
					<div className="space-y-4">
						{notes.map((note) => (
							<div key={note.id} className="mb-4">
								<div className="mb-2 flex items-center gap-2">
									<Badge variant="outline" className="text-xs">
										Shared by {note.sharedBy.username} on{' '}
										{format(new Date(note.sharedBy.sharedAt), 'MMM d, yyyy')}
									</Badge>
								</div>
								<NoteCard note={note} />
							</div>
						))}
					</div>
					{hasNextPage && (
						<div className="mt-6 text-center">
							<Button
								variant="outline"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? 'Loading...' : 'Load More'}
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

