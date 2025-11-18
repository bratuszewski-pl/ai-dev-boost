import { NoteCreationForm } from '@/components/notes/note-creation-form'
import { NotesList } from '@/components/notes/notes-list'

export default function NotesPage() {
	return (
		<div>
			<NoteCreationForm />
			<NotesList />
		</div>
	)
}

