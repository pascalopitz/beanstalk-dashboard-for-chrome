let store = {
	connectionError: false,
	loading: false,
	showPutForm: false,
	putForm: {},
	messages: [],
	stats: {},
	peek: {},
	job_stats: {},
	settings: {
		address: "localhost",
		port: 11300,
		pause_delay: 3600
	}
};

window.store = store;
export default store;
