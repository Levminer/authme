const { app, dialog, shell } = require("@electron/remote")
const QrcodeDecoder = require("qrcode-decoder").default
const logger = require("@levminer/lib/logger/renderer")
const electron = require("electron")
const path = require("path")
const fs = require("fs")
const { qrcodeConverter, time } = require("@levminer/lib")
const ipc = electron.ipcRenderer

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "import", error: error })
}

// ? logger
logger.getWindow("import")

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
const settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

// ? check for webcam
const checkWebcam = (callback) => {
	const md = navigator.mediaDevices
	if (!md || !md.enumerateDevices) return callback(false)
	md.enumerateDevices().then((devices) => {
		callback(devices.some((device) => device.kind === "videoinput"))
	})
}

// ? link
const onlineDocs = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=import")
}

const qrLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=qr-codes")
}

const gaLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=google-authenticator")
}

// ? hide
const hide = () => {
	ipc.send("toggleImport")
}

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}
