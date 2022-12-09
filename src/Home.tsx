import React from 'react'
import { EditPage } from './_pages/Notes'

interface Props { }
export const Homepage: React.FC<Props> = () => {
	return (
		<div className='flex flex-col h-full w-full'>
			<section className='flex justify-center h-full w-full'>
				<EditPage />
			</section>
		</div>
	)
}

