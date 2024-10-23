import type { StorageReference } from 'firebase/storage';

export type Album = {
	name: string;
	bucket: string;
	photoUrl: string;
};

export type Photo = {
	url: string;
	name: string;
	bucket: string;
	quantity?: number;
	ref?: StorageReference;
};

export type Order = {
	id: string;
	name?: string;
	address?: string;
	email_phone?: string;
	status?: string;
	stripe?: string;
	created_at?: Date;
	updated_at?: Date;
	photos?: Photo[];
};
