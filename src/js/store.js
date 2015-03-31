let store = {
	loading: false,
	stats: {},
	peek: {},
	job_stats: {},
	settings: {
		connection: "localhost",
		port: 11300,
		pause_delay: 3600
	}
};

window.store = store;
export default store;