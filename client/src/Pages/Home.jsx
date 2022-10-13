import { Button, Divider, InputAdornment, TextField } from "@mui/material";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import React, { useState } from "react";
import Layout from "../Components/Animation";
import { v4 as uuid } from "uuid";

const Home = () => {
	const [code, setCode] = useState("");
	function handleJoinMeet() {
		const url = `http://localhost:3000/meet/${code}`;
		window.open(url, "_blank", "noopener,noreferrer");
	}
	function handleNewMeet() {
		const unique_id = uuid();
		const url = `http://localhost:3000/meet/${unique_id}`;
		window.open(url, "_blank", "noopener,noreferrer");
	}
	return (
		<Layout>
			<div className="home">
				<div className="home__left">
					<div className="home__featureText">
						<h1 className="home__title">
							<span>Premium</span> video meetings. Now free for everyone
						</h1>
						<p className="home__subtitle">
							We re-engineered the service we built for secure buisness
							meetings, Google Meet, to make sure it free and available for all
						</p>
					</div>

					<div className="home__buttons">
						<Button
							onClick={() => handleNewMeet()}
							color="primary"
							variant="contained"
							className="home__createBTN"
						>
							<VideoCallIcon />
							<p>New Meeting</p>
						</Button>

						<TextField
							className="home__input"
							variant="outlined"
							onChange={(e) => setCode(e.target.value)}
							placeholder="Enter a code or link "
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<KeyboardIcon className="icon" />
									</InputAdornment>
								),
							}}
						/>

						<Button className="home__joinBTN" onClick={() => handleJoinMeet()}>
							Join
						</Button>
					</div>

					<Divider style={{ background: "rgba(255,255,255,0.1)" }} />

					<p className="home__learnMore">Learn more about Google Meet</p>
				</div>

				<div className="home__right">
					<img
						className="home__image"
						src="https://img.freepik.com/free-photo/smiling-african-american-female-remote-worker-greeting-colleagues-videocall-modern-home-office-videoconference-meeting-with-company-team-businesswoman-headphones-teleconference_482257-49266.jpg?w=1380&t=st=1664678505~exp=1664679105~hmac=57f2d3f7dc4a7ffb466701ca9f13e63d4a16404749f6b024f529b93a9b3e04ad"
						alt="Feature IMG"
					/>
				</div>
			</div>
		</Layout>
	);
};

export default Home;
