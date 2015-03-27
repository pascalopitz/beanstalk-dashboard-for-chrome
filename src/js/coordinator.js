import bs from 'nodestalker';
import store from './store';

var client = bs.Client();

class Coordinator {

	init () {
		this.query();
		window.setInterval(this.query.bind(this), 10000);
	}

	query() {

		console.log('query');

		let stats = [];

		client.list_tubes().onSuccess((data) => {
			data.forEach((tube) => {
				client.stats_tube(tube).onSuccess((s) => {
					stats.push(s)
					console.log('query result', s);
					store.stats = stats;
				});
			});
		});

	}
}

export default new Coordinator();