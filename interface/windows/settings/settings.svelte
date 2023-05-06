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
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
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
				<div class="ml-10 flex flex-wrap gap-3 sm:ml-0 sm:mt-10 sm:w-full">
					<button on:click={() => editShortcut(i)} id="editShortcut{i}" class="button">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="22" y2="6" /><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z" /></svg>
						Edit
					</button>
					<button on:click={() => resetShortcut(i)} id="resetShortcut{i}" class="button">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v6h6" /><path d="M21 12A9 9 0 0 0 6 5.3L3 8" /><path d="M21 22v-6h-6" /><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" /></svg>
						Reset
					</button>
					<button on:click={() => deleteShortcut(i)} id="deleteShortcut{i}" class="button">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
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
				<h2>Feedback</h2>
				<h3>Thank you for providing feedback! Please report issues or feature requests on GitHub or by Email (authme@levminer.com).</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button
					class="button"
					on:click={() => {
						open("https://github.com/levminer/authme/issues")
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
					GitHub
				</button>
			</div>
		</div>
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Logs</h2>
				<h3>You can view the logs for debugging..</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={showLogs}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
					Show logs
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>About Authme</h2>
				<h3>Information about your Authme build and your computer.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={about}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
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
