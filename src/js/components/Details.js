import React from 'react/addons'; 

import store from '../store';
import events from '../events';

import JobDetails from './JobDetails';

class Overview extends React.Component {

	componentDidMount () {
		events.emit('queue-details', this.props.name);
	}

	_pauseQueue () {
		events.emit('queue-pause', this.props.name);
	}

	_resumeQueue () {
		events.emit('queue-resume', this.props.name);
	}

	_showPutForm () {
		events.emit('putform-show', this.props.name);
	}

	render () {

		let st = store.stats[this.props.name];

		if(!st) {
			return (
				<div>
					<h1>{this.props.name} not found</h1>

					<p>
						<a href="#/">Back to homepage ...</a>
					</p>
				</div>
			);
		}

		let pause_resume;
		let ready, buried, delayed;

		if(st.pause) {
			pause_resume = (
				<a onClick={this._resumeQueue.bind(this)} className="pure-button pure-button-success">
					<i className="fa fa-play"></i>
					<span>Resume</span>
				</a>
			);
		} else {
			pause_resume = (
				<a onClick={this._pauseQueue.bind(this)} className="pure-button pure-button-warning">
					<i className="fa fa-pause"></i>
					<span>Pause</span>
				</a>
			);
		}

		let showPutForm = (
			<a onClick={this._showPutForm.bind(this)} className="pure-button">
				<i className="fa fa-plus"></i>
				<span>Add Job</span>
			</a>
		);


		if(store.peek.ready && store.peek.ready.id) {
			ready = <JobDetails name="ready" job={store.peek.ready} />
		}

		if(store.peek.buried && store.peek.buried.id) {
			buried = <JobDetails name="buried" job={store.peek.buried} />
		}

		if(store.peek.delayed && store.peek.delayed.id) {
			delayed = <JobDetails name="delayed" job={store.peek.delayed} />
		}

		return (
			<div>
				<h1>{this.props.name}</h1>

				<table className="pure-table pure-table-bordered" width="100%">
					<thead>
						<tr>
							<td>name</td>
							<td>urgent</td>
							<td>ready</td>
							<td>reserved</td>
							<td>buried</td>
							<td>total</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{st.name}</td>
							<td>{st['current-jobs-urgent']}</td>
							<td>{st['current-jobs-ready']}</td>
							<td>{st['current-jobs-reserved']}</td>
							<td>{st['current-jobs-buried']}</td>
							<td>{st['total-jobs']}</td>
						</tr>
					</tbody>
				</table>

				<div className="custom-button-row">
					{pause_resume}
					{showPutForm}
				</div>

				{ready}
				{buried}
				{delayed}

			</div>
		);
	}
};

export default Overview;

