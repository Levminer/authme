<script lang="ts">
	import build from "../../../../../build.json"
	import { settings } from "../../../../../interface/stores/settings"
	import Toggle from "../../../../../interface/components/toggle.svelte"

	const about = () => {
		alert(
			`Authme: ${build.version} \n\nRelease date: ${build.date} \nBuild number: ${build.number} \n\nCreated by: Lőrik Levente`,
		)
	}
</script>

<div class="flex flex-col my-20 justify-center items-start space-y-10">
	<div class="transparent-900 p-5 rounded-xl m-auto w-[95%] lg:w-2/3">
		<div class="flex flex-col justify-start items-start">
			<h1 class="text-2xl">About Authme</h1>
			<h2 class="text-xl text-gray-200">Information about your Authme build and your computer.</h2>
			<button class="button mt-3" on:click={about}>About</button>
		</div>
	</div>

	<div class="transparent-900 p-5 rounded-xl m-auto w-[95%] lg:w-2/3">
		<div class="flex flex-col justify-start items-start">
			<h1 class="text-2xl">Codes description</h1>
			<h2 class="text-xl text-gray-200">2FA code descriptions will be visible.</h2>
			<div class="mt-3">
				<Toggle bind:checked={$settings.settings.codesDescription} />
			</div>
		</div>
	</div>
</div>
