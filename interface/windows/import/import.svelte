<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Supported QR codes</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left sm:flex-wrap">
			<div>
				<h2>TOTP 2FA QR code</h2>
				<h3>A TOTP QR code is that you find mostly everywhere, if you want to setup 2FA. Consist of 6 digits which are changing every 30 seconds.</h3>
			</div>
			<div class="ml-20 flex gap-3 sm:ml-0 sm:mt-5">
				<button class="button" on:click={showTOTPDialog}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
					Instructions
				</button>
			</div>
		</div>

		<div class="transparent-800 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left sm:flex-wrap">
			<div>
				<h2>Google Authenticator QR code</h2>
				<h3>If you are using Google Authenticator you can export all of your exiting codes and import them to Authme.</h3>
			</div>
			<div class="ml-20 flex gap-3 sm:ml-0 sm:mt-5">
				<button class="button" on:click={showGADialog}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
					Instructions
				</button>
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 m-auto mb-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">Choose import method</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Import from images</h2>
				<h3>Choose images that contain compatible QR codes.</h3>
			</div>
			<div class="ml-10 flex gap-3">
				<button class="button" on:click={chooseImages}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><circle cx="10" cy="13" r="2" /><path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22" /></svg>
					Choose images
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>Enter secret manually</h2>
				<h3>Enter a TOTP secret key and name manually.</h3>
			</div>
			<div class="ml-10 flex gap-3">
				<button class="button" on:click={showManualEntry}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2" /><path d="M6 8h.001" /><path d="M10 8h.001" /><path d="M14 8h.001" /><path d="M18 8h.001" /><path d="M8 12h.001" /><path d="M12 12h.001" /><path d="M16 12h.001" /><path d="M7 16h10" /></svg>
					<span>Manual entry</span>
				</button>
			</div>
		</div>

		<Details>
			<div class="flex justify-between">
				<div>
					<h4 class="text-white">Webcam</h4>
					<h5>Use your webcam to scan a 2FA QR code.</h5>
				</div>
				<div>
					<button class="smallButton" on:click={useWebcam}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
						Use webcam
					</button>
				</div>
			</div>
			<div class="mt-5 flex justify-between">
				<div>
					<h4 class="text-white">Screen capture</h4>
					<h5>Capture a 2FA QR code from your screen.</h5>
				</div>
				<div>
					<button class="smallButton" on:click={captureScreen}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" /><path d="M8 21h8" /><path d="M12 17v4" /><path d="m17 8 5-5" /><path d="M17 3h5v5" /></svg>
						Capture screen
					</button>
				</div>
			</div>
			<div class="mt-5 flex justify-between">
				<div>
					<h4 class="text-white">Authme file</h4>
					<h5>Import all codes from an Authme import file.</h5>
				</div>
				<div>
					<button class="smallButton" on:click={chooseFile}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3" /><polyline points="14 2 14 8 20 8" /><path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="m9 18-1.5-1.5" /></svg>
						Choose file
					</button>
				</div>
			</div>
		</Details>
	</div>
</div>

<dialog class="dialog dialog1 overflow-hidden">
	<h2 class="dialog1Title">Capture screen import</h2>
	<h3>Waiting for a QR code...</h3>

	<div class="mt-10 flex aspect-video h-60 flex-row space-x-5">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video class="video rounded-xl bg-white p-1" autoplay />
	</div>

	<div class="mt-10">
		<button class="button stopVideo">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Stop
		</button>
	</div>
</dialog>

<dialog class="dialog dialog0">
	<h2>Manual entry</h2>
	<h3>Please enter the 2FA secret and name!</h3>

	<div class="mt-10 flex flex-row space-x-5">
		<div>
			<h5>Name (Required)</h5>
			<input class="input name mt-1" type="text" placeholder="Google" />
		</div>
		<div>
			<h5>Secret (Required)</h5>
			<input class="input secret mt-1 " type="text" placeholder="JBSWY3DPEHPK3PXP" />
		</div>
		<div>
			<h5>Description</h5>
			<input class="input description mt-1" type="text" placeholder="example@mail.com" />
		</div>
	</div>

	<div class="mt-10 flex space-x-5">
		<button class="button dialog0Close">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Cancel
		</button>
		<button class="button" on:click={manualEntry}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Confirm
		</button>
	</div>
</dialog>

<dialog class="dialog dialog2">
	<h2>Google Authenticator QR code</h2>
	<h3>Short tutorial on how to import your codes to Authme from Google Authenticator.</h3>

	<div class="mt-10 flex flex-row space-x-5">
		<ol class="instructions">
			<li>Export the QR codes from the Google Authenticator app: Tap on the three dots on the top right of the screen > Transfer Accounts > Export Accounts</li>
			<li>Save the two or more QR code with a screenshot or take a picture of them from another phone. Then transfer the pictures to your computer</li>
			<li>Back to Authme, go to the Import page: Sidebar > Import</li>
			<li>Click the Choose images button</li>
			<li>A popup windows will open, just select the picture(s)</li>
			<li>That's it you are done!</li>
		</ol>
	</div>

	<div class="mt-10 flex space-x-5">
		<button class="button dialog2Close">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Close
		</button>
	</div>
</dialog>

<dialog class="dialog dialog3">
	<h2>TOTP 2FA QR code</h2>
	<h3>Short tutorial on how to import your codes to Authme from any TOTP 2FA QR code.</h3>

	<div class="mt-10 flex flex-row space-x-5">
		<ol class="instructions">
			<li>Go to the website(s) you want to get the QR codes from</li>
			<li>Take screenshots (Windows key + Shift + S key combination on Windows) of the QR codes, and save the pictures</li>
			<li>Back to Authme, go to the Import page: Sidebar > Import</li>
			<li>Click the Choose images button</li>
			<li>A popup windows will open, just select the picture(s)</li>
			<li>That's it you are done!</li>
		</ol>
	</div>

	<div class="mt-10 flex space-x-5">
		<button class="button dialog3Close">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			Close
		</button>
	</div>
</dialog>

<script>
	import { captureScreen, chooseFile, chooseImages, manualEntry, showGADialog, showManualEntry, showTOTPDialog, useWebcam } from "./index"
	import Details from "../../components/details.svelte"
</script>
