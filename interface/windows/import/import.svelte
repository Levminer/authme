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
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
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
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
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
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<line x1="15" y1="8" x2="15.01" y2="8" />
						<rect x="4" y="4" width="16" height="16" rx="3" />
						<path d="M4 15l4 -4a3 5 0 0 1 3 0l5 5" />
						<path d="M14 14l1 -1a3 5 0 0 1 3 0l2 2" />
					</svg>
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
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<rect x="2" y="6" width="20" height="12" rx="2" />
						<line x1="6" y1="10" x2="6" y2="10" />
						<line x1="10" y1="10" x2="10" y2="10" />
						<line x1="14" y1="10" x2="14" y2="10" />
						<line x1="18" y1="10" x2="18" y2="10" />
						<line x1="6" y1="14" x2="6" y2="14.01" />
						<line x1="18" y1="14" x2="18" y2="14.01" />
						<line x1="10" y1="14" x2="14" y2="14" />
					</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<circle cx="12" cy="10" r="7" />
							<circle cx="12" cy="10" r="3" />
							<path d="M8 16l-2.091 3.486a1 1 0 0 0 .857 1.514h10.468a1 1 0 0 0 .857 -1.514l-2.091 -3.486" />
						</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<rect x="3" y="4" width="18" height="12" rx="1" />
							<line x1="7" y1="20" x2="17" y2="20" />
							<line x1="9" y1="16" x2="9" y2="20" />
							<line x1="15" y1="16" x2="15" y2="20" />
						</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
						</svg>
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
