const { app, dialog, clipboard } = require("@electron/remote")
const logger = require("@levminer/lib/logger/renderer")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const { sha, rsa } = require("@levminer/lib")
const path = require("path")

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "confirm", error: error })
}

// ? logger
logger.getWindow("confirm")

// ? if development
let dev = false
let integrity = false

if (app.isPackaged === false) {
	dev = true

	// check for integrity
	integrity = true
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

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

// ? init
const text = document.querySelector("#text")

document.querySelector("#password_input").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		if (integrity === false) {
			check_integrity()
		}

		setTimeout(() => {
			unhashPassword()
		}, 100)
	}
})

// ? check integrity
const check_integrity = () => {
	// read settings
	settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	// check integrity
	const storage = JSON.parse(localStorage.getItem("storage"))

	if (integrity == false) {
		try {
			logger.log(storage)

			if (settings.security.password !== storage.password || settings.security.require_password !== storage.require_password) {
				dialog
					.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						defaultId: 0,
						message: "Failed to check the integrity of the files. \n\nYou or someone messed with the settings file, shutting down for security reasons!",
					})
					.then((result) => {
						app.exit()
					})
			}
		} catch (error) {
			logger.error("Local storage not found")

			dialog
				.showMessageBox({
					title: "Authme",
					buttons: ["Close"],
					type: "error",
					defaultId: 0,
					message: "Failed to check the integrity of the files. \n\nYou or someone messed with the settings file, shutting down for security reasons!",
				})
				.then((result) => {
					app.exit()
				})
		}
	}
}

// ? compare
const unhashPassword = async () => {
	if (integrity === false) {
		check_integrity()
	}

	// read settings
	settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	// compare
	const password_input = Buffer.from(document.querySelector("#password_input").value)

	const compare = await bcrypt.compare(password_input.toString(), settings.security.password).then(logger.log("Passwords compared!"))

	if (compare == true) {
		ipc.send("send_password", password_input)

		text.style.color = "#28A443"
		text.textContent = "Passwords match! Please wait!"

		setInterval(() => {
			password_input.fill(0)

			ipc.send("to_application0")

			location.reload()
		}, 1000)
	} else {
		logger.warn("Passwords dont match!")

		text.style.color = "#CC001B"
		text.textContent = "Passwords don't match! Try again!"
	}
}

// ? forgot password
const forgotPassword = () => {
	dialog
		.showOpenDialog({
			title: "Choose backup file",
			properties: ["openFile"],
			filters: [{ name: "Key file", extensions: ["key"] }],
		})
		.then((result) => {
			canceled = result.canceled
			filepath = result.filePaths

			const loaded_key = Buffer.from(fs.readFileSync(filepath[0]))

			if (loaded_key.toString().startsWith("-----BEGIN RSA PRIVATE KEY-----")) {
				/**
				 * Load storage
				 * @type {LibStorage}
				 */
				let storage

				if (dev === true) {
					storage = JSON.parse(localStorage.getItem("dev_storage"))
				} else {
					storage = JSON.parse(localStorage.getItem("storage"))
				}

				const hash = Buffer.from(sha.generateHash(loaded_key.toString("base64")))

				if (hash.toString() === storage.hash) {
					const encrypted = Buffer.from(rsa.decrypt(loaded_key.toString(), Buffer.from(storage.backup_string, "base64")), "base64")

					dialog
						.showMessageBox({
							title: "Authme",
							buttons: ["Copy"],
							defaultId: 0,
							noLink: true,
							type: "info",
							message: "Backup key successfully decrypted! \n\nThe password is copied to your clipboard!",
						})
						.then((result) => {
							clipboard.writeText(encrypted.toString())

							if (result.response === 0) {
								clipboard.writeText(encrypted.toString())
							}

							loaded_key.fill(0)
							hash.fill()
							encrypted.fill(0)
						})
				} else {
					dialog.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						message: "This is not a matching backup key! \n\nThis backup key is not matching with the your backup key!",
					})

					loaded_key.fill(0)
					hash.fill(0)
				}
			} else {
				dialog.showMessageBox({
					title: "Authme",
					buttons: ["Close"],
					type: "error",
					message: "This is not a backup key! \n\nPlease choose another file!",
				})
			}
		})
}

// ? show password
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

let more_options_shown = false

/**
 * Show more options div
 */
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
