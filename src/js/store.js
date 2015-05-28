let store: {
	connectionError: boolean;
	loading: boolean;
	showPutForm: boolean;
	putForm: Object;
	messages: Array<Object>;
	stats: Object;
	peek: Object;
	job_stats: Object;
	settings: {
		address: string;
		port: mixed;
		pause_delay: mixed;
	};
} = {
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
