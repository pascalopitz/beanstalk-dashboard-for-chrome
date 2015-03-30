import React from 'react/addons'; 

import store from '../store';
import events from '../events';

import ActionsMenu from './ActionsMenu';

class Server extends React.Component {
	render () {

		var rows = store.stats.map((st) => {
			return 	<tr>
						<td>{st.name}</td>
						<td>{st['total-jobs']}</td>

						<td>{st['current-jobs-ready']}</td>
						<td>{st['current-jobs-reserved']}</td>
						<td>{st['current-jobs-buried']}</td>

						<td>{st['current-using']}</td>
						<td>{st['current-waiting']}</td>
						<td>{st['current-watching']}</td>

						<td width="100px">
							<ActionsMenu queue={st.name} />
						</td>
					</tr>;
		});

		return (
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

						<td></td>
					</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		);
	}
};

export default Server;

