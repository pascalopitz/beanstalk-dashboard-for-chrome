
import store from './store';
import events from './events';

import Queue from './beanstalk/Queue';

const INTERVAL = 1000;

class Coordinator {

	init () {
		window.setInterval(this.query.bind(this), INTERVAL);
		this.query();
		events.on('empty-queue', this.emptyQueue.bind(this));
	}

	query () {
		let client = new Queue(store.settings);

		store.stats = [];

		client.list_tubes().then((data) => {
			var all = data.map((tube) => {
				return client.stats_tube(tube);
			});

			Promise.all(all).then((data) => {
				client.disconnect();
				store.stats = data;
				events.emit('rerender');
			});
		});
	}


	emptyQueue (queue) {

		store.loading = true;
		events.emit('rerender');

		let client = new Queue(store.settings);

		client.watch(queue).then(() => {
			if(queue !== 'default') {
				return client.ignore('default');
			}
		}).then(() => {

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