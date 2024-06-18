import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { lazy,Suspense } from "react";
import { Outlet } from "react-router-dom";
const Main = lazy(() => import("../pages/Main/Main"));

const Layout = () =>
{
	return (
		<Suspense fallback={<CircularProgress color="inherit" />}>
			<Main />
		</Suspense>
	);
};

export default Layout;
