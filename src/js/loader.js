import store from './store';
import events from './events';

class LoaderHelper {
	show(text: string) {
		store.loading = true;
		events.emit('rerender');
	}

	hide(text: string) {				
		store.loading = false;
		events.emit('rerender');
	}
}


export default new LoaderHelper;