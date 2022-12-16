import PouchDB from 'pouchdb'

export const useDB = () => {
	return new PouchDB('strike')
}
