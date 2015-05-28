import store from './store';
import events from './events';

let nextId = 0;

function add(type: string, text: string) {

	let msg = {
		type: type,
		text: text,
		css: 'pure-alert pure-alert-' + type,
		id: nextId
	}

	store.messages.push(msg);

	window.setTimeout(() => {
		let idx = store.messages.indexOf(msg);

		if(idx > -1) {
			store.messages.splice(idx, 1);
			events.emit('rerender');
		}
	}, 3000);

	nextId++;
	events.emit('rerender');
}

class MessageHelper {
	info(text: string) {
		add('info', text);
	}

	success(text: string) {
		add('success', text);
	}

	error(text: string) {
		add('error', text);		
	}

	warning(text: string) {
		add('warning', text);
	}
}


export default new MessageHelper;