
import store from './store';
import events from './events';
import messages from './messages';
import loader from './loader';

import Queue from './beanstalk/Queue';

const INTERVAL = 1000;

class Coordinator {

	init () {
		events.on('connection-error', this.connectionError.bind(this));
		events.on('connection-success', this.connectionSuccess.bind(this));

		events.on('queue-kick-one', this.kickOne.bind(this));
		events.on('queue-kick-ten', this.kickTen.bind(this));
		events.on('queue-empty', this.emptyQueue.bind(this));
		events.on('queue-pause', this.pauseQueue.bind(this));
		events.on('queue-resume', this.resumeQueue.bind(this));
		events.on('queue-details', this.getQueueDetails.bind(this));
		events.on('queue-bury-one', this.buryOne.bind(this));

		events.on('job-delete', this.deleteJob.bind(this));
		events.on('job-delete-all', this.emptyQueue.bind(this));

		events.on('update-settings-start', this.pauseQueuePolling.bind(this));
		events.on('update-settings-save', this.saveSettings.bind(this));

		this.query();
		this.resumeQueuePolling();
	}

	connectionError () {
		if(store.connectionError) {
			return;
		}

		store.connectionError = true;
		events.emit('rerender');
	}

	connectionSuccess () {
		if(!store.connectionError) {
			return;
		}

		store.connectionError = false;
		events.emit('rerender');
	}

	resumeQueuePolling () {
		this.queryInterval = window.setInterval(this.query.bind(this), INTERVAL);
	}

	pauseQueuePolling () {
		if(this.queryInterval) {
			window.clearInterval(this.queryInterval);
		}
	}

	saveSettings (settings) {

		loader.show();

		let keys = Object.keys(settings);

		for (let k of keys) {
			store.settings[k] = settings[k];
		}

		chrome.storage.local.set(settings, () => {
			this.resumeQueuePolling();

			messages.success('Saved settings.');
			loader.hide();
		});
	}

	/*Queue Actions */

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
				this.getCurrentQueueDetails();
			});
		});
	}


	getQueueDetails (queue) {
		store.peek = {};
		store.job_stats = {};
		store.currentQueue = queue;

		this.getCurrentQueueDetails();
		events.emit('rerender');
	}

	getCurrentQueueDetails() {

		let queue = store.currentQueue;

		if(!queue) {
			return;
		}

		store.peek = {};
		store.job_stats = {};

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
						let promise;
						let qClient = new Queue(store.settings);

						promise = qClient.use(queue).then(() => {
							return qClient.stats_job(d.id)
						}).then((data) => {
							qClient.disconnect();
							return data;
						});

						all.push(promise);
					}
				}

				return Promise.all(all);
			}).then((data) => {
				for(let d of data) {
					store.job_stats[d.id] = d;
				}

				events.emit('rerender');
			});
		});
	}


	_pauseQueue (queue, delay) {

		loader.show();

		let client = new Queue(store.settings);

		return client.use(queue)
			.then(() => {
				return client.pause_tube(queue, delay);
			})
			.then(() => {
				client.disconnect();
				loader.hide();
				return true;
			});
	}

	resumeQueue (queue) {
		this._pauseQueue(queue, 0).then(() => {
			messages.success('Queue resumed.');
		});
	}


	pauseQueue (queue) {
		this._pauseQueue(queue, store.settings.pause_delay).then(() => {
			messages.success('Queue paused.');
		});
	}

	emptyQueue (queue, status) {

		loader.show();

		let client = new Queue(store.settings);

		let finish = () => {
			client.disconnect();
			this.getCurrentQueueDetails();
			messages.success(`Removed all ${status} jobs from queue.`);
			loader.hide();
		};

		client.use(queue).then(() => {

			let timeout;

			var getNextJob = () => {

				let promise;

				switch(status) {
					case 'delayed':
						promise = client.peek_delayed();
						break;

					case 'buried':
						promise = client.peek_buried();
						break;

					case 'ready':
					default:
						promise = client.peek_ready();
						status = 'ready';
						break;
				}

				promise.then((job) => {
					if(job.id) {
						// recursion
						this._deleteJob(job.id, getNextJob);
					} else {
						finish();
					}
				}, () => {
					finish();
				});
			};

			getNextJob();
		});
	}


	_kick (queue, num) {

		loader.show();

		let client = new Queue(store.settings);

		client.use(queue)
			.then(() => {
				return client.kick(num);
			})
			.then(() => {
				client.disconnect();
				this.getCurrentQueueDetails()
				messages.success(`Kicked ${num} jobs.`);

				loader.hide();
			});
	}

	kickTen (queue) {
		this._kick(queue, 10);
	}

	kickOne (queue) {
		this._kick(queue, 1);
	}

	buryOne (queue) {
		loader.show();

		let client = new Queue(store.settings);

		client.watch(queue)
			.then(() => {
				return client.reserve();
			})
			.then((job) => {
				return client.bury(job.id);
			})
			.then(() => {
				client.disconnect();
				this.getCurrentQueueDetails()
				loader.hide();
				messages.success(`Buried job.`);
			});

	}

	/* Job Actions */

	_deleteJob (jobId, callback) {

		callback = callback || () => {};

		loader.show();

		let client = new Queue(store.settings);

		client.deleteJob(jobId).then(() => {
			client.disconnect();
			callback();
		}, () => {
			console.log('err', arguments);
		})
	}

	deleteJob (queue, jobId) {

		loader.show();

		this._deleteJob(jobId, () => {
			this.getCurrentQueueDetails()
			messages.success(`Deleted job ${jobId}.`);
			loader.hide();
		});
	}
}

export default new Coordinator();