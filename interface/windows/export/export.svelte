<div class="transparent-900 saveExportedCodes m-auto my-20 hidden w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">{language.export.exportCodes}</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.export.exportAuthmeFile}</h2>
				<h3>{language.export.exportAuthmeFileText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={exportAuthmeFile}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" /><path d="M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" /></svg>
					{language.export.exportFileButton}
				</button>
			</div>
		</div>

		<div class="transparent-800 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.export.exportHTMlFile}</h2>
				<h3>{language.export.exportHTMlFileText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={exportHtmlFile}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="m9 18 3-3-3-3" /><path d="m5 12-3 3 3 3" /></svg>
					{language.export.exportFileButton}
				</button>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { onMount } from "svelte"
	import { exportCodes, exportAuthmeFile, exportHtmlFile } from "./index"
	import { getLanguage } from "@utils/language"

	const language = getLanguage()

	onMount(() => {
		exportCodes()
	})
</script>
