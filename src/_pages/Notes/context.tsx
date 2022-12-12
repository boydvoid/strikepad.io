import React, { useContext } from 'react'
import { Boxes } from '.';
import { createCtx } from '../../helpers/createCtx'

export interface EditorState {
	wrapperEditable: boolean,
	focusedIndex: number,
	boxes: Boxes[]
	boxFocused: boolean
}

export const editorInitialState = {
	wrapperEditable: false,
	focusedIndex: 0,
	boxes: [{
		id: 0,
		index: 0,
		value: '',
		markdown: 'H1',
		focused: true,
		lastAction: null,
		caretPos: 0
	}],
	boxFocused: false

}

type Action =
	| { type: 'set_wrapper_editable', payload: boolean }
	| { type: 'set_focused_index', payload: number }
	| { type: 'set_boxes', payload: Boxes[] }
	| { type: 'set_box_focused', payload: boolean };

function reducer(state: EditorState, action: Action) {
	switch (action.type) {
		case 'set_wrapper_editable':
			return { ...state, wrapperEditable: action.payload }
		case 'set_focused_index':
			return { ...state, focusedIndex: action.payload }
		case 'set_boxes':
			return { ...state, boxes: action.payload }
		case 'set_box_focused':
			return { ...state, boxFocused: action.payload }

	}
}


export const [EditorContext, EditorProvider] = createCtx(reducer, editorInitialState)


export const useEditorContext = () => {
	return useContext(EditorContext)
}

