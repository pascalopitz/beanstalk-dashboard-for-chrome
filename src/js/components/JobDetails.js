import React from 'react/addons'; 

import events from '../events';
import store from '../store';

class JobDetails extends React.Component {
	_noop () {
		return false;
	}

	_kickOne () {
		events.emit('queue-kick-one', store.job_stats[this.props.job.id].tube);
	}

	_kickTen () {
		events.emit('queue-kick-ten', store.job_stats[this.props.job.id].tube);
	}

	_bury () {
		events.emit('queue-bury-one', store.job_stats[this.props.job.id].tube);
	}

	_del () {
		events.emit('job-delete', store.job_stats[this.props.job.id].tube, this.props.job.id);
	}

	_delAll () {
		events.emit('job-delete-all', store.job_stats[this.props.job.id].tube, this.props.name);
	}

	render () {

		let actions = [];
		let job_stats = [];

		let statsObj = store.job_stats[this.props.job.id];

		for(let key in statsObj) {
			job_stats.push(<tr>
								<td>{key}</td>
								<td>{statsObj[key]}</td>
							</tr>);
		}

		if(this.props.name === 'ready') {
			actions.push(
				<a onClick={this._bury.bind(this)} className="pure-button pure-button-warning">
					<i className="fa fa-bed"></i>
					<span>Bury Next {this.props.name}</span>
				</a>
			);			
		}

		if(this.props.name === 'buried') {
			actions.push(
				<a onClick={this._kickOne.bind(this)} className="pure-button pure-button-secondary">
					<i className="fa fa-forward"></i>
					<span>Kick 1</span>
				</a>
			);

			actions.push(
				<a onClick={this._kickTen.bind(this)} className="pure-button pure-button-primary">
					<i className="fa fa-fast-forward"></i>
					<span>Kick 10</span>
				</a>
			);
		}

		actions.push(
			<a onClick={this._del.bind(this)} className="pure-button pure-button-error">
				<i className="fa fa-trash-o"></i>
				<span>Delete Job</span>
			</a>
		);

		actions.push(
			<a onClick={this._delAll.bind(this)} className="pure-button pure-button-error">
				<i className="fa fa-trash"></i>
				<span>Delete All {this.props.name}</span>
			</a>
		);

		return (
			<div className="custom-job-details">
				<h2>Next job {this.props.name}</h2>

				<div className="custom-button-row">
					{actions}
				</div>

				<div className="custom-job-data">
					<h3>Data</h3>
					<pre>{this.props.job.data}</pre>
				</div>

				<div className="custom-job-stats">
					<h3>Stats</h3>
					<table className="pure-table pure-table-bordered" width="100%">
						<tbody>
							{job_stats}
						</tbody>
					</table>
 				</div>
			</div>
		);
	}
};

export default JobDetails;
