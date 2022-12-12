import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { IndexRouteProps } from 'react-router-dom'
import { Action, Boxes } from '../../_pages/Notes'
import { useEditorContext } from '../../_pages/Notes/context'
import './Box.css'

interface Props {
	box: Boxes
	onClick: () => void
	id: number
	addBox: (initialValue?: string) => void
	removeBox: (appendText?: string) => void
	setBoxField: (index: number, value: any, field: any) => void
}

type Shortcut = { [index: string]: string }
const shortcuts: Shortcut = {
	'#': 'md-h1',
	'##': 'md-h2',
	'###': 'md-h3',
	'p': 'md-p',
}
export const Box = forwardRef<HTMLDivElement, Props>(({ box, onClick, id, addBox, setBoxField, removeBox }, ref) => {
	const { state: { wrapperEditable, focusedIndex, boxes, boxFocused }, dispatch } = useEditorContext()
	const [markdownTag, setMarkdownTag] = useState<string | null>('md-p')

	const initialValue = box.initialValue
	const lastAction = box.lastAction

	const [value, setValue] = useState(initialValue)
	const divRef = useRef<any>(null)

	useEffect(() => {
		if (box.focused) {
			if (lastAction === 'backspace' || lastAction === 'left') {
				placeCaretAtEnd(divRef.current)
			}
			// @ts-ignore
			divRef?.current?.focus()
			let range = document.createRange()
			let sel = window.getSelection()

			if (box.lastAction === 'up' || box.lastAction === 'down') {
				// this is depressing but it works so well
				setTimeout(() => {
					if (box.caretPos > divRef.current.innerText.length) {
						placeCaretAtEnd(divRef.current)
					} else {
						range.setStart(divRef.current?.childNodes[0], box.caretPos)
						range.collapse(true)
						sel?.removeAllRanges()
						sel?.addRange(range)
					}
				}, 1)
			}

			dispatch({
				type: 'set_focused_index',
				payload: box.index
			})
			dispatch({
				type: 'set_box_focused',
				payload: true
			})

		} else {
			// @ts-ignore
			divRef.current?.blur()
			dispatch({
				type: 'set_box_focused',
				payload: false
			})
		}
	}, [box.focused])

	function getCaretPosInBox() {
		return window.getSelection()?.getRangeAt(0).endOffset
	}

	const handleEnter = (e: any) => {
		let caretPos = getCaretPosInBox()
		if (e.key === 'Enter') {
			e.preventDefault()
			e.stopPropagation()

			if (window.getSelection()?.type === 'Range') {
				return
			}
			let caretPos = getCaretPosInBox()
			let text = divRef.current.innerText

			let currentText = text.substr(0, caretPos)
			let removedText = text.substr(caretPos)
			setBoxField(box.index, currentText, 'value')

			addBox(removedText)
		}

		if (e.key === 'Backspace') {
			if (divRef.current.id === '0') {
				return

			}
			let text = divRef.current.innerText

			if (caretPos === 0) {
				e.preventDefault()

				// append text to previous line
				//
				let currentText = divRef.current.innerText


				removeBox(currentText)
			}
		}
		if (e.key === 'ArrowDown') {
			if (boxes[box.index + 1] || boxes[box.index + 1] !== undefined) {
				setBoxField(box.index + 1, caretPos, 'caretPos')
				setBoxField(box.index + 1, 'down', 'lastAction')
				setBoxField(box.index, false, 'focused')
				setBoxField(box.index + 1, true, 'focused')
			}

		}
		if (e.key === 'ArrowRight') {
			if (caretPos === divRef.current.innerText.length) {
				if (boxes[box.index + 1] || boxes[box.index + 1] !== undefined) {
					e.preventDefault()
					dispatch({
						type: 'set_focused_index',
						payload: box.index + 1
					})
					setBoxField(box.index, false, 'focused')
					setBoxField(box.index + 1, true, 'focused')
				}
			}
		}
		if (e.key === 'ArrowUp') {
			if (boxes[box.index - 1] || boxes[box.index - 1] !== undefined) {
				setBoxField(box.index - 1, caretPos, 'caretPos')
				setBoxField(box.index - 1, 'up', 'lastAction')
				setBoxField(box.index, false, 'focused')
				setBoxField(box.index - 1, true, 'focused')
			}
		}
		if (e.key === 'ArrowLeft') {
			if (caretPos === 0) {
				if (boxes[box.index - 1] || boxes[box.index - 1] !== undefined) {
					e.preventDefault()
					dispatch({
						type: 'set_focused_index',
						payload: box.index - 1
					})
					setBoxField(box.index, false, 'focused')
					setBoxField(box.index - 1, true, 'focused')
					setBoxField(box.index - 1, true, 'focused')
					setBoxField(box.index - 1, 'left', 'lastAction')
				}
			}
		}

		if (e.key === 'Tab') {
			e.preventDefault()
		}
	}



	function handleOnChange(e: any) {
		const value = e.target.innerText
		setValue(value)
		setBoxField(box.index, value, 'value')
	}

	function positionCursor() {
		divRef.current?.setSelectionRange(4, 5)
	}


	function placeCaretAtEnd(el: any) {
		const range = document.createRange()
		const sel = document.getSelection()
		range?.selectNodeContents(el)
		range?.collapse(false)
		sel?.removeAllRanges();
		sel?.addRange(range);
	}

	return (
		<div className="flex">
			<p className="absolute select-none left-0">
				{'>'}
			</p>
			<div
				ref={divRef}
				onFocus={() => {

					dispatch({
						type: 'set_focused_index',
						payload: box.index
					})
					setBoxField(box.index, true, 'focused')
				}
				}
				onBlur={() => {
					setBoxField(box.index, false, 'focused')
				}}
				data-index={box.index}
				id={id.toString()}
				className={`editable-box w-full ${markdownTag} caret-black ${box.focused ? 'bg-sky-50' : ''}`}
				onClick={onClick}
				onKeyDown={handleEnter}
				contentEditable
				suppressContentEditableWarning >
				{initialValue && <div dangerouslySetInnerHTML={{ __html: initialValue }}></div>}
			</div>
		</div>
	)
}
)
