import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import {
	host, tokenValidator
} from "../utils/APIRoute";
import { Layout } from "../Components";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import MessageIcon from "@mui/icons-material/Message";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";
import { promiseToaster, toastOption } from "../Constants/constants";

const Video = (props) => {
	const ref = useRef();

	useEffect(() => {
		props.peer.on("stream", (stream) => {
			ref.current.srcObject = stream;
		});
	}, []);

	return <video playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
	height: window.innerHeight / 2,
	width: window.innerWidth / 2,
};

const Meet = () => {
	const socket = useRef();

	const [peers, setPeers] = useState([]);
	const userVideo = useRef();
	const peersRef = useRef([]);
	const params = useParams();
	const roomID = params.roomID;

	function createPeer(userToSignal, callerID, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});

		peer.on("signal", (signal) => {
			socket.current.emit("sending signal", {
				userToSignal,
				callerID,
				signal,
			});
		});

		return peer;
	}

	function addPeer(incomingSignal, callerID, stream) {
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});

		peer.on("signal", (signal) => {
			socket.current.emit("returning signal", { signal, callerID });
		});

		peer.signal(incomingSignal);

		return peer;
	}

	function addUserToDatabase(meetingId) {
		// const url = `${allUsers}/${meetingId}`;
		// const dataPromise = new Promise(function (resolve, reject) {
		// 	axios
		// 		.get(url)
		// 		.then((res) => {
		// 			if (res.status !== 200) {
		// 				reject(new Error(res.data.msg));
		// 			} else {
		// 				setAllUser(res.data);
		// 				resolve("Fetched Meeting Ids");
		// 			}
		// 		})
		// 		.catch((err) => {
		// 			reject(new Error("Something went wrong ?"));
		// 		});
		// });
		// toast.promise(dataPromise, promiseToaster, toastOption);
	}
	async function handleSocket() {
		socket.current = io(host);
		console.log(localStorage.getItem("authToken"))
		const user = await axios.get(tokenValidator,{
			headers:{
				'Authorization':`Bearer ${localStorage.getItem("authToken")}`
			}
		});
		console.log(user,"users")
		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((stream) => {
				userVideo.current.srcObject = stream;
				console.log("open peers");
				socket.current.emit("join room", roomID);
				socket.current.on("all users", (users) => {
					console.log("on peers")
					const peers = [];
					users.forEach((userID) => {
						const peer = createPeer(userID, socket.current.id, stream);
						peersRef.current.push({
							peerID: userID,
							peer,
						});
						peers.push(peer);
					});
					setPeers(peers);
				});

				addUserToDatabase(roomID);				

				socket.current.on("user joined", (payload) => {
					const peer = addPeer(payload.signal, payload.callerID, stream);
					peersRef.current.push({
						peerID: payload.callerID,
						peer,
					});

					setPeers((users) => [...users, peer]);
				});

				socket.current.on("receiving returned signal", (payload) => {
					const item = peersRef.current.find((p) => p.peerID === payload.id);
					item.peer.signal(payload.signal);
				});
			});
	}
	useEffect(() => {
		handleSocket();
	}, []);
	return (
		<Layout>
			<div className="meet_cover">
			<div className="vedio_meet_main">
				<video muted ref={userVideo} autoPlay playsInline />
				{peers.map((peer, index) => {
					return <Video key={index} peer={peer} />;
				})}
			</div>
			</div>
		</Layout>
	);
};

export default Meet;
