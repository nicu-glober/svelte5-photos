<script lang="ts">
	import firebaseService from '$lib/services/firebase';
	import { ShoppingCartIcon } from 'lucide-svelte';
	import { xCart } from '$lib/store';
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		firebaseService.getAlbums();
		firebaseService.getOrder();
		firebaseService.getCart();
	});
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<header class="flex justify-between p-4">
		<div>
			<a href="/"> Svelte 5 Photos </a>
		</div>

		<div class="relative inline-block">
			{#if $xCart.length > 0}
				<span class="chip-icon absolute -left-2 -top-2 z-10 preset-filled">{$xCart.length}</span>
			{/if}
			<a class="variant-ghost-surface btn btn-sm" href="/cart">
				<ShoppingCartIcon /> &nbsp; Your album
			</a>
		</div>
	</header>

	<main>
		<slot />
	</main>

	<footer>
		<hr />
		<div class="m-5 flex flex-col items-center justify-between gap-2 md:flex-row">
			<a href="https://www.globant.com/"> © Globant</a>
		</div>
	</footer>
</div>
