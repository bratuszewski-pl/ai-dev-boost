'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Note } from '@/types';
import NoteCard from '@/components/NoteCard';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const router = useRouter();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    const { data, isLoading } = useQuery({
        queryKey: ['notes', search],
        queryFn: async () => {
            const res = await api.get('/notes', { params: { search } });
            return res.data;
        },
        enabled: !!user,
    });

    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-900">NoteFow</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">Hello, {user.username}</span>
                        <button
                            onClick={() => {
                                logout();
                                router.push('/');
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <Link
                        href="/notes/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        New Note
                    </Link>
                </div>

                {/* Notes Grid */}
                {isLoading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.notes.map((note: Note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                        {data?.notes.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-500">
                                No notes found. Create one to get started!
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
