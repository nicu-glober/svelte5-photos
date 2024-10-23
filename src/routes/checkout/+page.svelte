<script lang="ts">
	import Summary from '$lib/components/Summary.svelte';
	import firebaseService from '$lib/services/firebase';
	import type { Order, Photo } from '$lib/models';
	import { xCart, xOrder } from '$lib/store';
	import { onMount } from 'svelte';

	let order: Order = $state($xOrder);
	let photos: Photo[] = $xCart;
	let paying = $state(false);

	onMount(() => {
		firebaseService.getOrder();
	});

	async function pay() {
		paying = true;
		firebaseService.updateOrder(order);

		fetch('/api/stripe/pay', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				photos,
				order
			})
		})
			.then(async (response) => {
				if (response.ok) {
					const { stripeSession } = await response.json();
					firebaseService.updateOrder({
						...order,
						stripe: stripeSession.url
					});
					window.location.replace(stripeSession.url);
				} else {
					console.error(response);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}

	function onInputChange(event: any, inputName: 'name' | 'address' | 'email_phone') {
		order[inputName] = event.target?.value;
		xOrder.set(order);
	}
</script>

<div class="container">
	<h2 class="h2">Where do we send the photos?</h2>

	<label class="label">
		<span class="label-text">Name*</span>
		<input
			class="input"
			type="text"
			placeholder="Complete Name"
			value={order?.name || ''}
			oninput={(event) => onInputChange(event, 'name')}
		/>
	</label>

	<label class="label">
		<span class="label-text">Address*</span>
		<input
			class="input"
			type="text"
			placeholder="Str, City, County, Country"
			value={order?.address || ''}
			oninput={(event) => onInputChange(event, 'address')}
		/>
	</label>

	<label class="label">
		<span class="label-text">Email/Phone*</span>
		<input
			class="input"
			type="text"
			placeholder="Email or phone for contact"
			value={order?.email_phone || ''}
			oninput={(event) => onInputChange(event, 'email_phone')}
		/>
	</label>

	<hr />

	<div class="flex flex-col items-center justify-between gap-5 md:flex-row">
		<Summary {photos} />

		<button
			type="button"
			class="btn preset-filled"
			disabled={!(order?.name && order?.address && order?.email_phone) || paying}
			onclick={pay}
		>
			{paying ? 'Printing...' : 'Pay'}
		</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		gap: 30px;
		padding: 30px;
		max-width: 1080px;
		font-size: larger;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
</style>
