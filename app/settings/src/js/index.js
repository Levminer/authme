const { shell, app, dialog, BrowserWindow } = require("@electron/remote")
const { convert, localization, time, password } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")
const { ipcRenderer: ipc } = require("electron")
const bcrypt = require("bcryptjs")
const path = require("path")
const fs = require("fs")

/**
 * Send error to main process
 */
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "settings", error })
}

/**
 * Start logger
 */
logger.getWindow("settings")

/**
 * Localization
 */
localization.localize("settings")

const lang = localization.getLang()

/**
 * If running in development
 */
let dev = false

if (app.isPackaged === false) {
	dev = true
}

// check if running on linux
if (process.platform !== "win32" && process.platform !== "darwin") {
	document.querySelector(".windowCapture").style.display = "none"
}

/**
 * Get Authme folder path
 */
const folder_path = dev ? path.join(app.getPath("appData"), "Levminer", "Authme Dev") : path.join(app.getPath("appData"), "Levminer", "Authme")

/**
 * Read settings
 * @type {LibSettings}
 */
let settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

/**
 * Refresh settings
 */
if (settings.security.require_password === null && settings.security.password === null) {
	const settings_refresher = setInterval(() => {
		try {
			settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

			/** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

			if (settings.security.require_password !== null || settings.security.password !== null) {
				clearInterval(settings_refresher)
			}
		} catch (error) {
			logger.error("Error refreshing settings and storage")
			clearInterval(settings_refresher)
		}
	}, 100)
}

/**
 * Elements
 */
const drp0 = document.querySelector("#sortButton")
const drp2 = document.querySelector("#languageButton")
const tgl0 = document.querySelector("#tgl0")
const tgt0 = document.querySelector("#tgt0")
const tgl1 = document.querySelector("#tgl1")
const tgt1 = document.querySelector("#tgt1")
const tgl3 = document.querySelector("#tgl3")
const tgt3 = document.querySelector("#tgt3")
const tgl5 = document.querySelector("#tgl5")
const tgt5 = document.querySelector("#tgt5")
const tgl6 = document.querySelector("#tgl6")
const tgt6 = document.querySelector("#tgt6")
const tgl7 = document.querySelector("#tgl7")
const tgt7 = document.querySelector("#tgt7")

// launch on startup
let launch_startup_state = settings.settings.launch_on_startup
if (launch_startup_state === true) {
	tgt0.textContent = "On"
	tgl0.checked = true
} else {
	tgt0.textContent = "Off"
	tgl0.checked = false
}

// close to tray
let close_tray_state = settings.settings.close_to_tray
if (close_tray_state === true) {
	tgt1.textContent = "On"
	tgl1.checked = true
} else {
	tgt1.textContent = "Off"
	tgl1.checked = false
}

// codes description
let codes_description_state = settings.settings.codes_description
if (codes_description_state === true) {
	tgt3.textContent = "On"
	tgl3.checked = true
} else {
	tgt3.textContent = "Off"
	tgl3.checked = false
}

// search history
let search_state = settings.settings.search_history
if (search_state === true) {
	tgt5.textContent = "On"
	tgl5.checked = true
} else {
	tgt5.textContent = "Off"
	tgl5.checked = false
}

// reset after copy
let reset_copy_state = settings.settings.reset_after_copy
if (reset_copy_state === true) {
	tgt6.textContent = "On"
	tgl6.checked = true
} else {
	tgt6.textContent = "Off"
	tgl6.checked = false
}

// sort
const sort_number = settings.settings.sort

if (sort_number === 1) {
	drp0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
	</svg>
	<span class="pointer-events-none">A-Z</span>`
} else if (sort_number === 2) {
	drp0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
	</svg> 
	<span class="pointer-events-none">Z-A</span>`
} else {
	drp0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none relative top-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
	</svg>
	<span class="pointer-events-none">${lang.text.default}</span>`
}

// language
switch (settings.settings.language) {
	case "en":
		drp2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" viewBox="0 0 36 36">
		<path fill="#B22334" d="M35.445 7C34.752 5.809 33.477 5 32 5H18v2h17.445zM0 25h36v2H0zm18-8h18v2H18zm0-4h18v2H18zM0 21h36v2H0zm4 10h28c1.477 0 2.752-.809 3.445-2H.555c.693 1.191 1.968 2 3.445 2zM18 9h18v2H18z" />
		<path fill="#EEE" d="M.068 27.679c.017.093.036.186.059.277.026.101.058.198.092.296.089.259.197.509.333.743L.555 29h34.89l.002-.004c.135-.233.243-.483.332-.741.034-.099.067-.198.093-.301.023-.09.042-.182.059-.275.041-.22.069-.446.069-.679H0c0 .233.028.458.068.679zM0 23h36v2H0zm0-4v2h36v-2H18zm18-4h18v2H18zm0-4h18v2H18zM0 9c0-.233.03-.457.068-.679C.028 8.542 0 8.767 0 9zm.555-2l-.003.005L.555 7zM.128 8.044c.025-.102.06-.199.092-.297-.034.098-.066.196-.092.297zM18 9h18c0-.233-.028-.459-.069-.68-.017-.092-.035-.184-.059-.274-.027-.103-.059-.203-.094-.302-.089-.258-.197-.507-.332-.74.001-.001 0-.003-.001-.004H18v2z" />
		<path fill="#3C3B6E" d="M18 5H4C1.791 5 0 6.791 0 9v10h18V5z" />
		<path
		fill="#FFF"
		d="M2.001 7.726l.618.449-.236.725L3 8.452l.618.448-.236-.725L4 7.726h-.764L3 7l-.235.726zm2 2l.618.449-.236.725.617-.448.618.448-.236-.725L6 9.726h-.764L5 9l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L9 9l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L13 9l-.235.726zm-8 4l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L5 13l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L9 13l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L13 13l-.235.726zm-6-6l.618.449-.236.725L7 8.452l.618.448-.236-.725L8 7.726h-.764L7 7l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L11 7l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L15 7l-.235.726zm-12 4l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L3 11l-.235.726zM6.383 12.9L7 12.452l.618.448-.236-.725.618-.449h-.764L7 11l-.235.726h-.764l.618.449zm3.618-1.174l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L11 11l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L15 11l-.235.726zm-12 4l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L3 15l-.235.726zM6.383 16.9L7 16.452l.618.448-.236-.725.618-.449h-.764L7 15l-.235.726h-.764l.618.449zm3.618-1.174l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L11 15l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L15 15l-.235.726z"
		/>
		</svg>
		English (US)`
		break

	case "hu":
		drp2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" viewBox="0 0 36 36">
		<path fill="#EEE" d="M0 14h36v8H0z" />
		<path fill="#CD2A3E" d="M32 5H4C1.791 5 0 6.791 0 9v5h36V9c0-2.209-1.791-4-4-4z" />
		<path fill="#436F4D" d="M4 31h28c2.209 0 4-1.791 4-4v-5H0v5c0 2.209 1.791 4 4 4z" />
		</svg>
		Hungarian (Magyar)`
		break

	default:
		drp2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none relative top-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
		</svg>
		${lang.text.default}`
		break
}

// hardware
let hardware_state = settings.settings.hardware_acceleration
if (hardware_state === false) {
	tgt7.textContent = "Off"
	tgl7.checked = false
} else {
	tgt7.textContent = "On"
	tgl7.checked = true
}

/**
 * Launch Authme on system startup
 */
const launchStartup = () => {
	if (launch_startup_state == true) {
		settings.settings.launch_on_startup = false

		save()

		tgt0.textContent = "Off"
		tgl0.checked = false

		launch_startup_state = false

		ipc.send("disableStartup")
	} else {
		settings.settings.launch_on_startup = true

		save()

		tgt0.textContent = "On"
		tgl0.checked = true

		launch_startup_state = true

		ipc.send("enableStartup")
	}
}

/**
 * Close Authme to tray when closing the window
 */
const closeTray = () => {
	if (close_tray_state == true) {
		settings.settings.close_to_tray = false

		save()

		tgt1.textContent = "Off"
		close_tray_state = false

		ipc.invoke("saveWindowPosition")
	} else {
		settings.settings.close_to_tray = true

		save()

		tgt1.textContent = "On"
		close_tray_state = true

		ipc.invoke("saveWindowPosition")
	}
}

/**
 * Toggles window capture
 */
const toggleWindowCapture = () => {
	const tgl2 = document.querySelector("#tgl2").checked
	const tgt2 = document.querySelector("#tgt2")

	if (tgl2 == true) {
		tgt2.textContent = "On"

		ipc.send("enableWindowCapture")
	} else {
		tgt2.textContent = "Off"

		ipc.send("disableWindowCapture")
	}
}

/**
 * Toggles window capture switch if this option is switched somewhere else
 */
const toggleWindowCaptureSwitch = () => {
	const tgl2 = document.querySelector("#tgl2")
	const tgt2 = document.querySelector("#tgt2")

	if (tgl2.checked === false) {
		tgt2.textContent = "On"
		tgl2.checked = true
	} else {
		tgt2.textContent = "Off"
		tgl2.checked = false
	}
}

/**
 * Clear all data
 */
const clearData = () => {
	dialog
		.showMessageBox(BrowserWindow.getFocusedWindow(), {
			title: "Authme",
			buttons: [lang.button.yes, lang.button.no],
			defaultId: 1,
			cancelId: 1,
			noLink: true,
			type: "warning",
			message: lang.settings_dialog.clear_data,
		})
		.then((result) => {
			if (result.response === 0) {
				dialog
					.showMessageBox(BrowserWindow.getFocusedWindow(), {
						title: "Authme",
						buttons: [lang.button.yes, lang.button.no],
						defaultId: 1,
						cancelId: 1,
						noLink: true,
						type: "warning",
						message: lang.settings_dialog.confirm_clear_data,
					})
					.then(async (result) => {
						if (result.response === 0) {
							// delete folders
							try {
								await fs.promises.rm(folder_path, { recursive: true, force: true })
							} catch (error) {
								logger.log("Error deleting folders", error)
							}

							// remove startup shortcut
							if (dev === false) {
								ipc.send("disableStartup")
							}

							// clear storage
							if (dev === false) {
								localStorage.removeItem("storage")
							} else {
								localStorage.removeItem("dev_storage")
							}

							// exit aoo
							setTimeout(() => {
								app.exit()
							}, 300)
						}
					})
			}
		})
}

/**
 * Codes description state
 */
const codesDescription = () => {
	const toggle = () => {
		if (codes_description_state === true) {
			settings.settings.codes_description = false

			save()

			tgt3.textContent = "Off"
			tgl3.checked = false

			codes_description_state = false
		} else {
			settings.settings.codes_description = true

			save()

			tgt3.textContent = "On"
			tgl3.checked = true

			codes_description_state = true
		}
	}

	toggle()
	reloadApplicationWindow()
}

/**
 * Save search results
 */
const searchHistory = () => {
	const toggle = () => {
		if (search_state === true) {
			settings.settings.search_history = false

			save()

			tgt5.textContent = "Off"
			tgl5.checked = false

			search_state = false
		} else {
			settings.settings.search_history = true

			save()

			tgt5.textContent = "On"
			tgl5.checked = true

			search_state = true
		}
	}

	toggle()
	reloadApplicationWindow()
}

/**
 * Reset search after copy
 */
const resetCopy = () => {
	const toggle = () => {
		if (reset_copy_state === true) {
			settings.settings.reset_after_copy = false

			save()

			tgt6.textContent = "Off"
			tgl6.checked = false

			reset_copy_state = false
		} else {
			settings.settings.reset_after_copy = true

			save()

			tgt6.textContent = "On"
			tgl6.checked = true

			reset_copy_state = true
		}
	}

	toggle()
	reloadApplicationWindow()
}

/**
 * Turn on hardware acceleration
 */
const hardwareAcceleration = () => {
	const toggle = () => {
		if (hardware_state === true) {
			settings.settings.hardware_acceleration = false

			save()

			tgt7.textContent = "Off"
			tgl7.checked = false

			hardware_state = false
		} else {
			settings.settings.hardware_acceleration = true

			save()

			tgt7.textContent = "On"
			tgl7.checked = true

			hardware_state = true
		}
	}

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: [lang.button.yes, lang.button.no, lang.button.cancel],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: lang.settings_dialog.restart,
		})
		.then((result) => {
			if (result.response === 0) {
				toggle()
				restart()
			}

			if (result.response === 1) {
				toggle()
			}
		})
}

/**
 * Sort codes dropdown
 */
let sort_shown = false

// show dropdown
const sortDropdown = () => {
	const sort_content = document.querySelector("#sortContent")

	if (sort_shown === false) {
		sort_content.style.visibility = "visible"

		setTimeout(() => {
			sort_content.style.display = "block"
		}, 10)

		sort_shown = true
	} else {
		sort_content.style.display = ""

		sort_shown = false
	}
}

// choose option
const sortDropdownChoose = (id) => {
	const sort_content = document.querySelector("#sortContent")
	const sort_button = document.querySelector("#sortButton")

	const sort = () => {
		switch (id) {
			case 0:
				sort_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
					   </svg> ${lang.text.default}`

				settings.settings.sort = null
				break

			case 1:
				sort_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
					   </svg> A-Z`

				settings.settings.sort = 1
				break

			case 2:
				sort_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
					  </svg> Z-A`

				settings.settings.sort = 2
				break
		}
	}

	sort_content.style.display = ""
	sort_shown = false

	sort()
	save()

	ipc.send("reloadApplicationWindow")
}

/**
 * Choose language dropdown
 */
let language_shown = false

// show dropdown
const languageDropdown = () => {
	const language_content = document.querySelector("#languageContent")

	if (language_shown === false) {
		language_content.style.visibility = "visible"

		setTimeout(() => {
			language_content.style.display = "block"
		}, 10)

		language_shown = true
	} else {
		language_content.style.display = ""

		language_shown = false
	}
}

// choose option
const languageDropdownChoose = (id) => {
	const language_button = document.querySelector("#languageButton")

	const toggle = () => {
		switch (id) {
			case "en":
				language_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" viewBox="0 0 36 36">
				<path fill="#B22334" d="M35.445 7C34.752 5.809 33.477 5 32 5H18v2h17.445zM0 25h36v2H0zm18-8h18v2H18zm0-4h18v2H18zM0 21h36v2H0zm4 10h28c1.477 0 2.752-.809 3.445-2H.555c.693 1.191 1.968 2 3.445 2zM18 9h18v2H18z" />
				<path fill="#EEE" d="M.068 27.679c.017.093.036.186.059.277.026.101.058.198.092.296.089.259.197.509.333.743L.555 29h34.89l.002-.004c.135-.233.243-.483.332-.741.034-.099.067-.198.093-.301.023-.09.042-.182.059-.275.041-.22.069-.446.069-.679H0c0 .233.028.458.068.679zM0 23h36v2H0zm0-4v2h36v-2H18zm18-4h18v2H18zm0-4h18v2H18zM0 9c0-.233.03-.457.068-.679C.028 8.542 0 8.767 0 9zm.555-2l-.003.005L.555 7zM.128 8.044c.025-.102.06-.199.092-.297-.034.098-.066.196-.092.297zM18 9h18c0-.233-.028-.459-.069-.68-.017-.092-.035-.184-.059-.274-.027-.103-.059-.203-.094-.302-.089-.258-.197-.507-.332-.74.001-.001 0-.003-.001-.004H18v2z" />
				<path fill="#3C3B6E" d="M18 5H4C1.791 5 0 6.791 0 9v10h18V5z" />
				<path
				fill="#FFF"
				d="M2.001 7.726l.618.449-.236.725L3 8.452l.618.448-.236-.725L4 7.726h-.764L3 7l-.235.726zm2 2l.618.449-.236.725.617-.448.618.448-.236-.725L6 9.726h-.764L5 9l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L9 9l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L13 9l-.235.726zm-8 4l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L5 13l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L9 13l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L13 13l-.235.726zm-6-6l.618.449-.236.725L7 8.452l.618.448-.236-.725L8 7.726h-.764L7 7l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L11 7l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L15 7l-.235.726zm-12 4l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L3 11l-.235.726zM6.383 12.9L7 12.452l.618.448-.236-.725.618-.449h-.764L7 11l-.235.726h-.764l.618.449zm3.618-1.174l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L11 11l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L15 11l-.235.726zm-12 4l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L3 15l-.235.726zM6.383 16.9L7 16.452l.618.448-.236-.725.618-.449h-.764L7 15l-.235.726h-.764l.618.449zm3.618-1.174l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L11 15l-.235.726zm4 0l.618.449-.236.725.617-.448.618.448-.236-.725.618-.449h-.764L15 15l-.235.726z"
				/>
				</svg>
				English (US)`

				settings.settings.language = "en"
				break

			case "hu":
				language_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6 pointer-events-none" viewBox="0 0 36 36">
				<path fill="#EEE" d="M0 14h36v8H0z" />
				<path fill="#CD2A3E" d="M32 5H4C1.791 5 0 6.791 0 9v5h36V9c0-2.209-1.791-4-4-4z" />
				<path fill="#436F4D" d="M4 31h28c2.209 0 4-1.791 4-4v-5H0v5c0 2.209 1.791 4 4 4z" />
				</svg>
				Hungarian (Magyar)`

				settings.settings.language = "hu"
				break

			default:
				language_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="pointer-events-none relative top-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
				</svg>
				${lang.text.default}`

				settings.settings.language = null
				break
		}

		save()
	}

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: [lang.button.yes, lang.button.no, lang.button.cancel],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: lang.settings_dialog.restart,
		})
		.then((result) => {
			if (result.response === 0) {
				toggle()
				restart()
			}

			if (result.response === 1) {
				toggle()
			}
		})
}

