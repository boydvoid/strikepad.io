import React from 'react'

import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import { CodeMode } from './_pages/Code';
import { Homepage } from './Home';

interface Props { }
const App: React.FC<Props> = () => {

	const router = createBrowserRouter([
		{
			path: "/",
			element: <Homepage />,
		},
	]);

	return (
		<RouterProvider router={router} />
	)
}

export default App;
