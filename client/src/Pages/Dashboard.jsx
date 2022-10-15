import { Button, Chip, Divider } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { promiseToaster, toastOption } from "../Constants/constants";
import { allUsers, loginRoute, meetDetail } from "../utils/APIRoute";
import Chart from "chart.js/auto";
import { color } from "@mui/system";

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
	const generateColor = () => {
		const randomColor = Math.floor(Math.random() * 1677715)
			.toString(16)
			.padStart(6, "0");
		return `#${randomColor}`;
	};
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
						const datavalue = res.data.map((val) => {
							return val.interaction_percentage;
						});
						const colors = [];
						for (let i = 0; i < datavalue.length; i++) {
							colors.push(generateColor());
						}
						// const ctx = document.getElementById("myChart");
						// const myChart = new Chart(ctx, {
						// 	type: 'bar',
						// 	data: {
						// 		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
						// 		datasets: [{
						// 			label: '# of Votes',
						// 			data: [12, 19, 3, 5, 2, 3],
						// 			backgroundColor: [
						// 				'rgba(255, 99, 132, 0.2)',
						// 				'rgba(54, 162, 235, 0.2)',
						// 				'rgba(255, 206, 86, 0.2)',
						// 				'rgba(75, 192, 192, 0.2)',
						// 				'rgba(153, 102, 255, 0.2)',
						// 				'rgba(255, 159, 64, 0.2)'
						// 			],
						// 			borderColor: [
						// 				'rgba(255, 99, 132, 1)',
						// 				'rgba(54, 162, 235, 1)',
						// 				'rgba(255, 206, 86, 1)',
						// 				'rgba(75, 192, 192, 1)',
						// 				'rgba(153, 102, 255, 1)',
						// 				'rgba(255, 159, 64, 1)'
						// 			],
						// 			borderWidth: 1
						// 		}]
						// 	},
						// 	options: {
						// 		scales: {
						// 			y: {
						// 				beginAtZero: true
						// 			}
						// 		}
						// 	}
						// });
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
	function handleShowUserReport(user) {
		setCurrentUser(user);
		const ctx = document.getElementById("myChart");
		const myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['Stress', 'Interaction'],
				datasets: [{
					label: '# of Votes',
					data: [user.stress_percentage,user.interaction_percentage],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
					],
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
	}
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

			<div style={{ width: "700px", height: "700px", marginTop: "10px",position:"absolute",bottom:"100px",right:"100px" }}>
				<canvas id="myChart" width="100" height="100"></canvas>
			</div>
			<div className="dashboard_label">All Meetings</div>
			<Divider />
			<div className="dashboard_users">
				{allMeet.map((meet) => (
					<Button
						variant="contained"
						onClick={() => getAllUserMeeting(meet.meeting_id)}
					>
						<div className="dashboard_username">
							{moment(meet.start_date).format("MMMM Do YYYY, h:mm a")}
						</div>
						<div className="dashboard_useremail">{meet.meeting_id}</div>
					</Button>
				))}
			</div>
			<div className="dashboard_label">All Users</div>
			<Divider />
			<div className="dashboard_users">
				{allUser.map((user) => (
					<Button variant="contained" onClick={() => handleShowUserReport(user)}>
						<div className="dashboard_username">{user.user_email}</div>
					</Button>
				))}
			</div>
		</div>
	);
};

export default Dashboard;
