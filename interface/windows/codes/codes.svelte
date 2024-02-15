<div class="transparent-900 main m-auto my-20 w-3/5 rounded-2xl p-10 text-center sm:w-4/5">
	<h1>Authme</h1>
	<div class="searchContainer mx-auto mb-5 mt-10 hidden justify-center px-10">
		<div class="mx-auto flex items-center justify-center">
			<svg class="pointer-events-none relative left-9 h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
			<input on:keyup={search} spellcheck="false" class="search input w-96 pl-12 pr-12" type="text" />

			<div class="relative right-9 top-0.5">
				<SearchFilter />
			</div>
		</div>
	</div>

	<div class="content mx-auto flex flex-col flex-wrap items-center justify-center gap-10 rounded-2xl p-10 sm:w-full">
		<div class="importCodes transparent-800 hidden w-full max-w-2xl rounded-2xl p-5">
			<h2>{language.codes.importCodes}</h2>
			<h3>{language.codes.importCodesText}</h3>
			<div class="mx-auto mt-6 flex flex-row items-center justify-center gap-3 sm:flex-wrap">
				<button class="button" on:click={() => navigate("import")}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M2 15h10" /><path d="m9 18 3-3-3-3" /></svg>
					{language.codes.importCodesButton}
				</button>
			</div>
		</div>

		<div class="noSearchResults transparent-800 hidden w-full max-w-2xl rounded-2xl p-5">
			<h2>{language.codes.noSearchResultsFound}</h2>
			<h3>{language.codes.noSearchResultsFoundText} "<span class="searchResult" />".</h3>
		</div>
	</div>
</div>

<script lang="ts">
	import { onMount, onDestroy } from "svelte"
	import { stopCodesRefresher, search, loadCodes } from "./index"
	import { navigate } from "../../utils/navigate"
	import SearchFilter from "../../components/searchFilter.svelte"
	import { getLanguage } from "@utils/language"

	const language = getLanguage()

	onMount(() => {
		loadCodes()
	})

	onDestroy(() => {
		stopCodesRefresher()
	})
</script>
