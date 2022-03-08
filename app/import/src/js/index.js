const { app, dialog, shell, desktopCapturer, BrowserWindow } = require("@electron/remote")
const { qrcodeConverter, time, localization } = require("@levminer/lib")
const logger = require("@levminer/lib/logger/renderer")
const QrcodeDecoder = require("qrcode-decoder").default
const { ipcRenderer: ipc } = require("electron")
const path = require("path")
const fs = require("fs")
const { chooseImages } = require(path.join(__dirname, "src", "js", "images.js"))
const { useWebcam } = require(path.join(__dirname, "src", "js", "webcam.js"))
const { captureFromScreen } = require(path.join(__dirname, "src", "js", "screen.js"))

/**
 * Send error to main process
 */
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "import", error })
}

/**
 * Start logger
 */
logger.getWindow("import")

/**
 * Localization
 */
localization.localize("import")

const lang = localization.getLang()

/**
 * Check if running in development
 */
let dev = false

if (app.isPackaged === false) {
	dev = true
}

// Get current window
const currentWindow = BrowserWindow.getFocusedWindow()

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
 * Links
 */
const totpLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=totp")
}

const migrationLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=migration")
}

const examplesLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/examples")
}

/**
 * Hide window
 */
const hide = () => {
	ipc.send("toggleImport")
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
 * Show experimental import screen capture
 */
if (settings.experimental.screen_capture === true) {
	document.querySelector(".screenCapture").style.display = "block"
} else {
	document.querySelector(".useWebcam").style.paddingBottom = "40px"
}

/**
 * Save created file
 * @param {string} string
 */
const saveFile = async (string) => {
	const result = await dialog.showSaveDialog(currentWindow, {
		title: lang.import_dialog.save_file,
		filters: [{ name: lang.application_dialog.authme_file, extensions: ["authme"] }],
		defaultPath: "~/import.authme",
	})

	/**
	 * .authme import file
	 * @type {LibAuthmeFile}
	 */
	const save_file = {
		role: "import",
		encrypted: false,
		codes: Buffer.from(string).toString("base64"),
		date: time.timestamp(),
		version: 3,
	}

	if (result.canceled === false) {
		fs.writeFile(result.filePath, JSON.stringify(save_file, null, "\t"), (err) => {
			if (err) {
				logger.error("Error creating file", err)
			} else {
				logger.log("File created")
			}
		})
	} else {
		logger.warn("Saving canceled")
	}
}

/**
 * Check for available webcam
 */
const webcamAvailable = async () => {
	const md = navigator.mediaDevices

	if (!md || !md.enumerateDevices) {
		return false
	} else {
		const devices = await md.enumerateDevices()

		for (let i = 0; i < devices.length; i++) {
			if (devices[i].kind === "videoinput") {
				return true
			}

			if (i === devices.length - 1) {
				return false
			}
		}
	}
}

/**
 * Convert TOTP QR codes to string
 * @param {string} data
 * @return {string} string
 */
const qrConvert = (data) => {
	// get url
	let url = data.replaceAll(/\s/g, "")
	url = url.slice(15)

	// get name
	const name_index = url.match(/[?]/)
	const name = url.slice(0, name_index.index)
	url = url.slice(name.length + 1)

	// get secret
	const secret_index = url.match(/[&]/)
	const secret = url.slice(7, secret_index.index)
	url = url.slice(secret.length + 14 + 1)

	// get issuer
	let issuer = url

	// check if issuer is empty
	if (issuer === "") {
		issuer = name
	}

	// add to final string
	return `\nName:   ${name} \nSecret: ${secret} \nIssuer: ${issuer} \nType:   OTP_TOTP\n`
}

/**
 * Convert Migration QR codes to string
 * @param {string} data
 * @return {string} string
 */
const gaConvert = (data) => {
	// return string
	let return_string = ""

	// split string
	const uri = data.split("=")

	// decode data
	const decoded = qrcodeConverter.convert(uri[1])

	// make a string
	decoded.forEach((element) => {
		const temp_string = `\nName:   ${element.name} \nSecret: ${element.secret} \nIssuer: ${element.issuer} \nType:   OTP_TOTP\n`
		return_string += temp_string
	})

	return return_string
}
