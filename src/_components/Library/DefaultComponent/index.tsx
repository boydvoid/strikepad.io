import React from 'react'

interface Props {
	attributes: any
	children: any
}
export const DefaultComponent: React.FC<Props> = props => {
	return <p {...props.attributes}>{props.children}</p>
}
