import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
import { EditorProvider } from "./_pages/Notes/context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<EditorProvider>
			<App />
		</EditorProvider>
	</React.StrictMode>
);
