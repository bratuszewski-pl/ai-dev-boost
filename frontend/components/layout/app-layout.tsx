'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
	children: React.ReactNode
}

const navigation = [
	{ name: 'Notes', href: '/notes' },
	{ name: 'Shared', href: '/shared' },
	{ name: 'Categories', href: '/categories' },
	{ name: 'Search', href: '/search' },
]

export function AppLayout({ children }: AppLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const pathname = usePathname()
	const { logout, user } = useAuth()

	const handleLogout = () => {
		logout()
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Mobile menu overlay */}
			{mobileMenuOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={() => setMobileMenuOpen(false)}
				/>
			)}

			{/* Sidebar - Desktop */}
			<aside
				className={cn(
					'fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background transition-transform duration-300 lg:translate-x-0',
					sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
				)}
			>
				<div className="flex h-full flex-col">
					<div className="flex h-16 items-center justify-between border-b px-6">
						<h1 className="text-xl font-bold">NoteFlow</h1>
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden"
							onClick={() => setSidebarOpen(false)}
						>
							<X className="h-5 w-5" />
						</Button>
					</div>
					<nav className="flex-1 space-y-1 px-3 py-4">
						{navigation.map((item) => {
							const isActive = pathname === item.href
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
										isActive
											? 'bg-accent text-accent-foreground'
											: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
									)}
									onClick={() => {
										setSidebarOpen(false)
										setMobileMenuOpen(false)
									}}
								>
									{item.name}
								</Link>
							)
						})}
					</nav>
					<div className="border-t p-4">
						<div className="mb-2 px-3 text-sm text-muted-foreground">
							{user?.username}
						</div>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={handleLogout}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Logout
						</Button>
					</div>
				</div>
			</aside>

			{/* Mobile menu - Overlay */}
			<div
				className={cn(
					'fixed left-0 top-0 z-50 h-screen w-64 border-r bg-background transition-transform duration-300 lg:hidden',
					mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				<div className="flex h-full flex-col">
					<div className="flex h-16 items-center justify-between border-b px-6">
						<h1 className="text-xl font-bold">NoteFlow</h1>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMobileMenuOpen(false)}
						>
							<X className="h-5 w-5" />
						</Button>
					</div>
					<nav className="flex-1 space-y-1 px-3 py-4">
						{navigation.map((item) => {
							const isActive = pathname === item.href
							return (
								<Link
									key={item.name}
									href={item.href}
									className={cn(
										'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
										isActive
											? 'bg-accent text-accent-foreground'
											: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
									)}
									onClick={() => setMobileMenuOpen(false)}
								>
									{item.name}
								</Link>
							)
						})}
					</nav>
					<div className="border-t p-4">
						<div className="mb-2 px-3 text-sm text-muted-foreground">
							{user?.username}
						</div>
						<Button
							variant="ghost"
							className="w-full justify-start"
							onClick={handleLogout}
						>
							<LogOut className="mr-2 h-4 w-4" />
							Logout
						</Button>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="lg:pl-64">
				{/* Header - Mobile */}
				<header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 lg:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileMenuOpen(true)}
					>
						<Menu className="h-5 w-5" />
					</Button>
					<h1 className="ml-4 text-lg font-semibold">NoteFlow</h1>
				</header>

				{/* Page content */}
				<main className="min-h-[calc(100vh-4rem)] p-4 lg:p-8">
					{children}
				</main>
			</div>
		</div>
	)
}

