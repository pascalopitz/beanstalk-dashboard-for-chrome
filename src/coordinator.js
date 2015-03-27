import bs from 'nodestalker';

var client = bs.Client();

class Coordinator {

	constructor () {
		window.setInterval(this.query.bind(this), 10000);
	}

	query() {

		let stats = [];

		client.list_tubes().onSuccess((data) => {
			data.forEach((tube) => {
				client.stats_tube(tube).onSuccess((s) => {
					stats.push(s)
				});
			});
		});

	}
}

export default new Coordinator();