import React, { useEffect } from 'react'
import { useDB } from '../../hooks/useDB'

interface Props { }
export const NoteSelector: React.FC<Props> = () => {
	const db = useDB()

	// get a list of all the notes for the user 
	// create a button to select that note
	// load that note into the editor
	useEffect(() => {
		db.allDocs({
			include_docs: true,
			attachments: true
		}).then(docs => {
			console.log(docs)
		}).catch(err => {
			console.log(err)
		})


	}, [])

	return (
		<div>
		</div>
	)
}

