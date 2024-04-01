<script lang="ts">
	import { onMount } from "svelte"
	import { UAParser } from "ua-parser-js"

	const api = async () => {
		try {
			await fetch("https://api.levminer.com/api/v1/authme/releases")
				.then((res) => res.json())
				.then((data) => {
					try {
						document.querySelector(
							"#downloads-release",
						).innerHTML = `Latest release (${data.tag_name})`
					} catch (error) {
						return console.log(error)
					}
				})
		} catch (error) {
			console.log(`Error: ${error}`)
		}

		const os = new UAParser().getOS().name
		const download_button = document.querySelector("#downloadButton")
		const download_text = document.querySelector("#downloadName")

		if (os !== undefined) {
			if (os.includes("Linux") || os.includes("Ubuntu")) {
				download_button.setAttribute("href", "https://api.levminer.com/api/v1/authme/release/linux")

				download_text.textContent = "(Linux x64)"
			}

			if (os.includes("Mac OS")) {
				download_button.setAttribute("href", "https://api.levminer.com/api/v1/authme/release/mac")

				download_text.textContent = "(macOS Universal)"
			}
		}
	}

	onMount(() => {
		api()
	})
</script>

<section class="h-screen">
	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center mt-32">
		<div
			class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
		>
			<h1 class="title-font sm:text-4xl text-3xl mb-4 font-bold text-white">
				Two-factor authenticator for desktop
			</h1>
			<h2 class="mb-8 leading-relaxed font-medium text-gray-300 text-xl">
				<span class="italic">Authme</span> is a simple cross-platform two-factor (2FA) authenticator
				app for desktop. It supports TOTP and Google Authenticator QR codes.
			</h2>
			<div class="flex gap-3">
				<div class="flex justify-center items-center flex-col">
					<a
						href="https://api.levminer.com/api/v1/authme/release/windows"
						id="downloadButton"
						class="button"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-arrow-down-to-line"
							><path d="M12 17V3" /><path d="m6 11 6 6 6-6" /><path d="M19 21H5" /></svg
						>
						Download
					</a>
					<h3 class="text-gray-300 mt-1 text-sm text-center">
						<p id="downloadName">(Windows x64)</p>
						<a class="hover:text-white duration-200 ease-in" href="#downloads">Other downloads</a>
					</h3>
				</div>
				<div>
					<a
						href="#features"
						class="button bg-transparent border-none text-white hover:text-gray-300"
					>
						Features
					</a>
				</div>
			</div>
		</div>
		<div class="lg:max-w-2xl lg:w-full md:w-1/2 w-5/6 p-2 bg-black bg-opacity-50 rounded-2xl">
			<img class="object-cover object-center" alt="hero" src="./application.png" />
		</div>
	</div>
	<div class="mx-auto flex justify-center mt-10">
		<a href="#features" class="mx-auto" aria-label="Go down button">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-16 w-16 mt-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
				/>
			</svg>
		</a>
	</div>
</section>

