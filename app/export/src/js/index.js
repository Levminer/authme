const { aes, convert, time, localization } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")
const { app, dialog } = require("@electron/remote")
const { ipcRenderer: ipc } = require("electron")
const qrcode = require("qrcode-generator")
const path = require("path")
const fs = require("fs")

/**
 * Send error to main process
 */
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "export", error: error })
}

/**
 * Start logger
 */
logger.getWindow("export")

/**
 * Localization
 */
localization.localize("export")

const lang = localization.getLang()

/**
 * Check if running in development
 */
let dev = false

if (app.isPackaged === false) {
	dev = true
}

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
 * Init codes for save to qr codes
 */
const codes = []
let file

/**
 * Get Authme folder path
 */
const folder_path = dev ? path.join(app.getPath("appData"), "Levminer", "Authme Dev") : path.join(app.getPath("appData"), "Levminer", "Authme")

/**
 * Read settings
 * @type {LibSettings}
 */
const settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

/**
 * Refresh settings
 */
const settings_refresher = setInterval(() => {
	file = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

	if (file.security.require_password !== null || file.security.password !== null) {
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
		const qr = qrcode(10, "M")

		qr.addData(`otpauth://totp/${names[i]}?secret=${secrets[i]}&issuer=${issuers[i]}`)
		qr.make()

		const qr_src = qr.createDataURL(3, 3)

		const text = `
			<div>
				<img class="img" src="${qr_src}">
				<h1 style=font-family:Arial;>${issuers[i]}</h1>
			</div>`

		codes.push(text)

		document.querySelector(".before_export").style.display = "none"
		document.querySelector(".after_export").style.display = "block"
	}
}

/**
 * Save .txt file
 */
const saveFile = () => {
	dialog
		.showSaveDialog({
			title: lang.import_dialog.save_file,
			filters: [{ name: lang.export_dialog.text_file, extensions: ["txt"] }],
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
						return logger.log("Text file created")
					}
				})
			}
		})
		.catch((err) => {
			logger.error(`Failed to save - ${err}`)
		})
}

/**
 * Save .authme file
 */
const newSaveFile = () => {
	dialog
		.showSaveDialog({
			title: lang.import_dialog.save_file,
			filters: [{ name: lang.application_dialog.authme_file, extensions: ["authme"] }],
			defaultPath: "~/export.authme",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			/**
			 * .authme export file
			 * @type {LibAuthmeFile}
			 */
			const save_file = {
				role: "export",
				encrypted: false,
				codes: Buffer.from(file).toString("base64"),
				date: time.timestamp(),
				version: 3,
			}

			if (canceled === false) {
				fs.writeFile(output, JSON.stringify(save_file, null, "\t"), (err) => {
					if (err) {
						return logger.error(`Error creating file - ${err}`)
					} else {
						return logger.log("Text file created")
					}
				})
			}
		})
		.catch((err) => {
			logger.error(`Failed to save - ${err}`)
		})
}

/**
 * Save .html file
 */
const saveQrCodes = () => {
	dialog
		.showSaveDialog({
			title: lang.import_dialog.save_file,
			filters: [{ name: lang.export_dialog.html_file, extensions: ["html"] }],
			defaultPath: "~/authme_export.html",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			if (canceled === false) {
				let string = ""

				for (let i = 0; i < codes.length; i++) {
					string += `${codes[i]} \n`
				}

				fs.writeFile(output, string, (err) => {
					if (err) {
						return logger.error(`Error creating file - ${err}`)
					} else {
						return logger.log("QR code file created")
					}
				})
			}
		})
		.catch((err) => {
			logger.error(`Failed to save - ${err}`)
		})
}

/**
 * Hide window
 */
const hide = () => {
	ipc.send("toggleExport")
}

/**
 * No saved codes found
 */
const error = () => {
	fs.readFile(path.join(folder_path, "codes", "codes.authme"), "utf-8", (err) => {
		if (err) {
			dialog.showMessageBox({
				title: "Authme",
				buttons: [lang.button.close],
				noLink: true,
				type: "error",
				message: lang.export_dialog.no_save_found,
			})
		}
	})
}

/**
 * Export codes save to the disk
 */
const exportCodes = async () => {
	let password
	let key

	if (settings.security.require_password === true) {
		password = Buffer.from(await ipc.invoke("request_password"))
		key = Buffer.from(aes.generateKey(password, Buffer.from(settings.security.key, "base64")))
	} else {
		let /** @type {LibStorage} */ storage

		if (dev === false) {
			storage = JSON.parse(localStorage.getItem("storage"))
		} else {
			storage = JSON.parse(localStorage.getItem("dev_storage"))
		}

		password = Buffer.from(storage.password, "base64")
		key = Buffer.from(aes.generateKey(password, Buffer.from(storage.key, "base64")))
	}

	fs.readFile(path.join(folder_path, "codes", "codes.authme"), (err, content) => {
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
