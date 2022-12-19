import React, { forwardRef } from 'react'
import { Boxes } from '../../../_pages/Notes'
import { useEditorContext } from '../../../_pages/Notes/context'
import { getCaretPosInBox } from '../helpers'

interface Props {
	box: Boxes
	setBoxField: (index: number, value: any, field: any) => void
	id: number
	onClick: () => void
	handleKeys: (e: any) => void
}

export const ListBox = forwardRef<HTMLUListElement, Props>(({ handleKeys, box, setBoxField, id, onClick }, divRef) => {
	const { state: { }, dispatch } = useEditorContext()

	return (
		<ul
			ref={divRef}
			style={{ listStyleType: 'revert' }}
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
			className={`editable-box w-full md-ul caret-black p-2`}
			onClick={() => {
				setBoxField(box.index, getCaretPosInBox(), 'caretPos')
				onClick()
			}}
			onKeyDown={handleKeys}
			data-placeholder="Enter Text Here..."
			contentEditable
			suppressContentEditableWarning >
			<li className='ml-8'></li>
		</ul>
	)
}
)

