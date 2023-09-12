<SwitchGroup as="div" class="flex items-center space-x-4">
	<SwitchLabel class="text-xl">{checked ? "On" : "Off"}</SwitchLabel>

	<Switch as="button" {checked} on:click on:change={(event) => (checked = event.detail)} class={({ checked }) => classNames("focus:shadow-outline relative inline-flex h-7 w-12 flex-shrink-0  cursor-pointer rounded-full border-2 border-white transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-4 focus-visible:ring-popup-magenta", checked ? "bg-white" : "bg-transparent")} let:checked>
		<span class={classNames("relative left-1 top-[4px] inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ", checked ? "translate-x-[21px] !bg-black" : "translate-x-0")} />
	</Switch>
</SwitchGroup>

<script lang="ts">
	import { Switch, SwitchGroup, SwitchLabel } from "@rgossiaux/svelte-headlessui"

	const classNames = (...classes: (string | false | null | undefined)[]) => {
		return classes.filter(Boolean).join(" ")
	}

	export let checked = false
</script>
