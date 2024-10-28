import React from "react";
import logo from "../logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserProvider";
import { FaArrowRight } from "react-icons/fa";

const Navbar: React.FC = () => {
	const { user, logoutUser } = useUserContext();
	const navigate = useNavigate();

	const handleLogout = () => {
		logoutUser();
	};

	return (
		<nav className="sticky top-0 z-50 border-b border-gray-200 backdrop-filter backdrop-blur-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 justify-between">
					<div className="flex cursor-pointer" onClick={() => {navigate("/")}}>
						<div className="shrink-0 flex items-center">
							<img className="h-8 w-8" src={logo} alt="Logo" />
							<span className="ml-2 text-xl font-bold text-secondary">
								Phone covers
							</span>
						</div>
					</div>

					<div className="flex items-center w-fit justify-between">
						{user ? (
							<>
								<div
									onClick={handleLogout}
									className="text-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium cursor-pointer"
								>
									Logout
								</div>
								{user.role === "admin" && (
									<Link
										to="/dashboard"
										className="text-gray-500 hover:text-gray-700 inline-flex justify-between items-center px-1 pt-1 text-sm font-medium w-24"
									>
										Dashboard✨
									</Link>
								)}
								<Link
									to="/configure/upload"
									className="ml-4 bg-primary inline-flex items-center justify-between w-32 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary"
								>
									Create cover <FaArrowRight />
								</Link>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="text-primary hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium"
								>
									Login
								</Link>
								<Link
									to="/Signup"
									className="ml-4 bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-primary"
								>
									Sign Up
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
