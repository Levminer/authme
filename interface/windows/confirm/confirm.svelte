<div class="transparent-900 m-auto mb-60 mt-40 w-3/5 rounded-2xl p-10 text-center">
	<h1>Welcome back!</h1>

	<div class="mx-auto flex w-4/5 flex-col items-center justify-center rounded-2xl p-10">
		<div class="transparent-800 mb-10 w-full rounded-2xl p-5">
			<h2>Confirm password</h2>
			<h3>Please enter your password to continue.</h3>
		</div>

		<div class="transparent-800 mb-10 w-full rounded-2xl p-5">
			<div class="mx-auto flex w-full items-center justify-center text-left">
				<div>
					<h5>Password</h5>
					<div class="flex items-center justify-center">
						<input class="input passwordInput mt-1" type="password" />
						<svg xmlns="http://www.w3.org/2000/svg" on:click={showPassword} on:keypress={showPassword} class="showPassword relative right-9 top-0.5 h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
						<svg xmlns="http://www.w3.org/2000/svg" on:click={showPassword} on:keypress={showPassword} class="hidePassword relative right-9 top-0.5 hidden h-6 w-6 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
					</div>
				</div>
			</div>

			<button class="button mx-auto mt-10" on:click={confirmPassword}>
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
				Confirm
			</button>
		</div>

		<Details>
			<div class="flex items-center justify-between">
				<div>
					<h4>Forgot password?</h4>
					<h5>Your codes are protected by your password. If you forgot your password you can't access your codes.</h5>
				</div>
				<div>
					<button class="smallButton" on:click={() => open("https://github.com/levminer/authme")}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
						More information
					</button>
				</div>
			</div>
		</Details>
	</div>
</div>

<script lang="ts">
	import { open } from "interface/utils/navigate"
	import { onMount } from "svelte"
	import Details from "../../components/details.svelte"
	import { confirmPassword, showPassword } from "./index"

	onMount(() => {
		document.querySelector<HTMLInputElement>(".passwordInput").focus()

		document.querySelector<HTMLInputElement>(".passwordInput").addEventListener("keypress", (event) => {
			if (event.key === "Enter") {
				confirmPassword()
			}
		})
	})
</script>
