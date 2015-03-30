import React from 'react/addons'; 
import events from '../events';

class ActionsMenuColumn extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
	}

	_addItem () {
		
	}

	_toggleMenu () {
		this.setState({
			open: !this.state.open
		});
	}

	_emptyQueue () {
		events.emit('empty-queue', this.props.queue);
	}

	render () {

		let menu;

		if(this.state.open) {
			menu = (
				<div className="pure-menu custom-actions-menu">
					<ul className="pure-menu-list">
						<li className="pure-menu-item">
							<a onClick={this._emptyQueue.bind(this)} className="pure-menu-link">
								<i className="fa fa-trash-o"></i>
								<span>Empty</span>
							</a>
						</li>
						<li className="pure-menu-item">
							<a onClick={this._addItem.bind(this)} className="pure-menu-link">
								<i className="fa fa-plus"></i>
								<span>Add Item</span>
							</a>
						</li>
					</ul>
				</div>
			);
		}

		return (
			<td className="custom-actions">
				<div className="custom-actions-inner">
					<a onClick={this._toggleMenu.bind(this)} className="pure-button">Actions</a>
					{menu}
				</div>
			</td>
		);
	}
};

export default ActionsMenuColumn;

