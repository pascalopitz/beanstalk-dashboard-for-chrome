import React from 'react/addons'; 

import store from '../store';
import events from '../events';

class Settings extends React.Component {

	constructor (props) {
		super(props);
		this.state = {};
	}

	_noop () {
		return false;
	}

	_save () {
		events.emit('job-put', this.state);
		return false;
	}

	_cancel () {
		events.emit('putform-hide', this.state);
		return false;
	}

	render () {

		let fields = [];
		let keys = ['queue', 'data', 'priority', 'delay', 'ttr'];

		for (let k of keys) {

			let prefixed = 'form-' + k;

			if(!this.state[k]) {
				this.state[k] = store.putForm[k];
			}

			var valueLink = {
				value: this.state[k],
				requestChange: (newValue) => {

					let obj = {};
					obj[k] = newValue;

					this.setState(obj);
				}
			};

			if(k === 'data') {
				fields.push(
					<div className="pure-control-group">
						<label htmlFor={prefixed}>{k}</label>
						<textarea id={prefixed} valueLink={valueLink}></textarea>
	 				</div>
				);

			} else {
				fields.push(
					<div className="pure-control-group">
						<label htmlFor={prefixed}>{k}</label>
						<input id={prefixed} type="text" valueLink={valueLink} />
	 				</div>
				);				
			}
		};


		return (
			<div className="custom-put-form">
				<div className="pure-popover">
					<form className="pure-form pure-form-stacked" onSubmit={this._noop}>
						<fieldset>
							{fields}
							
							<div className="pure-controls custom-button-row">
								<button
									className="pure-button"
									onClick={this._cancel.bind(this)}>Cancel</button>
								<button
									className="pure-button pure-button-primary"
									onClick={this._save.bind(this)}>Save</button>
							</div>
						</fieldset>
					</form>
				</div>
			</div>
		);
	}
};

export default Settings;

