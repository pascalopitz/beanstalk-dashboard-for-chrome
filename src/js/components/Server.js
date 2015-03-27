import React from 'react/addons'; 

class Server extends React.Component {
	render () {

		console.log(this._props);

		var rows = [];

		return (
			<table>
				{rows}
			</table>
		);
	}
};

export default Server;

