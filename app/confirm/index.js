const logger = require("@levminer/lib/logger/renderer")
const { app, dialog } = require("@electron/remote")
const { localization } = require("@levminer/lib")
const { ipcRenderer: ipc, shell } = require("electron")
const bcrypt = require("bcryptjs")
const path = require("path")
const fs = require("fs")

/**
 * Send error to main process
 */
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "confirm", error })
}

/**
 * Start logger
 */
logger.getWindow("confirm")

/**
 * Localization
 */
localization.localize("confirm")

const lang = localization.getLang()

/**
 * Check if running in development
 */
let dev = false

if (app.isPackaged === false) {
	dev = true
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

/**
 * Get info text
 */
const text = document.querySelector("#text")

/**
 * Confirm password on enter press
 */
document.querySelector("#password_input").addEventListener("keypress", (event) => {
	// @ts-ignore
	if (event.key === "Enter") {
		check_integrity()

		setTimeout(() => {
			unhashPassword()
		}, 100)
	}
})

/**
 * Check files integrity
 */
const check_integrity = () => {
	// read settings
	settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	// check integrity
	const storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

	try {
		if (settings.security.password !== storage.password || settings.security.require_password !== storage.require_password) {
			dialog
				.showMessageBox({
					title: "Authme",
					buttons: [lang.button.help, lang.button.close],
					type: "error",
					defaultId: 1,
					noLink: true,
					message: lang.dialog.integrity,
				})
				.then((res) => {
					if (res.response === 0) {
						shell.openExternal("https://github.com/Levminer/authme/issues")
					}

					app.exit()
				})
		}
	} catch (error) {
		logger.error("Local storage not found")

		dialog
			.showMessageBox({
				title: "Authme",
				buttons: [lang.button.help, lang.button.close],
				type: "error",
				defaultId: 1,
				noLink: true,
				message: lang.dialog.integrity,
			})
			.then((res) => {
				if (res.response === 0) {
					shell.openExternal("https://github.com/Levminer/authme/issues")
				}

				app.exit()
			})
	}
}

/**
 * Compare passwords
 */
let tries = 0

const unhashPassword = async () => {
	check_integrity()

	if (tries === 5) {
		setTimeout(() => {
			tries = 3

			text.textContent = lang.confirm_text.try_again
		}, 5000)

		return (text.textContent = lang.confirm_text.locked)
	}

	// read settings
	settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	// compare
	const password_input = Buffer.from(document.querySelector("#password_input").value)

	const compare = await bcrypt.compare(password_input.toString(), settings.security.password)

	if (compare == true) {
		ipc.invoke("sendPassword", password_input)

		text.style.color = "#28A443"
		text.textContent = lang.landing_text.passwords_match

		setTimeout(() => {
			password_input.fill(0)

			ipc.send("toApplicationFromConfirm")

			location.reload()
		}, 100)
	} else {
		logger.warn("Passwords dont match!")

		text.style.color = "#CC001B"
		text.textContent = lang.landing_text.passwords_dont_match

		tries++
	}
}

/**
 * Show more options div
 */
let more_options_shown = false

const showMoreOptions = () => {
	const more_options = document.querySelector(".moreOptions")

	if (more_options_shown === false) {
		more_options.style.visibility = "visible"

		setTimeout(() => {
			more_options.style.display = "block"
		}, 10)

		more_options_shown = true
	} else {
		more_options.style.display = "none"

		more_options_shown = false
	}
}

/**
 * Toggles window capture state
 */
const toggleWindowCapture = () => {
	const tgl0 = document.querySelector("#tgl0").checked
	const tgt0 = document.querySelector("#tgt0")

	if (tgl0 === false) {
		ipc.send("disableWindowCapture")
		tgt0.textContent = "Off"
	} else {
		tgt0.textContent = "On"
		ipc.send("enableWindowCapture")
	}
}

/**
 * Show passwords
 */
document.querySelector("#show_pass_0").addEventListener("click", () => {
	document.querySelector("#password_input").setAttribute("type", "text")

	document.querySelector("#show_pass_0").style.display = "none"
	document.querySelector("#show_pass_01").style.display = "flex"
})

document.querySelector("#show_pass_01").addEventListener("click", () => {
	document.querySelector("#password_input").setAttribute("type", "password")

	document.querySelector("#show_pass_0").style.display = "flex"
	document.querySelector("#show_pass_01").style.display = "none"
})
