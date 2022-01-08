const { shell, app, dialog, BrowserWindow, screen } = require("@electron/remote")
const logger = require("@levminer/lib/logger/renderer")
const { ipcRenderer: ipc } = require("electron")
const { convert } = require("@levminer/lib")
const path = require("path")
const fs = require("fs")

/**
 * Send error to main process
 */
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "settings", error: error })
}

/**
 * Start logger
 */
logger.getWindow("application")

/**
 * Get app information
 */
const res = ipc.sendSync("info")

/**
 * Show build number if version is pre release
 */
if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
} else if (res.build_number.startsWith("beta")) {
	document.querySelector(".build-content").textContent = `You are running a beta version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

// set app version
document.querySelector(".about").innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg> Authme ${res.authme_version}`

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
const settings_refresher = setInterval(() => {
	settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	if (settings.security.require_password !== null || settings.security.password !== null) {
		clearInterval(settings_refresher)

		logger.log("Settings refresh completed")
	}
}, 100)

// Get current window
const currentWindow = BrowserWindow.getFocusedWindow()

/**
 * Elements
 */
const drp0 = document.querySelector("#dropdownButton0")
const drp1 = document.querySelector("#dropdownButton1")

const tgl0 = document.querySelector("#tgl0")
const tgt0 = document.querySelector("#tgt0")
const tgl1 = document.querySelector("#tgl1")
const tgt1 = document.querySelector("#tgt1")
const tgl3 = document.querySelector("#tgl3")
const tgt3 = document.querySelector("#tgt3")
const tgl4 = document.querySelector("#tgl4")
const tgt4 = document.querySelector("#tgt4")
const tgl5 = document.querySelector("#tgl5")
const tgt5 = document.querySelector("#tgt5")
const tgl6 = document.querySelector("#tgl6")
const tgt6 = document.querySelector("#tgt6")
const tgl7 = document.querySelector("#tgl7")
const tgt7 = document.querySelector("#tgt7")
const tgl8 = document.querySelector("#tgl8")
const tgt8 = document.querySelector("#tgt8")

// import screen capture
let screen_capture_state = settings.experimental.screen_capture
if (screen_capture_state === true) {
	tgt8.textContent = "On"
	tgl8.checked = true
} else {
	tgt8.textContent = "Off"
	tgl8.checked = false
}

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

	ipc.send("enableTray")
} else {
	tgt1.textContent = "Off"
	tgl1.checked = false

	ipc.send("disableTray")
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

// blur codes
let blur_codes_state = settings.settings.blur_codes
if (blur_codes_state === true) {
	tgt4.textContent = "On"
	tgl4.checked = true
} else {
	tgt4.textContent = "Off"
	tgl4.checked = false
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
const sort_number = settings.experimental.sort

if (sort_number === 1) {
	drp0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
	</svg> A-Z`
} else if (sort_number === 2) {
	drp0.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
	</svg> Z-A`
}

// display
drp1.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
	</svg>
	Display #${settings.settings.default_display}
	`

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

		ipc.send("disableTray")
	} else {
		settings.settings.close_to_tray = true

		save()

		tgt1.textContent = "On"
		close_tray_state = true

		ipc.send("enableTray")
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
		.showMessageBox(currentWindow, {
			title: "Authme",
			buttons: ["Yes", "No"],
			defaultId: 1,
			cancelId: 1,
			noLink: true,
			type: "warning",
			message: "Are you sure you want to clear all data? \n\nThis cannot be undone!",
		})
		.then((result) => {
			if (result.response === 0) {
				dialog
					.showMessageBox(currentWindow, {
						title: "Authme",
						buttons: ["Yes", "No"],
						defaultId: 1,
						cancelId: 1,
						noLink: true,
						type: "warning",
						message: "Are you absolutely sure? \n\nThere is no way back!",
					})
					.then(async (result) => {
						if (result.response === 0) {
							// clear codes
							await fs.promises.rm(folder_path, { recursive: true, force: true }, (err) => {
								if (err) {
									return logger.error("Error deleting settings folder", err.stack)
								} else {
									logger.log("Setting folder deleted")
								}
							})

							// remove startup shortcut
							if (dev === false) {
								ipc.sendSync("disableStartup")
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
	reload()
}

/**
 * Blur codes
 */
const blurCodes = () => {
	const toggle = () => {
		if (blur_codes_state === true) {
			settings.settings.blur_codes = false

			save()

			tgt4.textContent = "Off"
			tgl4.checked = false

			blur_codes_state = false
		} else {
			settings.settings.blur_codes = true

			save()

			tgt4.textContent = "On"
			tgl4.checked = true

			blur_codes_state = true
		}
	}

	toggle()
	reload()
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
	reload()
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
	reload()
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
			buttons: ["Yes", "No", "Cancel"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
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
let dropdown_state = false

// show dropdown
const dropdown = () => {
	const dropdown_content = document.querySelector("#dropdownContent0")

	if (dropdown_state === false) {
		dropdown_content.style.visibility = "visible"

		setTimeout(() => {
			dropdown_content.style.display = "block"
		}, 10)

		dropdown_state = true
	} else {
		dropdown_content.style.display = ""

		dropdown_state = false
	}
}

// choose option
const dropdownChoose = (id) => {
	const dropdown_button = document.querySelector("#dropdownButton0")

	const sort = () => {
		switch (id) {
			case 0:
				dropdown_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
					 </svg> Default`

				settings.experimental.sort = null
				break

			case 1:
				dropdown_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
					 </svg> A-Z`

				settings.experimental.sort = 1
				break

			case 2:
				dropdown_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
					</svg> Z-A`

				settings.experimental.sort = 2
				break
		}
	}

	dropdown()
	sort()
	save()

	ipc.send("reloadApplicationWindow")
}

