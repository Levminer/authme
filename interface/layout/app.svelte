<div class="flex h-screen">
	{#if $state.authenticated}
		<Navigation />
	{/if}

	<div class="w-full overflow-hidden overflow-y-scroll">
		<BuildNumber />

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
	import { Route, router } from "tinro"
	import { onMount } from "svelte"
	import { state } from "../stores/state"

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
		router.subscribe((data) => {
			console.log("Path changed:", data)

			document.querySelector(".top").scrollIntoView()
		})
	})
</script>
