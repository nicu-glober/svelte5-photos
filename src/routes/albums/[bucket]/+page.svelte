<script lang="ts">
	import firebaseService from '$lib/services/firebase';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { Photo } from '$lib/models';
	import PhotoComponent from '$lib/components/Photo.svelte';

	const bucket = $page.params.bucket.split('_').join('/');
	let photos: Photo[] = $state([]);
	let currentPhoto: Photo | null = $state(null);

	onMount(async () => {
		photos = await firebaseService.getPhotosFromBucket(bucket);
	});

	function showPhoto(photo: Photo) {
		currentPhoto = photo;
	}

	function onPrevious() {
		if (!currentPhoto) {
			currentPhoto = photos[0];
		}

		const index = photos.findIndex((p) => p.url === currentPhoto?.url);

		if (index > 0) {
			currentPhoto = photos[index - 1];
		}

		if (index === 0) {
			currentPhoto = photos[photos.length - 1];
		}
	}

	function onNext() {
		if (!currentPhoto) {
			currentPhoto = photos[0];
		}

		const index = photos.findIndex((p) => p.url === currentPhoto?.url);

		if (index < photos.length - 1) {
			currentPhoto = photos[index + 1];
		}

		if (index === photos.length - 1) {
			currentPhoto = photos[0];
		}
	}

	function onKeyUp(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
				onPrevious();
				break;

			case 'ArrowRight':
				onNext();
				break;

			case 'Escape':
				currentPhoto = null;
				break;
		}
	}
</script>

<svelte:window on:keyup={onKeyUp} />

<div class="container mx-auto my-8 flex h-full justify-center">
	<div class="flex flex-col items-center space-y-10 text-center">
		<h1 class="h1">
			{$page.params.bucket.split('-').join(' ').split('_').join(' - ').toUpperCase()}
		</h1>

		<section class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{#if photos.length === 0}
				<div class="thumbnail placeholder animate-pulse"></div>
				<div class="thumbnail placeholder animate-pulse"></div>
				<div class="thumbnail placeholder animate-pulse"></div>
				<div class="thumbnail placeholder animate-pulse"></div>
				<div class="thumbnail placeholder animate-pulse"></div>
				<div class="thumbnail placeholder animate-pulse"></div>
				<div class="thumbnail placeholder animate-pulse"></div>
				<div class="thumbnail placeholder animate-pulse"></div>
			{/if}
			{#each photos as photo}
				<button onclick={() => showPhoto(photo)}>
					<img class="thumbnail h-auto max-w-full rounded-lg" src={photo?.url} alt="" />
					<p>{photo?.name}</p>
				</button>
			{/each}
		</section>
	</div>
</div>

{#if currentPhoto}
	<PhotoComponent
		photo={currentPhoto}
		on:close={() => (currentPhoto = null)}
		on:previous={onPrevious}
		on:next={onNext}
	/>
{/if}

<style lang="postcss">
	.thumbnail {
		width: 300px;
		height: 300px;
		object-fit: cover;
		transform: scale(1);
		transition: 0.3s;
		border-radius: 10px;

		&:hover {
			transform: scale(1.05);
			transition: 0.3s;
		}
	}
</style>
