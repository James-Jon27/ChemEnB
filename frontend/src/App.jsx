import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import Spots from "./components/Spots";
import SpotDetails from "./components/Spots/SpotDetails";
import SpotManagement from "./components/Spots/SpotManagement";

function Layout() {
	const dispatch = useDispatch();
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		dispatch(sessionActions.restoreUser()).then(() => {
			setIsLoaded(true);
		});
	}, [dispatch]);

	return (
		<>
			<Navigation isLoaded={isLoaded} />
			{isLoaded && <Outlet />}
		</>
	);
}

const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Spots />,
			},
			{
				path: "/spots/:id",
				element: <SpotDetails />,
				children : [
					{
						path : "edit",
						element: <SpotManagement method={false}/>
					}
				]
			},
			{
				path: "/spots/new",
				element: <SpotManagement method={true}/>
			},
			{
				path: "/reviews/current"
			}, 
			{
				path:  "/spots/current"
			}
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
