<div class="transparent-900 loadedCodes m-auto my-20 hidden w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Edit codes</h1>
	<div class="content mx-auto flex flex-col items-center justify-center rounded-2xl p-10" />
</div>

<script lang="ts">
	import { onMount } from "svelte"
	import { loadSavedCodes } from "./index"

	onMount(() => {
		loadSavedCodes()
	})
</script>
