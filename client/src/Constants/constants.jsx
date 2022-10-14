export const toastOption = {
	position: "bottom-right",
	autoClose: 8000,
	pauseOnHover: true,
	theme: "light",
};
export const promiseToaster = {
	pending: {
		render() {
			return "Processing Request";
		},
	},
	success: {
		render({ data }) {
			return `Successfully ${data} 👌`;
		},
	},
	error: {
		render({ data }) {
			return `${data}`;
		},
	},
};