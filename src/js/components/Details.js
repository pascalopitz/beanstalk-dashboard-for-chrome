import React from 'react/addons'; 

import store from '../store';
import events from '../events';

import ActionsMenuColumn from './ActionsMenuColumn';

class Overview extends React.Component {
	render () {
		return (
			<div>{this.props.name}</div>
		);
	}
};

export default Overview;

