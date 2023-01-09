import React, { useEffect, useRef, useState } from 'react'
import { Layer, Rect, Stage, Transformer } from 'react-konva'
import { Toolbox } from '../../_components/Toolbox'
import { EditPage } from '../Notes'

interface Props { }

export interface Shapes {
	x: number
	y: number
	type: 'box' | 'paper'
	fill: string
}

export const Tools = {
	RECT: 'rect'
}

export const ProjectBoard: React.FC<Props> = () => {
	const [isDragging, setIsDragging] = useState(false)
	const [dragElement, setDragElement] = useState(null)
	const [shapes, setShapes] = useState<Shapes[]>([])
	const [notepadOpen, setNotepadOpen] = useState(false)
	const stageRef = useRef(null)

	function gatherDragInfo(e: any) {
		setDragElement(e.target.id)
	}

	function handleClick() {
		console.log('clikc')
		// openNotepad
		setNotepadOpen(!notepadOpen)

	}
	return (
		<div className={`flex overflow-hidden w-full h-full`}
		>
			<Toolbox gatherDragInfo={gatherDragInfo} />
			<div className="border border-solid border-sky-500"
				onDrop={(e) => {
					console.log(e)
					e.preventDefault()
					stageRef.current.setPointersPositions(e);
					let currShapes = [...shapes]

					if (dragElement === 'box') {
						currShapes.push({
							...stageRef.current.getPointerPosition(),
							width: 50,
							height: 50,
							fill: "tan",
							type: 'box'
						})
					} else {
						currShapes.push({
							...stageRef.current.getPointerPosition(),
							width: 30,
							height: 50,
							fill: "#e1e1e1",
							type: 'paper'
						})
					}
					setShapes(
						currShapes
					)

				}}
				onDragOver={(e) => {
					e.preventDefault()
				}}
			>
				<Stage
					id='stage'
					ref={stageRef} width={window.innerWidth} height={window.innerHeight}>
					<Layer>
						<Rect
							width={window.innerWidth}
							height={window.innerHeight}
							fill="#f1f1f1"
						/>
					</Layer>
					<Layer>
						{shapes.map(shape => {
							if (shape.type !== 'box') return
							console.log('1', shape)
							return (<Rect
								draggable
								x={shape.x}
								y={shape.y}
								width={shape.width}
								height={shape.height}
								fill={shape.fill}
							/>
							)
						})}
					</Layer>
					<Layer>
						{shapes.map(shape => {
							if (shape.type === 'box') return
							console.log('2', shape)
							return <Rect
								onClick={handleClick}
								draggable
								x={shape.x}
								y={shape.y}
								width={shape.width}
								height={shape.height}
								fill={shape.fill}
								shadowBlur={3}
							/>
						})}
					</Layer>
				</Stage>
				{notepadOpen &&
					<div className="absolute w-2/3 h-full z-[9999] right-0 top-0 bg-gray-200">
						<button onClick={handleClick}>close</button>
						<EditPage />
					</div>
				}
			</div>
		</div >
	)
}