/**
 * Save settings to disk
 */
const save = () => {
	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), convert.fromJSON(settings))
}

/**
 * Feedback buttons
 */
const rateAuthme = () => {
	ipc.send("rateAuthme")
}

const starAuthme = () => {
	ipc.send("starAuthme")
}

/**
 * Send feedback
 */
const provideFeedback = () => {
	ipc.send("provideFeedback")
}

/**
 * Hide info dialog
 */
const showInfo = () => {
	document.querySelector(".info").style.display = "block"
}

/**
 * Hide update dialog
 */
const showUpdate = () => {
	document.querySelector(".update").style.display = "block"
}

/**
 * Open Authme folder
 */
const authmeFolder = () => {
	shell.showItemInFolder(app.getPath("exe"))
}

/**
 * Open setting folder
 */
const settingsFolder = () => {
	shell.openPath(folder_path)
}

/**
 * Open cache folder
 */
const cacheFolder = () => {
	shell.openPath(path.join(app.getPath("appData"), "Authme"))
}

/*
 * Open latest log
 */
const latestLog = () => {
	ipc.send("logs")
}

/**
 * Open logs folder
 */
const logsFolder = () => {
	shell.openPath(path.join(folder_path, "logs"))
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
document.querySelector(".settings").disabled = true
document.querySelector(".settings").classList.add("buttonmselected")
let shortcut = false

/**
 * Remove menu button styles
 */
const removeButtonStyles = () => {
	document.querySelector(".shortcuts").classList.remove("buttonmselected")
	document.querySelector(".settings").classList.remove("buttonmselected")
	document.querySelector(".experimental").classList.remove("buttonmselected")
	document.querySelector(".codes").classList.remove("buttonmselected")
}

// control menu
const menu = (evt, name) => {
	let i

	if (name === "shortcuts") {
		removeButtonStyles()

		document.querySelector(".shortcuts").classList.add("buttonmselected")

		document.querySelector(".shortcuts").disabled = true
		document.querySelector(".settings").disabled = false
		document.querySelector(".experimental").disabled = false
		document.querySelector(".codes").disabled = false

		window.location = `${`${window.location}`.replace(/#[A-Za-z0-9_]*$/, "")}#header`

		shortcut = true

		checkForIssuers()

		ipc.send("shortcuts")
	} else if (name === "setting") {
		removeButtonStyles()

		document.querySelector(".settings").classList.add("buttonmselected")

		document.querySelector(".settings").disabled = true
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".experimental").disabled = false
		document.querySelector(".codes").disabled = false

		window.location = `${`${window.location}`.replace(/#[A-Za-z0-9_]*$/, "")}#header`

		if (shortcut === true) {
			ipc.send("shortcuts")

			shortcut = false
		}
	} else if (name === "experimental") {
		removeButtonStyles()

		document.querySelector(".experimental").classList.add("buttonmselected")

		document.querySelector(".experimental").disabled = true
		document.querySelector(".settings").disabled = false
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".codes").disabled = false

		window.location = `${`${window.location}`.replace(/#[A-Za-z0-9_]*$/, "")}#header`

		if (shortcut === true) {
			ipc.send("shortcuts")

			shortcut = false
		}
	} else if (name === "codes") {
		removeButtonStyles()

		document.querySelector(".codes").classList.add("buttonmselected")

		document.querySelector(".experimental").disabled = false
		document.querySelector(".settings").disabled = false
		document.querySelector(".shortcuts").disabled = false
		document.querySelector(".codes").disabled = true

		window.location = `${`${window.location}`.replace(/#[A-Za-z0-9_]*$/, "")}#header`

		if (shortcut === true) {
			ipc.send("shortcuts")

			shortcut = false
		}
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
	evt.currentTarget.className += " active"
}

