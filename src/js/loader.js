import store from './store';
import events from './events';

class LoaderHelper {
	show(text) {
		store.loading = true;
		events.emit('rerender');
	}

	hide(text) {				
		store.loading = false;
		events.emit('rerender');
	}
}


export default new LoaderHelper;