import React, { useEffect } from 'react'
import useNotesApi from '../../api/notes'
import NotesApi from '../../api/notes'

import { useDB } from '../../hooks/useDB'
import { Note, useEditorContext } from '../../_pages/Notes/context'

interface Props { }
export const NoteSelector: React.FC<Props> = () => {
	const { state: {
		selectedNote, notes
	}, dispatch } = useEditorContext()
	const db = useDB()
	const { getNotesList } = useNotesApi()
	// get a list of all the notes for the user 
	// create a button to select that note
	// load that note into the editor

	useEffect(() => {
		getNotesList()
	}, [])

	function handleNewNote() {
		db.collection('notes').get().then((notes: any) => {
			let id = notes.length + 1
			let newNote = {
				id,
				title: '',
				json: [{
					id: 0,
					index: 0,
					value: 'test',
					initialValue: 'test',
					markdown: 'md-h1',
					focused: false,
					lastAction: null,
					caretPos: 0
				}],
				create_date: new Date()
			}

			db.collection('notes').add(
				newNote
			)

			dispatch({
				type: 'set_selected_note',
				payload: id
			})

			let newNotes = { ...notes }
			notes.push(newNote)
			dispatch({
				type: 'set_notes',
				payload: notes
			})
		})
	}

	function loadNoteById(id: number) {
		db.collection('notes').doc({ id: id }).get().then((note: Note) => {
			dispatch({
				type: 'set_selected_note',
				payload: note
			})
		})
	}


	return (
		<div className='h-full bg-slate-500 text-zinc-50 w-1/3'>
			<div>
				{notes.map((note, index) => (
					<div key={index} className="py-4 border border-solid border-black rounded" onClick={(e) => loadNoteById(note?.id)}>
						{note?.title ?? 'Enter a title'}
					</div>
				))}
			</div>
			<button onClick={handleNewNote}>New Note</button>
		</div>
	)
}

