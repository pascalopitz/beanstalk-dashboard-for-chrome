import React from 'react/addons'; 

import store from '../store';
import events from '../events';

class Settings extends React.Component {

	constructor (props) {
		super(props);
		this.state = {};
	}

	_save () {
		events.emit('update-settings-start');
		events.emit('update-settings-save', this.state);
		events.emit('update-settings-finish');
		return false;
	}

	_noop () {
		return false;
	}

	render () {

		let fields = [];
		let keys = Object.keys(store.settings);

		for (let k of keys) {

			let prefixed = 'form-' + k;

			var valueLink = {
				value: this.state[k] || store.settings[k],
				requestChange: (newValue) => {

					let obj = {};
					obj[k] = newValue;

					this.setState(obj);
				}
			};

			fields.push(
				<div className="pure-control-group">
					<label htmlFor={prefixed}>{k}</label>
					<input id={prefixed} type="text" valueLink={valueLink} />
 				</div>
			);
		};

		return (
			<div>
				<h1>Settings</h1>
				<form className="pure-form pure-form-aligned" onSubmit={this._noop}>
					<fieldset>
						{fields}

						<div className="pure-controls">
							<button
								className="pure-button pure-button-primary"
								onClick={this._save.bind(this)}>Save</button>
						</div>
					</fieldset>
				</form>
			</div>
		);
	}
};

export default Settings;

