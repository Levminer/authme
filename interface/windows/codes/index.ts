import { textConverter } from "../../utils/convert"
import { TOTP } from "otpauth"
import { clipboard } from "@tauri-apps/api"
import { getSettings, setSettings } from "../../stores/settings"
import { getState, setState } from "../../stores/state"
import { decryptData, encryptData } from "interface/utils/encryption"
import logger from "interface/utils/logger"
import { getLanguage } from "@utils/language"

const settings = getSettings()
const state = getState()
const language = getLanguage()
let codesRefresher: NodeJS.Timeout
let searchQuery: LibSearchQuery[] = []
let saveText: string = ""

export const generateCodeElements = (data: LibImportFile) => {
	const names = data.names
	const secrets = data.secrets
	const issuers = data.issuers

	document.querySelector(".importCodes").style.display = "none"
	document.querySelector(".searchContainer").style.display = "flex"

	const generate = () => {
		for (let i = 0; i < names.length; i++) {
			// create div
			const element = document.createElement("div")

			// set div content
			if (settings.settings.codesDescription === false) {
				element.innerHTML = `
				<div class="mt-5 flex flex-row px-5">
					<div class="flex flex-1 justify-start">
						<h3 id="name${i}" tabindex="0" class="whitespace-nowrap mt-3 text-3xl font-normal focusRing rounded-2xl">-</h3>
					</div>
					<div class="flex flex-1 justify-center px-3">
						<p id="code${i}" tabindex="0" class="transparent-900 relative mt-1.5 w-[150px] select-all rounded-2xl py-3 px-5 text-2xl focusRing">-</p>
					</div>
					<div class="flex flex-1 justify-end">
						<h3 id="time${i}" tabindex="0" class="mt-3 text-3xl font-normal focusRing rounded-2xl">-</h3>
					</div>
				</div>
				<div class="mt-5 flex flex-col items-center justify-center">
					<div class="progress">
						<div id="progress${i}" class="progressFill" />
					</div>
				</div>
				<div class="mb-5 mt-5 flex items-center justify-center">
					<button id="button${i}" class="button w-[150px] py-3 px-5">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
						${language.common.copy}
					</button>
				</div>`
			} else {
				element.innerHTML = `
				<div class="mt-5 flex flex-row px-5">
					<div class="flex flex-1 justify-start">
						<h3 id="name${i}" tabindex="0" class="whitespace-nowrap mt-3 text-3xl font-normal focusRing rounded-2xl">-</h3>
					</div>
					<div class="flex flex-1 justify-center px-3">
						<p id="code${i}" tabindex="0" class="transparent-900 relative mt-1.5 w-[150px] select-all rounded-2xl py-3 px-5 text-2xl focusRing">-</p>
					</div>
					<div class="flex flex-1 justify-end">
						<h3 id="time${i}" tabindex="0" class="mt-3 text-3xl font-normal focusRing rounded-2xl">-</h3>
					</div>
				</div>
				<div class="mt-5 flex flex-col items-center justify-center">
					<div class="progress">
						<div id="progress${i}" class="progressFill" />
					</div>
				</div>
				<p tabindex="0" class="text-2xl transparent-900 py-3 px-5 rounded-2xl select-all mt-5" id="description${i}">Description</p>
				<div class="mb-5 mt-5 flex items-center justify-center">
					<button id="button${i}" class="button w-[150px] py-3 px-5">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
						${language.common.copy}
					</button>
				</div>`
			}

			// add div
			element.classList.add("code")
			element.setAttribute("id", `codes${i}`)

			document.querySelector(".content").appendChild(element)

			// get elements
			const name = document.querySelector(`#name${i}`)
			const code = document.querySelector(`#code${i}`)
			const time = document.querySelector(`#time${i}`)
			const description = document.querySelector(`#description${i}`)
			const progress = document.querySelector(`#progress${i}`)
			const button = document.querySelector(`#button${i}`)

			// blur codes
			if (settings.settings.blurCodes === true) {
				code.classList.add("blurCodes")
			}

			// description
			if (settings.settings.codesDescription === true) {
				description.textContent = names[i]
			}

			// add to query
			searchQuery.push({
				name: `${issuers[i].toLowerCase().trim()}`,
				description: `${names[i].toLowerCase().trim()}`,
			})

			// generate token
			const token = new TOTP({
				secret: secrets[i],
			}).generate()

			// get remaining time
			const remainingTime = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

			// progress bar value
			const value = remainingTime * (100 / 30)
			progress.style.width = `${value}%`

			name.textContent = issuers[i]
			code.textContent = token
			time.textContent = remainingTime.toString()

			button.addEventListener("click", () => {
				clipboard.writeText(code.textContent)

				button.innerHTML = `
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="m9 14 2 2 4-4"></path></svg>
				${language.common.copied}
				`

				setTimeout(() => {
					button.innerHTML = `
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path></svg>
					${language.common.copy}
					`
				}, 800)
			})
		}
	}

	generate()

	if (state.importData !== null) {
		saveCodes()
	}

	codesRefresher = setInterval(() => {
		try {
			refreshCodes(secrets)
		} catch (error) {
			logger.error("Error refreshing codes")
		}
	}, 500)

	// latest search from history
	const latestSearch = state.searchHistory

	if (latestSearch !== null && latestSearch.trim() !== "") {
		const searchBar: HTMLInputElement = document.querySelector(".search")
		searchBar.value = state.searchHistory

		search()
	}

	if (settings.settings.codesLayout === 0) {
		const main = document.querySelector(".main")
		const content = document.querySelector(".content")

		main.classList.remove("w-3/5")
		main.classList.add("w-4/5")

		content.classList.remove("flex-col")
		content.classList.add("flex-row")
	}
}

