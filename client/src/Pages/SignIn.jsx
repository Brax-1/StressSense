import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { Layout } from "../Components";
import { toast } from "react-toastify";
import { loginRoute } from "../utils/APIRoute";
import axios from "axios";
import { promiseToaster, toastOption } from "../Constants/constants";

const SignIn = () => {
	const [info, setinfo] = useState({
		email: "",
		password: "",
	});
	const navigate = useNavigate();
	function handleSubmit() {
		const { email, password } = info;
		if (handleValidation()) {
			const dataPromise = new Promise(function (resolve, reject) {
				axios
					.post(loginRoute, {
						email,
						password,
					})
					.then((res) => {
						if (res.data.status === false) {
							reject(new Error(res.data.msg));
						} else {
							localStorage.setItem(
								"branchInternational",
								JSON.stringify(res.data.user)
							);
							navigate("/joinroom");
							resolve("Login");
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
		const { email, password } = info;
		if ((email === "") | (password === "")) {
			toast.error("Email and Password is required", toastOption);
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
							<span>Welcome</span> Back
						</h1>
						<p className="auth_subtitle">
							To keep connected with us please login with your personal
							information by email address and password
						</p>
					</div>
					<div className="auth_buttons">
						<input
							type={"text"}
							onChange={handleChange}
							name="email"
							className="auth_input"
							placeholder="Email"
						/>
						<input
							type={"password"}
							onChange={handleChange}
							name="password"
							className="auth_input"
							placeholder="Password"
						/>
						<Button
							color="primary"
							variant="contained"
							className="mui_btn"
							onClick={() => handleSubmit()}
						>
							<LockOpenIcon />
							<p>Sign in</p>
						</Button>
					</div>

					<Divider
						style={{
							background: "rgba(255,255,255,0.1)",
							marginBottom: "50px",
						}}
					/>
					<div style={{ color: "white" }}>
						Don't have an Account
						<Link to={"/signup"} className="auth_createaccount">
							Create Account
						</Link>
					</div>
				</div>

				<div className="auth_right">
					<img
						className="auth_image"
						src="https://img.freepik.com/free-photo/people-business-meeting-high-angle_23-2148911819.jpg?w=1380&t=st=1664680237~exp=1664680837~hmac=775ceb6693804749058263520686ead28e2679b7fe690faba9129e8be567baca"
						alt="Feature IMG"
					/>
				</div>
			</div>
		</Layout>
	);
};

export default SignIn;