<!-- features -->
<section id="features" class="text-gray-50 bg-gray-800 body-font">
	<div class="container px-5 py-24 mx-auto flex flex-wrap">
		<div class="flex flex-col text-center mx-auto mb-10">
			<h3 class="sm:text-1xl text-5xl font-bold text-white mb-14">Features</h3>

			<div class="flex gap-3 mt-10 text-2xl bg-gray-700 p-3 rounded-xl flex-wrap justify-center">
				<h4>Available for:</h4>
				<div class="flex flex-row gap-1 justify-center items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 relative top-0.5"
						viewBox="0 0 512 512"
						fill="currentColor"
					>
						<path
							d="M31.87 30.58H244.7v212.81H31.87zM266.89 30.58H479.7v212.81H266.89zM31.87 265.61H244.7v212.8H31.87zM266.89 265.61H479.7v212.8H266.89z"
						/>
					</svg>
					Windows
				</div>
				<div class="flex flex-row gap-1 justify-center items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						class="h-5 w-5 relative top-0.5"
						viewBox="0 0 512 512"
					>
						<path
							d="M443.66 405.05c-1.46-.79-2.85-1.54-4-2.2-6.47-3.83-13-10.52-11.85-17.83 2.42-15.94 2.89-23.47-.49-28.79a15.61 15.61 0 00-7.67-6.2v-.06c1.41-2.56 2.26-5.66 2.83-10.12 1.44-11-5-44-13.7-70.7-8.08-24.68-29.24-50-44.7-68.56l-3.61-4.34c-23.88-28.93-24.34-38.19-26.55-82.67-.32-6.47-.69-13.8-1.17-22C329.87 41.43 304 16 256 16c-25.2 0-44.62 7.15-57.72 21.26C187.79 48.55 182 64 182 80.78c0 29.52 2 53 2.15 54.29 1.4 35.7 1 41.22-8.31 57.55-2.23 3.93-8.38 10.87-14.89 18.21-8.48 9.57-18.09 20.41-23.36 29.22-3.77 6.31-5.88 12.63-8.11 19.33-3.4 10.21-7.26 21.78-18.15 36.57-12.57 17.07-15.52 29.61-11 47.45-4.94 6.45-4.83 14.37-4.75 20.23a25.84 25.84 0 01-.3 6.09c-2.29 7.59-12.42 9.4-22 10.18-1.58.12-3.1.21-4.55.29-7.26.39-13.53.74-17.13 6.3-3.47 5.36-1.12 13.8 2.14 25.48.72 2.58 1.46 5.25 2.19 8.06 1.83 7-.16 10.48-2.68 14.84-2.44 4.21-5.21 9-5.21 17.55 0 14.67 20 18 43.05 21.94 7.36 1.24 15 2.53 22.63 4.24a225.58 225.58 0 0134.08 10.68c9.72 3.73 17.4 6.68 26.43 6.68 16.18 0 28.25-9.77 39.92-19.21l2.15-1.75c5.53-4.49 21.5-4 34.34-3.64 3.46.1 6.73.2 9.65.2h6.22c13.48-.08 31.94-.18 42.23 2.5 3.75 1 6.2 3.72 9.29 7.19 5.87 6.56 13.17 14.75 33.39 14.75 19.39 0 29.55-8.71 41.32-18.8 7.16-6.13 14.56-12.48 25.07-17.86 3.92-2 7.62-3.87 11.08-5.61 22.64-11.38 35.11-17.65 35.11-27.82 0-9.91-12.24-16.5-20.34-20.86zM211.11 88.38a13.91 13.91 0 0112.47 9c1.95 5.55 1.81 10.42.21 12.94 0 0-.22-1-.36-1.44a14.85 14.85 0 00-6.44-8.59 11.35 11.35 0 00-8.94-1.47c-4.26 1.13-8.41 5-8.91 18.79-5.16-10.47-2.31-18 .92-23 2.31-3.73 7.47-6.33 11.05-6.23zm-17.5 375C192 479.24 175.2 479 170.09 478.59c-9.81-.82-21.66-4.69-33.13-8.43-4.52-1.47-9.19-3-13.73-4.34-13.2-3.89-30.12-6.74-43.72-9-3.22-.55-6.27-1.06-9.05-1.55s-4.61-1.27-5.2-2.3c-1-1.65.38-5.25 1.93-9.41C69.27 438 72.11 430.34 72 421c0-3.91-1.47-8.3-2.84-12.56-1.62-5-3.28-10.17-1.93-12.62 1.23-2.23 6.75-2.49 11.6-2.49h2.26c3.55 0 6.62.06 8.75-.53 6.51-1.81 14.86-6.92 17.81-13.88.9-2.17 1.37-6.94 2-14 .37-4.12.74-8.37 1.22-10.58a3.55 3.55 0 012.11-2.55c1.65-.77 6.78-1.91 18.63 4.08 11.18 5.65 22.88 25.84 34.2 45.37 3.56 6.14 6.92 11.94 10.3 17.36 14.04 22.54 18.83 31.6 17.5 44.8zm128.84-31.56a68.74 68.74 0 01-4.55 10.9.58.58 0 01-1.08-.42 56.61 56.61 0 002.11-18.43c-.25-4.73-.4-7.59-2.66-8.51s-4.26.83-9.45 5.54c-1.1 1-2.36 2.14-3.78 3.4-10.8 9.47-26.88 20.68-55.61 23.37-16.84 1.59-27.59-4.63-30.92-8.14a2.16 2.16 0 00-3.07-.08 2.23 2.23 0 00-.51 2.29c2.12 6.84 1.2 12.26-.49 16.19-.95 2.2-1.85 2.05-2-.34-.25-4.64-1-9.88-3-14.19-3.11-6.94-7-14.34-8.89-17.88v-.05c3.24-1.49 8.86-4.83 11.37-10.88s4.48-18-9.82-31.74c-6.28-6.05-22.1-17.16-36.06-27-10.9-7.65-22.17-15.56-23.65-17.51-4.49-5.89-6.37-9.3-6.94-19.65.07-2.3.13-4.59.19-6.89l.27-2.49a.58.58 0 011.15 0 63.07 63.07 0 002 9.72c1.08 3.73 2.4 7.58 3.62 9.18 3.19 4.22 7.56 7.39 11.67 8.49a5.48 5.48 0 005-.72c2.93-2.33 2.65-7.6 2.19-16.34-.47-9-1.11-21.34 1.85-34.55 5.62-25 10.91-32.51 17.61-42 .86-1.22 1.75-2.47 2.65-3.79 1.44-2.08 3-4.1 4.67-6.23 7.47-9.61 15.93-20.49 13.92-40.95-.51-5.19-.76-8.83-.86-11.39a1 1 0 011.88-.59l.49.77 1.21 2c4.86 8 13.64 22.57 25.1 22.57a13.62 13.62 0 002.36-.21c23.39-3.93 51.9-30.25 52.17-30.51 3.12-3 2.84-6.14 1.64-7.91a5.18 5.18 0 00-6.45-1.72c-3.29 1.4-7.14 3.15-11.22 5-13.82 6.27-37 16.75-42.25 14.34a23.11 23.11 0 01-6.32-5.13 1 1 0 011.14-1.65c5.59 2.29 9.55 1.45 14.2-.08l1-.34c9.37-3.09 14.2-4.77 30.76-12.08a97.55 97.55 0 0116.26-5.93c4-1 6.42-1.63 7.71-4.34a6.65 6.65 0 00-.5-7.13c-1.53-1.87-4.07-2.57-7-1.9-3.22.75-4.7 3-6.41 4.49-2.4 2.05-5 4.16-17.19 8.65-27 10-34.58 10.61-45.21 3.43-9.84-6.69-15.15-13.23-15.15-16 0-2.13 5.45-5.7 8.71-7.84 1.33-.87 2.59-1.69 3.62-2.46 4.34-3.22 13-11.39 13.38-11.73 5.4-5.41 17.91-2.18 25 2.58a2.23 2.23 0 001.72.41 2.14 2.14 0 001.68-2.58c-4.2-17.46-.13-27.34 4-32.55a22.58 22.58 0 0117.48-8.48c12.81 0 21.76 10 21.76 24.42 0 11-2.82 16.79-5.48 20.3a1.73 1.73 0 01-2.58.18 1.78 1.78 0 01-.24-2.2A24.61 24.61 0 00290 114a16.58 16.58 0 00-16.84-16.67c-3.94 0-13.48 1.5-16.77 15.44a29.81 29.81 0 00-.34 11.07l.08.71c.9 7.38 15.3 12.51 27.23 15.51 11.36 2.85 13 6.22 8.84 19.63s3.11 26.23 5.7 29.57a78.3 78.3 0 018.31 12.47 93.8 93.8 0 016.62 16.48c2.17 6.79 4.05 12.65 10.63 21.22 11.07 14.4 17.66 48.64 15 78-.21 2.41-.53 4.29-.77 5.67-.43 2.53-.72 4.2.66 5.38s3.16.7 7.26-.63l3.43-1.09a109.33 109.33 0 0112.58-2.8 2.15 2.15 0 001.59-1.16c3.43-6.91 3.85-15.22 4-22.47q0-1.31.06-2.79c.19-7.77.45-18.93-2.95-32a1 1 0 011.93-.64 93 93 0 016.66 25.55c2.55 22.58-1.9 32.09-1.94 32.17a1.61 1.61 0 00.95 2.25 17.12 17.12 0 016.95 4.67c1.46 1.66.93 2.4-1.14 1.62a36.26 36.26 0 00-12.77-2.29c-10.4 0-18.09 4.95-21.51 9.19-3.19 3.94-3.7 7.67-3.83 11.27l-.06.05c-7.48-.75-12.94 1.21-17.47 6.21l-.08.09c-6.26 7.75-4 24.63-1.29 38.48 1.28 6.45 5.59 25.52 1.73 37.68zm96.1 10.07c-15.71 6.71-25.43 14.51-34 21.39-5.65 4.53-11 8.81-17.28 12.14-10.12 5.34-24.91 6.53-33.27-7.7-2.37-4-.71-9.86 1.58-17.95 3.05-10.75 7.23-25.46 3.71-44.65-.94-5.12-1.77-9.51-2.49-13.31C334 377 332.9 371.43 334 367c.63-2.45 3.43-3 5.87-3a20.83 20.83 0 012.63.19 29.51 29.51 0 007 12.1c5.7 5.86 13.63 8.83 23.56 8.85 2.1.17 25.94 1.55 36.54-22.4 1.46.18 3.65.7 4.3 2.3 1.28 3.19-.27 8.91-1.52 13.5-.9 3.31-1.68 6.16-1.63 8.37.31 16 11 22.78 25.83 32.16 1.79 1.13 3.66 2.31 5.55 3.54S445 425 445 426c-.52 4.79-20 13.16-26.45 15.91z"
						/>
					</svg>
					Linux
				</div>
				<div class="flex flex-row gap-1 justify-center items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						class="h-5 w-5 relative top-0.5"
						viewBox="0 0 512 512"
					>
						<path
							d="M349.13 136.86c-40.32 0-57.36 19.24-85.44 19.24-28.79 0-50.75-19.1-85.69-19.1-34.2 0-70.67 20.88-93.83 56.45-32.52 50.16-27 144.63 25.67 225.11 18.84 28.81 44 61.12 77 61.47h.6c28.68 0 37.2-18.78 76.67-19h.6c38.88 0 46.68 18.89 75.24 18.89h.6c33-.35 59.51-36.15 78.35-64.85 13.56-20.64 18.6-31 29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48z"
						/>
						<path
							d="M340.25 32c-24 1.63-52 16.91-68.4 36.86-14.88 18.08-27.12 44.9-22.32 70.91h1.92c25.56 0 51.72-15.39 67-35.11 14.72-18.77 25.88-45.37 21.8-72.66z"
						/>
					</svg>
					macOS
				</div>
			</div>
		</div>

		<div class="flex flex-wrap">
			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-gray-700 bg-opacity-60 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-gray-800 text-white flex-shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h2 class="text-white text-lg title-font font-medium">Secure</h2>
					</div>
					<div class="flex-grow">
						<h3 class="leading-relaxed text-base text-gray-300">
							Your codes are secured by AES 256bit encryption with your own password.
						</h3>
					</div>
				</div>
			</div>

			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-gray-700 bg-opacity-60 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-gray-800 text-white flex-shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
								/>
							</svg>
						</div>
						<h2 class="text-white text-lg title-font font-medium">Import codes</h2>
					</div>
					<div class="flex-grow">
						<h3 class="leading-relaxed text-base text-gray-300">
							Import form any 2FA TOTP QR code or import directly from Google Authenticator.
						</h3>
					</div>
				</div>
			</div>

			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-gray-700 bg-opacity-60 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-gray-800 text-white flex-shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
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
						</div>
						<h2 class="text-white text-lg title-font font-medium">Many shortcuts</h2>
					</div>
					<div class="flex-grow">
						<h3 class="leading-relaxed text-base text-gray-300">
							Easily open Authme with custom shortcuts. The app will start with your system for
							quick and easy access.
						</h3>
					</div>
				</div>
			</div>

			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-gray-700 bg-opacity-60 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-gray-800 text-white flex-shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<line x1="12" y1="18" x2="12.01" y2="18" />
								<path d="M9.172 15.172a4 4 0 0 1 5.656 0" />
								<path
									d="M6.343 12.343a7.963 7.963 0 0 1 3.864 -2.14m4.163 .155a7.965 7.965 0 0 1 3.287 2"
								/>
								<path
									d="M3.515 9.515a12 12 0 0 1 3.544 -2.455m3.101 -.92a12 12 0 0 1 10.325 3.374"
								/>
								<line x1="3" y1="3" x2="21" y2="21" />
							</svg>
						</div>
						<h2 class="text-white text-lg title-font font-medium">Completely offline</h2>
					</div>
					<div class="flex-grow">
						<h3 class="leading-relaxed text-base text-gray-300">
							You own your data, internet is only required for updates.
						</h3>
					</div>
				</div>
			</div>

			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-gray-700 bg-opacity-60 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-gray-800 text-white flex-shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
								/>
							</svg>
						</div>
						<h2 class="text-white text-lg title-font font-medium">Privacy in mind</h2>
					</div>
					<div class="flex-grow">
						<h3 class="leading-relaxed text-base text-gray-300">
							Authme is hidden from video capture and screenshots.
						</h3>
					</div>
				</div>
			</div>

			<div class="p-4 md:w-1/3">
				<div class="flex rounded-lg h-full bg-gray-700 bg-opacity-60 p-8 flex-col">
					<div class="flex items-center mb-3">
						<div
							class="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-gray-800 text-white flex-shrink-0"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<line x1="3" y1="3" x2="21" y2="21" />
								<path
									d="M18 18h-11c-2.598 0 -4.705 -2.015 -4.705 -4.5s2.107 -4.5 4.705 -4.5c.112 -.5 .305 -.973 .568 -1.408m2.094 -1.948c.329 -.174 .68 -.319 1.05 -.43c1.9 -.576 3.997 -.194 5.5 1c1.503 1.192 2.185 3.017 1.788 4.786h1a3.5 3.5 0 0 1 2.212 6.212"
								/>
							</svg>
						</div>
						<h2 class="text-white text-lg title-font font-medium">Easy export and backup</h2>
					</div>
					<div class="flex-grow">
						<p class="leading-relaxed text-base text-gray-300">
							You can export your 2FA codes anytime and you can create a backup of your codes very
							easily.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FEATURES IMAGES -->
