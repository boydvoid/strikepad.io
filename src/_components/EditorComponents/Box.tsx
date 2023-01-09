import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { useDB } from '../../hooks/useDB'
import { CodeMode } from '../../_pages/Code'
import { Boxes } from '../../_pages/Notes'
import { useEditorContext } from '../../_pages/Notes/context'
import { getCaretPosInBox } from './helpers'
import './Box.css'
import { ListBox } from './_components/List'
import useNotesApi from '../../api/notes'

interface Props {
	box: Boxes
	onClick: (e: any) => void
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
	'```': 'md-code',
}
export const Box = forwardRef<HTMLDivElement, Props>(({ box, onClick, id, addBox, setBoxField, removeBox }, ref) => {
	const { state: { wrapperEditable, selectedNote
	}, dispatch } = useEditorContext()

	const db = useDB()
	const { updateNote } = useNotesApi()
	const [markdownTag, setMarkdownTag] = useState<string | null>(box.markdown)
	const [language, setLanguage] = useState<any>('setup')

	const boxes = selectedNote?.json

	const initialValue = box.initialValue
	const lastAction = box?.lastAction

	const divRef = useRef<any>(null)

	useEffect(() => {
		if (!box) return
		if (!divRef.current) return
		divRef.current.innerHTML = box.initialValue
	}, [box])

	useEffect(() => {
		if (lastAction === 'replaced') {
			setMarkdownTag(box.markdown)
			setBoxField(box.index, null, 'lastAction')
		}
		if (lastAction === 'moved') {
			setMarkdownTag(box.markdown)
			setBoxField(box.index, null, 'lastAction')
			divRef.current.innerHTML = box.initialValue
		}
		if (box.focused) {
			divRef.current.focus()
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
			// divRef?.current?.focus()
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
			console.log('blur', box.index)
			// @ts-ignore
			divRef.current?.blur()
			dispatch({
				type: 'set_box_focused',
				payload: false
			})
		}
	}, [box.focused, selectedNote])


	const handleKeys = (e: any) => {
		// TODO: CLEEEEEAAAANNNN
		if (!divRef.current) return
		// update box value
		let caretPos = getCaretPosInBox()
		setBoxField(box.index, caretPos + 1, 'caretPos')

		if (e.key === 'Enter') {
			if (e.shiftKey) {

			} else {

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
				setBoxField(box.index, currentText, 'initialValue')
				divRef.current.innerHTML = currentText

				addBox(removedText)
			}
		}

		if (e.key === 'Backspace') {
			if (markdownTag === 'md-ul') {
				if (divRef.current.childNodes.length !== 1) {
					return
				}
			}

			if (markdownTag !== 'md-p') {
				console.log('bp', divRef.current.innerHTML)
				if (divRef.current.innerText === '' || divRef.current.innerHTML === '<br>') {
					setMarkdownTag('md-p')
					setBoxField(box.index, 'md-p', 'markdown')
				}
			}


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

		updateNote()
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
		setBoxField(box.index, divRef?.current?.innerHTML, 'initialValue')

	}, [divRef?.current?.innerText])


	useEffect(() => {
		setBoxField(box.index, markdownTag, 'markdown')
	}, [markdownTag])

	function detectFormatting() {
		if (!divRef.current) return
		const text = divRef.current.innerText
		let html = divRef.current.innerHTML

		if (html.includes("**javascript")) {
			html = html.replace('**javascript', '')
			divRef.current.innerHTML = html
			setLanguage('javascript')
		}

		let newHtml = ''
		if (/^# /.test(html) || /^#&nbsp;/.test(html)) {
			newHtml = html.replaceAll("# ", "")
			newHtml = html.replaceAll("#&nbsp;", "")
			setBoxField(box.index, newHtml, 'initialValue')
			setMarkdownTag('md-h1')
		}
		if (/^## /.test(html)) {
			newHtml = html.replaceAll("## ", "")
			setBoxField(box.index, newHtml, 'initialValue')
			setMarkdownTag('md-h2')
		}
		if (/^### /.test(html)) {
			newHtml = html.replaceAll("### ", "")
			setBoxField(box.index, newHtml, 'initialValue')
			setMarkdownTag('md-h3')
		}

		if (/^``` /.test(html)) {
			newHtml = html.replaceAll("``` ", "")
			setBoxField(box.index, newHtml, 'initialValue')
			setMarkdownTag('md-code')
		}

		if (/^- /.test(html)) {
			newHtml = html.replaceAll("- ", "")
			setBoxField(box.index, newHtml, 'initialValue')
			setMarkdownTag('md-ul')
		}
		updateNote()
	}

	function getHTML() {
		// console.log(markdownTag, box.index)

		switch (markdownTag) {
			case 'md-code':
				return (
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
							className={`editable-box w-full ${markdownTag} caret-black`}
							onClick={() => {
								setBoxField(box.index, getCaretPosInBox(), 'caretPos')
								onClick()
							}}
							onKeyDown={handleKeys}
							contentEditable
							suppressContentEditableWarning >
						</div>
						<CodeMode code={box.value} language={language} />
					</>
				)
			case 'md-ul':
				return (
					<ListBox ref={divRef} box={box} id={id} handleKeys={handleKeys} setBoxField={setBoxField} />
				)
			case 'md-p':
				return (
					<p
						ref={divRef}
						onFocus={() => {
							dispatch({
								type: 'set_focused_index',
								payload: box.index
							})
							setBoxField(box?.index, true, 'focused')
						}
						}
						onBlur={() => {
							setBoxField(box?.index, false, 'focused')
						}}
						data-index={box.index}
						id={id.toString()}
						className={`editable-box w-full ${markdownTag} caret-black p-2`}
						onClick={(e) => {
							setBoxField(box.index, getCaretPosInBox(), 'caretPos')
							// onClick(e)
						}}
						onKeyDown={handleKeys}
						data-placeholder="Enter Text Here..."
						contentEditable
						suppressContentEditableWarning >
					</p>
				)
			default:
				return (
					<p
						ref={divRef}
						onFocus={() => {
							dispatch({
								type: 'set_focused_index',
								payload: box.index
							})
							setBoxField(box?.index, true, 'focused')
						}
						}
						onBlur={() => {
							setBoxField(box?.index, false, 'focused')
						}}
						data-index={box.index}
						id={id.toString()}
						className={`editable-box w-full ${markdownTag} caret-black p-2`}
						onClick={(e) => {
							setBoxField(box.index, getCaretPosInBox(), 'caretPos')
						}}
						onKeyDown={handleKeys}
						data-placeholder="Enter Text Here..."
						contentEditable
						suppressContentEditableWarning >
					</p>
				)

		}
	}

	return (
		<div className="flex">
			{
				getHTML()
			}
		</div >
	)
}
)

				// {box.initialValue && <div dangerouslySetInnerHTML={{ __html: box.initialValue }}></div>}
