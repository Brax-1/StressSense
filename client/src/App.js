import "./App.css";
import "./Styling/auth.css";
import "./Styling/home.css";
import { Header } from "./Components";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home, Meet, SignIn, SignUp } from "./Pages";
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
						<Route path="/joinroom" element={<Home />} />
						<Route path="/meet/:roomId" element={<Meet />} />
					</Routes>
				</AnimatePresence>
			</Header>
		</div>
	);
}

export default App;
