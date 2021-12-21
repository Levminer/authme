const bcrypt = require("bcryptjs")
const fs = require("fs")
const { app, dialog } = require("@electron/remote")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const { aes, rsa, sha, password } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "landing", error: error })
}

// ? logger
logger.getWindow("landing")

// ? init
const text = document.querySelector("#text")

// ? if development
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

// ? create storage
const storage = {}

if (dev === false) {
	temp_storage = localStorage.getItem("storage")

	if (temp_storage === null) {
		localStorage.setItem("storage", JSON.stringify(storage))
	}
} else {
	temp_storage = localStorage.getItem("dev_storage")

	if (temp_storage === null) {
		localStorage.setItem("dev_storage", JSON.stringify(storage))
	}
}

// ? match passwords
const comparePasswords = () => {
	const password_input1 = Buffer.from(document.querySelector("#password_input1").value)
	const password_input2 = Buffer.from(document.querySelector("#password_input2").value)

	if (password_input1.toString().length > 64) {
		text.style.color = "#CC001B"
		text.textContent = "Maximum password length is 64 characters!"
	} else if (password_input1.toString().length < 8) {
		text.style.color = "#CC001B"
		text.textContent = "Minimum password length is 8 characters!"
	} else {
		if (password_input1.toString() == password_input2.toString()) {
			if (!password.search(password_input1.toString())) {
				logger.log("Passwords match!")

				text.style.color = "#28A443"
				text.textContent = "Passwords match! Please wait!"

				password_input1.fill(0)
				password_input2.fill(0)

				hashPasswords()
			} else {
				text.style.color = "#CC001B"
				text.textContent = "This password is on the list of the top 1000 most common passwords. Please choose a more secure password!"
			}
		} else {
			logger.warn("Passwords dont match!")

			text.style.color = "#CC001B"
			text.textContent = "Passwords don't match! Try again!"
		}
	}
}

// ? hash password
const hashPasswords = async () => {
	const result = await dialog.showMessageBox({
		title: "Authme",
		buttons: ["Yes", "No"],
		type: "warning",
		defaultId: 0,
		cancelId: 1,
		noLink: true,
		message: "Do you want to create a backup key? \n\nIn case you forget your password you can use this backup key to retrieve them.",
	})

	if (result.response === 0) {
		await generateBackupKey()
	}

	const password_input = Buffer.from(document.querySelector("#password_input1").value)

	const salt = await bcrypt.genSalt(10)
	const hashed = await bcrypt.hash(password_input.toString(), salt).then(logger.log("Hash completed!"))

	/**
	 * Read settings
	 * @type {LibSettings}
	 */
	settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	settings.security.require_password = true
	settings.security.password = hashed
	settings.security.key = aes.generateSalt().toString("base64")

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

	storage.require_password = settings.security.require_password
	storage.password = hashed
	storage.key = settings.security.key

	if (storage.backup_key !== undefined) {
		const encrypted = rsa.encrypt(Buffer.from(storage.backup_key, "base64").toString(), password_input.toString("base64"))

		storage.backup_string = encrypted
	}

	if (dev === true) {
		localStorage.setItem("dev_storage", JSON.stringify(storage))
	} else {
		localStorage.setItem("storage", JSON.stringify(storage))
	}

	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))

	setInterval(() => {
		password_input.fill(0)

		ipc.send("toConfirm")

		location.reload()
	}, 1000)
}

// ? no password
const noPassword = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No"],
			type: "warning",
			defaultId: 1,
			cancelId: 1,
			noLink: true,
			message: "Are you sure? \n\nThis way everyone with access to your computer can access your codes too.",
		})
		.then((result) => {
			if (result.response === 0) {
				text.style.color = "#28A443"
				text.textContent = "Please wait!"

				/**
				 * Read settings
				 * @type{LibSettings}
				 */
				settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

				const salt = aes.generateSalt().toString("base64")
				const password = Buffer.from(aes.generateRandomKey(salt))

				settings.security.require_password = false

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

				storage.require_password = settings.security.require_password
				storage.password = password.toString("base64")
				storage.key = salt.toString("base64")

				if (storage.backup_key !== undefined) {
					const encrypted = rsa.encrypt(Buffer.from(storage.backup_key, "base64").toString(), password.toString("base64"))

					storage.backup_string = encrypted
				}

				if (dev === true) {
					localStorage.setItem("dev_storage", JSON.stringify(storage))
				} else {
					localStorage.setItem("storage", JSON.stringify(storage))
				}

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
 * Generate a backup key which encrypts the password
 */
const generateBackupKey = async () => {
	const keys = Buffer.from(rsa.generateKeys())
	const public_key = Buffer.from(keys.toString().split("@")[0])
	const private_key = Buffer.from(keys.toString().split("@")[1])

	const result = await dialog.showMessageBox({
		title: "Authme",
		buttons: ["Save", "Close"],
		defaultId: 0,
		cancelId: 1,
		noLink: true,
		type: "info",
		message: "Please save this key to a secure location, anyone with this key can decrypt your codes! \n\nYou can only save this key now, after closing this dialog you can't save it again!",
	})

	if (result.response === 0) {
		await dialog
			.showSaveDialog({
				title: "Save as Text file",
				filters: [{ name: "Key file", extensions: ["key"] }],
				defaultPath: "~/authme_backup.key",
			})
			.then((result) => {
				canceled = result.canceled
				output = result.filePath

				if (canceled === false) {
					fs.writeFile(output, private_key, (err) => {
						if (err) {
							logger.error(`Error creating file - ${err}`)
						} else {
							logger.log("Text file created")
						}

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

						const saved_key = fs.readFileSync(output)

						storage.backup_key = public_key.toString("base64")
						storage.hash = sha.generateHash(saved_key.toString("base64"))

						if (dev === true) {
							localStorage.setItem("dev_storage", JSON.stringify(storage))
						} else {
							localStorage.setItem("storage", JSON.stringify(storage))
						}

						keys.fill(0)
						public_key.fill(0)
						private_key.fill(0)
					})
				}
			})
			.catch((err) => {
				keys.fill(0)
				public_key.fill(0)
				private_key.fill(0)

				logger.error(`Failed to save - ${err}`)
			})
	}
}

// ? show password

// input 1
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

// input 2
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
