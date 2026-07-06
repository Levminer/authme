<div class="sponsorAlert z-10 hidden w-full bg-popup-magenta">
	<div class="container mx-auto flex items-center justify-between px-6 py-4">
		<div class="flex items-center justify-center gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>

			<p class="updateText mx-1 text-lg font-bold">Authme is a free and open source project. To keep Authme free forever please consider supporting the project by donating.</p>

			<button type="button" class="installUpdate smallButton" on:click={sponsor}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
				<span>Sponsor</span>
			</button>
		</div>

		<button class="updateClose transform duration-200 hover:text-black" on:click={hidePopup}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
</div>

<script>
	import { settings } from "@stores/settings"
	import { open } from "@utils/navigate"
	import { onMount } from "svelte"

	/*
	onMount(() => {
		if ($settings.banners.sponsor === null) {
			$settings.banners.sponsor = new Date()
		}

		// check if sponsor is older than 30 days
		if ($settings.banners.sponsor !== null) {
			const date = new Date($settings.banners.sponsor)
			const now = new Date()

			if (now.getTime() - date.getTime() > 30 * 24 * 60 * 60 * 1000) {
				document.querySelector(".sponsorAlert").style.display = "block"
			}
		}
	})
	*/

	const sponsor = () => {
		open("https://github.com/sponsors/Levminer?frequency=recurring")
	}

	const hidePopup = () => {
		document.querySelector(".sponsorAlert").style.display = "none"

		$settings.banners.sponsor = new Date()
	}
</script>