const refreshCodes = (secrets: string[]) => {
	for (let i = 0; i < secrets.length; i++) {
		const code = document.querySelector(`#code${i}`)
		const time = document.querySelector(`#time${i}`)
		const progress = document.querySelector(`#progress${i}`)

		// generate token
		const token = new TOTP({
			secret: secrets[i],
		}).generate()

		// generate time
		const remainingTime = 30 - Math.floor((new Date(Date.now()).getTime() / 1000.0) % 30)

		// progress bar
		const value = remainingTime * (100 / 30)
		progress.style.width = `${value}%`

		// set content
		code.textContent = token
		time.textContent = remainingTime.toString()
	}
}

export const stopCodesRefresher = () => {
	clearInterval(codesRefresher)
}

export const search = () => {
	const searchBar: HTMLInputElement = document.querySelector(".search")
	const input = searchBar.value.toLowerCase()
	let noResults = 0

	// restart
	for (let i = 0; i < searchQuery.length; i++) {
		const div = document.querySelector(`#codes${[i]}`)
		div.style.display = "flex"
	}

	document.querySelector(".noSearchResults").style.display = "none"

	// search algorithm
	for (let i = 0; i < searchQuery.length; i++) {
		let searchParameter: boolean

		if (settings.searchFilter.name === true && settings.searchFilter.description === false) {
			searchParameter = searchQuery[i].name.startsWith(input)
		} else if (settings.searchFilter.description === true && settings.searchFilter.name === false) {
			searchParameter = searchQuery[i].description.startsWith(input)
		} else {
			searchParameter = `${searchQuery[i].name} ${searchQuery[i].description}`.includes(input)
		}

		if (!searchParameter) {
			const div = document.querySelector(`#codes${[i]}`)
			div.style.display = "none"

			if (div.style.display === "none") {
				noResults++
			}
		}
	}

	// no search results
	if (searchQuery.length === noResults) {
		document.querySelector(".noSearchResults").style.display = "block"
		document.querySelector(".searchResult").textContent = input
	} else {
		// save results
		state.searchHistory = input
		setSettings(settings)
	}
}

const saveCodes = async () => {
	const encryptedText = await encryptData(saveText)

	state.importData = null
	settings.vault.codes = encryptedText

	setState(state)
	setSettings(settings)
}

export const loadCodes = async () => {
	searchQuery = []
	let savedCodes = false

	if (settings.vault.codes !== null) {
		// There are saved codes
		savedCodes = true
	} else {
		// No saved and no imported codes
		document.querySelector(".importCodes").style.display = "block"
	}

	if (savedCodes === true) {
		const decryptedText = await decryptData(settings.vault.codes)

		if (state.importData !== null) {
			// There are saved and new codes
			savedCodes = false
			saveText = state.importData + decryptedText

			generateCodeElements(textConverter(state.importData + decryptedText, settings.settings.sortCodes))
		} else {
			// There are saved but not new ones
			generateCodeElements(textConverter(decryptedText, settings.settings.sortCodes))
		}

		document.querySelector<HTMLInputElement>(".search").select()
	} else {
		if (state.importData !== null) {
			// There are no saved codes, but new codes imported
			saveText = state.importData

			generateCodeElements(textConverter(state.importData, settings.settings.sortCodes))
		}
	}
}
