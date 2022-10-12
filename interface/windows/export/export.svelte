<div class="transparent-900 exportCodes m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Export codes</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Exporting codes</h2>
				<h3>Your saved codes can be exported here. Ideal if you want to use your codes elsewhere or for a security backup.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={exportCodes}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					Confirm
				</button>
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 saveExportedCodes m-auto my-20 hidden w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Save exported codes</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Export .authme file</h2>
				<h3>Ideal to import for Authme or other Authme apps.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={exportAuthmeFile}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M14 3v4a1 1 0 0 0 1 1h4" />
						<path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
					</svg>
					Export file
				</button>
			</div>
		</div>

		<div class="transparent-800 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Export .html file</h2>
				<h3>Ideal for scanning the QR codes or for security backup.</h3>
			</div>
			<div class="ml-20 flex gap-3">
				<button class="button" on:click={exportHtmlFile}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M14 3v4a1 1 0 0 0 1 1h4" />
						<path d="M11.5 21h-4.5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v5m-5 6h7m-3 -3l3 3l-3 3" />
					</svg>
					Export file
				</button>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { exportCodes, exportAuthmeFile, exportHtmlFile } from "./index"
</script>
