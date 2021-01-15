const { ipcMain, shell, app, dialog } = require("electron").remote
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const fetch = require("node-fetch")

document.querySelector("#setting").click()

const version = ipc.sendSync("ver")

document.querySelector("#but7").textContent = `Authme ${version}`

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
const but10 = document.querySelector("#but10")

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

// copy
let copy_state = file.settings.reset_after_copy
if (copy_state === true) {
	but10.textContent = "On"
} else {
	but10.textContent = "Off"
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

const reset = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No"],
			defaultId: 0,
			cancelId: 1,
			type: "warning",
			message: "Are you sure you want to clear all data? This cannot be undone!",
		})
		.then((result) => {
			if (result.response === 0) {
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
		})
}

// ? names
const names = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No"],
			defaultId: 0,
			cancelId: 1,
			type: "warning",
			message: "Are you sure you want change this setting? This is requires a restart!",
		})
		.then((result) => {
			if (result.response === 0) {
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
		})
}

// ? copy
const copy = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No"],
			defaultId: 0,
			cancelId: 1,
			type: "warning",
			message: "Are you sure you want change this setting? This is requires a restart!",
		})
		.then((result) => {
			if (result.response === 0) {
				if (copy_state == true) {
					file.settings.reset_after_copy = false

					fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

					but10.textContent = "Off"
					copy_state = false
				} else {
					file.settings.reset_after_copy = true

					fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

					but10.textContent = "On"
					copy_state = true
				}

				but10.textContent = "Restarting app"

				setTimeout(() => {
					app.relaunch()
					app.exit()
				}, 1000)
			}
		})
}

// ? folder 0
const folder0 = () => {
	ipc.send("app_path")
}

// ? folder 1
const folder1 = () => {
	shell.showItemInFolder(file_path)
}

// ? status api
const status = document.querySelector("#but6")

const api = async () => {
	try {
		await fetch("https://api.levminer.com/api/v1/status/all")
			.then((res) => res.json())
			.then((data) => {
				try {
					if (data.state === "up") {
						status.textContent = "All systems online"
					} else {
						status.textContent = "Some systems offline"
					}
				} catch (error) {
					return console.log(error)
				}
			})
	} catch (error) {
		status.textContent = "Can't connect to API"
	}
}

api()

// ? open status
const link0 = () => {
	shell.openExternal("https://status.levminer.com")
}

// ? open releases
const link1 = () => {
	shell.openExternal("https://github.com/Levminer/authme/releases")
}

// ? open docs
const link2 = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/settings?id=settings")
}

const hide = () => {
	ipc.send("hide0")
}

// ? menu
const menu = (evt, name) => {
	let i

	if (name === "shortcuts") {
		document.querySelector(".center").style.height = "2500px"
	} else {
		document.querySelector(".center").style.height = "2450px"
	}

	const tabcontent = document.getElementsByClassName("tabcontent")
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none"
	}

	const tablinks = document.getElementsByClassName("tablinks")
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "")
	}

	document.getElementById(name).style.display = "block"
	evt.currentTarget.className += " active"
}

// ? restart
const restart = () => {
	app.relaunch()
	app.exit()
}
