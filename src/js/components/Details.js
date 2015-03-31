import React from 'react/addons'; 

import store from '../store';
import events from '../events';

import ActionsMenuColumn from './ActionsMenuColumn';

class Overview extends React.Component {

	componentDidMount () {
		events.emit('queue-details', this.props.name);
	}

	render () {

		let st = store.stats[this.props.name];

		if(!st) {
			window.setTimeout(() => {
				window.location.hash = '/';
			}, 5000);

			return (
				<div>
					<h1>{this.props.name} not found</h1>

					<p>
						Redirecting to homepage ...
					</p>
				</div>
			);
		}

		return (
			<div>
				<h1>{this.props.name}</h1>

				<table className="pure-table pure-table-bordered" width="100%">
					<thead>
						<tr>
							<td>name</td>
							<td>total</td>

							<td>ready</td>
							<td>reserved</td>
							<td>buried</td>

							<td>using</td>
							<td>waiting</td>
							<td>watching</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{st.name}</td>
							<td>{st['total-jobs']}</td>

							<td>{st['current-jobs-ready']}</td>
							<td>{st['current-jobs-reserved']}</td>
							<td>{st['current-jobs-buried']}</td>

							<td>{st['current-using']}</td>
							<td>{st['current-waiting']}</td>
							<td>{st['current-watching']}</td>
						</tr>
					</tbody>
				</table>

			</div>
		);
	}
};

export default Overview;

