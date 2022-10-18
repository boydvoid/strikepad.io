import { umask } from 'process'
import React, { useEffect, useState } from 'react'

interface Props {
	data: string
	language: string
}
export const ResponseParser: React.FC<Props> = ({ data, language }) => {
	const [isTable, setIsTable] = useState(false)
	const [headers, setHeaders] = useState<string[] | null>(null)
	const [rows, setRows] = useState<string[] | null>(null)
	// const [text, setText] = useState(data)

	// parse sql 
	useEffect(() => {
		if (language === 'postgres') {
			// get columns // by line 
			const lines = data.split("\n")

			const headers = lines[0].split("^|^")
			setHeaders(headers)
			setIsTable(true)
			lines.shift()
			lines.shift()
			console.log(lines)
			setRows(lines)
		} else {
			setIsTable(false)
		}
	}, [language, data])

	return (
		<div className="tw-w-full tw-h-full bg-slate-700 text-slate-300">
			{isTable ?
				<table>
					<thead>
						<tr>
							{headers && headers.map(header => (
								<th className='border border-black p-4'>
									{header}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows && rows.map(row => (
							<tr>
								{row.split("^|^").map(item => (
									<td className='border border-black'>{item}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				:
				<div>
					{data}
				</div>
			}
		</div>
	)
}
