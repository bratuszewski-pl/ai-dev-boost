'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api/categories'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateCategoryDialog } from '@/components/categories/create-category-dialog'
import { EditCategoryDialog } from '@/components/categories/edit-category-dialog'
import { Trash2, Plus } from 'lucide-react'

export default function CategoriesPage() {
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const { data, isLoading } = useQuery({
		queryKey: ['categories'],
		queryFn: () => getCategories({ includeCounts: true }),
	})

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteCategory(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			toast({
				title: 'Category deleted',
				description: 'The category has been deleted',
			})
		},
		onError: (error: { statusCode?: number; message?: string }) => {
			toast({
				title: 'Failed to delete category',
				description: error.message || 'An error occurred',
				variant: 'destructive',
			})
		},
	})

	if (isLoading) {
		return (
			<div>
				<h1 className="mb-6 text-2xl font-bold">Categories</h1>
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-20 w-full" />
					))}
				</div>
			</div>
		)
	}

	const categories = data?.categories ?? []

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Categories</h1>
				<CreateCategoryDialog />
			</div>

			{categories.length === 0 ? (
				<div className="py-12 text-center text-muted-foreground">
					<p>No categories yet. Create your first category!</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{categories.map((category) => (
						<Card key={category.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<CardTitle>{category.name}</CardTitle>
									<div className="flex gap-2">
										<EditCategoryDialog category={category} />
										<Button
											variant="ghost"
											size="icon"
											onClick={() => deleteMutation.mutate(category.id)}
											disabled={deleteMutation.isPending}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<Badge variant="secondary">
									{category.noteCount || 0} notes
								</Badge>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}

