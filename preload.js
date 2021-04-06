const fs = require("fs")
const electron = require("electron")
const path = require("path")
const ipc = electron.ipcRenderer
const { is } = require("electron-util")

// ? if development
let dev
let integrity = false

if (is.development === true) {
	dev = true
	integrity = true
}

// ?platform
let folder

// get platform
if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

// ? settings
const file_path = dev ? path.join(folder, "Levminer/Authme Dev") : path.join(folder, "Levminer/Authme")

// read settings
const file = JSON.parse(
	fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", (err, data) => {
		if (err) {
			return console.log(`Error reading settings.json ${err}`)
		} else {
			return console.log("settings.json readed")
		}
	})
)

// settings launch_on_startup
if (file.settings.launch_on_startup === true) {
	ipc.send("startup")
}

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
		try {
			console.log(storage)
		} catch (error) {
			console.warn("Authme - Local storage not found in controller")

			ipc.send("abort")
		}

		if (file.security.require_password === storage.require_password) {
			ipc.send("to_application1")
		} else {
			console.warn("Authme - Local storage not found in controller")

			ipc.send("abort")
		}
	} else {
		ipc.send("to_application1")
	}
} else if (file.security.require_password === null && file.security.password === null) {
	return console.log("First restart")
} else {
	ipc.send("to_confirm")
}
