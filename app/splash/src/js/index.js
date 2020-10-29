const { ipcMain, shell } = require("electron")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")

const file_path = path.join(process.env.APPDATA, "/Levminer/Authme")

let but0 = document.querySelector("#but0")
let but1 = document.querySelector("#but1")
let but2 = document.querySelector("#but2")

//? startup
let startup_state = true

fs.readFile(path.join(file_path, "saos.md"), "utf-8", (err, data) => {
	if (err) {
		but0.textContent = "Off"
		startup_state = true

		after_startup0()
	} else {
		but0.textContent = "On"
		startup_state = false

		after_startup1()
	}
})

let startup = () => {
	if (startup_state == true) {
		fs.writeFile(path.join(file_path, "saos.md"), "saos", (err) => {
			if (err) {
				console.log("Start after os started don't created!")
			} else {
				console.log("Start after os started file created!")

				but0.textContent = "On"
				startup_state = false

				after_startup1()
			}
		})
	} else {
		fs.unlink(path.join(file_path, "saos.md"), (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("saos.md not deleted")
			} else {
				console.log("saos.md deleted")

				but0.textContent = "Off"
				startup_state = true

				after_tray0()
			}
		})
	}
}

//? tray
let tray_state = true

fs.readFile(path.join(file_path, "catt.md"), "utf-8", (err, data) => {
	if (err) {
		but2.textContent = "Off"
		tray_state = true

		after_tray0()
	} else {
		but2.textContent = "On"
		tray_state = false

		after_tray1()
	}
})

let tray = () => {
	if (tray_state == true) {
		fs.writeFile(path.join(file_path, "catt.md"), "catt", (err) => {
			if (err) {
				console.log("Close app to tray don't created!")
			} else {
				console.log("Close app to tray file created!")

				but2.textContent = "On"
				tray_state = false

				after_tray1()
			}
		})
	} else {
		fs.unlink(path.join(file_path, "catt.md"), (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("catt.md not deleted")
			} else {
				console.log("catt.md deleted")

				but2.textContent = "Off"
				tray_state = true

				after_tray0()
			}
		})
	}
}

//? data
let data_state = false

let data = () => {
	if (data_state == false) {
		but1.textContent = "Confirm"
		data_state = true
	} else {
		fs.unlink(path.join(file_path, "nrpw.md"), (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("nrpw.md not deleted")
			} else {
				console.log("nrpw.md deleted")
			}
		})

		fs.unlink(path.join(file_path, "pass.md"), (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("pass.md not deleted")
			} else {
				console.log("pass.md deleted")
			}
		})

		fs.unlink(path.join(file_path, "hash.md"), (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("hash.md not deleted")
			} else {
				console.log("hash.md deleted")
			}
		})

		fs.unlink(path.join(file_path, "saos.md"), (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("saos.md not deleted")
			} else {
				console.log("saos.md deleted")
			}
		})

		let file_path2 = path.join(process.env.APPDATA, "/Microsoft/Windows/Start Menu/Programs/Startup/Authme Launcher.lnk")

		fs.unlink(file_path2, (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("startup shortcut not deleted")
			} else {
				console.log("startup shortcut deleted")
			}
		})

		but1.textContent = "Exiting app"
		after_data()
	}
}

//? folder 0
let folder0 = () => {
	ipc.send("app_path")
}

//? folder 1
let folder1 = () => {
	shell.showItemInFolder(file_path)
}

let hide = () => {
	ipc.send("hide0")
}

//? after_data
let after_data = () => {
	ipc.send("after_data")
}

//? after_startup
let after_startup0 = () => {
	ipc.send("after_startup0")
}

let after_startup1 = () => {
	ipc.send("after_startup1")
}

//? after_tray
let after_tray0 = () => {
	ipc.send("after_tray0")
}

let after_tray1 = () => {
	ipc.send("after_tray1")
}
