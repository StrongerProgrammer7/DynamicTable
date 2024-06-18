import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const Layout = () =>
{
	return (
		<Suspense fallback={<CircularProgress color="inherit" />}>
			<Outlet />
		</Suspense>
	);
};

export default Layout;
