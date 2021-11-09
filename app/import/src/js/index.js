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
const settings = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

if (settings.experimental.webcam === true) {
	document.querySelector("#but2").style.display = "inline-block"
	document.querySelector("#but3").style.display = "inline-block"
}

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
	ipc.send("hide_import")
}

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}
