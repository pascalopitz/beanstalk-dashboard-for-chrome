import React from 'react/addons'; 

import events from '../events';
import store from '../store';

class JobDetails extends React.Component {
	_noop () {
		return false;
	}

	_del () {
		events.emit('job-delete', store.job_stats[this.props.job.id].tube, this.props.job.id);
	}

	_delAll () {
		events.emit('job-delete-all', store.job_stats[this.props.job.id].tube, this.props.name);
	}

	render () {

		let actions = [];

		let job_stats = JSON.stringify(store.job_stats[this.props.job.id], true, 2);

		actions.push(
			<a onClick={this._del.bind(this)} className="pure-button">
				<i className="fa fa-trash-o"></i>
				<span>Delete Job</span>
			</a>
		);

		actions.push(
			<a onClick={this._delAll.bind(this)} className="pure-button">
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
					<pre>{job_stats}</pre>
 				</div>
			</div>
		);
	}
};

export default JobDetails;
