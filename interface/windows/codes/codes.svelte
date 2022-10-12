<div class="transparent-900 main m-auto my-20 w-3/5 rounded-2xl p-10 text-center sm:w-4/5">
	<h1>Authme</h1>
	<div class="searchContainer mx-auto mt-10 mb-5 hidden justify-center px-10">
		<div class="mx-auto flex items-center justify-center">
			<svg id="searchIcon" xmlns="http://www.w3.org/2000/svg" class="pointer-events-none relative left-9 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>

			<input on:keyup={search} class="search input w-96 pl-12 pr-12" type="text" />

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
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
					</svg>
					Import codes
				</button>
				<button class="button" on:click={chooseImportFile}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
					</svg>
					Choose file
				</button>
			</div>
		</div>

		<div class="gettingStarted transparent-800 hidden w-full max-w-2xl rounded-2xl p-5">
			<h2>Getting started</h2>
			<h3>In the mean time you can check out the settings or visit the GitHub page.</h3>
			<div class="mx-auto mt-6 flex flex-row items-center justify-center gap-3 sm:flex-wrap">
				<button class="button" on:click={() => navigate("settings")}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
					Settings
				</button>
				<button class="button" on:click={() => open("https://github.com/levminer/authme")}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
					</svg>
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
