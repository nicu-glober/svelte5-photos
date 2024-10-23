import { pricePerPhoto, shippingPrice, freeShippingOver } from '$lib/constants.js';
import type { Photo } from '$lib/models.js';
import Stripe from 'stripe';
import {
	SECRET_STRIPE_KEY,
	SECRET_APP_URL,
	SECRET_STRIPE_SHIPPING_COURIER,
	SECRET_STRIPE_SHIPPING_FREE
} from '$env/static/private';

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST({ request }) {
	const { photos, order } = await request.json();

	const noOfPhotos = photos.reduce(
		(acc: number, photo: Photo) => acc + (photo?.quantity ? photo?.quantity : 1),
		0
	);
	const finalShippingPrice = noOfPhotos * pricePerPhoto >= freeShippingOver ? 0 : shippingPrice;

	const lineItems = photos.map((photo: Photo) => {
		return {
			price_data: {
				currency: 'ron',
				product_data: {
					name: photo.name
				},
				unit_amount: pricePerPhoto * 100
			},
			quantity: photo.quantity
		};
	});

	const session = await stripe.checkout.sessions.create({
		metadata: {
			uuid: order.id,
			name: order.name,
			email_phone: order.email_phone,
			address: order.address
		},
		client_reference_id: order.id,
		line_items: lineItems,
		shipping_options: [
			{
				shipping_rate:
					finalShippingPrice === 0 ? SECRET_STRIPE_SHIPPING_FREE : SECRET_STRIPE_SHIPPING_COURIER
			}
		],
		mode: 'payment',
		success_url: `${SECRET_APP_URL}/pay/success?orderId=${order.id}`,
		cancel_url: `${SECRET_APP_URL}/pay/cancel?orderId=${order.id}`,
		invoice_creation: {
			enabled: true
		}
	});

	return new Response(
		JSON.stringify({
			stripeSession: session
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
}
