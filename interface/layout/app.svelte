<div class="flex h-screen">
	{#if $state.authenticated}
		<Navigation />
	{/if}

	<div class="w-full overflow-hidden overflow-y-scroll">
		{#if number.startsWith("alpha") || number.startsWith("beta")}
			<BuildNumber />
		{/if}

		{#if $state.updateAvailable}
			<UpdateAlert />
		{/if}

		<div class="top" />

		<RouteTransition>
			<Route path="/"><Landing /></Route>
			<Route path="/confirm"><Confirm /></Route>

			<Route path="/codes"><Codes /></Route>
			<Route path="/import"><Import /></Route>
			<Route path="/export"><Export /></Route>
			<Route path="/edit"><Edit /></Route>
			<Route path="/settings"><Settings /></Route>

			<Route path="/idle"><div /></Route>
		</RouteTransition>
	</div>
</div>

<script lang="ts">
	import { Route, router } from "@baileyherbert/tinro"
	import { onMount } from "svelte"
	import { state } from "../stores/state"
	import { number, version } from "../../build.json"
	import logger from "interface/utils/logger"

	import UpdateAlert from "../components/updateAlert.svelte"
	import BuildNumber from "../components/buildNumber.svelte"
	import RouteTransition from "../components/routeTransition.svelte"

	import Landing from "../windows/landing/landing.svelte"
	import Codes from "../windows/codes/codes.svelte"
	import Settings from "../windows/settings/settings.svelte"
	import Import from "../windows/import/import.svelte"
	import Export from "../windows/export/export.svelte"
	import Confirm from "../windows/confirm/confirm.svelte"
	import Navigation from "../components/navigation.svelte"
	import Edit from "../windows/edit/edit.svelte"

	onMount(() => {
		// Debug info
		logger.log(`Authme ${version} ${number}`)

		// Listen for router events
		router.subscribe((data) => {
			logger.log(`Path changed: ${data.path}`)

			document.querySelector(".top").scrollIntoView()
		})

		// Listen for errors
		window.addEventListener("unhandledrejection", (error) => {
			logger.error(`Unknown runtime error occurred: ${error.reason}`)
		})
	})
</script>
