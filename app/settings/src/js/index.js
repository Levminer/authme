const { ipcMain } = require("electron")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer

let but0 = document.querySelector("#but0")
let but1 = document.querySelector("#but1")

//? startup
let startup_state = true

fs.readFile("saos.md", "utf-8", (err, data) => {
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
		fs.writeFile("saos.md", "saos", (err) => {
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
		fs.unlink("saos.md", (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("saos.md not deleted")
			} else {
				console.log("saos.md deleted")

				but0.textContent = "Off"
				startup_state = true

				after_startup0()
			}
		})
	}
}

//? data
let data_state = false

let data = () => {
	if (data_state == false) {
		but1.textContent = "Are you sure?"
		data_state = true
	} else {
		fs.unlink("nrpw.md", (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("nrpw.md not deleted")
			} else {
				console.log("nrpw.md deleted")
			}
		})

		fs.unlink("pass.md", (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("pass.md not deleted")
			} else {
				console.log("pass.md deleted")
			}
		})

		fs.unlink("hash.md", (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("hash.md not deleted")
			} else {
				console.log("hash.md deleted")
			}
		})

		fs.unlink("saos.md", (err) => {
			if (err && err.code === "ENOENT") {
				return console.log("saos.md not deleted")
			} else {
				console.log("saos.md deleted")
			}
		})

		but1.textContent = "Exiting app"
		after_data()
	}
}

let hide = () => {
	after_hide()
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

//? hide
let after_hide = () => {
	ipc.send("hide")
}
