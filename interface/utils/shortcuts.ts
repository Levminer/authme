import { globalShortcut, invoke, window } from "@tauri-apps/api"
import { exit } from "@tauri-apps/api/process"
import { getSettings, setSettings } from "interface/stores/settings"
import { getState } from "interface/stores/state"
import { navigate } from "./navigate"
import { getLanguage } from "@utils/language"

const language = getLanguage()
const settings = getSettings()
const state = getState()
let modify = true
let inputName: HTMLInputElement

export const shortcuts = [
	{ id: "show", name: language.menu.show },
	{ id: "settings", name: language.menu.settings },
	{ id: "exit", name: language.menu.exit },
]
const defaultShortcuts = ["CmdOrCtrl+Shift+a", "None", "CmdOrCtrl+Shift+d"]

/**
 * Delete specified shortcut
 */
export const deleteShortcut = (id: number) => {
	const input = document.querySelector(`#shortcut${id}`)

	input.value = "None"

	settings.shortcuts[shortcuts[id].id] = input.value
	setSettings(settings)

	registerShortcuts()
}

/**
 * Reset specified shortcut
 */
export const resetShortcut = (id: number) => {
	const input = document.querySelector(`#shortcut${id}`)

	input.value = defaultShortcuts[id]

	settings.shortcuts[shortcuts[id].id] = input.value
	setSettings(settings)

	registerShortcuts()
}

/**
 * Test if a character is ASCII
 */
const isASCII = (str: string): boolean => {
	// eslint-disable-next-line no-control-regex
	return /^[\x00-\x7F]*$/.test(str)
}

/**
 * Detect pressed keyboard combination
 * @param {KeyboardEvent} event
 */
const getKeyboardCombination = (event: KeyboardEvent) => {
	let key = event.key

	if (isASCII(event.key) === false) {
		key = "a"
	}

	if (key === "Control" || key === "Shift" || key === "Alt") {
		key = "a"
	}

	if (event.ctrlKey === true) {
		inputName.value = `CmdOrCtrl+${key.toLowerCase()}`
	}

	if (event.altKey === true) {
		inputName.value = `Alt+${key.toLowerCase()}`
	}

	if (event.shiftKey === true) {
		inputName.value = `Shift+${key.toLowerCase()}`
	}

	if (event.ctrlKey === true && event.shiftKey === true) {
		inputName.value = `CmdOrCtrl+Shift+${key.toLowerCase()}`
	}

	if (event.ctrlKey === true && event.altKey === true) {
		inputName.value = `CmdOrCtrl+Alt+${key.toLowerCase()}`
	}

	if (event.shiftKey === true && event.altKey === true) {
		inputName.value = `Shift+Alt+${key.toLowerCase()}`
	}
}

/**
 * Edit inputName=d shortcut
 */
export const editShortcut = (id: number) => {
	let input: HTMLInputElement = document.querySelector(`#shortcut${id}`)
	inputName = input

	globalShortcut.unregisterAll()

	if (modify === true) {
		input.value = "Press any key combination"
		input.style.color = "#28A443"

		document.addEventListener("keydown", getKeyboardCombination)

		modify = false
	} else {
		input = document.querySelector(`#shortcut${id}`)

		if (input.value === "Press any key combination") {
			input.value = "None"
		}

		document.removeEventListener("keydown", getKeyboardCombination)

		input.style.color = "white"

		settings.shortcuts[shortcuts[id].id] = input.value
		setSettings(settings)

		modify = true

		registerShortcuts()
	}
}

export const registerShortcuts = () => {
	globalShortcut.unregisterAll()

	if (settings.shortcuts.show !== "None") {
		globalShortcut.register(settings.shortcuts.show, async () => {
			await invoke("update_tray")

			const windowShown = await window.appWindow.isVisible()

			if (windowShown === true) {
				window.appWindow.hide()

				if (state.authenticated === true && location.pathname === "/codes") {
					navigate("idle")
				}
			} else {
				await window.appWindow.show()
				await window.appWindow.unminimize()
				await window.appWindow.setFocus()

				if (state.authenticated === true && location.pathname === "/idle") {
					navigate("codes")
				}
			}
		})
	}

	if (settings.shortcuts.settings !== "None") {
		globalShortcut.register(settings.shortcuts.settings, async () => {
			const windowShown = await window.appWindow.isVisible()

			if (windowShown === false) {
				await window.appWindow.show()
				await window.appWindow.unminimize()
				await window.appWindow.setFocus()
			} else {
				window.appWindow.hide()
			}

			if (state.authenticated === true) {
				navigate("settings")
			}
		})
	}

	if (settings.shortcuts.exit !== "None") {
		globalShortcut.register(settings.shortcuts.exit, async () => {
			exit()
		})
	}
}

registerShortcuts()
