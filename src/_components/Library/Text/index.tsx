import React from 'react'


interface Props {
	value: string
}

export const Text: React.FC<Props> = ({ value }) => {
	return <p>{value}</p>
}
