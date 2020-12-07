const fs = require("fs")
const electron = require("electron")
const path = require("path")
const { dialog, shell, app } = require("electron").remote
const ipc = electron.ipcRenderer

// ?platform
let folder

// get platform
if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

// ? settings
const file_path = path.join(folder, "Levminer/Authme")

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

// startup require_password
if (file.security.require_password === true) {
	ipc.send("to_confirm")
} else if (file.security.require_password === false) {
	ipc.send("to_application1")
}
