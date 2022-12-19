export function getCaretPosInBox() {
	if (document.getSelection()?.type !== 'None') {
		return document.getSelection()?.getRangeAt(0).endOffset
	}
}