/**
 * Save settings to disk
 */
const save = () => {
	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), convert.fromJSON(settings))
}

/**
 * Send feedback
 */
const provideFeedback = () => {
	ipc.send("provideFeedback")
}

/*
 * Open latest log
 */
const latestLog = () => {
	logger.log("Used issuers", storage.issuers)
	logger.log("Settings", settings.settings)
	logger.log("Security", settings.security)
	logger.log("Experimental features", settings.experimental)

	ipc.send("logs")
}

/**
 * Open logs folder
 */
const logsFolder = () => {
	shell.openPath(path.join(folder_path, "logs"))
}

/* Experimental docs */
const githubIssues = () => {
	shell.openExternal("https://github.com/Levminer/authme/issues")
}

/**
 * Hide window
 */
const hide = () => {
	ipc.send("toggleSettings")
}

/**
 * Menu
 */
document.querySelector(".general").disabled = true
document.querySelector(".general").classList.add("buttonmselected")

/**
 * Remove menu button styles
 */
const removeButtonStyles = () => {
	document.querySelector(".shortcuts").classList.remove("buttonmselected")
	document.querySelector(".general").classList.remove("buttonmselected")
	document.querySelector(".experimental").classList.remove("buttonmselected")
	document.querySelector(".codes").classList.remove("buttonmselected")
}

