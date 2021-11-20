const { app } = require("@electron/remote")
const electron = require("electron")
const path = require("path")
const fs = require("fs")
const ipc = electron.ipcRenderer

// ? if development
let dev = false
let integrity = false

if (app.isPackaged === false) {
	dev = true
	integrity = true
}

/**
 * Get Authme folder path
 */
const folder_path = dev ? path.join(process.env.APPDATA, "Levminer", "Authme Dev") : path.join(process.env.APPDATA, "Levminer")

/**
 * Read settings
 * @type {LibSettings}
 */
const file = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

// ? local storage
let storage

if (integrity === false) {
	storage = JSON.parse(localStorage.getItem("storage"))
}

// ? controller
if (file.security.require_password === true && file.security.password !== null) {
	ipc.send("to_confirm")
} else if (file.security.require_password === false && file.security.password === null) {
	if (integrity === false) {
		if (storage === null) {
			ipc.send("abort")

			console.error("Authme - Local storage not found in controller")
		} else {
			console.log("Authme - Local storage found in controller")
		}

		if (file.security.require_password === storage.require_password) {
			console.log("Passwords match")

			ipc.send("to_application1")
		} else {
			ipc.send("abort")

			console.error("Authme - Local storage not found in controller")
		}
	} else {
		ipc.send("to_application1")
	}
} else if (file.security.require_password === null && file.security.password === null) {
	console.log("Authme - First restart")
} else {
	ipc.send("to_confirm")
}

// ? prevent default shortcuts
document.addEventListener("keydown", (event) => {
	if (event.ctrlKey && event.code === "KeyA" && event.target.type !== "text" && event.target.type !== "number" && event.target.type !== "textarea" && event.target.type !== "password") {
		event.preventDefault()
	}

	if (event.altKey && event.code === "F4") {
		event.preventDefault()
	}
})

// prevent drag and drop
document.addEventListener("dragover", (event) => event.preventDefault())
document.addEventListener("drop", (event) => event.preventDefault())
