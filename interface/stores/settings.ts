import { invoke } from "@tauri-apps/api"
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
		settings: "CmdOrCtrl+Shift+s",
		exit: "CmdOrCtrl+Shift+d",
	},
}

// Setup auto launch on first start
if (build.dev === false && localStorage.settings === undefined) {
	invoke("auto_launch")
}

// Create store
export const settings = writable<LibSettings>(localStorage.settings ? JSON.parse(localStorage.settings) : defaultSettings)

// Listen for store events
settings.subscribe((data) => {
	console.log("Settings changed: ", data)

	localStorage.setItem("settings", JSON.stringify(data))
})

export const getSettings = (): LibSettings => {
	return get(settings)
}

export const setSettings = (newSettings: LibSettings) => {
	settings.set(newSettings)
}
