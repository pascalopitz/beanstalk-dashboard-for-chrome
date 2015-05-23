import React from 'react/addons'; 

import store from '../store';
import events from '../events';

import ActionsMenuColumn from './ActionsMenuColumn';

class Overview extends React.Component {
	render () {

		var rows = [];

		for(let k of Object.keys(store.stats)) {
			let st = store.stats[k];

			rows.push(
				<tr>
					<td><a href={ "#/queue/" + st.name}>{st.name}</a></td>
					<td>{st['current-jobs-urgent']}</td>
					<td>{st['current-jobs-ready']}</td>
					<td>{st['current-jobs-reserved']}</td>
					<td>{st['current-jobs-buried']}</td>
					<td>{st['total-jobs']}</td>

					<ActionsMenuColumn queue={st.name} stats={st} />
				</tr>
			);
		};

		if(store.connectionError) {
			return (
				<div className="pure-alert pure-alert-error">
					<label>Connection Error</label>
				</div>
			);
		}

		return (
			<div>
				<h1>All Queues</h1>

				<table className="pure-table pure-table-bordered" width="100%">
					<thead>
						<tr>
							<td>name</td>
							<td>urgent</td>
							<td>ready</td>
							<td>reserved</td>
							<td>buried</td>
							<td>total</td>

							<td></td>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
			</div>
		);
	}
};

export default Overview;