<section>
	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
		<div class="lg:max-w-2xl lg:w-full md:w-1/2 w-5/6 p-2 bg-black bg-opacity-50 rounded-2xl">
			<img class="object-cover object-center rounded" alt="hero" src="./application.png" />
		</div>
		<div
			class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center"
		>
			<h1 class="sm:text-4xl text-3xl mb-4 font-medium text-white">
				All of your 2FA codes in one place
			</h1>
			<h2 class="mb-8 text-lg text-gray-300">
				You can see all of your imported codes in one place and quickly copy them with one click.
			</h2>
		</div>
	</div>

	<div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
		<div
			class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center"
		>
			<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
				Import your codes many ways
			</h1>
			<h2 class="mb-8 text-lg text-gray-300">
				Authme supports TOTP codes which you can find mostly everywhere. Already using Google
				Authenticator? You can import your existing codes easily.
			</h2>
		</div>
		<div class="lg:max-w-2xl lg:w-full md:w-1/2 w-5/6 p-2 bg-black bg-opacity-50 rounded-2xl">
			<img class="object-cover object-center rounded" alt="hero" src="./import.png" />
		</div>
	</div>
</section>

<section class="text-gray-400 bg-gray-800 body-font">
	<div class="container px-5 py-24 mx-auto">
		<div class="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
			<div class=" flex-grow sm:pr-16">
				<h1 class="text-2xl font-medium text-white">
					Authme is open source. Check out the source code on GitHub.
				</h1>
				<h2 class="text-gray text-xl">Contributions and ideas are always welcome!</h2>
			</div>
			<a class="button" href="https://github.com/levminer/authme"> GitHub </a>
		</div>
	</div>
