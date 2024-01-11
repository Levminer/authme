<div class="transparent-900 landing m-auto mb-60 mt-40 w-3/5 rounded-2xl p-10 text-center">
	<h1>{language.landing.welcome}</h1>

	<div class="mx-auto flex w-4/5 flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-10 w-full rounded-2xl p-5">
			<h2>{language.landing.gettingStarted}</h2>
			<h3>{language.landing.gettingStartedText}</h3>
		</div>

		<div class="flex w-full flex-row justify-center gap-5 sm:flex-wrap">
			<div class="transparent-800 my-5 flex w-1/2 flex-col flex-wrap items-center justify-center rounded-2xl p-5 sm:w-full">
				<h4 class="mb-3">{language.landing.passwordAuth}</h4>
				<h5 class="mb-3">{language.landing.passwordAuthText}</h5>

				<button class="button" on:click={requirePassword}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 16 16 12 12 8" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
					<span>{language.common.continue}</span>
				</button>
			</div>
			<div class="transparent-800 my-5 flex w-1/2 flex-col flex-wrap items-center justify-center rounded-2xl p-5 sm:w-full">
				<h4 class="mb-3">{language.landing.noAuth}</h4>
				<h5 class="mb-3">{language.landing.noAuthText}</h5>

				<button class="button" on:click={noPassword}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
					<span>{language.common.confirm}</span>
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left sm:flex-wrap">
			<div>
				<h4>{language.landing.hardwareAuth}</h4>
				<h5>{language.landing.hardwareAuthText}</h5>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.security.hardwareAuthentication} />
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 requirePassword m-auto mb-60 mt-40 hidden w-3/5 rounded-2xl p-10 text-center">
	<h1>{language.landing.passwordAuth}</h1>

	<div class="mx-auto flex w-4/5 flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-10 w-full rounded-2xl p-5">
			<h2>{language.landing.createPass}</h2>
			<h3>{language.landing.createPassText}</h3>
		</div>

		<div class="transparent-800 mb-10 w-full rounded-2xl p-5">
			<div class="mx-auto flex w-full items-center justify-center gap-5 text-left sm:flex-wrap">
				<div>
					<h5>{language.landing.password}</h5>
					<div class="flex items-center justify-center">
						<input class="input passwordInput0 mt-1" type="password" />
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(0)} on:keypress={() => showPassword(0)} class="showPassword0 relative right-9 top-0.5 h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(0)} on:keypress={() => showPassword(0)} class="hidePassword0 relative right-9 top-0.5 hidden h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
					</div>
				</div>

				<div>
					<h5>{language.landing.confirmPassword}</h5>
					<div class="flex items-center justify-center">
						<input class="input passwordInput1 mt-1" type="password" />
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(1)} on:keypress={() => showPassword(1)} class="showPassword1 relative right-9 top-0.5 h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(1)} on:keypress={() => showPassword(1)} class="hidePassword1 relative right-9 top-0.5 hidden h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
					</div>
				</div>
			</div>

			<button class="button mx-auto mt-10" on:click={createPassword}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
				{language.common.confirm}
			</button>
		</div>

		<Details>
			<div class="flex justify-between">
				<div>
					<h4>{language.landing.chooseDifferent}</h4>
					<h5>{language.landing.chooseDifferentText}</h5>
				</div>
				<div class="ml-20">
					<button
						class="smallButton"
						on:click={() => {
							location.reload()
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 8 8 12 12 16" /><line x1="16" y1="12" x2="8" y2="12" /></svg>
						{language.landing.goBack}
					</button>
				</div>
			</div>
		</Details>
	</div>
</div>

<script lang="ts">
	import { appController, createPassword, noPassword, requirePassword, showPassword } from "./index"
	import Toggle from "interface/components/toggle.svelte"
	import Details from "../../components/details.svelte"
	import { settings } from "interface/stores/settings"
	import { onMount } from "svelte"
	import { getLanguage } from "@utils/language"

	const language = getLanguage()

	onMount(() => {
		appController()
	})
</script>
