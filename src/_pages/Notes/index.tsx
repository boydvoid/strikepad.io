import React, { useEffect, useState, useRef, useCallback, useMemo, cloneElement } from 'react'
import { Box } from '../../_components/EditorComponents/Box'

interface Boxes {
	id: number
	index: number
	value: string
	markdown: string
	focused: boolean

}

interface Props { }
export const EditPage: React.FC<Props> = () => {
	const [boxes, setBoxes] = useState<Boxes[]>([{
		id: 0,
		index: 0,
		value: '',
		markdown: 'H1',
		focused: true
	}])
	const [elementIsFocused, setElementIsFocused] = useState(false)
	const [wrapperEditable, setWrapperEditable] = useState(true)
	const [focusedIndex, setFocusedIndex] = useState<number>(0)
	const [boxTextData, setBoxTextData] = useState<{ [id: number]: string }>({})
	const [isInit, setIsInit] = useState(false)
	const wrapperRef = useRef<any>(null)
	const boxRefs = useRef<any>([])
	const keyPressedRef = useRef<any>(null)

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
	// 	console.log('handlePaste', data)
	// 	// data = data.map(tag => {
	// 	// 	tag.removeAttribute('style')
	// 	// 	tag.removeAttribute('class')
	// 	// 	return tag
	// 	// }
	// 	// )
	// }

	// useEffect(() => {
	// 	console.log('br', boxRefs.current)
	// 	if (boxRefs.current.length === 1) {
	// 		setFocusedBox(boxRefs.current[0])
	// 	}
	// }, [boxRefs.current])

	// useEffect(() => {
	// 	if (!wrapperEditable) {
	// 		// this would break on deletion
	// 		const focusedIndex = boxRefs.current.findIndex((element: any) => {
	// 			console.log(element, focusedBox)
	// 			return element?.id === focusedBox?.id.toString()
	// 		})

	// 		console.log('fi', focusedIndex)
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
	// 			console.log('selection', getRange)
	// 			// @ts-ignore
	// 			console.log('innerText', window.getSelection()?.getRangeAt(0).endContainer.parentNode.innerText)
	// 			console.log('total removed', totalRemoved)
	// 			if (isNaN(totalRemoved)) {
	// 				console.log('isnan')

	// 			}
	// 			else if (getRange?.endContainer.innerText.length === 0) {
	// 				e.preventDefault()
	// 				console.log('innerText len')
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

	// 	const handleContainerClick = useCallback(() => {
	// 		console.log(window.getSelection())
	// 		if (window.getSelection()?.type === 'Range') {
	// 			setWrapperEditable(true)
	// 			console.log('true')
	// 		} else {
	// 			// placeCaretAtEnd(elem)
	// 		}
	// 	}, [wrapperRef.current])

	// function placeCaretAtEnd(el: any) {
	// 	const range = document.createRange()
	// 	const sel = document.getSelection()
	// 	range?.selectNodeContents(el)
	// 	range?.collapse(false)
	// 	sel?.removeAllRanges();
	// 	sel?.addRange(range);
	// 	el.focus()
	// }

	useEffect(() => {
		console.log('b', boxes)

	}, [boxes])

	function addBox() {
		// get box location in array splice
		const newBox = {
			id: focusedIndex + 1,
			index: focusedIndex + 1,
			value: '',
			markdown: 'H1',
			focused: true
		}

		const cloneBoxes = [...boxes]
		cloneBoxes[focusedIndex].focused = false
		cloneBoxes.splice(focusedIndex + 1, 0, newBox)

		cloneBoxes.map((box, key) => box.index = key)

		setBoxes(cloneBoxes)
	}

	function setBoxValue(index: number, value: string) {
		const cloneBoxes = [...boxes]
		cloneBoxes[index].value = value
		console.log(cloneBoxes)
		setBoxes(cloneBoxes)
	}


	function handleBoxClick(e) {
		console.log(e.target.id)
		let cloneBoxes = [...boxes]
		cloneBoxes = cloneBoxes.map(box => box.id == e.target.id ? { ...box, focused: true } : { ...box, focused: false })
		console.log(cloneBoxes)
		setBoxes(cloneBoxes)


	}

	return (
		<>
			<div ref={wrapperRef} id="fluid-wrapper" className='flex flex-col w-4/5' contentEditable={false} suppressContentEditableWarning>
				{boxes.map((i, key) => (
					<Box
						key={key}
						index={i.index}
						ref={(el) => (boxRefs.current[key] = el)}
						setFocusedIndex={(value) => setFocusedIndex(value)}
						id={key}
						addBox={addBox}
						onClick={(e) => handleBoxClick(e)}
						setBoxValue={(setBoxValue)}
						initialValue={i.value}
						focused={i.focused}
					/>
				))}
			</div>
		</>
	)
}

