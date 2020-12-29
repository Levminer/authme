const { ipcMain, shell, app } = require("electron").remote
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

// ? Open Status
const link0 = () => {
	shell.openExternal("https://status.levminer.com")
}

// ? Open Releases
const link1 = () => {
	shell.openExternal("https://github.com/Levminer/authme/releases")
}

// ? Open Releases
const link2 = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/settings?id=settings")
}

const hide = () => {
	ipc.send("hide0")
}

// ? Hotkeys
let modify = true

let inp_name
let but_name
let id

const hk0 = document.querySelector("#hk0_input")
const hk1 = document.querySelector("#hk1_input")
const hk2 = document.querySelector("#hk2_input")
const hk3 = document.querySelector("#hk3_input")
const hk4 = document.querySelector("#hk4_input")
const hk5 = document.querySelector("#hk5_input")

hk0.value = file.shortcuts.settings
hk1.value = file.shortcuts.exit
hk2.value = file.shortcuts.import
hk3.value = file.shortcuts.export
hk4.value = file.shortcuts.update
hk5.value = file.shortcuts.about

const call = (event) => {
	console.log(event)
	console.log(event.key + event.ctrlKey)

	if (event.ctrlKey === true) {
		inp_name.value = `CommandOrControl+${event.key}`
	}

	if (event.altKey === true) {
		inp_name.value = `Alt+${event.key}`
	}

	if (event.shiftKey === true) {
		inp_name.value = `Shift+${event.key.toLowerCase()}`
	}
}

const hk_modify = (value) => {
	id = value
	inp_name = document.querySelector(`#hk${value}_input`)
	but_name = document.querySelector(`#hk${value}_button`)

	if (modify === true) {
		document.addEventListener("keydown", call, true)

		inp_name.value = "Press any key combiantion"
		but_name.textContent = "Done"

		modify = false
	} else {
		but_name.textContent = "Modify"

		document.removeEventListener("keydown", call, true)

		console.log(id)
		switch (id) {
			case 0:
				const hk0 = document.querySelector("#hk0_input").value

				file.shortcuts.settings = hk0
				break
			case 1:
				const hk1 = document.querySelector("#hk1_input").value

				file.shortcuts.exit = hk1
				break
			case 2:
				const hk2 = document.querySelector("#hk2_input").value

				file.shortcuts.import = hk2
				break
			case 3:
				const hk3 = document.querySelector("#hk3_input").value

				file.shortcuts.export = hk3
				break
			case 4:
				const hk4 = document.querySelector("#hk4_input").value

				file.shortcuts.update = hk4
				break
			case 5:
				const hk5 = document.querySelector("#hk5_input").value

				file.shortcuts.about = hk5
				break

			default:
				console.warn("No save file found")
				break
		}

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

		modify = true
	}
}

// ? Menu
const menu = (evt, name) => {
	let i

	if (name === "shortcuts") {
		document.querySelector(".center").style.height = "1700px"
	} else {
		document.querySelector(".center").style.height = "2250px"
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

// ? Restart
const restart = () => {
	app.relaunch()
	app.exit()
}
