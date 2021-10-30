const bcrypt = require("bcryptjs")
const fs = require("fs")
const { app, dialog } = require("@electron/remote")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const { aes, rsa, sha } = require("@levminer/lib")
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

let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = dev ? path.join(folder, "Levminer", "Authme Dev") : path.join(folder, "Levminer", "Authme")

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
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
		text.style.color = "#A30015"
		text.textContent = "Maximum password length is 64 characters!"
	} else if (password_input1.toString().length < 8) {
		text.style.color = "#A30015"
		text.textContent = "Minimum password length is 8 characters!"
	} else {
		if (password_input1.toString() == password_input2.toString()) {
			logger.log("Passwords match!")

			text.style.color = "#28A443"
			text.textContent = "Passwords match! Please wait!"

			password_input1.fill(0)
			password_input2.fill(0)

			hashPasswords()
		} else {
			logger.warn("Passwords dont match!")

			text.style.color = "#A30015"
			text.textContent = "Passwords don't match! Try again!"
		}
	}
}

// ? hash password
const hashPasswords = async () => {
	const password_input = Buffer.from(document.querySelector("#password_input1").value)
	const new_encryption = document.querySelector("#tgl0").checked

	const salt = await bcrypt.genSalt(10)

	const hashed = await bcrypt.hash(password_input.toString(), salt).then(logger.log("Hash completed!"))

	/**
	 * Read settings
	 * @type {LibSettings}
	 */
	const file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

	file.security.require_password = true
	file.security.password = hashed

	if (new_encryption === true) {
		file.security.new_encryption = true
		file.security.key = aes.generateSalt().toString("base64")
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

	storage.require_password = file.security.require_password
	storage.password = hashed
	storage.new_encryption = file.security.new_encryption
	storage.key = file.security.key

	if (storage.backup_key !== undefined) {
		const encrypted = rsa.encrypt(Buffer.from(storage.backup_key, "base64").toString(), password_input.toString("base64"))

		storage.backup_string = encrypted
	}

	if (dev === true) {
		localStorage.setItem("dev_storage", JSON.stringify(storage))
	} else {
		localStorage.setItem("storage", JSON.stringify(storage))
	}

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))

	setInterval(() => {
		password_input.fill(0)

		ipc.send("to_confirm")

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
			message: "Are you sure? \n\nThis way nothing will protect your codes.",
		})
		.then((result) => {
			if (result.response === 0) {
				const new_encryption = document.querySelector("#tgl0").checked

				text.style.color = "#28A443"
				text.textContent = "Please wait!"

				/**
				 * Read settings
				 * @type{LibSettings}
				 */
				const file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

				const salt = aes.generateSalt().toString("base64")
				const password = Buffer.from(aes.generateRandomKey(salt))

				file.security.require_password = false

				if (new_encryption === true) {
					file.security.new_encryption = true
				} else {
					file.security.new_encryption = false
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

				storage.require_password = file.security.require_password
				storage.password = password.toString("base64")
				storage.new_encryption = file.security.new_encryption
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

				fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))

				setInterval(() => {
					password.fill(0)

					ipc.send("to_application1")

					location.reload()
				}, 1000)
			}
		})
}

// ? encryption method toggle
const encryptionMethodToggle = () => {
	const tgl0 = document.querySelector("#tgl0").checked
	const tgt0 = document.querySelector("#tgt0")

	if (tgl0 === false) {
		tgt0.textContent = "Off"
	} else {
		tgt0.textContent = "On"
	}
}

// ?  generate backup key

const generateKey = () => {
	const keys = Buffer.from(rsa.generateKeys())
	const public_key = Buffer.from(keys.toString().split("@")[0])
	let private_key = Buffer.from(keys.toString().split("@")[1])

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Copy"],
			defaultId: 0,
			noLink: true,
			type: "info",
			message: "Please save this key to a secure location, anyone with this key can decrypt your codes! \n\nYou can only copy this key now, after closing this dialog you can't copy it again!",
		})
		.then((result) => {
			navigator.clipboard.writeText(private_key.toString())

			if (result.response === 0) {
				navigator.clipboard.writeText(private_key.toString())
			}

			navigator.clipboard.readText().then((text) => {
				private_key = Buffer.from(text)

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

				storage.backup_key = public_key.toString("base64")
				storage.hash = sha.generateHash(private_key.toString("base64"))

				if (dev === true) {
					localStorage.setItem("dev_storage", JSON.stringify(storage))
				} else {
					localStorage.setItem("storage", JSON.stringify(storage))
				}

				keys.fill(0)
				public_key.fill(0)
				private_key.fill(0)
			})
		})
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
