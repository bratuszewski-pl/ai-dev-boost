import { Note } from '@/types';
import { format } from 'date-fns';
import Link from 'next/link';

interface NoteCardProps {
    note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
    return (
        <Link href={`/notes/${note.id}`} className="block">
            <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                    {note.title || 'Untitled Note'}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-grow">
                    {note.content.text}
                </p>

                <div className="mt-auto space-y-2">
                    <div className="flex flex-wrap gap-1">
                        {note.keywords.slice(0, 3).map((keyword) => (
                            <span key={keyword} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                {keyword}
                            </span>
                        ))}
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>{format(new Date(note.createdAt), 'MMM d, yyyy')}</span>
                        {note.categoryName && (
                            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                                {note.categoryName}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
