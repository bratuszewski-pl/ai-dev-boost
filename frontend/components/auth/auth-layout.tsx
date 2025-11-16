import { ReactNode } from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
	children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight">NoteFlow</h1>
					<p className="mt-2 text-muted-foreground">
						AI-powered note-taking application
					</p>
				</div>
				{children}
			</div>
		</div>
	)
}

