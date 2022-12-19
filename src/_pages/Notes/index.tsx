import React, { useEffect, useState, useRef, useCallback, useMemo, cloneElement } from 'react'
import useNotesApi from '../../api/notes'
import { useDB } from '../../hooks/useDB'
import { Box } from '../../_components/EditorComponents/Box'
import { MetaItem } from '../../_components/Library/MetaItem'
import { NoteSelector } from '../../_components/NoteSelector'
import { useEditorContext } from './context'

export type Action = 'enter' | 'backspace' | 'left' | 'right' | 'up' | 'down' | 'new' | 'moved' | null
export interface Boxes {
	id: number
	index: number
	value?: string // just used for storing data
	initialValue?: string
	markdown: string
	focused: boolean
	lastAction: Action
	caretPos: number
}

interface Props { }

export const EditPage: React.FC<Props> = () => {
	const { state: { wrapperEditable, focusedIndex, selectedNote }, dispatch } = useEditorContext()
	const [titleValue, setTitleValue] = useState<any>('')
	const db = useDB()
	const { getNotesList, updateNotesList } = useNotesApi()
	const wrapperRef = useRef<any>(null)
	const boxRefs = useRef<any>([])

	useEffect(() => {
		if (!selectedNote) return
		setTitleValue(selectedNote?.title)
		updateNotesList(selectedNote)
	}, [selectedNote])

	function addBox(initialValue?: string) {
		// get box location in array splice
		const newIndex = focusedIndex + 1
		const newBox: Boxes = {
			id: focusedIndex + 1,
			index: newIndex,
			value: '',
			initialValue,
			markdown: 'md-p',
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

	function removeBox(appendText?: string) {
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
		dispatch({
			type: 'set_selected_note',
			payload: { ...selectedNote, json: cloneBoxes }
		})
	}


	function setBoxField(index: number, value: any, field: any, triggerWrapper?: boolean) {
		const cloneBoxes: Boxes[] = [...selectedNote?.json]
		cloneBoxes[index][field] = value
		dispatch({
			type: 'set_selected_note',
			payload: { ...selectedNote, json: cloneBoxes }
		})

		if (triggerWrapper) {
			dispatch({
				type: 'set_wrapper_editable',
				payload: true
			})
		}
	}

	function handleBoxClick(e) {
		let cloneBoxes = [...selectedNote?.json]
		cloneBoxes = cloneBoxes.map(box => box.id == e.target.id ? { ...box, focused: true } : { ...box, focused: false })

		dispatch({
			type: 'set_selected_note',
			payload: { ...selectedNote, json: cloneBoxes }
		})
	}


	useEffect(() => {
		document.addEventListener('selectionchange', () => {
			dispatch({
				type: 'set_wrapper_editable',
				payload: document.getSelection()?.type === 'Range' ? true : false
			})
		})

		return () => {
			document.removeEventListener('selectionchange', () => {
			})
		}
	}, [])


	function handleWrapperKeys(e: any) {
		if (e.key === 'Backspace') {
			e.preventDefault()
			let cloneBoxes = [...selectedNote?.json]
			const range = document.getSelection()?.getRangeAt(0)

			const endContainer = range?.endContainer
			const startContainer = range?.startContainer

			let newBoxes: Boxes[] = []
			if (startContainer !== undefined && endContainer !== undefined) {
				cloneBoxes.map((item) => {
					if (item.id > startContainer.parentElement.id && item.id < endContainer.parentElement.id) {
					} else {
						let startTextLength = startContainer.textContent.length
						let endTextLength = startContainer.textContent.length

						newBoxes.push(item)
					}
				})
			}

			newBoxes = newBoxes.map((item, key) => {
				if (key === newBoxes.length - 1) {
					item.lastAction = 'moved'
					item.initialValue = item.value
				}
				item.id = key
				item.index = key
				return item
			})

			dispatch({
				type: 'set_selected_note',
				payload: { ...selectedNote, json: cloneBoxes }
			})


			// get selection start and end
			// if box is between the start and the end delete it 
			// if the box is the start or the end delete all the text that is selected, if it is all selected delete the box
		}
	}

	function handleTitleUpdate(e) {
		setTitleValue(e.target.value)

		dispatch({
			type: 'set_selected_note',
			payload: { ...selectedNote, title: e.target.value }
		})


		// save
		db.collection('notes').doc({ id: selectedNote.id }).update({
			title: e.target.value
		})

		// update note list

	}

	return (
		<>
			<NoteSelector />
			<div className='flex flex-col items-center w-full h-full p-8 bg-zinc-50'>
				<div ref={wrapperRef} id="fluid-wrapper" className='flex flex-col w-4/5 max-w-[800px] bg-zinc-50 rounded p-2' contentEditable={wrapperEditable} onKeyDown={(e) => {
					if (!wrapperEditable) return
					handleWrapperKeys(e)
				}}
					suppressContentEditableWarning>
					<MetaItem label='Title' value={titleValue} onChange={handleTitleUpdate} />
					{selectedNote?.json?.map((i, key) => (
						<Box
							key={key}
							ref={(el) => (boxRefs.current[key] = el)}
							id={key}
							addBox={addBox}
							onClick={(e) => handleBoxClick(e)}
							removeBox={removeBox}
							setBoxField={setBoxField}
							box={i}
						/>
					))}
				</div>
			</div>
		</>
	)
}

