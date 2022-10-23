import { useEffect, useState, useRef, useCallback } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { Platform, platform } from '@tauri-apps/api/os'
import { register } from '@tauri-apps/api/globalShortcut';
import { appWindow } from '@tauri-apps/api/window';
import CodeMirror from '@uiw/react-codemirror'
import { vim } from "@replit/codemirror-vim"

import { githubDark } from '@uiw/codemirror-themes-all'

import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { sql } from '@codemirror/lang-sql'

import "./App.css";
import { ResponseParser } from "./_components/ResponseParser";

const languages = ['javascript', 'python', 'setup', 'postgres']
const metaKeywords = ['[lang]', '[dbuser]', '[dbpass]']

function App() {
	const [editorValue, setEditorValue] = useState("")
	const [hiddenInput, setHiddenInput] = useState("")
	const [showHiddenInput, setShowHiddenInput] = useState(false)
	const [runResponse, setRunResponse] = useState("")
	const [language, setLanguage] = useState('setup')
	const [isInstalled, setIsInstalled] = useState<string | null>(null)
	const [os, setOs] = useState<Platform | null>(null)
	const [sqlPass, setSqlPass] = useState<string | null>(null)
	const [sqlUser, setSqlUser] = useState<string | null>(null)
	const editorValueRef = useRef(editorValue)

	useEffect(() => {
		if (os) return
		const getOs = async () => {
			const x = await platform()
			setOs(x)
		}
		getOs()
	}, [])

	const toggleHiddenInput = useCallback(() => {
		setShowHiddenInput(!showHiddenInput)
	}, [showHiddenInput])

	const handleKeyListen = useCallback((e: any) => {
		if (os === 'darwin' && e.metaKey && e.key === 'Enter') {
			handleButton()
		}
		if (os === 'darwin' && e.metaKey && e.key === 'k') {
			toggleHiddenInput()
		}
	}, [showHiddenInput, os, sqlUser, sqlPass])

	useEffect(() => {
		document.addEventListener('keydown', handleKeyListen)
		return () => {
			document.removeEventListener('keydown', handleKeyListen)
		}
	}, [handleKeyListen])

	async function handleButton() {
		if (language === 'setup') {
			setRunResponse("You must select a language.")
		} else {
			invokeLanguage()
		}
	}

	async function invokeLanguage() {
		const code = removeMeta()
		const res: string = await invoke(`run_${language}`, {
			code: code,
			...(sqlPass ? { pass: sqlPass } : undefined),
			...(sqlUser ? { user: sqlUser } : undefined)
		})
		setRunResponse(res)
	}

	function removeMeta() {
		let lines = editorValueRef.current.split("\n")

		let newLines = lines.map(line => {
			if (metaKeywords.indexOf(line.split(" ")[0]) > -1) {
				return '\n'
			} else {
				return '\n' + line
			}
		})
		return newLines.join("")
	}

	useEffect(() => {
		const reg = async () => {
			await appWindow.setAlwaysOnTop(true)

			await register('Alt+Shift+Space', async () => {
				if (await appWindow.isVisible()) {
					await appWindow.hide()
				} else {
					await appWindow.show()
					await appWindow.setFocus()
				}
			});
		}
		reg()
	}, [])

	useEffect(() => {
		checkForLanguage()
		checkForUser()
	}, [editorValue])

	const checkForUser = () => {

		const valueByLine = splitByLine()

		valueByLine.map((line: string, i: number) => {
			if (line.includes('[dbuser]')) {
				const l: string = line.split(']')[1].trim()
				setSqlUser(l)
			}
			if (line.includes('[dbpass]')) {
				const l: string = line.split(']')[1].trim()
				setSqlPass(l)

			}

		}
		)
	}

	const onChange = (value, viewUpdate) => {
		setEditorValue(value)
		editorValueRef.current = value
	}

	/**
	* Checks for the Language
	* Choices are in languages array
	* */
	function checkForLanguage() {
		const valueByLine = splitByLine()

		valueByLine.map((line: string, i: number) => {
			if (line.includes('[lang]')) {
				const l: string = line.split(']')[1].trim()
				if (languages.indexOf(l) > -1) {
					setLanguage(l)
					setEditorValue('')
				}
			} else {
			}
		}
		)
	}

	useEffect(() => {
		checkForInstallation()
	}, [language])

	async function checkForInstallation() {
		let res: string = await invoke(`${language}_check`)
		setIsInstalled(res)
	}


	function splitByLine() {
		return editorValueRef.current.split('\n')
	}

	const handleHiddenSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
		if (languages.indexOf(hiddenInput.trim()) > -1) {
			setLanguage(hiddenInput)
		}
		setShowHiddenInput(false)
		setHiddenInput('')
	}, [hiddenInput])

	return (
		<div className="App overflow-hidden">
			<div className="overflow-hidden">
				<button onClick={handleButton}>Run</button>
				<h2>{language}</h2>
				<h3>Installed: {isInstalled}</h3>
			</div>
			<div className="flex h-full overflow-hidden">
				<div className="flex basis-1/2 grow">
					<CodeMirror
						value={editorValue}
						height="100%"
						width="50vw"
						maxWidth="50vw"
						extensions={[javascript(), python(), sql(), vim()]}
						lang={language}
						onChange={onChange}
						theme={githubDark}
					/>
				</div>
				<div className="flex basis-1/2 grow whitespace-pre-line">
					<ResponseParser data={runResponse} language={language} />
				</div>
				{
					showHiddenInput &&
					<div className="absolute bottom-0 w-full p-4">
						<form onSubmit={handleHiddenSubmit}>
							<input autoFocus className="bg-blue-500 w-full h-8 rounded p-4" value={hiddenInput} onChange={(e) => setHiddenInput(e.target.value)} />
						</form>
					</div>
				}
			</div>
		</div>
	);
}

export default App;

