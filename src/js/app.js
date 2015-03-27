import React from 'react/addons';
import Application from './components/Application';
import coordinator from './coordinator';
import store from './store';

React.render(
	React.createElement(Application, store),
	document.getElementById('root')
);

coordinator.init();