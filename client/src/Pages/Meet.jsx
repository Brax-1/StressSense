import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import { addMeetUser, addUserInteraction, host, tokenValidator } from "../utils/APIRoute";
import { Layout } from "../Components";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import moment from "moment";
import MessageIcon from "@mui/icons-material/Message";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";
import { promiseToaster, toastOption } from "../Constants/constants";
import Auth from "../utils/Auth";
import * as faceapi from "face-api.js";

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

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
	const [currentStress, setCurrentStress] = useState(0);
	const [currentStressIterations, setCurrentStressIteration] = useState(1);
	const heightv = videoConstraints.height;
	const widthv = videoConstraints.width;
	const [peers, setPeers] = useState([]);
	const userVideo = useRef();
	const peersRef = useRef([]);
	const params = useParams();
	const [intializing, setInitializing] = useState(false);
	const canvasRef = useRef();
	const roomID = params.roomID;
	const navigate = useNavigate()
	const [currentUser,setCurrentUser]=useState(undefined)
	const {
        transcript,
        resetTranscript,
      } = useSpeechRecognition();
    const [cnt,setwordcnt] = useState(0)
    useEffect(() => {
        SpeechRecognition.startListening({continuous:true});
    },[]);

	const patchUrl = `addUserInteraction/${roomID}/${currentUser?currentUser.email:""}/${cnt}`
    useEffect(()=>{
        setwordcnt((prev)=>prev+transcript.split(' ').length)
		
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.patch(patchUrl)
				.then((res) => {
					if (res.status !== 200) {
						reject(new Error(res.data.msg));
					} else {
						resolve("added interaction level");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});
		toast.promise(dataPromise, promiseToaster, toastOption);
    },[transcript])


	async function getModel() {
		const MODEL_URL = process.env.PUBLIC_URL + "/Models";
		setInitializing(true);
		Promise.all([
			faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
			faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
			faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
			faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
		]).then(getUserId);
	}
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
	function handleVideoPlay() {
		setInterval(async () => {
			if (intializing) {
				setInitializing(false);
			}
			canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
				userVideo.current
			);
			const displaySize = {
				width: widthv,
				height: heightv,
			};
			faceapi.matchDimensions(canvasRef.current, displaySize);
			const detection = await faceapi
				.detectAllFaces(
					userVideo.current,
					new faceapi.TinyFaceDetectorOptions()
				)
				.withFaceLandmarks()
				.withFaceExpressions();
			const resizedDetection = faceapi.resizeResults(detection, displaySize);
			canvasRef.current.getContext("2d").clearRect(0, 0, widthv, heightv);
			faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
			faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetection);
			faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetection);
			if (detection.length !== 0) {
				setCurrentStress(
					detection[0].expressions.angry * 100 +
						detection[0].expressions.fearful * 100 +
						detection[0].expressions.sad * 100 +
						detection[0].expressions.disgusted * 100
				);
			}
		}, 100);
	}
	async function getUserId() {
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.get(tokenValidator, {
					headers: {
						"x-Auth-Token": JSON.parse(localStorage.getItem("authToken")),
					},
				})
				.then((res) => {
					console.log(res, "ress");
					if (res.status !== 200) {
						reject(new Error(res.data.msg));
					} else {
						handleSocket(res.data);
						setCurrentUser(res.data)
						resolve("added meeting id");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});
		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	function addUserToDatabase(meetId, email, name) {
		const dataPromise = new Promise(function (resolve, reject) {
			axios
				.post(addMeetUser, {
					meeting_id: meetId,
					user_email: email,
					user_name: name,
				})
				.then((res) => {
					if (res.status !== 200) {
						reject(new Error(res.data.msg));
					} else {
						resolve("Added User Meeting");
					}
				})
				.catch((err) => {
					reject(new Error("Something went wrong ?"));
				});
		});
		toast.promise(dataPromise, promiseToaster, toastOption);
	}
	async function handleSocket(userdata) {
		socket.current = io(host);

		socket.current.on("stress", (users) => {
			console.log(users, "stress");
		});
		navigator.mediaDevices
			.getUserMedia({ video: videoConstraints, audio: true })
			.then((stream) => {
				userVideo.current.srcObject = stream;
				socket.current.emit("join room", roomID);
				socket.current.on("all users", (users) => {
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

				addUserToDatabase(roomID, userdata.email, userdata.name);

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
	function getCurrentStress(stress, iteration) {
		var res = stress / (5 * iteration);
		res = res * 100;
		res = res * 80;
		if (res > 80) {
			res = 76.98;
		}
		
		return Math.round(res);
	}
	useEffect(() => {
		getModel();
	}, []);
	return (
		<Layout>
			<div className="meet_cover">
				<div style={{color:"white",fontSize:"50px",position:"absolute",top:"50px",left:"50px"}}>
					Current Stress Level :{" "}
					{getCurrentStress(currentStress, currentStressIterations)}%
				</div>
				<div className="vedio_meet_main">
					<div style={{ display: "flex", justifyContent: "center" }}>
						<video
							muted
							ref={userVideo}
							autoPlay
							playsInline
							onPlay={handleVideoPlay}
						/>

						<canvas ref={canvasRef} style={{ position: "absolute" }} />
					</div>

					{peers.map((peer, index) => {
						return <Video key={index} peer={peer} />;
					})}
				</div>
			</div>
		</Layout>
	);
};

export default Meet;
