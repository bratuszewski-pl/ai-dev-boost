'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote } from '@/lib/api/notes'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CreateNoteRequest } from '@/types/models'

const MAX_WORDS = 2000

const noteSchema = z.object({
	content: z
		.string()
		.min(1, 'Note content is required')
		.refine(
			(val) => {
				const words = val.trim().split(/\s+/).filter(Boolean)
				return words.length <= MAX_WORDS
			},
			{ message: `Note cannot exceed ${MAX_WORDS} words` }
		),
})

type NoteFormValues = z.infer<typeof noteSchema>

function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(Boolean).length
}

function extractTags(text: string): string[] {
	const tagRegex = /#(\w+)/g
	const matches = text.matchAll(tagRegex)
	return Array.from(matches, (m) => m[1].toLowerCase())
}

export function NoteCreationForm() {
	const { toast } = useToast()
	const queryClient = useQueryClient()
	const [wordCount, setWordCount] = useState(0)
	const [imageData, setImageData] = useState<string | null>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const form = useForm<NoteFormValues>({
		resolver: zodResolver(noteSchema),
		defaultValues: {
			content: '',
		},
	})

	const content = form.watch('content')

	useEffect(() => {
		setWordCount(countWords(content))
	}, [content])

	// Handle image paste
	useEffect(() => {
		const handlePaste = (e: ClipboardEvent) => {
			const items = e.clipboardData?.items
			if (!items) return

			for (let i = 0; i < items.length; i++) {
				const item = items[i]
				if (item.type.indexOf('image') !== -1) {
					e.preventDefault()
					const file = item.getAsFile()
					if (file) {
						const reader = new FileReader()
						reader.onloadend = () => {
							const base64 = reader.result as string
							setImageData(base64)
							toast({
								title: 'Image added',
								description: 'Image will be included when you save the note',
							})
						}
						reader.readAsDataURL(file)
					}
					break
				}
			}
		}

		const textarea = textareaRef.current
		if (textarea) {
			textarea.addEventListener('paste', handlePaste)
			return () => textarea.removeEventListener('paste', handlePaste)
		}
	}, [toast])

	const createMutation = useMutation({
		mutationFn: (data: CreateNoteRequest) => createNote(data),
		onSuccess: () => {
			form.reset()
			setImageData(null)
			setWordCount(0)
			queryClient.invalidateQueries({ queryKey: ['notes'] })
			toast({
				title: 'Note created',
				description: 'Your note has been saved and AI analysis has started',
			})
		},
		onError: (error: { statusCode?: number; message?: string }) => {
			toast({
				title: 'Failed to create note',
				description: error.message || 'An error occurred',
				variant: 'destructive',
			})
		},
	})

	const onSubmit = (values: NoteFormValues) => {
		const tags = extractTags(values.content)
		const links: string[] = []
		// Extract URLs from content
		const urlRegex = /(https?:\/\/[^\s]+)/g
		const urlMatches = values.content.match(urlRegex)
		if (urlMatches) {
			links.push(...urlMatches)
		}

		const request: CreateNoteRequest = {
			content: {
				text: values.content,
				links: links.length > 0 ? links : undefined,
				images: imageData ? [imageData] : undefined,
			},
			tags: tags.length > 0 ? tags : undefined,
		}

		createMutation.mutate(request)
	}

	const remainingWords = MAX_WORDS - wordCount
	const isNearLimit = remainingWords < 100

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>What&apos;s on your mind?</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="content"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Textarea
											{...field}
											ref={textareaRef}
											placeholder="Start typing... Use #tag for tags, paste images, or include links"
											className="min-h-[120px] resize-none"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center justify-between">
							<div className="text-sm text-muted-foreground">
								<span className={isNearLimit ? 'text-warning' : ''}>
									{wordCount} / {MAX_WORDS} words
								</span>
								{imageData && (
									<span className="ml-4 text-green-600">Image attached</span>
								)}
							</div>
							<Button
								type="submit"
								disabled={createMutation.isPending || wordCount === 0}
							>
								{createMutation.isPending ? 'Saving...' : 'Save Note'}
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