// control menu

const menu = (name) => {
	storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

	let i

	if (name === "shortcuts") {
		storage.settings_page = "shortcuts"
		dev ? localStorage.setItem("dev_storage", JSON.stringify(storage)) : localStorage.setItem("storage", JSON.stringify(storage))

		removeButtonStyles()

		document.querySelector(".shortcuts").classList.add("buttonmselected")

		document.querySelector(".shortcuts").disabled = true
		document.querySelector(".general").disabled = false
		document.querySelector(".experimental").disabled = false
		document.querySelector(".codes").disabled = false

		// @ts-ignore
		window.location = `${`${window.location}`.replace(/#[A-Za-z0-9_]*$/, "")}#header`
	} else if (name === "general") {
		storage.settings_page = "general"

		removeButtonStyles()

		document.querySelector(".general").classList.add("buttonmselected")

		document.querySelector(".general").disabled = true
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".experimental").disabled = false
		document.querySelector(".codes").disabled = false

		// @ts-ignore
		window.location = `${`${window.location}`.replace(/#[A-Za-z0-9_]*$/, "")}#header`
	} else if (name === "experimental") {
		storage.settings_page = "experimental"

		removeButtonStyles()

		document.querySelector(".experimental").classList.add("buttonmselected")

		document.querySelector(".experimental").disabled = true
		document.querySelector(".general").disabled = false
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".codes").disabled = false

		// @ts-ignore
		window.location = `${`${window.location}`.replace(/#[A-Za-z0-9_]*$/, "")}#header`
	} else if (name === "codes") {
		storage.settings_page = "codes"

		removeButtonStyles()

		document.querySelector(".codes").classList.add("buttonmselected")

		document.querySelector(".experimental").disabled = false
		document.querySelector(".general").disabled = false
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".codes").disabled = true

		// @ts-ignore
		window.location = `${`${window.location}`.replace(/#[A-Za-z0-9_]*$/, "")}#header`
	}

	const tabcontent = document.getElementsByClassName("tabcontent")
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none"
	}

	const tablinks = document.getElementsByClassName("tablinks")
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "")
	}

	document.getElementById(name).style.display = "block"

	dev ? localStorage.setItem("dev_storage", JSON.stringify(storage)) : localStorage.setItem("storage", JSON.stringify(storage))
}

