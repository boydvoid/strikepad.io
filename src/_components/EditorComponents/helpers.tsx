import { Boxes } from "../../_pages/Notes"
import { EditorState, Action } from "../../_pages/Notes/context"

export function getCaretPosInBox() {
	if (document.getSelection()?.type !== 'None') {
		return document.getSelection()?.getRangeAt(0).endOffset
	}
}

export function addBox(state: EditorState, dispatch: any, initialValue?: string, markdown = 'md-p') {
	const { focusedIndex, selectedNote } = state
	// get box location in array splice
	const newIndex = focusedIndex + 1
	const newBox: Boxes = {
		id: focusedIndex + 1,
		index: newIndex,
		value: '',
		initialValue,
		markdown: markdown,
		focused: true,
		lastAction: 'new',
		caretPos: 0
	}

	const cloneBoxes: Boxes[] = [...selectedNote.json]
	cloneBoxes[focusedIndex].focused = false
	cloneBoxes.splice(focusedIndex + 1, 0, newBox)

	cloneBoxes.map((box, key) => {
		box.id = key
		box.index = key
		if (box.index > newIndex) {
			box.lastAction = 'moved'
			box.initialValue = box.value
		}
		return box
	})

	dispatch({
		type: 'set_selected_note',
		payload: { ...selectedNote, json: cloneBoxes }
	})

	dispatch({
		type: 'set_focused_index',
		payload: focusedIndex + 1
	})
}

export function removeBox(state: EditorState, dispatch: any, appendText?: string) {
	const { focusedIndex, selectedNote } = state
	const cloneBoxes: Boxes[] = [...selectedNote.json]
	const prevIndex = cloneBoxes[focusedIndex - 1]
	if (prevIndex.value !== undefined) {
		prevIndex.caretPos = prevIndex.value.length
	}
	prevIndex.focused = true
	prevIndex.lastAction = 'backspace'
	if (appendText !== undefined) {
		prevIndex.initialValue = prevIndex.value + appendText
	}
	cloneBoxes.splice(focusedIndex, 1)
	cloneBoxes.map((box, key) => {
		if (box.index > focusedIndex - 1) {
			box.lastAction = 'moved'
			box.initialValue = box.value
		}
		box.index = key
	})
	console.log(cloneBoxes)
	dispatch({
		type: 'set_selected_note',
		payload: { ...selectedNote, json: cloneBoxes }
	})
}

export function replaceBox(state: EditorState, dispatch: any, appendText?: string) {
	console.log('replace')
	const { focusedIndex, selectedNote } = state
	const cloneBoxes: Boxes[] = [...selectedNote.json]
	const newBox: Boxes = {
		id: focusedIndex,
		index: focusedIndex,
		value: appendText ?? '',
		initialValue: '',
		markdown: 'md-p',
		focused: true,
		lastAction: 'replaced',
		caretPos: 0
	}

	cloneBoxes[focusedIndex] = newBox
	console.log('replaced', cloneBoxes)
	dispatch({
		type: 'set_selected_note',
		payload: { ...selectedNote, json: cloneBoxes }
	})
}

export function placeCaretAtEnd(el: any) {
	const range = document.createRange()
	const sel = document.getSelection()
	range?.selectNodeContents(el)
	range?.collapse(false)
	sel?.removeAllRanges();
	sel?.addRange(range);
}
