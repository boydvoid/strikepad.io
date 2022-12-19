import React from 'react'

import { useDB } from '../hooks/useDB'

import { Note, useEditorContext } from '../_pages/Notes/context'

const db = useDB()
function useNotesApi() {
	const { state: { notes }, dispatch } = useEditorContext()

	const getNotesList = () => {
		db.collection('notes').orderBy('create_date').get().then((notes: Note[]) => {
			console.log(notes)
			dispatch({
				type: 'set_notes',
				payload: notes
			})
		})
	}

	const updateNotesList = (passedNote: Note) => {

		let list = [...notes]

		// find note
		list = list.map(item => {
			if (item.id === passedNote.id) {
				return passedNote
			} else {
				return item
			}
		})
		dispatch({
			type: 'set_notes',
			payload: list
		})
	}

	return { getNotesList, updateNotesList }

}

export default useNotesApi;
