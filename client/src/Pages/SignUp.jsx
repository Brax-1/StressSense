import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import { Layout } from "../Components";
import { toast } from "react-toastify";
import { registerRoute } from "../utils/APIRoute";
import axios from "axios";
import { promiseToaster, toastOption } from "../Constants/constants";
const SignUp = () => {
	const [info, setinfo] = useState({
		username: "",
		email: "",
		password: "",
		confirmPass: "",
		admin: true,
	});
	const navigate = useNavigate();
	function handleSubmit() {
		const { email, username, password, admin } = info;
		if (handleValidation()) {
			const dataPromise = new Promise(function (resolve, reject) {
				axios
					.post(registerRoute, {
						name : username,
						email,
						password
					})
					.then((res) => {
						if (res.status !== 200) {
							reject(new Error(res.data.msg));
						} else {
							localStorage.setItem(
								"authToken",
								JSON.stringify(res.data.token)
							);
							navigate("/joinroom");
							resolve("Registered");
						}
					})
					.catch((err) => {
						reject(new Error("Something went wrong ?"));
					});
			});
			toast.promise(dataPromise, promiseToaster, toastOption);
		}
	}
	function handleValidation() {
		const { username, email, password, confirmPass } = info;
		if (password !== confirmPass) {
			toast.error("Password and Confirm password should be same", toastOption);
			return false;
		} else if (username.length < 3) {
			toast.error("Username should be greater than 3", toastOption);
			return false;
		} else if (password.length < 8) {
			toast.error("Password should be greater than 8", toastOption);
			return false;
		} else if (email.length === 0) {
			toast.error("Email is required", toastOption);
			return false;
		}
		return true;
	}
	function handleChange(e) {
		setinfo({ ...info, [e.target.name]: e.target.value });
	}

	return (
		<Layout>
			<div className="auth">
				<div className="auth_left">
					<div className="auth_featureText">
						<h1 className="auth_title">
							Welcome to <span>Family</span>
						</h1>
						<p className="auth_subtitle">
							A few click away for creating your account with Branch
							International
						</p>
					</div>
					<div className="auth_buttons">
						<input
							type={"text"}
							onChange={handleChange}
							className="auth_input"
							name="username"
							placeholder="Username"
						/>
						<input
							type={"text"}
							onChange={handleChange}
							className="auth_input"
							name="email"
							placeholder="Email"
						/>
						<input
							type={"password"}
							onChange={handleChange}
							className="auth_input"
							placeholder="Password"
							name="password"
						/>
						<input
							type={"password"}
							onChange={handleChange}
							className="auth_input"
							placeholder="Confirm Password"
							name="confirmPass"
						/>
						<Button
							color="primary"
							variant="contained"
							className="mui_btn"
							onClick={handleSubmit}
						>
							<LockIcon />
							<p>Sign Up</p>
						</Button>
					</div>
					<Divider
						style={{
							background: "rgba(255,255,255,0.1)",
							marginBottom: "50px",
						}}
					/>
					<div style={{ color: "white" }}>
						Already have an Account
						<Link to={"/signin"} className="auth_createaccount">
							Sign In
						</Link>
					</div>
				</div>

				<div className="auth_right">
					<img
						className="auth_image"
						src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
						alt="Feature IMG"
					/>
				</div>
			</div>
		</Layout>
	);
};

export default SignUp;
