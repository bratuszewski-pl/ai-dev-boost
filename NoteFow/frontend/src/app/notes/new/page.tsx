'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/auth';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NewNote() {
    const router = useRouter();
    const [text, setText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token, user } = useAuthStore();

    useEffect(() => {
        if (!token) {
            router.push('/');
        }
    }, [token, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        setIsLoading(true);
        try {
            await api.post('/notes', {
                content: {
                    text,
                },
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to create note', error);
            alert('Failed to create note');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Dashboard
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Note</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Note Content
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full h-64 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Start typing your note here..."
                                required
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                AI will automatically analyze your note to generate keywords and categories.
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading || !text.trim()}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Note
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
