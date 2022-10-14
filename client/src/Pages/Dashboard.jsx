import { Button, Chip, Divider } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { promiseToaster, toastOption } from "../Constants/constants";
import { allUsers, loginRoute, meetDetail } from "../utils/APIRoute";

const Dashboard = () => {
	const [allMeet, setAllMeet] = useState([]);
	const [allUser, setAllUser] = useState([]);
	const [currentUser, setCurrentUser] = useState(undefined);
	function handleUserDetail() {
		console.log("done");
	}
	function getAllMeeting() {
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.get(meetDetail)
				.then((res) => {
					if (res.status !== 200) {
						reject(new Error(res.data.msg));
					} else {
						setAllMeet(res.data);
						resolve("Fetched Meeting Ids");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});
		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	function getAllUserMeeting(meetingId) {
		const url = `${allUsers}/${meetingId}`;
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.get(url)
				.then((res) => {
					if (res.status !== 200) {
						reject(new Error(res.data.msg));
					} else {
						setAllUser(res.data);
						resolve("Fetched Meeting Ids");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});
		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	useEffect(() => {
		getAllMeeting();
	}, []);
	return (
		<div className="dashboard_main">
			{currentUser && (
				<div className="dashboard_card_info">
					<div>
						<div>Mental Stress</div>
						<div>{currentUser.stress_percentage}%</div>
					</div>
					<div>
						<div>Interaction</div>
						<div>{currentUser.interaction_percentage}%</div>
					</div>
				</div>
			)}

			<div className="dashboard_label">All Meetings</div>
			<Divider />
			<div className="dashboard_users">
				{allMeet.map((meet) => (
					<Button
						variant="contained"
						onClick={() => getAllUserMeeting(meet.meeting_id)}
					>
						<div className="dashboard_username">
							{moment(meet.start_data).format("MMMM Do YYYY, h:mm a")}
						</div>
						<div className="dashboard_useremail">{meet.meeting_id}</div>
					</Button>
				))}
			</div>
			<div className="dashboard_label">All Users</div>
			<Divider />
			<div className="dashboard_users">
				{allUser.map((user) => (
					<Button variant="contained" onClick={()=>setCurrentUser(user)}>
						<div className="dashboard_username">{user.user_email}</div>
					</Button>
				))}
			</div>
		</div>
	);
};

export default Dashboard;
