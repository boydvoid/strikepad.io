import React from 'react'

interface Props {
	label: string
	value: string
	onChange: (e: any) => void
}

export const MetaItem: React.FC<Props> = ({ label, value, onChange }) => {
	return (
		<div className='flex flex-col'>
			<label>{label}</label>
			<input value={value} placeholder={label} onChange={onChange} />
		</div>
	)
}
