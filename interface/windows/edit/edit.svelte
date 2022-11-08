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
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
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
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
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
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
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
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
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
