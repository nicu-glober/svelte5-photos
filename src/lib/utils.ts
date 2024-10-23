import { browser } from '$app/environment';

export function getUuid() {
	if (!browser) {
		return null;
	}

	const uuid = localStorage.getItem('uuid');
	
	if (uuid) {
		return uuid;
	}

	const newUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;

		return v.toString(16);
	});

	localStorage.setItem('uuid', newUuid);

	return newUuid;
}
