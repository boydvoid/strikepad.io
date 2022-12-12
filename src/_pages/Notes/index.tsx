import React, { useEffect, useState, useRef, useCallback, useMemo, cloneElement } from 'react'
import { Box } from '../../_components/EditorComponents/Box'
import { useEditorContext } from './context'

export type Action = 'enter' | 'backspace' | 'left' | 'right' | 'up' | 'down' | null
export interface Boxes {
	id: number
	index: number
	value: string // just used for storing data
	initialValue?: string
	markdown: string
	focused: boolean
	lastAction: Action
	caretPos: number
}

interface Props { }

export const EditPage: React.FC<Props> = () => {
	const { state: { wrapperEditable, focusedIndex, boxes, boxFocused }, dispatch } = useEditorContext()
	// const [elementIsFocused, setElementIsFocused] = useState(false)
	// const [boxTextData, setBoxTextData] = useState<{ [id: number]: string }>({})
	// const [isInit, setIsInit] = useState(false)
	const wrapperRef = useRef<any>(null)
	const boxRefs = useRef<any>([])


	// const keyPressedRef = useRef<any>(null)

	// useEffect(() => {
	// 	setIsInit(true)
	// 	if (!isInit) return
	// 	// window.addEventListener('paste', handlePaste)
	// 	// window.addEventListener('keydown', handleKeydown)
	// 	window.addEventListener('click', handleClickListen)
	// 	return () => {
	// 		// window.removeEventListener('keydown', handleKeydown)
	// 		window.removeEventListener('click', () => {
	// 		})
	// 	}
	// }, [isInit])

	// function handlePaste(e) {
	// 	e.preventDefault()
	// 	let data = e.clipboardData.getData('text')
	// 	// let example = new DOMParser().parseFromString(data, 'text/html')
	// 	// data = example.querySelectorAll('body')
	// 	// data = data.map(tag => {
	// 	// 	tag.removeAttribute('style')
	// 	// 	tag.removeAttribute('class')
	// 	// 	return tag
	// 	// }
	// 	// )
	// }

	// useEffect(() => {
	// 	if (boxRefs.current.length === 1) {
	// 		setFocusedBox(boxRefs.current[0])
	// 	}
	// }, [boxRefs.current])

	// useEffect(() => {
	// 	if (!wrapperEditable) {
	// 		// this would break on deletion
	// 		const focusedIndex = boxRefs.current.findIndex((element: any) => {
	// 			return element?.id === focusedBox?.id.toString()
	// 		})

	// 		if (keyPressedRef.current === 'Enter' && focusedBox !== null && focusedIndex !== boxRefs.current.length - 1) {
	// 			boxRefs.current[focusedIndex + 1].focus()
	// 			setFocusedBox(boxRefs.current[focusedIndex + 1])
	// 			setWrapperEditable(true)
	// 		} else if (keyPressedRef.current === 'Backspace' && focusedBox !== null) {
	// 			setFocusedBox(boxRefs.current[focusedIndex - 1])
	// 			setWrapperEditable(true)
	// 		} else {
	// 			setFocusedBox(boxRefs.current[boxRefs.current.length - 1])
	// 			setWrapperEditable(true)
	// 		}
	// 	}
	// }, [wrapperEditable])

	// function handleClickListen(e) {
	// 	if (e.target.id.includes('fluid-wrapper')) {
	// 		if (window.getSelection()?.type === 'Caret') {
	// 			setWrapperEditable(false)
	// 		}
	// 	} else if (e.target.className.includes('editable-tag')) {
	// 		// setFocusedBox(e.target)
	// 	}
	// }

	// useEffect(() => {
	// 	if (!focusedBox) return
	// 	// set wrapper editable false to move focus to next box 
	// 	setWrapperEditable(false)
	// }, [boxes])

	// const handleKeydown = useCallback((e: any) => {
	// 	keyPressedRef.current = e.key
	// 	switch (e.key) {
	// 		case 'Enter':
	// 			// e.preventDefault()
	// 			e.stopPropagation()
	// 			// addBox()
	// 			break;
	// 		case 'Backspace':
	// 			e.stopPropagation()
	// 			const getRange: any = window.getSelection()?.getRangeAt(0)
	// 			// @ts-ignore
	// 			let endContainerId = window.getSelection()?.getRangeAt(0).endContainer.parentNode.id
	// 			// @ts-ignore
	// 			let startContainerId = window.getSelection()?.getRangeAt(0).startContainer.parentNode.id

	// 			// const focusedIndex = boxRefs.current.findIndex((element: any) => element?.id === focusedBox?.id.toString())
	// 			// @ts-ignore
	// 			const focusedIndex = getRange?.endContainer.parentNode.id
	// 			// @ts-ignore
	// 			const totalRemoved = getRange?.endContainer.parentNode.innerText.length >= 1 ?
	// 				parseInt(endContainerId) - parseInt(startContainerId)
	// 				: parseInt(endContainerId) - parseInt(startContainerId) + 1
	// 			// @ts-ignore
	// 			// @ts-ignore
	// 			if (isNaN(totalRemoved)) {

	// 			}
	// 			else if (getRange?.endContainer.innerText.length === 0) {
	// 				e.preventDefault()
	// 			}
	// 			break;
	// 		case 'ArrowLeft':
	// 			break;
	// 		case 'ArrowRight':
	// 			break;
	// 		case 'ArrowUp':
	// 			break;
	// 		case 'ArrowDown':
	// 			break;
	// 	}

	// }, [boxes, focusedBox])

	useEffect(() => {
		console.log('b', boxes)

	}, [boxes])

	function addBox(initialValue?: string) {
		// get box location in array splice
		const newBox: Boxes = {
			id: focusedIndex + 1,
			index: focusedIndex + 1,
			value: '',
			initialValue: initialValue,
			markdown: 'H1',
			focused: true,
			lastAction: 'enter',
			caretPos: 0
		}

		const cloneBoxes: Boxes[] = [...boxes]
		cloneBoxes[focusedIndex].focused = false
		cloneBoxes.splice(focusedIndex + 1, 0, newBox)

		cloneBoxes.map((box, key) => {
			box.id = key
			box.index = key
			return box
		})

		dispatch({
			type: 'set_boxes',
			payload: cloneBoxes
		})

		dispatch({
			type: 'set_focused_index',
			payload: focusedIndex + 1
		})
	}

	function removeBox(appendText?: string) {
		const cloneBoxes: Boxes[] = [...boxes]
		cloneBoxes[focusedIndex - 1].focused = true
		cloneBoxes[focusedIndex - 1].lastAction = 'backspace'
		console.log(cloneBoxes)
		cloneBoxes.splice(focusedIndex, 1)
		cloneBoxes.map((box, key) => box.index = key)
		console.log(cloneBoxes)
		dispatch({
			type: 'set_boxes',
			payload: cloneBoxes
		})
	}


	function setBoxField(index: number, value: any, field: any, triggerWrapper?: boolean) {
		const cloneBoxes: Boxes[] = [...boxes]
		cloneBoxes[index][field] = value
		console.log(cloneBoxes)
		dispatch({
			type: 'set_boxes',
			payload: cloneBoxes
		})

		if (triggerWrapper) {
			dispatch({
				type: 'set_wrapper_editable',
				payload: true
			})
		}
	}

	function handleBoxClick(e) {
		let cloneBoxes = [...boxes]
		cloneBoxes = cloneBoxes.map(box => box.id == e.target.id ? { ...box, focused: true } : { ...box, focused: false })

		dispatch({
			type: 'set_boxes',
			payload: cloneBoxes
		})
	}



	return (
		<>
			<div ref={wrapperRef} id="fluid-wrapper" className='flex flex-col w-4/5 max-w-[800px]' contentEditable={false} suppressContentEditableWarning>
				{boxes.map((i, key) => (
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
				<div>{focusedIndex}</div>
			</div>
		</>
	)
}

