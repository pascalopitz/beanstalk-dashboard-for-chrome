import React from 'react/addons'; 
import events from '../events';

class ActionsMenu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	render () {

		let menu;

		if(this.state.open) {
			menu = (
					<div className="pure-menu">

					<ul className="pure-menu-list">
						<li className="pure-menu-item">
							<a onClick={this._emptyQueue.bind(this)} className="pure-menu-link">Empty</a>
						</li>
					</ul>
				</div>
			);
		}

		return (
			<div className="custom-actions-menu">
				<a onClick={this._toggleMenu.bind(this)} className="pure-button">Actions</a>
				{menu}
			</div>
		);
	}

	_toggleMenu () {
		this.setState({
			open: !this.state.open
		});
	}

	_emptyQueue () {
		events.emit('empty-queue', this.props.queue);
	}
};

export default ActionsMenu;

