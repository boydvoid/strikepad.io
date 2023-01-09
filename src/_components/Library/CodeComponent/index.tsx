import React, { ReactNode } from 'react'

interface Props {
	children: ReactNode
}
export const CodeComponent: React.FC<Props> = ({ children }) => {

	function handleClick() {
		console.log(children[0].props)
	}

	return (
		<div className='flex flex-col relative p-4 w-full'>
			<button className='relative flex top-4 right-0 bg-sky-300 p-2 rounded' onClick={handleClick}>Run</button>
			<pre className='bg-slate-300 border border-solid border-slate-500 rounded p-4 w-full'>
				<code>{children}</code>
			</pre>
		</div>
	)
}
