import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import { EditPage } from './_pages/Notes'
// import { Pad } from './_pages/Pad'
import { ProjectBoard } from './_pages/ProjectBoard'

interface Props { }
export const Homepage: React.FC<Props> = () => {
	return (
		<div className='flex flex-col h-full w-full'>
			<section className='flex h-full w-full'>
				<DndProvider backend={HTML5Backend}>
					<ProjectBoard />
				</DndProvider>
			</section>
		</div>
	)
}


				// <EditPage />
