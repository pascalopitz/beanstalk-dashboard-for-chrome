let store = {
	connectionError: false,
	loading: false,
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
