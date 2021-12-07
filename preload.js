const { app } = require("@electron/remote")
const electron = require("electron")
const path = require("path")
const fs = require("fs")
const ipc = electron.ipcRenderer

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
const file = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

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

/**
 * App controller
 */
if (file.security.require_password === true && file.security.password !== null) {
	ipc.send("toConfirm")
} else if (file.security.require_password === false && file.security.password === null) {
	if (storage === null) {
		ipc.send("abort")

		console.error("Authme - Local storage not found in controller")
	} else {
		console.log("Authme - Local storage found in controller")
	}

	if (file.security.require_password === storage.require_password) {
		console.log("Authme - Local storage passwords match")

		ipc.send("toConfirmFromLanding")
	} else {
		ipc.send("abort")

		console.error("Authme - Local storage not found in controller")
	}
} else if (file.security.require_password === null && file.security.password === null) {
	console.log("Authme - First restart")
} else {
	ipc.send("toConfirm")
}

/**
 * Prevent default shortcuts
 */
document.addEventListener("keydown", (event) => {
	if (event.ctrlKey && event.code === "KeyA" && event.target.type !== "text" && event.target.type !== "number" && event.target.type !== "textarea" && event.target.type !== "password") {
		event.preventDefault()
	}

	if (event.altKey && event.code === "F4") {
		event.preventDefault()
	}
})

/**
 * Prevent drag and drop
 */
document.addEventListener("dragover", (event) => event.preventDefault())
document.addEventListener("drop", (event) => event.preventDefault())