let /** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

try {
	if (storage.settings_page !== "general" && storage.settings_page !== undefined) {
		menu(storage.settings_page)
	}
} catch (error) {
	console.log("Error getting settings page")
}

/**
 * Restart Authme
 */
const restart = () => {
	setTimeout(() => {
		app.relaunch()
		app.quit()
	}, 300)
}

/**
 * Show About dialog
 */
const about = () => {
	ipc.send("about")
}

/**
 * Reload application window
 */
const reloadApplicationWindow = () => {
	ipc.send("reloadApplicationWindow")

	/** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))
}

/**
 * Dismiss dialog on click outside
 */
window.addEventListener("click", (event) => {
	const sort_content = document.querySelector("#sortContent")
	const sort_button = document.querySelector("#sortButton")
	const language_content = document.querySelector("#languageContent")
	const language_button = document.querySelector("#languageButton")

	if (event.target != sort_button) {
		sort_content.style.display = ""

		sort_shown = false
	}

	if (event.target != language_button) {
		language_content.style.display = ""

		language_shown = false
	}
})

/**
 * Build number
 */
const buildNumber = async () => {
	const info = await ipc.invoke("info")

	if (info.build_number.startsWith("alpha")) {
		document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${info.authme_version} - Build ${info.build_number}`
		document.querySelector(".build").style.display = "block"
	} else if (info.build_number.startsWith("beta")) {
		document.querySelector(".build-content").textContent = `You are running a beta version of Authme - Version ${info.authme_version} - Build ${info.build_number}`
		document.querySelector(".build").style.display = "block"
	}
}

buildNumber()
