'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { login as loginApi, logout as logoutApi, getCurrentUser } from '@/lib/api/auth'
import type { LoginRequest, RegisterRequest } from '@/types/models'
import { useToast } from '@/components/ui/use-toast'

export function useAuth() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { toast } = useToast()

	// Get current user
	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['auth', 'me'],
		queryFn: getCurrentUser,
		retry: false,
		refetchOnWindowFocus: false,
	})

	// Login mutation
	const loginMutation = useMutation({
		mutationFn: (credentials: LoginRequest) => loginApi(credentials),
		onSuccess: (data) => {
			queryClient.setQueryData(['auth', 'me'], { user: data.user })
			toast({
				title: 'Login successful',
				description: `Welcome back, ${data.user.username}!`,
			})
			router.push('/notes')
		},
		onError: (error: { statusCode?: number; message?: string }) => {
			toast({
				title: 'Login failed',
				description:
					error.message || 'Invalid username or password',
				variant: 'destructive',
			})
		},
	})

	// Logout mutation
	const logoutMutation = useMutation({
		mutationFn: logoutApi,
		onSuccess: () => {
			queryClient.clear()
			router.push('/login')
			toast({
				title: 'Logged out',
				description: 'You have been successfully logged out.',
			})
		},
		onError: () => {
			// Even if logout fails on server, clear local state
			queryClient.clear()
			router.push('/login')
		},
	})

	return {
		user: user?.user,
		isLoading,
		isAuthenticated: !!user?.user,
		login: loginMutation.mutate,
		loginAsync: loginMutation.mutateAsync,
		isLoggingIn: loginMutation.isPending,
		logout: logoutMutation.mutate,
		isLoggingOut: logoutMutation.isPending,
		error,
	}
}

