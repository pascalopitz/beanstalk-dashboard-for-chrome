let store = {
	loading: false,
	stats: {},
	peek: {},
	job_stats: {},
	settings: {
		connection: "localhost",
		port: 11300
	}
};

window.store = store;
export default store;