const electron = require("electron")
const { app, dialog, shell } = require("@electron/remote")
const { aes, convert } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")
const fs = require("fs")
const path = require("path")
const qrcode = require("qrcode")
const ipc = electron.ipcRenderer

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "export", error: error })
}

// ? logger
logger.getWindow("export")

// ? if development
let dev = false

if (app.isPackaged === false) {
	dev = true
}

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

// ? init codes for save to qr codes
const codes = []
let file

// ? os specific folders
let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = dev ? path.join(folder, "Levminer", "Authme Dev") : path.join(folder, "Levminer", "Authme")

/**
 * Read settings
 * @type{LibSettings}
 */
let settings = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

// ? refresh settings
const settings_refresher = setInterval(() => {
	settings = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

	if (settings.security.require_password !== null || settings.security.password !== null) {
		clearInterval(settings_refresher)

		logger.log("Settings refresh completed")
	}
}, 100)

/**
 * Process data from saved file
 * @param {String} text
 */
const processdata = (text) => {
	const converted = convert.fromText(text, 0)

	go(converted)
}

/**
 * Start creating export elements
 * @param {LibImportFile} data
 */
const go = (data) => {
	const names = data.names
	const secrets = data.secrets
	const issuers = data.issuers

	for (let i = 0; i < names.length; i++) {
		const element = document.createElement("div")

		qrcode.toDataURL(`otpauth://totp/${names[i]}?secret=${secrets[i]}&issuer=${issuers[i]}`, (err, data) => {
			if (err) {
				logger.error(`Failed to generate QR code - ${err}`)
			}

			qr_data = data

			const text = `
			<div data-scroll class="qr">
				<img src="${data}">
				<h2>${issuers[i]}</h2>
			</div>`

			element.innerHTML = text

			codes.push(text)
		})

		document.querySelector(".center").appendChild(element)

		document.querySelector(".before_export").style.display = "none"
		document.querySelector(".after_export").style.display = "block"
	}
}

// ? save file
const saveFile = () => {
	dialog
		.showSaveDialog({
			title: "Save as Text file",
			filters: [{ name: "Text file", extensions: ["txt"] }],
			defaultPath: "~/authme_export.txt",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			if (canceled === false) {
				fs.writeFile(output, file, (err) => {
					if (err) {
						return logger.error(`Error creating file - ${err}`)
					} else {
						return logger.log("File created")
					}
				})
			}
		})
		.catch((err) => {
			logger.error(`Failed to save - ${err}`)
		})
}

// ? save qr codes
const saveQrCodes = () => {
	dialog
		.showSaveDialog({
			title: "Save as HTML file",
			filters: [{ name: "HTML file", extensions: ["html"] }],
			defaultPath: "~/authme_export.html",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			if (canceled === false) {
				for (let i = 0; i < codes.length; i++) {
					fs.appendFile(output, `${codes[i]} \n`, (err) => {
						if (err) {
							return logger.error(`Error creating file - ${err}`)
						} else {
							return logger.log("File created")
						}
					})
				}
			}
		})
		.catch((err) => {
			logger.error(`Failed to save - ${err}`)
		})
}

// ? hide
const hide = () => {
	ipc.send("hide_export")
}

// ? error handling
const error = () => {
	fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, content) => {
		if (err) {
			dialog.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				type: "error",
				message: `No save file found.
				
				Go back to the main page and save your codes!`,
			})
		}
	})
}

// ? new encryption method
const expChooser = () => {
	if (settings.security.new_encryption === true) {
		newExp()
	} else {
		exp()
	}
}

const newExp = () => {
	let password
	let key

	if (settings.security.require_password === true) {
		password = Buffer.from(ipc.sendSync("request_password"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(settings.security.key, "base64")))
	} else {
		/**
		 * Load storage
		 * @type {LibStorage}
		 */
		let storage

		if (dev === false) {
			storage = JSON.parse(localStorage.getItem("storage"))
		} else {
			storage = JSON.parse(localStorage.getItem("dev_storage"))
		}

		password = Buffer.from(storage.password, "base64")
		key = Buffer.from(aes.generateKey(password, Buffer.from(storage.key, "base64")))
	}

	fs.readFile(path.join(file_path, "codes", "codes.authme"), (err, content) => {
		if (err) {
			logger.warn("The file codes.authme don't exists")

			password.fill(0)
			key.fill(0)

			error()
		} else {
			const codes_file = JSON.parse(content)

			const decrypted = aes.decrypt(Buffer.from(codes_file.codes, "base64"), key)

			processdata(decrypted.toString())
			file = decrypted.toString()

			decrypted.fill(0)
			password.fill(0)
			key.fill(0)
		}
	})
}