/**
 * Restart Authme
 */
const restart = () => {
	setTimeout(() => {
		app.relaunch()
		app.exit()
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
const reload = () => {
	ipc.send("reloadApplicationWindow")
}

/**
 * Dismiss dialog on click outside
 */
window.addEventListener("click", (event) => {
	const dropdown_content0 = document.querySelector("#dropdownContent0")
	const dropdown_button0 = document.querySelector("#dropdownButton0")
	const dropdown_content1 = document.querySelector("#dropdownContent1")
	const dropdown_button1 = document.querySelector("#dropdownButton1")
	const sort_svg = document.querySelector("#sortSvg")
	const sort_path = document.querySelector("#sortPath")
	const link0 = document.querySelector("#link0")
	const link1 = document.querySelector("#link1")
	const link2 = document.querySelector("#link2")

	if (event.target != dropdown_button0 && event.target != sort_svg && event.target != sort_path && event.target != link0 && event.target != link1 && event.target != link2) {
		dropdown_content0.style.display = ""

		dropdown_state = false
	}

	if (event.target != dropdown_content1 && event.target != dropdown_button1) {
		dropdown_content1.style.display = ""

		display_state = false
	}
})

/**
 * Display release notes
 */
const releaseNotes = () => {
	ipc.send("releaseNotes")
}

/**
 * Download manual update
 */
const manualUpdate = () => {
	ipc.send("manualUpdate")
}

/**
 * Display auto update download info
 */
ipc.on("updateInfo", (event, info) => {
	document.querySelector("#updateText").textContent = `Downloading update: ${info.download_percent}% - ${info.download_speed}MB/s (${info.download_transferred}MB/${info.download_total}MB)`
})

/**
 * Display auto update popup if update available
 */
const updateAvailable = () => {
	document.querySelector(".autoupdate").style.display = "block"
}

/**
 * Display restart button if download finished
 */
const updateDownloaded = () => {
	document.querySelector("#updateText").textContent = "Successfully downloaded update! Please restart the app, Authme will install the updates in the background and restart automatically."
	document.querySelector("#updateButton").style.display = "block"
	document.querySelector("#updateClose").style.display = "block"
}

/**
 * Restart app after the download finished
 */
const updateRestart = () => {
	ipc.send("updateRestart")
}

/**
 * Toggle import screen capture
 */
const screenCapture = () => {
	const toggle = () => {
		if (screen_capture_state === true) {
			settings.experimental.screen_capture = false

			save()

			tgt8.textContent = "Off"
			tgl8.checked = false

			screen_capture_state = false
		} else {
			settings.experimental.screen_capture = true

			save()

			tgt8.textContent = "On"
			tgl8.checked = true

			screen_capture_state = true
		}
	}

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No", "Cancel"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
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
 * Get screens
 */
const displays = screen.getAllDisplays()
const displayChooser = document.querySelector("#dropdownContent1")

for (let i = 1; i < displays.length + 1; i++) {
	const element = document.createElement("a")

	element.innerHTML = `
	<a href="#" onclick="displayChoose(${i})" class="block no-underline text-xl px-2 py-2 transform duration-200 ease-in text-black hover:bg-gray-600 hover:text-white">
	<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
	</svg>
	Display #${i}
	</a>
	`

	displayChooser.appendChild(element)
}

/**
 * Toggle display dropdown
 */
let display_state = false
const display = () => {
	const dropdown_content = document.querySelector("#dropdownContent1")

	if (display_state === false) {
		dropdown_content.style.visibility = "visible"

		setTimeout(() => {
			dropdown_content.style.display = "block"
		}, 10)

		display_state = true
	} else {
		dropdown_content.style.display = ""

		display_state = false
	}
}

const displayChoose = (id) => {
	const toggle = () => {
		drp1.innerHTML = `
		<svg xmlns="http://www.w3.org/2000/svg" class="relative top-1 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
		</svg>
		Display #${id}
		`

		settings.settings.default_display = id
		save()

		display()
	}

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No", "Cancel"],
			defaultId: 2,
			cancelId: 2,
			noLink: true,
			type: "warning",
			message: "If you want to change this setting you have to restart the app! \n\nDo you want to restart it now?",
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
