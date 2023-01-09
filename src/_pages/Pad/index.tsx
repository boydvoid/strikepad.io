import React, { useCallback, useState } from 'react'
import { createEditor, BaseEditor, Block, Transforms, Editor } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { CodeComponent } from '../../_components/Library/CodeComponent';
import { DefaultComponent } from '../../_components/Library/DefaultComponent';
// @ts-ignore
import SoftBreak from 'slate-soft-break'

type CustomElement = { type: 'paragraph' | 'code'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor
		Element: CustomElement
		Text: CustomText
	}
}

interface Props {

}

const initialValue = [
	{
		type: 'paragraph',
		children: [{ text: 'A line of text in a paragraph.' }],
	},
]


export const Pad: React.FC<any> = () => {
	const [editor] = useState<any>(() => withReact(createEditor()))

	const renderElement = useCallback((props: any) => {
		switch (props.element.type) {
			case 'code':
				return <CodeComponent {...props} />
			default:
				return <DefaultComponent {...props} />
		}
	}, [])

	const handleKeydown = (event: any) => {
		if (event.key === '`' && event.ctrlKey) {
			// Prevent the "`" from being inserted by default.
			event.preventDefault()
			// Otherwise, set the currently selected blocks type to "code".
			Transforms.setNodes(
				editor,
				{ type: 'code' },
				{ match: n => Editor.isBlock(editor, n) }
			)
		}
	}

	return (
		<Slate
			editor={editor}
			value={initialValue}
		>
			<Editable
				className='w-full'
				renderElement={renderElement}
				onKeyDown={(e: any) => handleKeydown(e)}
			/>
		</Slate>
	)
}
