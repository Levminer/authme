const { ipcMain } = require("electron")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const { is } = require("electron-util")

// ? if development
let dev

if (is.development === true) {
	dev = true
}

// ?platform
let folder

// get platform
if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = dev ? path.join(folder, "Levminer/Authme Dev") : path.join(folder, "Levminer/Authme")

const text = document.querySelector("#text")

document.querySelector("#password_input").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		unhash_password()
	}
})

const unhash_password = async () => {
	const password_input = document.querySelector("#password_input").value

	const file = JSON.parse(
		fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", async (err, data) => {
			if (err) {
				return console.warn(`Authme - Error reading settings.json - ${err}`)
			} else {
				return console.warn("Authme - Succesfully readed settings.json")
			}
		})
	)

	const compare = await bcrypt.compare(password_input, file.security.password).then(console.warn("Passwords compared!"))

	if (compare == true) {
		text.style.color = "green"
		text.textContent = "Passwords match! Please wait!"

		setInterval(() => {
			ipc.send("to_application0")
		}, 1000)
	} else {
		console.warn("Authme - Passwords dont match!")

		text.style.color = "red"
		text.textContent = "Passwords don't match! Try again!"
	}
}
