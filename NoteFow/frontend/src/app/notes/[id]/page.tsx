'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Note } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Tag, Folder, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function NoteDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data, isLoading, error } = useQuery({
        queryKey: ['note', id],
        queryFn: async () => {
            const res = await api.get(`/notes/${id}`);
            return res.data.note as Note;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <p className="text-red-500 mb-4">Failed to load note</p>
                <Link href="/dashboard" className="text-blue-600 hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

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

                <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b bg-slate-50/50">
                        <h1 className="text-2xl font-bold text-slate-900 mb-4">
                            {data.title || 'Untitled Note'}
                        </h1>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {format(new Date(data.createdAt), 'MMMM d, yyyy h:mm a')}
                            </div>

                            {data.categoryName && (
                                <div className="flex items-center">
                                    <Folder className="w-4 h-4 mr-2" />
                                    {data.categoryName}
                                </div>
                            )}

                            <div className="flex items-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${data.aiAnalysisStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                        data.aiAnalysisStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    AI Analysis: {data.aiAnalysisStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 prose prose-slate max-w-none">
                        <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                            {data.content.text}
                        </p>
                    </div>

                    {/* Footer / Metadata */}
                    <div className="p-6 bg-slate-50 border-t">
                        <div className="flex items-start gap-2">
                            <Tag className="w-4 h-4 text-slate-400 mt-1" />
                            <div className="flex flex-wrap gap-2">
                                {data.keywords.length > 0 ? (
                                    data.keywords.map((keyword) => (
                                        <span
                                            key={keyword}
                                            className="px-2 py-1 text-xs bg-white border rounded-full text-slate-600"
                                        >
                                            {keyword}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400 italic">No keywords generated</span>
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
