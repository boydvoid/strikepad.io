import React, { useEffect, useRef } from 'react'
import { debounce } from '../../helpers/debounce'

interface Props {
	draw: (ctx: CanvasRenderingContext2D) => void
	mouseDown: (e: any) => void
	mouseUp: (e: any) => void
	isDragging: boolean
	selectedIndex: number | null
	mouseCoords: { x: number, y: number }
}
const Canvas: React.FC<Props> = ({ draw, mouseDown, mouseUp, isDragging, selectedIndex, mouseCoords, ...props }) => {
	let scale = 1
	let originx = 0
	let originy = 0
	let startX = mouseCoords.x
	let startY = mouseCoords.y
	const canvasRef = useRef(null)

	useEffect(() => {
		if (!canvasRef) return
		const canvas = canvasRef?.current
		if (!canvas) return
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		// @ts-ignore
		canvas.style.border = '1px solid red';
		// @ts-ignore
		const context = canvas?.getContext('2d')
		// @ts-ignore
		context?.clearRect(0, 0, canvas?.width, canvas?.height)
		draw(context)
	}, [draw, window.innerWidth])

	let xleftView = 0
	let ytopView = 0

	function handleMouseMove(e) {
		console.log(isDragging, selectedIndex)
		if (!isDragging) return
		const canvas = canvasRef?.current

		// @ts-ignore
		const ctx = canvas.getContext('2d')

		if (!selectedIndex) {
			// dragging canvas
			var X = e.clientX
			var Y = e.clientY

			var dx = (X - startX) / canvas.width;
			var dy = (Y - startY) / canvas.height;
			xleftView -= dx;
			ytopView -= dy;
			startX = X;
			startY = Y;
			console.log(xleftView, ytopView)
			ctx?.clearRect(0, 0, canvas?.width, canvas?.height)
			ctx.translate(-xleftView, -ytopView)
			ctx?.clearRect(0, 0, canvas?.width, canvas?.height)
			draw(ctx)

		} else {
			// dragging item
		}

	}

	function handleWheel(e: any) {
		e.preventDefault()

		const canvas = canvasRef?.current

		// @ts-ignore
		const ctx = canvas.getContext('2d')

		ctx?.clearRect(0, 0, canvas?.width, canvas?.height)
		// @ts-ignore
		var mousex = e.clientX - canvas.offsetLeft;
		var mousey = e.clientY - canvas.offsetTop;
		var wheel = e.deltaY / 120;//n or -n


		//according to Chris comment
		var zoom = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? -1 : 1);

		ctx.translate(
			originx,
			originy
		);
		ctx.scale(zoom, zoom);
		ctx?.clearRect(0, 0, canvas?.width, canvas?.height)
		ctx.translate(
			-(mousex / scale + originx - mousex / (scale * zoom)),
			-(mousey / scale + originy - mousey / (scale * zoom))
		);

		originx = (mousex / scale + originx - mousex / (scale * zoom));
		originy = (mousey / scale + originy - mousey / (scale * zoom));
		scale *= zoom;

		draw(ctx)
	}

	return <canvas id="canvas" ref={canvasRef} {...props} onMouseMove={handleMouseMove} onMouseDown={mouseDown} onMouseUp={mouseUp} onWheel={handleWheel} />
}

export default Canvas

