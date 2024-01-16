<div class="updateAlert z-10 w-full bg-popup-blue">
	<div class="container mx-auto flex items-center justify-between px-6 py-4">
		<div class="flex items-center justify-center gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
			</svg>

			<p class="updateText mx-1 text-lg font-bold">New Authme update available! Click install to download and install the update.</p>

			<button type="button" class="installUpdate smallButton" on:click={installUpdate}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
				</svg>
				<span>Install</span>
			</button>

			<button type="button" class="smallButton" on:click={showReleaseNotes}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
				</svg>
				<span>Release notes</span>
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
	import { installUpdate, showReleaseNotes } from "interface/utils/update"

	const hidePopup = () => {
		document.querySelector(".updateAlert").style.display = "none"
	}
</script>
