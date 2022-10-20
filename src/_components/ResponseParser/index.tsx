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
			let lines = data.split("\n")

			let headers = lines[0].split("¶|¶")
			headers = headers.map(header => header.replace("¶", ""))
			setHeaders(headers)
			setIsTable(true)
			lines.shift()
			lines.shift()
			setRows(lines)
		} else {
			setIsTable(false)
		}
	}, [language, data])

	return (
		<div className="flex w-full h-full bg-slate-700 text-slate-300">
			{isTable ?
				<table className='w-full p-4 m-4 rounded bg-slate-500'>
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
								{row.split("¶|¶").map(item => (
									<td className='border border-black'>{item.replaceAll("¶", "")}</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				:
				<div className='p-4 bg-slate-500 rounded m-4'>
					{data}
				</div>
			}
		</div>
	)
}
