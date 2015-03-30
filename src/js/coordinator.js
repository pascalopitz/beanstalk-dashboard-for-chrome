
import store from './store';
import events from './events';

import Queue from './beanstalk/Queue';

class Coordinator {

	init () {
		window.setInterval(this.query.bind(this), 1000);
		events.on('empty-queue', this.emptyQueue.bind(this))
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

		let client = new Queue(store.settings);
		let setup = [];

		setup.push(client.watch(queue));
		if(queue !== 'default') setup.push(client.ignore('default'));

		Promise.all(setup).then(() => {

			let timeout;

			let emptyHandler = (job) => {
				console.log('emptyHandler', job);
				client.deleteJob(job.id).then(emptyHandler);

				if(timeout) {
					clearTimeout(timeout);
				}
				timeout = setTimeout(() => {
					client.disconnect();
				}, 1000);
			};

			let reserve = () => {
				client.reserve().then(emptyHandler, () => {
					client.disconnect();
				});
			};

			reserve();
		});
	}
}

export default new Coordinator();