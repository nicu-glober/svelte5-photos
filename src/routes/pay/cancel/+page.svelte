<script lang="ts">
	import firebaseService from '$lib/services/firebase';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	const orderId = $page.url.searchParams.get('orderId');

	if (browser) {
		firebaseService.updateOrder({ id: orderId || '', status: 'canceled' });
		localStorage.setItem('uuid', orderId || '');
	}
</script>

<div
	class="alert card w-full max-w-md border-[1px] p-4 border-surface-200-800 preset-filled-surface-100-900"
>
	<h3 class="h3">Ups...</h3>
	<p>Something went wrong with the payment!</p>
</div>

<style>
	.alert {
		margin: 50px auto;
		max-width: 1080px;
	}
</style>
