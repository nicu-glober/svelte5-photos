import { getDownloadURL, getStorage, listAll, ref } from 'firebase/storage';
import type { Album, Order, Photo } from '$lib/models';
import { xCart, xAlbums, xOrder } from '$lib/store';
import { initializeApp } from 'firebase/app';
import { getUuid } from '$lib/utils';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	serverTimestamp,
	setDoc,
	updateDoc
} from 'firebase/firestore';
import { env } from '$env/dynamic/public';

class FirebaseService {
	private static instance: FirebaseService;
	private storage;
	private db;

	private constructor() {
		const firebaseConfig = {
			apiKey: env.PUBLIC_FIREBASE_API_KEY,
			authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN,
			projectId: env.PUBLIC_FIREBASE_PROJECT_ID,
			storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET,
			messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			appId: env.PUBLIC_FIREBASE_APP_ID,
			measurementId: env.PUBLIC_FIREBASE_MEASUREMENT_ID
		};

		// Initialize Firebase
		const firebaseApp = initializeApp(firebaseConfig);
		this.storage = getStorage(firebaseApp, `gs://${env.PUBLIC_FIREBASE_STORAGE_BUCKET}`);
		this.db = getFirestore(firebaseApp);
	}

	public static getInstance(): FirebaseService {
		if (!FirebaseService.instance) {
			FirebaseService.instance = new FirebaseService();
		}

		return FirebaseService.instance;
	}

	public async getPhotosFromBucket(bucket: string) {
		const listRef = ref(this.storage, bucket);
		const res = await listAll(listRef);
		const photos: Photo[] = [];

		await Promise.all(
			res.items.map(async (photoRef, index) => {
				const url = await getDownloadURL(photoRef);
				photos[index] = {
					url,
					name: photoRef ? photoRef.name : 'unknown',
					bucket,
					ref: photoRef
				};
			})
		);

		return photos;
	}

	public async getAlbums() {
		const albumsRef = collection(this.db, 'albums');
		const albumsSnap = await getDocs(albumsRef);
		const albums = albumsSnap.docs.map((doc) => doc.data() as Album);

		xAlbums.set(albums);

		return albums;
	}

	public async addToCart(photo: Photo) {
		const uuid = getUuid();

		if (!uuid) {
			return;
		}

		const orderRef = doc(this.db, 'orders', uuid);
		const orderSnap = await getDoc(orderRef);

		if (!orderSnap.exists()) {
			await setDoc(
				orderRef,
				{
					id: uuid,
					status: 'new',
					created_at: serverTimestamp()
				},
				{ merge: true }
			);
		}

		await setDoc(doc(orderRef, 'photos', photo.name), {
			name: photo.name,
			bucket: photo.bucket,
			url: photo.url,
			quantity: photo.quantity || 1,
			updated_at: serverTimestamp()
		});

		return await this.getCart();
	}

	public async updateQuantity(photo: Photo, quantity: number) {
		const uuid = getUuid();

		if (!uuid) {
			return;
		}

		const photoRef = doc(this.db, 'orders', uuid, 'photos', photo.name);

		await updateDoc(photoRef, { quantity });

		return await this.getCart();
	}

	public async removeFromCart(photo: Photo) {
		const uuid = getUuid();

		if (!uuid) {
			return;
		}

		const photoRef = doc(this.db, 'orders', uuid, 'photos', photo.name);
		await deleteDoc(photoRef);

		return await this.getCart();
	}

	public async getCart(): Promise<Photo[]> {
		const uuid = getUuid();

		if (!uuid) {
			return [];
		}

		const photosRef = collection(this.db, 'orders', uuid, 'photos');
		const photosSnap = await getDocs(photosRef);
		const photos = photosSnap.docs.map((doc) => doc.data() as Photo);

		xCart.set(photos);

		return photos;
	}

	public async getOrder() {
		const uuid = getUuid();

		if (!uuid) {
			return [];
		}

		const orderRef = doc(this.db, 'orders', uuid);
		const orderSnap = await getDoc(orderRef);
		const order = orderSnap.data() as Order;

		if (order) {
			xOrder.set(order);
		}

		return order;
	}

	public async updateOrder(order: Order) {
		const orderRef = doc(this.db, 'orders', order.id);
		await updateDoc(orderRef, { ...order, updated_at: serverTimestamp() });
		this.getOrder();
	}
}

const firebaseService = FirebaseService.getInstance();
export default firebaseService;
