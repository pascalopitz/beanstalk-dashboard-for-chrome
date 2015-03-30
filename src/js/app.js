// needs to be required before other stuff
import _ from "babel/polyfill";

import React from 'react/addons';
import Router from 'tiny-react-router'

import coordinator from './coordinator';
import store from './store';
import events from './events';

import Navigation from './components/Navigation'; 
import Settings from './components/Settings'; 
import Server from './components/Server'; 


let routes = {
    '/'         : Server,
    '/settings' : Settings
}

function render() {
	React.render(
		<div>
			<Navigation routes={routes} store={store} />		
			<Router routes={routes} store={store} />
		</div>,
		document.getElementById('root')
	);	
}

events.on('rerender', () => {
	render();
});

coordinator.init();

render();