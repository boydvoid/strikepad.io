import React from "react";

interface Props {
	gatherDragInfo: (e: any) => void
}
export const Toolbox: React.FC<Props> = ({ gatherDragInfo }) => {
	return (
		<div className="flex flex-col items-center space-y-2 relative p-8 h-full w-[100px] border border-solid border-sky-500">
			<div draggable onDrag={gatherDragInfo} id="box" className="w-[50px] h-[50px] bg-red-300">
			</div>
			<div draggable onDrag={gatherDragInfo} id="paper" className="w-[30px] h-[50px] bg-gray-300">
			</div>
		</div>
	)
}
