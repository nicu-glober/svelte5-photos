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

<aside class="alert variant-ghost-error">
	<div class="alert-message">
		<h3 class="h3">Ups...</h3>
		<p>Something went wrong with the payment!</p>
	</div>
</aside>

<style>
	.alert {
		margin: 50px auto;
		max-width: 1080px;
	}
</style>
