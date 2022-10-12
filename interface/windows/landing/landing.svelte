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
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<span data-loc>Continue</span>
				</button>
			</div>
			<div class="transparent-800 my-5 flex w-1/2 flex-col flex-wrap items-center justify-center rounded-2xl p-5 sm:w-full">
				<h4 data-loc class="mb-3">No authentication</h4>
				<h5 data-loc class="mb-3">If you don't want to type in a password every time you launch Authme.</h5>

				<button class="button" on:click={noPassword}>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(0)} on:keypress={() => showPassword(0)} viewBox="0 0 24 24" fill="currentColor" class="showPassword0 relative right-9 top-0.5 h-6 w-6 cursor-pointer">
							<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
							<path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(0)} on:keypress={() => showPassword(0)} viewBox="0 0 24 24" fill="currentColor" class="hidePassword0 relative right-9 top-0.5 hidden h-6 w-6 cursor-pointer">
							<path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
							<path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
							<path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
						</svg>
					</div>
				</div>

				<div>
					<h5>Confirm password</h5>
					<div class="flex items-center justify-center">
						<input class="input passwordInput1 mt-1" type="password" />
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(1)} on:keypress={() => showPassword(0)} viewBox="0 0 24 24" fill="currentColor" class="showPassword1 relative right-9 top-0.5 h-6 w-6 cursor-pointer">
							<path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
							<path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clip-rule="evenodd" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" on:click={() => showPassword(1)} on:keypress={() => showPassword(0)} viewBox="0 0 24 24" fill="currentColor" class="hidePassword1 relative right-9 top-0.5 hidden h-6 w-6 cursor-pointer">
							<path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
							<path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
							<path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
						</svg>
					</div>
				</div>
			</div>

			<button class="button mx-auto mt-10" on:click={createPassword}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
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
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
						</svg>
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
