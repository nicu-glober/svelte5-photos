<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import firebaseService from '$lib/services/firebase';
	import { fade } from 'svelte/transition';
	import type { Photo } from '$lib/models';
	import {
		ChevronLeftIcon,
		ChevronRightIcon,
		FileDownIcon,
		PrinterIcon,
		XIcon
	} from 'lucide-svelte';

	interface Props {
		photo: Photo;
	}

	let { photo }: Props = $props();

	const dispatch = createEventDispatcher();
	let imgRef: HTMLImageElement;

	onMount(() => {
		onSwipe(imgRef, (direction: string) => {
			if (direction === 'left') {
				next();
			} else if (direction === 'right') {
				previous();
			}
		});
	});

	function previous() {
		dispatch('previous');
	}

	function next() {
		dispatch('next');
	}

	function closeModal() {
		dispatch('close');
	}

	function addToCart() {
		firebaseService.addToCart(photo);
	}

	function onSwipe(el: any, callback: (swipedir: any) => void) {
		var touchsurface = el,
			swipedir: string,
			startX: number,
			startY: number,
			distX,
			distY,
			threshold = 50, //required min distance traveled to be considered swipe
			restraint = 100, // maximum distance allowed at the same time in perpendicular direction
			allowedTime = 300, // maximum time allowed to travel that distance
			elapsedTime,
			startTime: number,
			handleswipe = callback || function (swipedir: any) {};

		touchsurface.addEventListener(
			'touchstart',
			function (e: { changedTouches: any[]; preventDefault: () => void }) {
				var touchobj = e.changedTouches[0];
				swipedir = 'none';
				// dist = 0;
				startX = touchobj.pageX;
				startY = touchobj.pageY;
				startTime = new Date().getTime(); // record time when finger first makes contact with surface
				e.preventDefault();
			},
			false
		);

		touchsurface.addEventListener(
			'touchmove',
			function (e: { preventDefault: () => void }) {
				e.preventDefault(); // prevent scrolling when inside DIV
			},
			false
		);

		touchsurface.addEventListener(
			'touchend',
			function (e: { changedTouches: any[]; preventDefault: () => void }) {
				var touchobj = e.changedTouches[0];
				distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
				distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
				elapsedTime = new Date().getTime() - startTime; // get time elapsed
				if (elapsedTime <= allowedTime) {
					// first condition for awipe met
					if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
						// 2nd condition for horizontal swipe met
						swipedir = distX < 0 ? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
					} else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
						// 2nd condition for vertical swipe met
						swipedir = distY < 0 ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
					}
				}
				handleswipe(swipedir);
				e.preventDefault();
			},
			false
		);
	}
</script>

<div class="photo-backdrop"></div>

<div class="photo-container" transition:fade>
	<div class="actions">
		<div></div>

		<div>
			<a href={photo?.url} type="button" class="btn preset-outlined" download>
				<FileDownIcon /> Download
			</a>

			<button type="button" class="btn preset-outlined" onclick={addToCart}>
				<PrinterIcon /> Add to your album
			</button>
		</div>

		<div>
			<button
				type="button"
				class="btn-icon preset-outlined"
				onclick={closeModal}
				aria-label="Close"
			>
				<XIcon />
			</button>
		</div>
	</div>

	<img bind:this={imgRef} src={photo?.url} alt="" />

	<div class="actions">
		<div></div>
		<div></div>
		<div>
			<button
				type="button"
				class="btn-icon preset-filled"
				onclick={previous}
				aria-label="Previous Photo"
			>
				<ChevronLeftIcon />
			</button>
			<button type="button" class="btn-icon preset-filled" onclick={next} aria-label="Next Photo">
				<ChevronRightIcon />
			</button>
		</div>
	</div>
</div>

<div class="variant-filled-surface card z-20 p-4" data-popup="popupHover">
	<p>
		If you like this photo, <br />
		<strong>we can print it for you</strong>
	</p>
	<div class="arrow variant-filled-surface"></div>
</div>

<style>
	.photo-backdrop {
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.9);
	}

	.photo-container {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 11;
	}

	.actions {
		display: flex;
		gap: 15px;
		margin: 25px;
		justify-content: space-between;
	}

	img {
		max-width: 95%;
		max-height: 80vh;
		margin: auto auto;
		border: 7px solid white;
		border-radius: 5px;
		box-shadow: 0 0 100px rgba(0, 0, 0, 0.2);
	}
</style>
