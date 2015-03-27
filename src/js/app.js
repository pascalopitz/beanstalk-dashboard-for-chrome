import React from 'react/addons';
import Application from './components/Application';
import coordinator from './coordinator';

React.render(
	React.createElement(Application, null),
	document.getElementById('root')
)