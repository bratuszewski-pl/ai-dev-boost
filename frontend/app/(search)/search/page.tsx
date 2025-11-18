'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchNotes } from '@/lib/api/search'
import { SearchType } from '@/types/models'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { NoteCard } from '@/components/notes/note-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'

export default function SearchPage() {
	const [searchType, setSearchType] = useState<SearchType>(SearchType.KEYWORD)
	const [query, setQuery] = useState('')
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [categoryId, setCategoryId] = useState('')

	const [searchTrigger, setSearchTrigger] = useState(0)

	const { data, isLoading, isFetching, refetch } = useQuery({
		queryKey: ['search', searchType, query, startDate, endDate, categoryId, searchTrigger],
		queryFn: () =>
			searchNotes({
				type: searchType,
				query: query || undefined,
				startDate: startDate || undefined,
				endDate: endDate || undefined,
				categoryId: categoryId || undefined,
			}),
		enabled: false, // Manual trigger
	})

	const handleSearch = () => {
		setSearchTrigger((prev) => prev + 1)
		refetch()
	}

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold">Search Notes</h1>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Search Options</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs value={searchType} onValueChange={(v) => setSearchType(v as SearchType)}>
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value={SearchType.KEYWORD}>Keyword</TabsTrigger>
							<TabsTrigger value={SearchType.SEMANTIC}>Semantic</TabsTrigger>
							<TabsTrigger value={SearchType.DATE}>Date</TabsTrigger>
							<TabsTrigger value={SearchType.CATEGORY}>Category</TabsTrigger>
						</TabsList>

						<TabsContent value={SearchType.KEYWORD} className="space-y-4">
							<Input
								placeholder="Enter search keywords"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
							<Button onClick={handleSearch} disabled={!query}>
								Search
							</Button>
						</TabsContent>

						<TabsContent value={SearchType.SEMANTIC} className="space-y-4">
							<Input
								placeholder="Enter your question in natural language"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
							<Button onClick={handleSearch} disabled={!query}>
								{isFetching ? 'Searching...' : 'Search'}
							</Button>
							{isFetching && (
								<p className="text-sm text-muted-foreground">
									Semantic search may take up to 1 minute...
								</p>
							)}
						</TabsContent>

						<TabsContent value={SearchType.DATE} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="mb-2 block text-sm font-medium">
										Start Date
									</label>
									<Input
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
									/>
								</div>
								<div>
									<label className="mb-2 block text-sm font-medium">
										End Date
									</label>
									<Input
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
									/>
								</div>
							</div>
							<Button
								onClick={handleSearch}
								disabled={!startDate || !endDate}
							>
								Search
							</Button>
						</TabsContent>

						<TabsContent value={SearchType.CATEGORY} className="space-y-4">
							<Input
								placeholder="Category ID (TODO: Category selector)"
								value={categoryId}
								onChange={(e) => setCategoryId(e.target.value)}
							/>
							<Button onClick={handleSearch} disabled={!categoryId}>
								Search
							</Button>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{isLoading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-32 w-full" />
					))}
				</div>
			) : data?.results ? (
				<div>
					<div className="mb-4 flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Found {data.pagination.total} results in {data.queryTime}ms
						</p>
					</div>
					<div className="space-y-4">
						{data.results.map((result) => {
							// Convert SearchResult to NotePreview format
							const notePreview = {
								id: result.id,
								title: result.title,
								preview: result.preview,
								categoryId: result.categoryId,
								categoryName: result.categoryName,
								tags: result.tags,
								keywords: result.keywords,
								createdAt: result.createdAt,
								updatedAt: result.updatedAt,
							}
							return <NoteCard key={result.id} note={notePreview} />
						})}
					</div>
				</div>
			) : null}
		</div>
	)
}

