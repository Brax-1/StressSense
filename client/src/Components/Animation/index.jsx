import React from "react";
import { motion } from "framer-motion";

const Animation = (props) => {
	return (
		<motion.div
			initial={{ translateX: "100vw" }}
			animate={{ translateX: 0 }}
			exit={{ translateY: "100vh" }}
			transition={{ duration: 0.5,delay:0.3 }}
		>
			{props.children}
		</motion.div>
	);
};

export default Animation;
