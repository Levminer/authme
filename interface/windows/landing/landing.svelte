<div class="transparent-900 landing m-auto mt-40 mb-60 w-3/5 rounded-2xl p-10 text-center">
	<h1>Welcome to Authme!</h1>

	<div class="mx-auto flex w-4/5 flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-10 w-full rounded-2xl p-5">
			<h2>Getting started</h2>
			<h3>Choose how you want to use Authme.</h3>
		</div>

		<div class="flex w-full flex-row justify-center gap-5 sm:flex-wrap">
			<div class="transparent-800 my-5 flex w-1/2 flex-col flex-wrap items-center justify-center rounded-2xl p-5 sm:w-full">
				<h4 data-loc class="mb-3">Password authentication</h4>
				<h5 data-loc class="mb-3">You have to type in a password every time you launch Authme.</h5>

				<button class="button" on:click={requirePassword}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 16 16 12 12 8" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
					<span data-loc>Continue</span>
				</button>
			</div>
			<div class="transparent-800 my-5 flex w-1/2 flex-col flex-wrap items-center justify-center rounded-2xl p-5 sm:w-full">
				<h4 data-loc class="mb-3">No authentication</h4>
				<h5 data-loc class="mb-3">If you don't want to type in a password every time you launch Authme.</h5>

				<button class="button" on:click={noPassword}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
					<span data-loc>Confirm</span>
				</button>
			</div>
		</div>

		<div class="transparent-800 mb-5 flex w-full flex-row items-center justify-between rounded-xl p-5 text-left sm:flex-wrap">
			<div>
				<h4>Hardware authentication</h4>
				<h5>Confirm important actions with Windows Hello, Touch ID or any WebAuthn compatible hardware key.</h5>
			</div>
			<div class="ml-20 flex gap-3">
				<Toggle bind:checked={$settings.security.hardwareAuthentication} />
			</div>
		</div>
	</div>
</div>

<div class="transparent-900 requirePassword m-auto mt-40 mb-60 hidden w-3/5 rounded-2xl p-10 text-center">
	<h1>Password authentication</h1>

	<div class="mx-auto flex w-4/5 flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-10 w-full rounded-2xl p-5">
			<h2>Create password</h2>
			<h3>Create a strong password to encrypt your codes.</h3>
		</div>

		<div class="transparent-800 mb-10 w-full rounded-2xl p-5">
			<div class="mx-auto flex w-full items-center justify-center gap-5 text-left sm:flex-wrap">
				<div>
					<h5>Password</h5>
					<div class="flex items-center justify-center">
						<input class="input passwordInput0 mt-1" type="password" />
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(0)} on:keypress={() => showPassword(0)} class="showPassword0 relative right-9 top-0.5 h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(0)} on:keypress={() => showPassword(0)} class="hidePassword0 relative right-9 top-0.5 hidden h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
					</div>
				</div>

				<div>
					<h5>Confirm password</h5>
					<div class="flex items-center justify-center">
						<input class="input passwordInput1 mt-1" type="password" />
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(1)} on:keypress={() => showPassword(1)} class="showPassword1 relative right-9 top-0.5 h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(1)} on:keypress={() => showPassword(1)} class="hidePassword1 relative right-9 top-0.5 hidden h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
					</div>
				</div>
			</div>

			<button class="button mx-auto mt-10" on:click={createPassword}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
				Confirm
			</button>
		</div>

		<Details>
			<div class="flex justify-between">
				<div>
					<h4>Choose a different method</h4>
					<h5>Go back to the previous page and choose a different login method.</h5>
				</div>
				<div class="ml-20">
					<button
						class="smallButton"
						on:click={() => {
							location.reload()
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 8 8 12 12 16" /><line x1="16" y1="12" x2="8" y2="12" /></svg>
						Go back
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

	onMount(() => {
		appController()
	})
</script>
