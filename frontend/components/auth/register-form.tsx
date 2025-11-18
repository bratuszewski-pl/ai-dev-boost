'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { register as registerApi, login as loginApi } from '@/lib/api/auth'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { RegisterRequest } from '@/types/models'

const registerSchema = z.object({
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(50, 'Username must be at most 50 characters')
		.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
	const router = useRouter()
	const { toast } = useToast()

	const [savedPassword, setSavedPassword] = useState('')

	const registerMutation = useMutation({
		mutationFn: (data: RegisterRequest) => {
			setSavedPassword(data.password)
			return registerApi(data)
		},
		onSuccess: async (data) => {
			toast({
				title: 'Registration successful',
				description: `Account created for ${data.user.username}`,
			})
			// Auto-login after registration
			try {
				await loginApi({
					username: data.user.username,
					password: savedPassword,
				})
				router.push('/notes')
			} catch (error) {
				// If auto-login fails, redirect to login page
				router.push('/login')
			}
		},
		onError: (error: { statusCode?: number; message?: string }) => {
			if (error.statusCode === 409) {
				toast({
					title: 'Registration failed',
					description: 'Username already exists. Please choose a different username.',
					variant: 'destructive',
				})
			} else {
				toast({
					title: 'Registration failed',
					description: error.message || 'An error occurred during registration',
					variant: 'destructive',
				})
			}
		},
	})

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	})

	const onSubmit = (values: RegisterFormValues) => {
		registerMutation.mutate(values)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create your account</CardTitle>
				<CardDescription>
					Enter your information to get started with NoteFlow
				</CardDescription>
			</CardHeader>
			<CardContent>
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
											placeholder="Enter your username"
											autoComplete="username"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your password (min 8 characters)"
											autoComplete="new-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={registerMutation.isPending}
						>
							{registerMutation.isPending ? 'Creating account...' : 'Sign up'}
						</Button>
					</form>
				</Form>
				<div className="mt-4 text-center text-sm">
					<span className="text-muted-foreground">Already have an account? </span>
					<Link
						href="/login"
						className="font-medium text-primary hover:underline"
					>
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}

