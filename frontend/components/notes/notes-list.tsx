'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { getNotes } from '@/lib/api/notes'
import { NoteCard } from './note-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { NotesQueryParams } from '@/types/models'

interface NotesListProps {
	queryParams?: NotesQueryParams
}

export function NotesList({ queryParams }: NotesListProps) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useInfiniteQuery({
		queryKey: ['notes', queryParams],
		queryFn: ({ pageParam }) =>
			getNotes({
				...queryParams,
				cursor: pageParam,
			}),
		getNextPageParam: (lastPage) =>
			lastPage.pagination.hasMore ? lastPage.pagination.nextCursor : undefined,
		initialPageParam: undefined as string | undefined,
	})

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-32 w-full" />
				))}
			</div>
		)
	}

	const notes = data?.pages.flatMap((page) => page.notes) ?? []

	if (notes.length === 0) {
		return (
			<div className="py-12 text-center text-muted-foreground">
				<p>No notes yet. Create your first note above!</p>
			</div>
		)
	}

	return (
		<div>
			<div className="space-y-4">
				{notes.map((note) => (
					<NoteCard key={note.id} note={note} />
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
	)
}

