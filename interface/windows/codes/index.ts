import { textConverter } from "../../utils/convert"
import { TOTP } from "otpauth"
import * as clipboard from "@tauri-apps/plugin-clipboard-manager"
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
			if (settings.settings.codesDescription) {
				element.innerHTML = `
				<div class="flex flex-row justify-between">
					<div class="flex flex-col justify-start mb-3 overflow-hidden">
						<div class="flex overflow-hidden">
							<p id="name${i}" class="text-2xl font-medium whitespace-nowrap truncate overflow-hidden w-full">
								${issuers[i]}
							</p>
						</div>
						<div class="flex">
							<p id="code${i}" class="text-2xl text-gray-200" >-</p>
						</div>
					</div>
					<div class="flex items-center justify-between mb-3">
						<button
							id="button${i}"
							class="bg-white flex justify-center items-center font-medium rounded-full gap-1 hover:bg-gray-200 duration-200 px-4 text-black text-lg py-2"
							>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
								<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
							</svg>
							${language.common.copy}
						</button>
					</div>
					</div>
					<div class="pb-4 flex items-start">
						<p id="description${i}" class="text-lg text-gray-200 transparent-800 py-1 px-2 rounded-xl select-all truncate" >${names[i]}</p>
					</div>
					<div class="progressFull mb-3">
					<div id="progress${i}" class="progressFill" />
				</div>
				`
			} else {
				element.innerHTML = `
				<div class="flex flex-row justify-between">
					<div class="flex flex-col justify-start mb-3 overflow-hidden">
						<div class="flex overflow-hidden">
							<p id="name${i}" class="text-2xl font-medium whitespace-nowrap truncate w-full overflow-hidden">
								${issuers[i]}
							</p>
						</div>
						<div class="flex">
							<p id="code${i}" class="text-2xl text-gray-200" >-</p>
						</div>
					</div>
					<div class="flex items-center justify-between mb-3">
						<button
							id="button${i}"
							class="bg-white flex justify-center items-center font-medium rounded-full gap-1 hover:bg-gray-200 duration-200 px-4 text-black text-lg py-2"
							>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
								<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
							</svg>
							${language.common.copy}
						</button>
					</div>
					</div>
					<div class="progressFull mb-3">
					<div id="progress${i}" class="progressFill" />
				</div>
				`
			}

			// add div
			element.classList.add("code")
			element.setAttribute("id", `codes${i}`)

			document.querySelector(".content").appendChild(element)

			// get elements
			const code = document.querySelector(`#code${i}`)
			const progress = document.querySelector(`#progress${i}`)
			const button = document.querySelector(`#button${i}`)

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

			code.textContent = token

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

	// Save newly imported codes
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
}

const refreshCodes = (secrets: string[]) => {
	for (let i = 0; i < secrets.length; i++) {
		const code = document.querySelector(`#code${i}`)
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
		div.style.display = "block"
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

	logger.log("Codes saved")

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

			const codes = textConverter(state.importData + decryptedText, settings.settings.sortCodes)
			logger.log(`New codes merged with existing ones. Count: ${codes.names.length}`)
			generateCodeElements(codes)
		} else {
			// There are saved but not new ones
			const codes = textConverter(decryptedText, settings.settings.sortCodes)
			logger.log(`Existing codes loaded. Count: ${codes.names.length}`)
			generateCodeElements(codes)
		}

		document.querySelector<HTMLInputElement>(".search").select()
	} else {
		if (state.importData !== null) {
			// There are no saved codes, but new codes imported
			saveText = state.importData

			const codes = textConverter(state.importData, settings.settings.sortCodes)
			logger.log(`New codes imported and saved. Count: ${codes.names.length}`)
			generateCodeElements(codes)
		}
	}
}
