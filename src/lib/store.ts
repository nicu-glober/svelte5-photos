import type { Album, Order, Photo } from './models';
import type { Writable } from 'svelte/store';
import { getUuid } from './utils';
import { persisted } from 'svelte-persisted-store';

export const xAlbums: Writable<Album[]> = persisted('albums', []);

export const xOrder: Writable<Order> = persisted('order', {
	id: getUuid() || '',
	name: '',
	address: '',
	email_phone: ''
});

export const xCart: Writable<Photo[]> = persisted('cart', []);
