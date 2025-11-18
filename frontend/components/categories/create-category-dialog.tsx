'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '@/lib/api/categories'
import { useToast } from '@/components/ui/use-toast'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const categorySchema = z.object({
	name: z.string().min(1, 'Category name is required').max(100, 'Category name must be at most 100 characters'),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export function CreateCategoryDialog() {
	const [open, setOpen] = useState(false)
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: {
			name: '',
		},
	})

	const createMutation = useMutation({
		mutationFn: (data: { name: string }) => createCategory(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['categories'] })
			toast({
				title: 'Category created',
				description: 'The category has been created successfully',
			})
			form.reset()
			setOpen(false)
		},
		onError: (error: { statusCode?: number; message?: string }) => {
			if (error.statusCode === 409) {
				toast({
					title: 'Category already exists',
					description: 'A category with this name already exists',
					variant: 'destructive',
				})
			} else {
				toast({
					title: 'Failed to create category',
					description: error.message || 'An error occurred',
					variant: 'destructive',
				})
			}
		},
	})

	const onSubmit = (values: CategoryFormValues) => {
		createMutation.mutate(values)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Create Category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Category</DialogTitle>
					<DialogDescription>
						Enter a name for the new category
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter category name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={createMutation.isPending}
							>
								{createMutation.isPending ? 'Creating...' : 'Create'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

