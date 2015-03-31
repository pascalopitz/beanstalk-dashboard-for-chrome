
import store from './store';
import events from './events';

import Queue from './beanstalk/Queue';

const INTERVAL = 1000;

class Coordinator {

	init () {
		this.query();
		this.resumeQueuePolling();

		events.on('queue-empty', this.emptyQueue.bind(this));
		events.on('queue-pause', this.pauseQueue.bind(this));
		events.on('queue-resume', this.resumeQueue.bind(this));
		events.on('queue-details', this.getQueueDetails.bind(this));

		events.on('job-bury', this.buryJob.bind(this));

		events.on('update-settings-start', this.pauseQueuePolling.bind(this));
		events.on('update-settings-finish', this.resumeQueuePolling.bind(this));
	}

	resumeQueuePolling () {
		this.queryInterval = window.setInterval(this.query.bind(this), INTERVAL);
	}

	pauseQueuePolling () {
		if(this.queryInterval) {
			window.clearInterval(this.queryInterval);
		}
	}

	query () {
		let client = new Queue(store.settings);

		store.stats = {};

		client.list_tubes().then((data) => {
			var all = data.map((tube) => {
				return client.stats_tube(tube);
			});

			Promise.all(all).then((data) => {
				client.disconnect();

				for(let d of data) {
					store.stats[d.name] = d;
				}
				events.emit('rerender');
			});
		});
	}


	getQueueDetails (queue) {

		store.loading = true;
		store.peek = {};
		store.job_stats = {};
		events.emit('rerender');

		let client = new Queue(store.settings);

		client.use(queue).then(() => {
			var all = [];

			all.push(client.peek_ready());
			all.push(client.peek_buried());
			all.push(client.peek_delayed());

			Promise.all(all).then((data) => {
				client.disconnect();

				store.peek.ready = data[0];
				store.peek.buried = data[1];
				store.peek.delayed = data[2];

				return data;
			}).then((data) => {

				let all = [];

				for(let d of data) {
					if(typeof d === 'object' && d.id) {
						all.push(client.stats_job(d.id));
					}
				}

				return Promise.all(all);
			}).then((data) => {

				for(let d of data) {
					store.job_stats[d.id] = d;
				}
	
				store.loading = false;
				events.emit('rerender');
			});
		});
	}


	_pauseQueue (queue, delay) {

		store.loading = true;
		events.emit('rerender');

		let client = new Queue(store.settings);

		client.use(queue)
			.then(() => {
				return client.pause_tube(queue, delay);
			})
			.then(() => {
				store.loading = false;
				client.disconnect();
				events.emit('rerender');
			});
	}

	resumeQueue (queue) {
		this._pauseQueue(queue, 0);
	}


	pauseQueue (queue) {
		this._pauseQueue(queue, store.settings.pause_delay);
	}

	buryJob (queue, jobId) {
		store.loading = true;
		events.emit('rerender');

		let client = new Queue(store.settings);

		client.watchOnly(queue).then(() => {
			return client.bury(jobId);
		}).then(() => {
			console.log('success', arguments);

			client.disconnect();
			this.getQueueDetails();
		}, () => {
			console.log('err', arguments);
		});
	}

	emptyQueue (queue) {

		store.loading = true;
		events.emit('rerender');

		let client = new Queue(store.settings);

		client.watchOnly(queue).then(() => {

			let timeout;

			var emptyHandler = (job) => {
				client.deleteJob(job.id).then(reserve);
			};

			var reserve = () => {
				client.reserve().then((job) => {
					emptyHandler(job);
				}, () => {
					client.disconnect();
				});

				if(timeout) {
					clearTimeout(timeout);
				}
				timeout = setTimeout(() => {
					client.disconnect();
					store.loading = false;
					events.emit('rerender');
				}, 100);
			};

			reserve();
		});
	}
}

export default new Coordinator();