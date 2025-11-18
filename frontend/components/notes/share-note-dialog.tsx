'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shareNote } from '@/lib/api/sharing'
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
import { Share2 } from 'lucide-react'

const shareSchema = z.object({
	username: z.string().min(1, 'Username is required'),
})

type ShareFormValues = z.infer<typeof shareSchema>

interface ShareNoteDialogProps {
	noteId: string
}

export function ShareNoteDialog({ noteId }: ShareNoteDialogProps) {
	const [open, setOpen] = useState(false)
	const { toast } = useToast()
	const queryClient = useQueryClient()

	const form = useForm<ShareFormValues>({
		resolver: zodResolver(shareSchema),
		defaultValues: {
			username: '',
		},
	})

	const shareMutation = useMutation({
		mutationFn: (data: { username: string }) => shareNote(noteId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['note', noteId] })
			toast({
				title: 'Note shared',
				description: 'The note has been shared successfully',
			})
			form.reset()
			setOpen(false)
		},
		onError: (error: { statusCode?: number; message?: string }) => {
			if (error.statusCode === 404) {
				toast({
					title: 'User not found',
					description: 'The username you entered does not exist',
					variant: 'destructive',
				})
			} else if (error.statusCode === 409) {
				toast({
					title: 'Already shared',
					description: 'This note is already shared with this user',
					variant: 'destructive',
				})
			} else {
				toast({
					title: 'Failed to share note',
					description: error.message || 'An error occurred',
					variant: 'destructive',
				})
			}
		},
	})

	const onSubmit = (values: ShareFormValues) => {
		shareMutation.mutate(values)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<Share2 className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share Note</DialogTitle>
					<DialogDescription>
						Enter the username of the person you want to share this note with
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter username"
											autoComplete="username"
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
								disabled={shareMutation.isPending}
							>
								{shareMutation.isPending ? 'Sharing...' : 'Share'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

