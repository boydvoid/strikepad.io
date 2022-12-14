import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { IndexRouteProps } from 'react-router-dom'
import { CodeMode } from '../../_pages/Code'
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
	'```': 'md-code'
}
export const Box = forwardRef<HTMLDivElement, Props>(({ box, onClick, id, addBox, setBoxField, removeBox }, ref) => {
	const { state: { wrapperEditable, focusedIndex, boxes, boxFocused }, dispatch } = useEditorContext()
	const [markdownTag, setMarkdownTag] = useState<string | null>(box.markdown)

	const initialValue = box.initialValue
	const lastAction = box.lastAction

	const [value, setValue] = useState(initialValue)
	const divRef = useRef<any>(null)

	useEffect(() => {
		if (lastAction === 'moved') {
			setMarkdownTag(box.markdown)
			setBoxField(box.index, null, 'lastAction')
			divRef.current.innerHTML = box.initialValue
		}
		if (box.focused) {
			console.log('k', getCaretPosInBox())
			if (lastAction === 'backspace') {
				setBoxField(box.index, null, 'lastAction')
				divRef.current.innerHTML = box.initialValue
				// this is depressing but it works so well
				setTimeout(() => {
					range.setStart(divRef.current?.childNodes[0], box.caretPos)
					range.collapse(true)
					sel?.removeAllRanges()
					sel?.addRange(range)
				}, 1)
			}
			if (lastAction === 'left') {
				setBoxField(box.index, null, 'lastAction')
				placeCaretAtEnd(divRef.current)
			}

			if (lastAction === 'new') {
				setBoxField(box.index, null, 'lastAction')
				setMarkdownTag(box.markdown)
				divRef.current.innerHTML = box.initialValue
			}

			if (lastAction === 'enter') {
				setBoxField(box.index, null, 'lastAction')
				divRef.current.innerHTML = box.initialValue
			}

			detectFormatting()

			// @ts-ignore
			divRef?.current?.focus()
			let range = document.createRange()
			let sel = window.getSelection()

			if (box.lastAction === 'up' || box.lastAction === 'down') {
				setBoxField(box.index, null, 'lastAction')
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
	}, [box.focused, boxes])

	function getCaretPosInBox() {
		if (document.getSelection()?.type !== 'None') {
			return document.getSelection()?.getRangeAt(0).endOffset
		}
	}

	const handleKeys = (e: any) => {
		// update box value
		let caretPos = getCaretPosInBox()
		setBoxField(box.index, caretPos + 1, 'caretPos')
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
			divRef.current.innerHTML = currentText

			addBox(removedText)
		}

		if (e.key === 'Backspace') {
			if (divRef.current.id === '0') {
				return
			}

			let text = divRef.current.innerText

			if (caretPos === 0) {
				e.preventDefault()
				let currentText = divRef.current.innerText
				removeBox(currentText)
			}

			// setBoxField(box.index, caretPos - 2, 'caretPos')
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

			setBoxField(box.index, caretPos - 2, 'caretPos')
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

	useEffect(() => {
		if (wrapperEditable) return
		if (!divRef.current) return
		setBoxField(box.index, divRef?.current?.innerHTML, 'value')

	}, [divRef?.current?.innerText])


	useEffect(() => {
		setBoxField(box.index, markdownTag, 'markdown')
	}, [markdownTag])

	function detectFormatting() {
		const text = divRef.current.innerText
		const html = divRef.current.innerHTML

		if (text.length <= 4) {

			if (html.includes('#&nbsp;')) {
				divRef.current.innerHTML = ''
				setMarkdownTag('md-h1')
			}
			if (html.includes('##&nbsp;')) {
				divRef.current.innerHTML = ''
				setMarkdownTag('md-h2')
			}
			if (html.includes('###&nbsp;')) {
				divRef.current.innerHTML = ''
				setMarkdownTag('md-h3')
			}

			if (html.includes('```&nbsp;')) {
				divRef.current.innerHTML = ''
				setMarkdownTag('md-code')
			}
		}

	}

	return (
		<div className="flex">
			<p className="absolute select-none left-0">
				{'>'}
			</p>
			{
				markdownTag === 'md-code' ?
					<>
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
							onClick={() => {
								setBoxField(box.index, getCaretPosInBox(), 'caretPos')
								onClick()
							}}
							onKeyDown={handleKeys}
							contentEditable
							suppressContentEditableWarning >
						</div>
						{
							box.focused &&

							<CodeMode code={box.value} />
						}
					</>
					:
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
						onClick={() => {
							setBoxField(box.index, getCaretPosInBox(), 'caretPos')
							onClick()
						}}
						onKeyDown={handleKeys}
						contentEditable
						suppressContentEditableWarning >
					</div>
			}
		</div >
	)
}
)

				// {box.initialValue && <div dangerouslySetInnerHTML={{ __html: box.initialValue }}></div>}
