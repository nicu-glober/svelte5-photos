<script lang="ts">
	import type { Album } from '$lib/models';
	import { xAlbums } from '$lib/store';

	let albums = $xAlbums;

	xAlbums.subscribe((storeAlbums: Album[]) => {
		albums = storeAlbums;
	});
</script>

<div class="container h-full mx-auto my-9 flex justify-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h1 class="h1">Albums</h1>

		<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{#each albums as album}
				<a href="/albums/{album.bucket}">
					<img class="thumbnail" src={album?.photoUrl} alt="" />
					<h2 class="h2">{album?.name}</h2>
				</a>
			{/each}
		</section>
	</div>
</div>

<style lang="postcss">
	.thumbnail {
		width: 300px;
		height: 300px;
		object-fit: cover;
		transform: scale(1);
		transition: 0.3s;
		border-radius: 10px;
		margin: 0 auto;

		&:hover {
			transform: scale(1.05);
			transition: 0.3s;
		}
	}
</style>
