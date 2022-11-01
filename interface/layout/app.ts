import App from "./app.svelte"
import "../styles/index.css"
import { os, event, window, invoke } from "@tauri-apps/api"
import { getSettings } from "../stores/settings"
import { navigate } from "../utils/navigate"
import { getState } from "interface/stores/state"
import { dev } from "../../build.json"
import { optionalAnalyticsPayload } from "interface/utils/analytics"
import { checkForUpdate } from "interface/utils/update"
import logger from "interface/utils/logger"

const settings = getSettings()
const state = getState()

// Create the svelte app
const app = new App({
	target: document.body,
})

export default app

// Set background color if vibrancy not supported
const setBackground = async () => {
	const system = await os.type()
	const build = await os.version()

	if (system === "Windows_NT" && build < "10.0.22000") {
		document.querySelector("body").style.background = "black"
	}

	if (system === "Linux") {
		document.querySelector("body").style.background = "black"
	}
}

// TODO transparency
// setBackground()

// Tray settings open handler
event.listen("openSettings", (data: any) => {
	if (state.authenticated === true) {
		navigate("settings")
	}
})

// Tray navigate to codes handler
event.listen("openCodes", (data: any) => {
	const event: boolean = data.payload.event

	if (state.authenticated === true && location.pathname === "/idle") {
		navigate("codes")
	} else if (state.authenticated === true && location.pathname === "/codes" && event === false) {
		navigate("idle")
	}
})

// Listen for focus changes
window.appWindow.onFocusChanged((focused) => {
	if (focused.payload === true && state.authenticated === true) {
		if (location.pathname === "/codes") {
			document.querySelector<HTMLInputElement>(".search").select()
		}
	}
})

// Listen for close request
window.appWindow.onCloseRequested((event) => {
	if (settings.settings.minimizeToTray === true) {
		event.preventDefault()
		window.appWindow.hide()

		if (state.authenticated === true) {
			navigate("idle")
		}
	}
})

// Disable right click
document.addEventListener("contextmenu", (event) => {
	event.preventDefault()
})

// Handle launch options
const launchOptions = async () => {
	const args: string[] = await invoke("get_args")

	if (args[1] === "--minimized" && state.authenticated === true) {
		navigate("idle")
	}
}

launchOptions()

// Optional analytics
const optionalAnalytics = async () => {
	if (settings.settings.optionalAnalytics === true && dev === false) {
		const payload = JSON.stringify(await optionalAnalyticsPayload())

		try {
			fetch("https://api.levminer.com/api/v1/authme/analytics/post", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: payload,
			})
		} catch (error) {
			logger.error(`Failed to send analytics: ${error}`)
		}
	}
}

optionalAnalytics()
checkForUpdate()
