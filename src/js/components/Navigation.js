import React from 'react/addons'; 

class Navigation extends React.Component {
	render () {
		return (
			<div className="pure-menu pure-menu-horizontal">

				<span className="pure-menu-heading"><img src="./img/icon_48.png" /></span>

				<ul className="pure-menu-list">
					<li className="pure-menu-item">
						<a href="#/" className="pure-menu-link">Home</a>
					</li>
					<li className="pure-menu-item">
						<a href="#/settings" className="pure-menu-link">Settings</a>
					</li>
				</ul>
			</div>
		);
	}
};

export default Navigation;