</section>

<!-- DOWNLOADS -->
<section id="downloads" class="text-gray-400 body-font">
	<div class="container px-5 py-24 mx-auto">
		<div class="text-center mb-10">
			<h1 class="sm:text-1xl text-5xl font-bold text-center title-font text-white pb-14">
				Downloads
			</h1>
		</div>

		<div class="bg-gray-900 rounded-2xl pt-10 pb-10 small:w-11/12 mx-auto small:p-3">
			<div class="mx-auto flex justify-center flex-col items-center mb-10">
				<h1
					id="downloads-release"
					class="text-4xl font-medium text-center title-font text-white mb-4"
				>
					Latest release
				</h1>
				<button class="button mt-5">
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://github.com/levminer/authme/releases"
					>
						Release notes
					</a>
				</button>
			</div>

			<div class="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
				<div class="p-2 w-full">
					<div
						class="bg-gray-700 rounded-2xl flex flex-wrap p-16 h-full items-center justify-between"
					>
						<div class="flex flex-row gap-1 text-white">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 relative top-1 mx-1"
								viewBox="0 0 512 512"
								fill="currentColor"
							>
								<path
									d="M31.87 30.58H244.7v212.81H31.87zM266.89 30.58H479.7v212.81H266.89zM31.87 265.61H244.7v212.8H31.87zM266.89 265.61H479.7v212.8H266.89z"
								/>
							</svg>

							<h1 class="text-2xl font-medium">Windows Installer x64 (.exe)</h1>
						</div>

						<div
							class="title-font font-medium text-white flex flex-row flex-wrap justify-center items-end my-3 gap-3"
						>
							<a
								target="_blank"
								rel="noopener noreferrer"
								class="button"
								href="https://link.levminer.com/authme-microsoft-store"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									viewBox="0 0 512 512"
									fill="currentColor"
								>
									<path
										d="M31.87 30.58H244.7v212.81H31.87zM266.89 30.58H479.7v212.81H266.89zM31.87 265.61H244.7v212.8H31.87zM266.89 265.61H479.7v212.8H266.89z"
									/>
								</svg>
								Microsoft Store
							</a>

							<a class="button" href="https://api.levminer.com/api/v1/authme/release/windows">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								Download
							</a>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
				<div class="p-2 w-full">
					<div
						class="bg-gray-700 rounded-2xl flex flex-wrap md:justify-between p-16 h-full items-center"
					>
						<div class="flex flex-row gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 relative top-1 mx-1"
								fill="white"
								viewBox="0 0 512 512"
							>
								<path
									d="M443.66 405.05c-1.46-.79-2.85-1.54-4-2.2-6.47-3.83-13-10.52-11.85-17.83 2.42-15.94 2.89-23.47-.49-28.79a15.61 15.61 0 00-7.67-6.2v-.06c1.41-2.56 2.26-5.66 2.83-10.12 1.44-11-5-44-13.7-70.7-8.08-24.68-29.24-50-44.7-68.56l-3.61-4.34c-23.88-28.93-24.34-38.19-26.55-82.67-.32-6.47-.69-13.8-1.17-22C329.87 41.43 304 16 256 16c-25.2 0-44.62 7.15-57.72 21.26C187.79 48.55 182 64 182 80.78c0 29.52 2 53 2.15 54.29 1.4 35.7 1 41.22-8.31 57.55-2.23 3.93-8.38 10.87-14.89 18.21-8.48 9.57-18.09 20.41-23.36 29.22-3.77 6.31-5.88 12.63-8.11 19.33-3.4 10.21-7.26 21.78-18.15 36.57-12.57 17.07-15.52 29.61-11 47.45-4.94 6.45-4.83 14.37-4.75 20.23a25.84 25.84 0 01-.3 6.09c-2.29 7.59-12.42 9.4-22 10.18-1.58.12-3.1.21-4.55.29-7.26.39-13.53.74-17.13 6.3-3.47 5.36-1.12 13.8 2.14 25.48.72 2.58 1.46 5.25 2.19 8.06 1.83 7-.16 10.48-2.68 14.84-2.44 4.21-5.21 9-5.21 17.55 0 14.67 20 18 43.05 21.94 7.36 1.24 15 2.53 22.63 4.24a225.58 225.58 0 0134.08 10.68c9.72 3.73 17.4 6.68 26.43 6.68 16.18 0 28.25-9.77 39.92-19.21l2.15-1.75c5.53-4.49 21.5-4 34.34-3.64 3.46.1 6.73.2 9.65.2h6.22c13.48-.08 31.94-.18 42.23 2.5 3.75 1 6.2 3.72 9.29 7.19 5.87 6.56 13.17 14.75 33.39 14.75 19.39 0 29.55-8.71 41.32-18.8 7.16-6.13 14.56-12.48 25.07-17.86 3.92-2 7.62-3.87 11.08-5.61 22.64-11.38 35.11-17.65 35.11-27.82 0-9.91-12.24-16.5-20.34-20.86zM211.11 88.38a13.91 13.91 0 0112.47 9c1.95 5.55 1.81 10.42.21 12.94 0 0-.22-1-.36-1.44a14.85 14.85 0 00-6.44-8.59 11.35 11.35 0 00-8.94-1.47c-4.26 1.13-8.41 5-8.91 18.79-5.16-10.47-2.31-18 .92-23 2.31-3.73 7.47-6.33 11.05-6.23zm-17.5 375C192 479.24 175.2 479 170.09 478.59c-9.81-.82-21.66-4.69-33.13-8.43-4.52-1.47-9.19-3-13.73-4.34-13.2-3.89-30.12-6.74-43.72-9-3.22-.55-6.27-1.06-9.05-1.55s-4.61-1.27-5.2-2.3c-1-1.65.38-5.25 1.93-9.41C69.27 438 72.11 430.34 72 421c0-3.91-1.47-8.3-2.84-12.56-1.62-5-3.28-10.17-1.93-12.62 1.23-2.23 6.75-2.49 11.6-2.49h2.26c3.55 0 6.62.06 8.75-.53 6.51-1.81 14.86-6.92 17.81-13.88.9-2.17 1.37-6.94 2-14 .37-4.12.74-8.37 1.22-10.58a3.55 3.55 0 012.11-2.55c1.65-.77 6.78-1.91 18.63 4.08 11.18 5.65 22.88 25.84 34.2 45.37 3.56 6.14 6.92 11.94 10.3 17.36 14.04 22.54 18.83 31.6 17.5 44.8zm128.84-31.56a68.74 68.74 0 01-4.55 10.9.58.58 0 01-1.08-.42 56.61 56.61 0 002.11-18.43c-.25-4.73-.4-7.59-2.66-8.51s-4.26.83-9.45 5.54c-1.1 1-2.36 2.14-3.78 3.4-10.8 9.47-26.88 20.68-55.61 23.37-16.84 1.59-27.59-4.63-30.92-8.14a2.16 2.16 0 00-3.07-.08 2.23 2.23 0 00-.51 2.29c2.12 6.84 1.2 12.26-.49 16.19-.95 2.2-1.85 2.05-2-.34-.25-4.64-1-9.88-3-14.19-3.11-6.94-7-14.34-8.89-17.88v-.05c3.24-1.49 8.86-4.83 11.37-10.88s4.48-18-9.82-31.74c-6.28-6.05-22.1-17.16-36.06-27-10.9-7.65-22.17-15.56-23.65-17.51-4.49-5.89-6.37-9.3-6.94-19.65.07-2.3.13-4.59.19-6.89l.27-2.49a.58.58 0 011.15 0 63.07 63.07 0 002 9.72c1.08 3.73 2.4 7.58 3.62 9.18 3.19 4.22 7.56 7.39 11.67 8.49a5.48 5.48 0 005-.72c2.93-2.33 2.65-7.6 2.19-16.34-.47-9-1.11-21.34 1.85-34.55 5.62-25 10.91-32.51 17.61-42 .86-1.22 1.75-2.47 2.65-3.79 1.44-2.08 3-4.1 4.67-6.23 7.47-9.61 15.93-20.49 13.92-40.95-.51-5.19-.76-8.83-.86-11.39a1 1 0 011.88-.59l.49.77 1.21 2c4.86 8 13.64 22.57 25.1 22.57a13.62 13.62 0 002.36-.21c23.39-3.93 51.9-30.25 52.17-30.51 3.12-3 2.84-6.14 1.64-7.91a5.18 5.18 0 00-6.45-1.72c-3.29 1.4-7.14 3.15-11.22 5-13.82 6.27-37 16.75-42.25 14.34a23.11 23.11 0 01-6.32-5.13 1 1 0 011.14-1.65c5.59 2.29 9.55 1.45 14.2-.08l1-.34c9.37-3.09 14.2-4.77 30.76-12.08a97.55 97.55 0 0116.26-5.93c4-1 6.42-1.63 7.71-4.34a6.65 6.65 0 00-.5-7.13c-1.53-1.87-4.07-2.57-7-1.9-3.22.75-4.7 3-6.41 4.49-2.4 2.05-5 4.16-17.19 8.65-27 10-34.58 10.61-45.21 3.43-9.84-6.69-15.15-13.23-15.15-16 0-2.13 5.45-5.7 8.71-7.84 1.33-.87 2.59-1.69 3.62-2.46 4.34-3.22 13-11.39 13.38-11.73 5.4-5.41 17.91-2.18 25 2.58a2.23 2.23 0 001.72.41 2.14 2.14 0 001.68-2.58c-4.2-17.46-.13-27.34 4-32.55a22.58 22.58 0 0117.48-8.48c12.81 0 21.76 10 21.76 24.42 0 11-2.82 16.79-5.48 20.3a1.73 1.73 0 01-2.58.18 1.78 1.78 0 01-.24-2.2A24.61 24.61 0 00290 114a16.58 16.58 0 00-16.84-16.67c-3.94 0-13.48 1.5-16.77 15.44a29.81 29.81 0 00-.34 11.07l.08.71c.9 7.38 15.3 12.51 27.23 15.51 11.36 2.85 13 6.22 8.84 19.63s3.11 26.23 5.7 29.57a78.3 78.3 0 018.31 12.47 93.8 93.8 0 016.62 16.48c2.17 6.79 4.05 12.65 10.63 21.22 11.07 14.4 17.66 48.64 15 78-.21 2.41-.53 4.29-.77 5.67-.43 2.53-.72 4.2.66 5.38s3.16.7 7.26-.63l3.43-1.09a109.33 109.33 0 0112.58-2.8 2.15 2.15 0 001.59-1.16c3.43-6.91 3.85-15.22 4-22.47q0-1.31.06-2.79c.19-7.77.45-18.93-2.95-32a1 1 0 011.93-.64 93 93 0 016.66 25.55c2.55 22.58-1.9 32.09-1.94 32.17a1.61 1.61 0 00.95 2.25 17.12 17.12 0 016.95 4.67c1.46 1.66.93 2.4-1.14 1.62a36.26 36.26 0 00-12.77-2.29c-10.4 0-18.09 4.95-21.51 9.19-3.19 3.94-3.7 7.67-3.83 11.27l-.06.05c-7.48-.75-12.94 1.21-17.47 6.21l-.08.09c-6.26 7.75-4 24.63-1.29 38.48 1.28 6.45 5.59 25.52 1.73 37.68zm96.1 10.07c-15.71 6.71-25.43 14.51-34 21.39-5.65 4.53-11 8.81-17.28 12.14-10.12 5.34-24.91 6.53-33.27-7.7-2.37-4-.71-9.86 1.58-17.95 3.05-10.75 7.23-25.46 3.71-44.65-.94-5.12-1.77-9.51-2.49-13.31C334 377 332.9 371.43 334 367c.63-2.45 3.43-3 5.87-3a20.83 20.83 0 012.63.19 29.51 29.51 0 007 12.1c5.7 5.86 13.63 8.83 23.56 8.85 2.1.17 25.94 1.55 36.54-22.4 1.46.18 3.65.7 4.3 2.3 1.28 3.19-.27 8.91-1.52 13.5-.9 3.31-1.68 6.16-1.63 8.37.31 16 11 22.78 25.83 32.16 1.79 1.13 3.66 2.31 5.55 3.54S445 425 445 426c-.52 4.79-20 13.16-26.45 15.91z"
								/>
							</svg>

							<span class="title-font font-medium text-white">
								<h1 class="text-2xl">Linux Installer x64 (.appimage)</h1>
							</span>
						</div>

						<div
							class="title-font font-medium text-white flex flex-row flex-wrap justify-center items-end my-3 gap-3"
						>
							<a
								target="_blank"
								rel="noopener noreferrer"
								class="button"
								href="https://link.levminer.com/authme-snap-store"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									viewBox="0 0 32 32"
									fill="currentColor"
								>
									<path
										d="M18.406 17.823v-10.234l7.057 3.146zM4.932 31.354l8.656-16.297 3.797 3.792zM0 0.646l17.807 6.469v11.307zM29.073 7.115h-10.26l13.188 5.88z"
									/>
								</svg>
								Snap Store
							</a>

							<a class="button" href="https://api.levminer.com/api/v1/authme/release/linux">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								Download
							</a>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
				<div class="p-2 w-full">
					<div
						class="bg-gray-700 rounded-2xl flex flex-wrap md:justify-between p-16 h-full items-center"
					>
						<div class="flex flex-row gap-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 relative top-1 mx-1"
								fill="white"
								viewBox="0 0 512 512"
							>
								<path
									d="M349.13 136.86c-40.32 0-57.36 19.24-85.44 19.24-28.79 0-50.75-19.1-85.69-19.1-34.2 0-70.67 20.88-93.83 56.45-32.52 50.16-27 144.63 25.67 225.11 18.84 28.81 44 61.12 77 61.47h.6c28.68 0 37.2-18.78 76.67-19h.6c38.88 0 46.68 18.89 75.24 18.89h.6c33-.35 59.51-36.15 78.35-64.85 13.56-20.64 18.6-31 29-54.35-76.19-28.92-88.43-136.93-13.08-178.34-23-28.8-55.32-45.48-85.79-45.48z"
								/>
								<path
									d="M340.25 32c-24 1.63-52 16.91-68.4 36.86-14.88 18.08-27.12 44.9-22.32 70.91h1.92c25.56 0 51.72-15.39 67-35.11 14.72-18.77 25.88-45.37 21.8-72.66z"
								/>
							</svg>

							<span class="title-font font-medium text-white">
								<h1 class="text-2xl">macOS Installer Universal (.dmg)</h1>
							</span>
						</div>

						<div
							class="title-font font-medium text-white flex flex-row flex-wrap justify-center items-end my-3 gap-3"
						>
							<a class="button" href="https://api.levminer.com/api/v1/authme/release/mac">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								Download
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
