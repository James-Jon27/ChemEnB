import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";
import * as sessionActions from "./store/session";
import Spots from "./components/Spots";
import SpotDetails from "./components/Spots/SpotDetails";
import SpotManagement from "./components/Spots/SpotManagement";
import SpotUpdate from "./components/Spots/SpotUpdate";
import SpotCreate from "./components/Spots/SpotCreate";
import UserReviews from "./components/Reviews/UserReviews";

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
			},
			{
				path: "/spots/:id/edit",
				element: <SpotUpdate />,
			},
			{
				path: "/spots/new",
				element: <SpotCreate />,
			},
			{
				path: "/reviews/current",
				element: <UserReviews />
			},
			{
				path: "/spots/current",
				element : <SpotManagement />
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
