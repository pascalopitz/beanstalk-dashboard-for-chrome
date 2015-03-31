import React from 'react/addons'; 

import events from '../events';

class JobDetails extends React.Component {
	_noop () {
		return false;
	}

	_kick () {
		events.emit('job-kick', this.props.job.id);
	}

	_bury () {
		events.emit('job-bury', this.props.job.id);
	}

	render () {

		let actions = [];

		switch(this.props.name) {
			case 'buried':
			case 'delayed':
				actions.push(
					<a onClick={this._kick.bind(this)} className="pure-button">
						<i className="fa fa-play"></i>
						<span>Kick</span>
					</a>
				);
				break;

			case 'ready':
				actions.push(
					<a onClick={this._bury.bind(this)} className="pure-button">
						<i className="fa fa-pause"></i>
						<span>Bury</span>
					</a>
				);
				break;
		}

		return (
			<div>
				<h2>Next job {this.props.name}</h2>

				<form className="pure-form pure-form-aligned" onSubmit={this._noop}>
					<fieldset>
						<div className="pure-control-group">
							<label htmlFor="job-id">Id:</label>
							<input id="job-id" type="text" value={this.props.job.id} disabled />
		 				</div>

						<div className="pure-control-group">
							<label htmlFor="job-data">Data:</label>
							<textarea id="job-data" disabled>{this.props.job.data}</textarea>
		 				</div>

						<div className="pure-controls">
							{actions}
						</div>
					</fieldset>
				</form>
			</div>
		);
	}
};

export default JobDetails;
