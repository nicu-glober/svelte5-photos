<script lang="ts">
	import { PrinterCheckIcon, TrashIcon } from 'lucide-svelte';
	import Summary from '$lib/components/Summary.svelte';
	import firebaseService from '$lib/services/firebase';
	import type { Order, Photo } from '$lib/models';
	import { pricePerPhoto } from '$lib/constants';
	import { xCart, xOrder } from '$lib/store';

	let photos: Photo[] | null = null;
	let order: Order = $xOrder;

	xCart.subscribe((xPhotos) => {
		photos = xPhotos;
	});

	function updateQuantity(photo: Photo, value: any) {
		firebaseService.updateQuantity(photo, +value);
	}

	function removeFromCart(photo: Photo) {
		firebaseService.removeFromCart(photo);
	}

	function onQuantityChange(event: any, photo: Photo) {
		updateQuantity(photo, event.target?.value);
	}
</script>

<div class="container">
	<div class="flex items-center justify-between">
		<h2 class="h2">Photos to print</h2>
	</div>

	{#if photos === null}
		<div class="placeholder animate-pulse"></div>
		<hr />
		<div class="placeholder animate-pulse"></div>
		<hr />
		<div class="placeholder animate-pulse"></div>
	{/if}

	{#if photos !== null && photos.length === 0}
		<div class="flex items-center justify-between">
			<p>There are no photos in your album</p>
		</div>
	{/if}

	{#each photos || [] as photo}
		<hr />
		<div class="product">
			<img class="thumbnail" src={photo?.url} alt="" />
			<div class="product-actions">
				<label class="label">
					<span>No of photos</span>
					<input
						class="input"
						type="number"
						min="1"
						step="1"
						placeholder="Quantity"
						value={photo?.quantity}
						onchange={(event) => onQuantityChange(event, photo)}
					/>
				</label>

				<p class="flex items-center gap-3">
					Price: {pricePerPhoto * (photo?.quantity ? photo?.quantity : 1)} €
				</p>

				<p class="flex items-center gap-3">
					Remove from cart
					<button
						type="button"
						class="btn-icon preset-outlined-error-500"
						onclick={() => removeFromCart(photo)}
						aria-label="Remove from cart"
					>
						<TrashIcon />
					</button>
				</p>
			</div>
		</div>
	{/each}

	<hr />

	{#if photos && photos.length > 0}
		<div class="flex flex-col items-center justify-between gap-5 md:flex-row">
			<Summary {photos} />

			<a href="/checkout" type="button" class="btn preset-filled">
				Send to print &nbsp;
				<PrinterCheckIcon />
			</a>
		</div>
	{/if}
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

	.product {
		display: flex;
		gap: 30px;
	}

	.product-actions {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		gap: 10px;
	}

	input {
		max-width: 70px;
	}

	.thumbnail,
	.placeholder {
		width: 130px;
		height: 130px;
		object-fit: cover;
		border-radius: 10px;
	}
</style>
