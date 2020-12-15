const { ipcMain, shell, app } = require("electron").remote
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const fetch = require("node-fetch")

const version = ipc.sendSync("ver")

document.querySelector("#ver").textContent = `Authme ${version}`

let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = path.join(folder, "/Levminer/Authme")

const but0 = document.querySelector("#but0")
const but1 = document.querySelector("#but1")
const but2 = document.querySelector("#but2")
const but5 = document.querySelector("#but5")

// ? read settings
const file = JSON.parse(
	fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", (err, data) => {
		if (err) {
			return console.log(`Error reading settings.json ${err}`)
		} else {
			return console.log("settings.json readed")
		}
	})
)

// launch on startup
let startup_state = file.settings.launch_on_startup
if (startup_state === true) {
	but0.textContent = "On"

	ipc.send("after_startup1")
} else {
	but0.textContent = "Off"

	ipc.send("after_startup0")
}

// close to tray
let tray_state = file.settings.close_to_tray
if (tray_state === true) {
	but2.textContent = "On"

	ipc.send("after_tray1")
} else {
	but2.textContent = "Off"

	ipc.send("after_tray0")
}

// names
let names_state = file.settings.show_2fa_names
if (names_state === true) {
	but5.textContent = "On"
} else {
	but5.textContent = "Off"
}

// ? startup
const startup = () => {
	if (startup_state == true) {
		file.settings.launch_on_startup = false

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

		but0.textContent = "Off"
		startup_state = false

		ipc.send("after_startup0")
	} else {
		file.settings.launch_on_startup = true

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

		but0.textContent = "On"
		startup_state = true

		ipc.send("after_startup1")
	}
}

// ? tray
const tray = () => {
	if (tray_state == true) {
		file.settings.close_to_tray = false

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

		but2.textContent = "Off"
		tray_state = false

		ipc.send("after_tray0")
	} else {
		file.settings.close_to_tray = true

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

		but2.textContent = "On"
		tray_state = true

		ipc.send("after_tray1")
	}
}

// ? reset
let reset_state = false

const reset = () => {
	if (reset_state == false) {
		but1.textContent = "Confirm"
		reset_state = true
	} else {
		fs.unlink(path.join(file_path, "settings.json"), (err) => {
			if (err && err.code === "ENOENT") {
				return console.log(`error deleting settings.json ${err}`)
			} else {
				console.log("settings.json deleted")
			}
		})

		fs.unlink(path.join(file_path, "hash.authme"), (err) => {
			if (err && err.code === "ENOENT") {
				return console.log(`error deleting hash.authme ${err}`)
			} else {
				console.log("hash.authme deleted")
			}
		})

		const file_path2 = path.join(process.env.APPDATA, "/Microsoft/Windows/Start Menu/Programs/Startup/Authme Launcher.lnk")

		fs.unlink(file_path2, (err) => {
			if (err && err.code === "ENOENT") {
				return console.log(`error deleting shortcut ${err}`)
			} else {
				console.log("shortcut deleted")
			}
		})

		but1.textContent = "Restarting app"

		setTimeout(() => {
			app.relaunch()
			app.exit()
		}, 1000)
	}
}

// ? names
const names = () => {
	if (names_state == true) {
		file.settings.show_2fa_names = false

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

		but5.textContent = "Off"
		names_state = false
	} else {
		file.settings.show_2fa_names = true

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

		but5.textContent = "On"
		names_state = true
	}

	but5.textContent = "Restarting app"

	setTimeout(() => {
		app.relaunch()
		app.exit()
	}, 1000)
}

// ? folder 0
const folder0 = () => {
	ipc.send("app_path")
}

// ? folder 1
const folder1 = () => {
	shell.showItemInFolder(file_path)
}

// ? Status API
const status = document.querySelector("#status")

const api = async () => {
	try {
		await fetch("https://api.levminer.com/api/v1/status/all")
			.then((res) => res.json())
			.then((data) => {
				try {
					if (data.state === "up") {
						status.style.color = "green"
					} else {
						status.textContent = "Some systems offline"
						status.style.color = "red"
					}
				} catch (error) {
					return console.log(error)
				}
			})
	} catch (error) {
		status.textContent = "Can't connect to API"
		status.style.color = "red"
	}
}

api()

// ? Open Status
const page = () => {
	shell.openExternal("https://status.levminer.com")
}

const hide = () => {
	ipc.send("hide0")
}
