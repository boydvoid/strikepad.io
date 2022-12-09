import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { IndexRouteProps } from 'react-router-dom'
import './Box.css'

interface Props {
	onClick: () => void
	id: number
	addBox: () => void
	setBoxValue: (index: number, value: string) => void
	index: number
	setFocusedIndex: (index: number) => void
	initialValue: string
	focused: boolean
}

type Shortcut = { [index: string]: string }
const shortcuts: Shortcut = {
	'#': 'md-h1',
	'##': 'md-h2',
	'###': 'md-h3',
	'p': 'md-p',
}
export const Box = forwardRef<HTMLDivElement, Props>(({ onClick, id, addBox, index, setBoxValue, setFocusedIndex, initialValue, focused }, ref) => {
	const [markdownTag, setMarkdownTag] = useState<string | null>('md-p')
	const [value, setValue] = useState(initialValue)

	const divRef = useRef<any>(null)

	useEffect(() => {
		console.log(focused, divRef?.current)
		if (focused) {
			console.log('getfocus')
			// @ts-ignore
			divRef?.current?.focus()
		} else {
			console.log('blur')
			// @ts-ignore
			divRef.current?.blur()
		}
	}, [])

	const handleEnter = (e: any) => {
		console.log(e)
		if (!e.shiftKey && e.key === 'Enter') {
			e.preventDefault()
			addBox()
		}
	}

	function handleOnChange(e: any) {
		console.log(e)
		const value = e.target.innerText
		setValue(value)
		setBoxValue(index, value)
	}

	return (
		<div className="flex">
			<p className="absolute select-none left-0">
				{'>'}
			</p>
			<div
				ref={divRef}
				onFocus={() => setFocusedIndex(index)}
				data-index={index}
				id={id.toString()}
				className={`editable-box w-full ${markdownTag} caret-black ${focused ? 'bg-sky-50' : ''}`}
				onClick={onClick}
				onKeyDown={handleEnter}
				contentEditable
				suppressContentEditableWarning
			>
				{initialValue && <div dangerouslySetInnerHTML={{ __html: initialValue }}></div>}
			</div>
		</div>
	)
}
)
