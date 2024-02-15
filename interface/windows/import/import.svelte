<div class="transparent-900 m-auto my-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">{language.import.supportedTypes}</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left sm:flex-wrap">
			<div>
				<h2>{language.import.totpQRCode}</h2>
				<h3>{language.import.totpQRCodeText}</h3>
			</div>
			<div class="ml-20 flex gap-3 sm:ml-0 sm:mt-5">
				<button class="button" on:click={showTOTPDialog}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
					{language.import.instructions}
				</button>
			</div>
		</div>

		<div class="transparent-800 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left sm:flex-wrap">
			<div>
				<h2>{language.import.googleAuthQRCode}</h2>
				<h3>{language.import.googleAuthQRCodeText}</h3>
			</div>
			<div class="ml-20 flex gap-3 sm:ml-0 sm:mt-5">
				<button class="button" on:click={showGADialog}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
					{language.import.instructions}
				</button>
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 m-auto mb-20 w-4/5 rounded-2xl p-10 text-left">
	<h1 class="px-10">{language.import.chooseImportMethod}</h1>
	<div class="mx-auto flex flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.import.importFromImage}</h2>
				<h3>{language.import.importFromImageText}</h3>
			</div>
			<div class="ml-10 flex gap-3">
				<button class="button" on:click={chooseImages}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
					{language.import.chooseImageButton}
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left">
			<div>
				<h2>{language.import.enterSecretManually}</h2>
				<h3>{language.import.enterSecretManuallyText}</h3>
			</div>
			<div class="ml-10 flex gap-3">
				<button class="button" on:click={showManualEntry}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
					<span>{language.import.enterSecretManuallyButton}</span>
				</button>
			</div>
		</div>

		<Details openByDefault={true}>
			<div class="flex justify-between">
				<div>
					<h4 class="text-white">{language.import.screenCapture}</h4>
					<h5>{language.import.screenCaptureText}</h5>
				</div>
				<div>
					<button class="smallButton" on:click={captureScreen}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="19" cy="6" r="3"/><path d="M22 12v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/><path d="M12 17v4"/><path d="M8 21h8"/></svg>
						{language.import.screenCaptureButton}
					</button>
				</div>
			</div>
			<div class="mt-5 flex justify-between">
				<div>
					<h4 class="text-white">{language.import.webcam}</h4>
					<h5>{language.import.webcamText}</h5>
				</div>
				<div>
					<button class="smallButton" on:click={useWebcam}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
						{language.import.webcamButton}
					</button>
				</div>
			</div>

			<div class="mt-5 flex justify-between">
				<div>
					<h4 class="text-white">{language.import.authmeFile}</h4>
					<h5>{language.import.authmeFileText}</h5>
				</div>
				<div>
					<button class="smallButton" on:click={chooseFile}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v3" /><polyline points="14 2 14 8 20 8" /><path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="m9 18-1.5-1.5" /></svg>
						{language.import.authmeFileButton}
					</button>
				</div>
			</div>
		</Details>
	</div>
</div>

<dialog class="dialog dialog1 overflow-hidden">
	<h2 class="dialog1Title">{language.import.captureScreenTitle}</h2>
	<h3>{language.import.captureScreenWaiting}</h3>

	<div class="mt-10 flex aspect-video h-60 flex-row space-x-5">
		<!-- svelte-ignore a11y-media-has-caption -->
		<video class="video rounded-xl bg-white p-1" autoplay />
	</div>

	<div class="mt-10">
		<button class="button stopVideo">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{language.common.cancel}
		</button>
	</div>
</dialog>

<dialog class="dialog dialog0">
	<h2>{language.import.manualEntry}</h2>
	<h3>{language.import.manualEntryText}</h3>

	<div class="mt-10 flex flex-row gap-5 sm:flex-col">
		<div>
			<h5>{language.import.manualEntryName}</h5>
			<input class="input name mt-1" type="text" placeholder="Google" />
		</div>
		<div>
			<h5>{language.import.manualEntrySecret}</h5>
			<input class="input secret mt-1" type="text" placeholder="JBSWY3DPEHPK3PXP" />
		</div>
		<div>
			<h5>{language.import.manualEntryDescription}</h5>
			<input class="input description mt-1" type="text" placeholder="example@mail.com" />
		</div>
	</div>

	<div class="mt-10 flex space-x-5">
		<button class="button dialog0Close">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{language.common.cancel}
		</button>
		<button class="button" on:click={manualEntry}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{language.common.confirm}
		</button>
	</div>
</dialog>

<dialog class="dialog dialog2">
	<h2>{language.import.googleAuthQRCode}</h2>
	<h3>{language.import.googleAuthTutorialTitle}</h3>

	<div class="mt-10 flex flex-row space-x-5">
		<ol class="instructions">
			<li>{language.import.googleAuthTutorial0}</li>
			<li>{language.import.googleAuthTutorial1}</li>
			<li>{language.import.googleAuthTutorial2}</li>
			<li>{language.import.googleAuthTutorial3}</li>
		</ol>
	</div>

	<div class="mt-10 flex space-x-5">
		<button class="button dialog2Close">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{language.common.close}
		</button>
	</div>
</dialog>

<dialog class="dialog dialog3">
	<h2>{language.import.totpQRCode}</h2>
	<h3>{language.import.totpTutorialTitle}</h3>

	<div class="mt-10 flex flex-row space-x-5">
		<ol class="instructions">
			<li>{language.import.totpTutorial0}</li>
			<li>{language.import.totpTutorial1}</li>
			<li>{language.import.totpTutorial2}</li>
			<li>{language.import.totpTutorial3}</li>
		</ol>
	</div>

	<div class="mt-10 flex space-x-5">
		<button class="button dialog3Close">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			{language.common.close}
		</button>
	</div>
</dialog>

<script>
	import { captureScreen, chooseFile, chooseImages, manualEntry, showGADialog, showManualEntry, showTOTPDialog, useWebcam } from "./index"
	import Details from "../../components/details.svelte"
	import { getLanguage } from "@utils/language"

	const language = getLanguage()
</script>
