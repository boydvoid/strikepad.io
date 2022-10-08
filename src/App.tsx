import { useEffect, useState, useRef, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { Platform, platform } from '@tauri-apps/api/os'
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { Command } from '@tauri-apps/api/shell'
import { register } from '@tauri-apps/api/globalShortcut';
import { appWindow } from '@tauri-apps/api/window';
import CodeMirror from '@uiw/react-codemirror'

import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'

import "./App.css";

const languages = ['js', 'javascript', 'python', 'setup']
const metaKeywords = ['[lang]']

function App() {
	const [editorValue, setEditorValue] = useState("")
	const [runResponse, setRunResponse] = useState("")
	const [language, setLanguage] = useState('setup')
	const [isInstalled, setIsInstalled] = useState<string | null>(null)
	const [os, setOs] = useState<Platform | null>(null)
	const editorValueRef = useRef(editorValue)

	useEffect(() => {
		if (os) return
		const getOs = async () => {
			const x = await platform()
			setOs(x)
		}
		getOs()
	}, [])

	useEffect(() => {
		document.addEventListener('keydown', (e: any) => {
			if (os === 'darwin' && e.metaKey && e.key === 'Enter') {
				handleButton()
			}
		})
		return () => {
			document.removeEventListener('keydown', () => { })
		}
	}, [language])

	async function handleButton() {

		let res: string
		switch (language) {
			case 'js':
			case 'javascript':
				res = await invoke('run_js', { code: editorValueRef.current })
				setRunResponse(res)
				break;
			case 'python':
				res = await invoke('run_py', { code: editorValueRef.current })
				setRunResponse(res)
				break;
			case 'setup':
				setRunResponse("You must select a language.")
				break;
		}

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
	}, [editorValue])

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
		let res: string
		switch (language) {
			case 'js':
			case 'javascript':
				res = await invoke('js_check')
				setIsInstalled(res)
				break;
			case 'python':
				res = await invoke('py_check')
				setIsInstalled(res)
				break;
		}
	}


	// TODO:remove split by line 
	function splitByLine() {
		return editorValueRef.current.split('\n')
	}

	return (
		<div className="App">
			<div>
				<button onClick={handleButton}>Run</button>
				<h2>{language}</h2>
				<h3>Installed: {isInstalled}</h3>
			</div>
			<div className="flex h-full">
				<div className="flex basis-1/2 grow">
					<CodeMirror
						value={editorValue}
						height="100%"
						width="50vw"
						maxWidth="50vw"
						extensions={[javascript(), python()]}
						onChange={onChange}
						theme="dark"
					/>
				</div>
				<div className="flex basis-1/2 grow whitespace-pre-line">
					{runResponse}
				</div>
			</div>
		</div>
	);
}

export default App;

