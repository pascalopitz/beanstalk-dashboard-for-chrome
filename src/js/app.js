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

import PutForm from './components/PutForm'; 

let ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

let routes = {
    '/'              : Overview,
    '/queue/:name'   : Details,
    '/settings'      : Settings
}

function render() {
	let loader, putForm, messages = [], 
		messageContainer, loaderContainer, putFormContainer;

	store.messages.forEach((m, idx) => {
		messages.push(<div className={m.css} key={m.id}>{m.text}</div>);
	});

	messageContainer =	<div className="custom-message-container">
							<ReactCSSTransitionGroup transitionName="fade" transitionAppear={true}>
								{messages}
							</ReactCSSTransitionGroup>
						</div>;

	if(store.loading) {
		loader = <div id="custom-loader"><i className="fa fa-spinner fa-spin"></i></div>
	}

	loaderContainer = 	<ReactCSSTransitionGroup transitionName="fade" transitionAppear={true}>
							{loader}
						</ReactCSSTransitionGroup>


	if(store.showPutForm) {
		putForm = <PutForm />;
	}

	putFormContainer = 	<ReactCSSTransitionGroup transitionName="fade" transitionAppear={true}>
							{putForm}
						</ReactCSSTransitionGroup>


	React.render(
		<div>
			{putFormContainer}
			{loaderContainer}
			{messageContainer}
			<Navigation routes={routes} store={store} />
			<Router routes={routes} store={store} />
		</div>,
		document.getElementById('root')
	);	
}

events.on('rerender', () => {
	render();
});

chrome.storage.local.get(Object.keys(store.settings), (settings) => {
	store.settings = Object.assign(store.settings, settings);
	coordinator.init();
	render();
});

