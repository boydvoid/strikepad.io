import React, { useContext } from 'react'
import { Boxes } from '.';
import { createCtx } from '../../helpers/createCtx'

export interface Note {
	json: Boxes[]
	create_date?: Date
	id?: number
	key?: string
	title?: string
}
export interface EditorState {
	wrapperEditable: boolean,
	focusedIndex: number,
	boxFocused: boolean
	selectedNote: Note
	notes: Note[]
}

export const editorInitialState = {
	wrapperEditable: false,
	focusedIndex: 0,
	boxFocused: false,
	selectedNote: { json: [] },
	notes: []

}

type Action =
	| { type: 'set_wrapper_editable', payload: boolean }
	| { type: 'set_focused_index', payload: number }
	| { type: 'set_box_focused', payload: boolean }
	| { type: 'set_selected_note', payload: Note }
	| { type: 'set_notes', payload: Note[] };

function reducer(state: EditorState, action: Action) {
	switch (action.type) {
		case 'set_wrapper_editable':
			return { ...state, wrapperEditable: action.payload }
		case 'set_focused_index':
			return { ...state, focusedIndex: action.payload }
		case 'set_box_focused':
			return { ...state, boxFocused: action.payload }
		case 'set_selected_note':
			return { ...state, selectedNote: action.payload }
		case 'set_notes':
			return { ...state, notes: action.payload }

	}
}


export const [EditorContext, EditorProvider] = createCtx(reducer, editorInitialState)


export const useEditorContext = () => {
	return useContext(EditorContext)
}

