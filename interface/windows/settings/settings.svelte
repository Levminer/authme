<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">General</h1>

	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Launch on startup</h2>
				<h3>Start Authme after your computer started. Authme will start on the system tray.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.launchOnStartup} on:click={launchOnStartup} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Minimize to tray</h2>
				<h3>When closing the app Authme will not quit. You can open Authme from the system tray.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.minimizeToTray} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Optional analytics</h2>
				<h3>Send optional analytics, the sent data is completely anonymous. This includes your Authme version and your OS version.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.optionalAnalytics} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Clear data</h2>
				<h3>Clear password, 2FA codes and all other settings. Be careful.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={clearData}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Clear data
				</button>
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Codes</h1>

	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Codes description</h2>
				<h3>The saved codes description will be visible. You can copy it after clicking it.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.codesDescription} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Blur codes</h2>
				<h3>Blur the saved codes. You can still copy the codes or hover over the codes to show them.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.blurCodes} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Codes layout</h2>
				<h3>You can choose your preferred layout. Grid displays more items and adapts to the screen size.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Select options={["Grid", "List"]} setting={"codesLayout"} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Sort codes</h2>
				<h3>You can choose how to sort the codes. By default codes are sorted by importing order.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Select options={["Default", "A-Z", "Z-A"]} setting={"sortCodes"} />
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10 pb-10">Shortcuts</h1>

	{#each shortcuts as { id, name }, i}
		<div class="mx-auto flex flex-col items-center justify-center rounded-2xl px-10">
			<div class="edit">
				<div class="flex flex-wrap gap-3">
					<div>
						<h5>{name}</h5>
						<input id="shortcut{i}" bind:value={$settings.shortcuts[id]} readonly class="input mt-1" type="text" />
					</div>
				</div>
				<div class="ml-10 flex flex-wrap gap-3 sm:mt-10 sm:ml-0 sm:w-full">
					<button on:click={() => editShortcut(i)} id="editShortcut{i}" class="button">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
						</svg>
						Edit
					</button>
					<button on:click={() => resetShortcut(i)} id="resetShortcut{i}" class="button">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						Reset
					</button>
					<button on:click={() => deleteShortcut(i)} id="deleteShortcut{i}" class="button">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
						Delete
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>

<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">About</h1>

	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Licenses</h2>
				<h3>Authme is an open source software. You can view the licenses.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button
					class="button"
					on:click={() => {
						open("https://authme.levminer.com/licenses")
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<circle cx="12" cy="12" r="9" />
						<path d="M14.5 9a3.5 4 0 1 0 0 6" />
					</svg>
					View licenses
				</button>
			</div>
		</div>
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Logs</h2>
				<h3>You can view the logs for debugging. You can view all the logs in the settings folder.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={showLogs}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Show logs
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>About Authme</h2>
				<h3>Information about your Authme build.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={about}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					About Authme
				</button>
			</div>
		</div>
	</div>
</div>

<script>
	import Select from "../../components/select.svelte"
	import Toggle from "../../components/toggle.svelte"
	import { about, clearData, showLogs, launchOnStartup } from "./index"
	import { settings } from "../../stores/settings"
	import { open } from "../../utils/navigate"
	import { deleteShortcut, editShortcut, resetShortcut, shortcuts } from "../../utils/shortcuts"
</script>
