import "./App.css";
import "./Styling/auth.css";
import "./Styling/home.css";
import "./Styling/meet.css";
import "./Styling/dashboard.css";
import { Header } from "./Components";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dashboard, Home, Meet, SignIn, SignUp } from "./Pages";
import ProtectedRoute from "./ProtectedRoute";
function App() {
	const location = useLocation();
	return (
		<div className="app">
			<Header>
				<ToastContainer />
				<AnimatePresence exitBeforeEnter initial={false}>
					<Routes location={location} key={location.pathname}>
						<Route path="/signin" element={<SignIn />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/joinroom" element={< ProtectedRoute Component={Home} />}/>
						<Route path="/dashboard" element={< ProtectedRoute Component={Dashboard} />}/>
						<Route path="/meet/:roomID" element={< ProtectedRoute Component={Meet} />} />
					</Routes>
				</AnimatePresence>
			</Header>
		</div>
	);
}

export default App;
