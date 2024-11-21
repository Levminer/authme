import { invoke } from "@tauri-apps/api/core"
import { writable, get } from "svelte/store"
import build from "../../build.json"

const defaultSettings: LibSettings = {
	info: {
		version: build.version,
		build: build.number,
		date: build.date,
	},

	security: {
		requireAuthentication: null,
		hardwareAuthentication: false,
		password: null,
		hardwareKey: null,
	},

	settings: {
		language: 0,
		launchOnStartup: true,
		minimizeToTray: true,
		optionalAnalytics: true,
		codesDescription: false,
		blurCodes: false,
		sortCodes: 0,
		codesLayout: 0,
	},

	searchFilter: {
		name: true,
		description: false,
	},

	vault: {
		codes: null,
	},

	shortcuts: {
		show: "CmdOrCtrl+Shift+a",
		settings: "None",
		exit: "CmdOrCtrl+Shift+d",
	},

	banners: {
		sponsor: null,
	},
}

// Setup auto launch on first start
if (build.dev === false && localStorage.settings === undefined) {
	invoke("enable_auto_launch")
}

// Create store
export const settings = writable<LibSettings>(localStorage.settings ? JSON.parse(localStorage.settings) : defaultSettings)

// Listen for store events
settings.subscribe((data) => {
	console.log("Settings changed: ", data)

	if (data.settings.language === undefined) {
		data.settings.language = 0
	}

	if (data.banners === undefined) {
		data.banners = {}
	}

	if (data.banners.sponsor === undefined) {
		data.banners.sponsor = null
	}

	localStorage.setItem("settings", JSON.stringify(data))
})

export const getSettings = (): LibSettings => {
	return get(settings)
}

export const setSettings = (newSettings: LibSettings) => {
	settings.set(newSettings)
}
