// needs to be required before other stuff
import _ from "babel/polyfill";

import React from 'react/addons';
import Router from 'tiny-react-router'

import coordinator from './coordinator';
import store from './store';
import events from './events';

import Navigation from './components/Navigation'; 
import Settings from './components/Settings'; 
import Overview from './components/Overview'; 
import Details from './components/Details'; 


let routes = {
    '/'              : Overview,
    '/queue/:name'   : Details,
    '/settings'      : Settings
}

function render() {
	let loader;

	if(store.loading) {
		loader = <div id="custom-loader"><i className="fa fa-spinner fa-spin"></i></div>
	}

	React.render(
		<div>
			{loader}
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