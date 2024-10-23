<script lang="ts">
	import firebaseService from '$lib/services/firebase';
	import { browser } from '$app/environment';
	import { xCart, xOrder } from '$lib/store';
	import { getUuid } from '$lib/utils';
	import { page } from '$app/stores';

	const orderId = $page.url.searchParams.get('orderId');

	if (browser) {
		firebaseService.updateOrder({ id: orderId || '', status: 'paid' });
		localStorage.removeItem('uuid');
		xOrder.set({
			id: getUuid() || ''
		});
		xCart.set([]);
	}
</script>

<div
	class="alert card w-full max-w-md border-[1px] p-4 border-surface-200-800 preset-filled-surface-100-900"
>
	<h3 class="h3">Success</h3>
	<p>The order has been registered successfully!</p>
</div>

<style>
	.alert {
		margin: 50px auto;
		max-width: 1080px;
	}
</style>
