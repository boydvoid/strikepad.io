import { useEffect, useState, useRef, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { Command } from '@tauri-apps/api/shell'
import { register } from '@tauri-apps/api/globalShortcut';
import { appWindow } from '@tauri-apps/api/window';
import CodeMirror from '@uiw/react-codemirror'

import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'

import "./App.css";

const languages = ['javascript', 'python', 'setup']
const metaKeywords = ['[lang]']

function App() {
	const [editorValue, setEditorValue] = useState("")
	const [runResponse, setRunResponse] = useState("")
	const [language, setLanguage] = useState('setup')
	const [isInstalled, setIsInstalled] = useState<string | null>(null)

	async function handleButton() {
		let res: string
		switch (language) {
			case 'javascript':
				res = await invoke('run_js', { code: removeMeta() })
				setRunResponse(res)
				break;
			case 'python':
				res = await invoke('run_py', { code: removeMeta() })
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
		checkForMode()
	}, [editorValue])

	const onChange = useCallback((value, viewUpdate) => {
		setEditorValue(value)
	}, [])

	function removeMeta() {
		// check for meta keywords
		const byLine = splitByLine()

		let formattedValue = byLine.map((line: string, i: number) => {
			if (metaKeywords.indexOf(line) !== -1) {
				return '\n'
			}
			else if (metaKeywords.indexOf(byLine[i - 1]) !== -1) {
				return '\n'
			} else {
				return `${line}\n`
			}

		})
		return formattedValue.join("")

	}

	/**
	* Checks for the Language
	* Choices are in languages array
	* */
	function checkForMode() {
		// split the full editor text by linebreak
		const valueByLine = splitByLine()

		valueByLine.map((line: string, i: number) => {
			if (line.includes('[lang]')) {
				const languageIndex = languages.indexOf(valueByLine[i + 1])
				if (languageIndex !== -1) {
					setLanguage(languages[languageIndex])
				} else {
					if (language !== 'setup') {
						setLanguage('setup')
					}
				}
			}
		})
	}

	useEffect(() => {
		checkForInstallation()
	}, [language])

	async function checkForInstallation() {
		let res: string
		switch (language) {

			case 'javascript':
				res = await invoke('js_check')
				setIsInstalled(res)
				break;
			case 'python':
				res = await invoke('py_check')
				setIsInstalled(res)
				console.log(res)
				break;
		}
	}


	// TODO: probably should create helpers

	function splitByLine() {
		return editorValue.split('\n')
	}

	return (
		<div>
			<div>
				<button onClick={handleButton}>Run</button>
				<h2>{language}</h2>
				<h3>Installed: {isInstalled}</h3>
			</div>
			<div className="flex">
				<div className="flex basis-1/2 grow">
					<CodeMirror
						value={editorValue}
						height="200px"
						width="50vw"
						maxWidth="50vw"
						extensions={[python()]}
						onChange={onChange}
						theme="light"
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

