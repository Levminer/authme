const { aes, password, localization } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")
const { app, dialog } = require("@electron/remote")
const { ipcRenderer: ipc } = require("electron")
const bcrypt = require("bcryptjs")
const path = require("path")
const fs = require("fs")

/**
 * Send error to main process
 */
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "landing", error })
}

/**
 * Start logger
 */
logger.getWindow("landing")

/**
 * Localization
 */
localization.localize("landing")

const lang = localization.getLang()

/**
 * If running in development
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
 * Create storage
 */
let storage = {}

if (dev === false) {
	const temp_storage = localStorage.getItem("storage")

	if (temp_storage === null) {
		localStorage.setItem("storage", JSON.stringify(storage))
	}
} else {
	const temp_storage = localStorage.getItem("dev_storage")

	if (temp_storage === null) {
		localStorage.setItem("dev_storage", JSON.stringify(storage))
	}
}

/**
 * Compare passwords
 */
const comparePasswords = () => {
	const password_input1 = Buffer.from(document.querySelector("#password_input1").value)
	const password_input2 = Buffer.from(document.querySelector("#password_input2").value)

	if (password_input1.toString().length > 64) {
		text.style.color = "#CC001B"
		text.textContent = lang.landing_text.maximum_password
	} else if (password_input1.toString().length < 8) {
		text.style.color = "#CC001B"
		text.textContent = lang.landing_text.minimum_password
	} else {
		if (password_input1.toString() == password_input2.toString()) {
			if (!password.search(password_input1.toString())) {
				logger.log("Passwords match!")

				text.style.color = "#28A443"
				text.textContent = lang.landing_text.passwords_match

				password_input1.fill(0)
				password_input2.fill(0)

				hashPasswords()
			} else {
				text.style.color = "#CC001B"
				text.textContent = lang.landing_text.top_1000_password
			}
		} else {
			logger.warn("Passwords dont match!")

			text.style.color = "#CC001B"
			text.textContent = lang.landing_text.passwords_dont_match
		}
	}
}

/**
 * Hash passwords
 */
const hashPasswords = async () => {
	const password_input = Buffer.from(document.querySelector("#password_input1").value)

	const salt = await bcrypt.genSalt(10)
	const hashed = await bcrypt.hash(password_input.toString(), salt)

	/**
	 * Read settings
	 * @type {LibSettings}
	 */
	settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	settings.security.require_password = true
	settings.security.password = hashed
	settings.security.key = aes.generateSalt().toString("base64")

	/** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

	storage.require_password = settings.security.require_password
	storage.password = hashed
	storage.key = settings.security.key

	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))

	dev ? localStorage.setItem("dev_storage", JSON.stringify(storage)) : localStorage.setItem("storage", JSON.stringify(storage))

	setInterval(() => {
		password_input.fill(0)

		ipc.send("toConfirm")

		location.reload()
	}, 1000)
}

/**
 * Don't require password
 */
const noPassword = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: [lang.button.yes, lang.button.no],
			type: "warning",
			defaultId: 1,
			cancelId: 1,
			noLink: true,
			message: lang.landing_dialog.no_password,
		})
		.then((result) => {
			if (result.response === 0) {
				text.style.color = "#28A443"
				text.textContent = lang.landing_text.please_wait

				/**
				 * Read settings
				 * @type{LibSettings}
				 */
				settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

				const salt = aes.generateSalt().toString("base64")
				const password = Buffer.from(aes.generateRandomKey(salt))

				settings.security.require_password = false

				/** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

				storage.require_password = settings.security.require_password
				storage.password = password.toString("base64")
				storage.key = salt

				dev ? localStorage.setItem("dev_storage", JSON.stringify(storage)) : localStorage.setItem("storage", JSON.stringify(storage))

				fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))

				setInterval(() => {
					password.fill(0)

					ipc.send("toApplicationFromLanding")

					location.reload()
				}, 1000)
			}
		})
}

/**
 * Show more options div
 */
let more_options_shown = false

const showMoreOptions = () => {
	const more_options = document.querySelector("#more_options")

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
 * Show password
 */
document.querySelector("#show_pass_0").addEventListener("click", () => {
	document.querySelector("#password_input1").setAttribute("type", "text")

	document.querySelector("#show_pass_0").style.display = "none"
	document.querySelector("#show_pass_01").style.display = "flex"
})

document.querySelector("#show_pass_01").addEventListener("click", () => {
	document.querySelector("#password_input1").setAttribute("type", "password")

	document.querySelector("#show_pass_0").style.display = "flex"
	document.querySelector("#show_pass_01").style.display = "none"
})

document.querySelector("#show_pass_1").addEventListener("click", () => {
	document.querySelector("#password_input2").setAttribute("type", "text")

	document.querySelector("#show_pass_1").style.display = "none"
	document.querySelector("#show_pass_11").style.display = "flex"
})

document.querySelector("#show_pass_11").addEventListener("click", () => {
	document.querySelector("#password_input2").setAttribute("type", "password")

	document.querySelector("#show_pass_1").style.display = "flex"
	document.querySelector("#show_pass_11").style.display = "none"
})
