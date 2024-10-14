import React from "react";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./Utils/ProtectedRoutes";
import Navbar from "./components/Navbar";
import { UserProvider } from "./Context/UserProvider";
import Restriction from "./Pages/Restriction";
import Dashboard from "./Pages/Dashboard/Dashboard";
import PublicRoutes from "./Utils/PublicRoutes";
import Signup from "./Pages/Signup/Signup";
import ErrorPage from "./Pages/ErrorPage";
import Footer from "./components/Footer";
import Upload from "./Pages/Upload/Upload";
import Design from "./Pages/Design/Design";
import Preview from "./Pages/Preview/Preview";
import UploadProvider from "./Context/UploadProvider";

const App = () => {
	return (
		<UserProvider>
			<Router>
				<Navbar />
				<main className="grainy-light font-recursive flex flex-col min-h-[calc(100vh-5.5rem-10px)]">
					<div className="flex flex-col flex-1 h-full">
						<Routes>
							<Route
								element={<ProtectedRoutes allowedRoles={["user", "admin"]} />}
							>
								<Route path="/" element={<Home />} />
								<Route
									path="configure/upload"
									element={
										<UploadProvider>
											<Upload />
										</UploadProvider>
									}
								/>
								<Route
									path="configure/design"
									element={
										<UploadProvider>
											<Design />
										</UploadProvider>
									}
								/>
								<Route
									path="configure/preview"
									element={
										<UploadProvider>
											<Preview />
										</UploadProvider>
									}
								/>
							</Route>
							<Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
								<Route path="/dashboard" element={<Dashboard />} />
							</Route>
							<Route element={<PublicRoutes />}>
								<Route path="/login" element={<Login />} />
								<Route path="/signup" element={<Signup />} />
							</Route>
							<Route path="/non-allowed-access" element={<Restriction />} />
							<Route path="/*" element={<ErrorPage />} />
						</Routes>
					</div>
					<Footer />
				</main>
			</Router>
		</UserProvider>
	);
};

export default App;
