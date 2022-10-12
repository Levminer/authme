<div class="transparent-900 loadSavedCodes m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Load saved codes</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Loading saved codes</h2>
				<h3>Load your saved 2FA codes. You can edit or delete your codes, or you can even add new codes here.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={loadSavedCodes}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					Confirm
				</button>
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 editSavedCodes m-auto my-20 hidden w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Edit saved codes</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Save changes</h2>
				<h3>Save the changes you made. This will overwrite your codes.</h3>
			</div>
			<div class="ml-10 flex gap-3">
				<button class="button" on:click={saveChanges}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" />
						<circle cx="12" cy="14" r="2" />
						<polyline points="14 4 14 8 8 8 8 4" />
					</svg>
					Save changes
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Revert changes</h2>
				<h3>You can revert the current changes you made.</h3>
			</div>
			<div class="ml-10 flex gap-3">
				<button class="button" on:click={revertChanges}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
						<path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
						<line x1="12" y1="9" x2="12" y2="12" />
						<line x1="12" y1="15" x2="12.01" y2="15" />
					</svg>
					Revert changes
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Delete codes</h2>
				<h3>You can delete all codes. Be careful, this can not be undone.</h3>
			</div>
			<div class="ml-10 flex gap-3">
				<button class="button" on:click={deleteCodes}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Delete codes
				</button>
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 loadedCodes m-auto mb-20 hidden w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Loaded codes</h1>
	<div class="content mx-auto flex flex-col items-center justify-center rounded-2xl p-10" />
</div>

<script lang="ts">
	import { deleteCodes, loadSavedCodes, revertChanges, saveChanges } from "./index"
</script>
