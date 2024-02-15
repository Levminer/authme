<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">{language.settings.general}</h1>

	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.launchOnStartup}</h2>
				<h3>{language.settings.launchOnStartupText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.launchOnStartup} on:click={launchOnStartup} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.minimizeToTray}</h2>
				<h3>{language.settings.minimizeToTrayText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.minimizeToTray} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.optionalAnalytics}</h2>
				<h3>{language.settings.optionalAnalyticsText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.optionalAnalytics} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.windowCapture}</h2>
				<h3>{language.settings.windowCaptureText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={windowCapture} on:click={() => toggleWindowCapture(windowCapture)} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.clearData}</h2>
				<h3>{language.settings.clearDataText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={clearData}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
					{language.settings.clearDataButton}
				</button>
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">{language.settings.codes}</h1>

	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.codesDescription}</h2>
				<h3>{language.settings.codesDescriptionText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.codesDescription} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.blurCodes}</h2>
				<h3>{language.settings.blurCodesText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.settings.blurCodes} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.codesLayout}</h2>
				<h3>{language.settings.codesLayoutText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Select options={["Grid", "List"]} setting={"codesLayout"} />
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.sortCodes}</h2>
				<h3>{language.settings.sortCodesText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<Select options={["Default", "A-Z", "Z-A"]} setting={"sortCodes"} />
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10 pb-10">{language.settings.shortcuts}</h1>

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
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
						{language.settings.shortcutsEditButton}
					</button>
					<button on:click={() => resetShortcut(i)} id="resetShortcut{i}" class="button">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v6h6" /><path d="M21 12A9 9 0 0 0 6 5.3L3 8" /><path d="M21 22v-6h-6" /><path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" /></svg>
						{language.settings.shortcutsResetButton}
					</button>
					<button on:click={() => deleteShortcut(i)} id="deleteShortcut{i}" class="button">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
						{language.settings.shortcutsDeleteButton}
					</button>
				</div>
			</div>
		</div>
	{/each}
</div>

<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">{language.settings.about}</h1>

	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		{#if build.dev}
			<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
				<div>
					<h2>Delete codes</h2>
					<h3>Delete all imported 2FA codes. Be careful, this can not be undone</h3>
				</div>
				<div class="ml-20 flex gap-3">
					<button class="button" on:click={deleteCodes}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
						Delete codes
					</button>
				</div>
			</div>
		{/if}
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.feedback}</h2>
				<h3>{language.settings.feedbackText}</h3>
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
				<h2>{language.settings.logs}</h2>
				<h3>{language.settings.logsText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={showLogs}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
					{language.settings.showLogsButton}
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.settings.aboutAuthme}</h2>
				<h3>{language.settings.aboutAuthmeText}</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={about}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
					{language.settings.aboutAuthme}
				</button>
			</div>
		</div>
	</div>
</div>

<script>
	import Select from "../../components/select.svelte"
	import Toggle from "../../components/toggle.svelte"
	import { about, clearData, showLogs, launchOnStartup, toggleWindowCapture, deleteCodes } from "./index"
	import { settings } from "../../stores/settings"
	import { open } from "../../utils/navigate"
	import { deleteShortcut, editShortcut, resetShortcut, shortcuts } from "../../utils/shortcuts"
	import { getLanguage } from "@utils/language"
	import build from "../../../build.json"

	const language = getLanguage()

	$: windowCapture = false
</script>
