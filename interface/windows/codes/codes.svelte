<div class="transparent-900 main m-auto my-20 w-3/5 rounded-2xl p-10 text-center sm:w-4/5">
	<h1>Authme</h1>
	<div class="searchContainer mx-auto mt-10 mb-5 hidden justify-center px-10">
		<div class="mx-auto flex items-center justify-center">
			<svg id="searchIcon" xmlns="http://www.w3.org/2000/svg" class="pointer-events-none relative left-9 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>

			<input on:keyup={search} spellcheck="false" class="search input w-96 pl-12 pr-12" type="text" />

			<div class="relative right-9 top-0.5">
				<SearchFilter />
			</div>
		</div>
	</div>

	<div class="content mx-auto flex flex-col flex-wrap items-center justify-center gap-10 rounded-2xl p-10 sm:w-full">
		<div class="importCodes transparent-800 hidden w-full max-w-2xl rounded-2xl p-5">
			<h2>Import your codes</h2>
			<h3>Import your existing 2FA codes, or choose your Authme import file if you already have one.</h3>
			<div class="mx-auto mt-6 flex flex-row items-center justify-center gap-3 sm:flex-wrap">
				<button class="button" on:click={() => navigate("import")}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M2 15h10" /><path d="m9 18 3-3-3-3" /></svg>
					Import codes
				</button>
				<button class="button" on:click={chooseImportFile}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3" /><polyline points="14 2 14 8 20 8" /><path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="m9 18-1.5-1.5" /></svg>
					Choose file
				</button>
			</div>
		</div>

		<div class="gettingStarted transparent-800 hidden w-full max-w-2xl rounded-2xl p-5">
			<h2>Getting started</h2>
			<h3>In the mean time you can check out the settings or visit the GitHub page.</h3>
			<div class="mx-auto mt-6 flex flex-row items-center justify-center gap-3 sm:flex-wrap">
				<button class="button" on:click={() => navigate("settings")}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
					Settings
				</button>
				<button class="button" on:click={() => open("https://github.com/levminer/authme")}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
					GitHub
				</button>
			</div>
		</div>

		<div class="noSearchResults transparent-800 hidden w-full max-w-2xl rounded-2xl p-5">
			<h2>No search results found.</h2>
			<h3>Not found search results for "<span class="searchResult" />".</h3>
		</div>
	</div>
</div>

<script lang="ts">
	import { onMount, onDestroy } from "svelte"
	import { stopCodesRefresher, search, chooseImportFile, loadCodes } from "./index"
	import { navigate, open } from "../../utils/navigate"
	import SearchFilter from "../../components/searchFilter.svelte"

	onMount(() => {
		loadCodes()
	})

	onDestroy(() => {
		stopCodesRefresher()
	})
</script>
