import React, { forwardRef } from 'react'
import { Boxes } from '../../../_pages/Notes'
import { useEditorContext } from '../../../_pages/Notes/context'
import { addBox, getCaretPosInBox, placeCaretAtEnd, removeBox, replaceBox } from '../helpers'


interface Props {
	box: Boxes
	setBoxField: (index: number, value: any, field: any) => void
	id: number
	onClick?: (e: any) => void
	handleKeys: (e: any) => void
}

export const ListBox = forwardRef<HTMLLIElement, Props>(({ handleKeys, box, setBoxField, id, onClick }, divRef: ForwardedRef<HTMLLIElement>) => {
	const { state, dispatch } = useEditorContext()

	function customKeyHandler(e: React.KeyboardEvent) {
		console.log('custom')
		if (!divRef) return
		let caretPos = getCaretPosInBox()
		setBoxField(box.index, caretPos + 1, 'caretPos')
		if (e.key === 'Enter') {
			console.log('add box ul')
			e.preventDefault()
			// add new list box 
			let caretPos = getCaretPosInBox()
			let text = divRef.current.innerText

			let currentText = text.substr(0, caretPos)
			let removedText = text.substr(caretPos)
			setBoxField(box.index, currentText, 'value')
			setBoxField(box.index, currentText, 'initialValue')
			divRef.current.innerHTML = currentText
			addBox(state, dispatch, removedText, 'md-ul')
		}

		if (e.key === 'Backspace') {
			console.log('bs', box)
			if (divRef?.current?.id === '0') {
				return
			}

			// if (caretPos === 0 && box.value !== '') {
			// 	console.log('hello')
			// 	e.preventDefault()
			// 	let currentText = divRef.current.innerText
			// 	removeBox(state, dispatch, currentText)
			// }

			if (box.value === '&nbsp;' || box.value === "<br>" || box.value === '' || box.caretPos === 0) {
				console.log('bs caret0')
				e.preventDefault()
				replaceBox(state, dispatch, '')
			}
		}
	}

	return (
		<ul>
			<li
				ref={divRef}
				style={{ listStyleType: 'disc' }}
				onFocus={() => {
					if (box.lastAction === 'new') {
						placeCaretAtEnd(divRef)
					}
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
				className={`editable-box w-full md-ul caret-black p-2`}
				onClick={(e) => {
					console.log('onclick')
					setBoxField(box.index, getCaretPosInBox(), 'caretPos')
				}}
				onKeyDown={customKeyHandler}
				data-placeholder=""
				contentEditable
				suppressContentEditableWarning >
			</li>
		</ul>
	)
}
)

