<script lang="ts">
	import { shippingPrice, pricePerPhoto, freeShippingOver } from '$lib/constants';
	import type { Photo } from '$lib/models';

	interface Props {
		photos: Photo[];
	}

	let { photos }: Props = $props();

	let noOfPhotos = $derived(
		photos.reduce((acc: number, photo: Photo) => acc + (photo?.quantity ? photo?.quantity : 1), 0)
	);

	let finalShippingPrice = $derived(
		noOfPhotos * pricePerPhoto >= freeShippingOver ? 0 : shippingPrice
	);
</script>

{#if photos.length}
	<div class="flex flex-col gap-2">
		<p>
			No of photos: {noOfPhotos}
		</p>

		<p>Shipping Price: {finalShippingPrice} €</p>

		<p>
			<strong>
				Total: {noOfPhotos * pricePerPhoto + finalShippingPrice} €
			</strong>
		</p>
	</div>
{:else}
	<section class="placeholders">
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
		<div class="placeholder animate-pulse"></div>
	</section>
{/if}

<style>
	.placeholders {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.placeholder {
		height: 20px;
		width: 160px;
	}
</style>
