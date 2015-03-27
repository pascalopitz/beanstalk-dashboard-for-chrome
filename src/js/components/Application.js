import React from 'react/addons'; 

import Settings from './Settings'; 
import Server from './Server'; 

class Application extends React.Component {
	render () {
		return (
			<div>
				<Settings  {...this._props} />
				<Server {...this._props} />
			</div>
		);
	}
}

export default Application;

