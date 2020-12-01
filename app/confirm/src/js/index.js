const { ipcMain } = require("electron")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")

let text = document.querySelector("#text")

let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = path.join(folder, "/Levminer/Authme")

document.querySelector("#password_input").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		unhash_password()
	}
})

let unhash_password = async () => {
	let password_input = document.querySelector("#password_input").value

	const file = JSON.parse(
		fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", async (err, data) => {
			if (err) {
				return console.log(`Error reading settings.json ${err}`)
			} else {
				return console.log("settings.json readed")
			}
		})
	)

	const compare = await bcrypt.compare(password_input, file.security.password).then(console.log("Passwords compared!"))

	if (compare == true) {
		console.log("Passwords match!")

		text.style.color = "green"
		text.textContent = "Passwords match! Please wait!"

		setInterval(() => {
			ipc.send("to_application0")
		}, 1000)
	} else {
		console.log("Passwords dont match!")

		text.style.color = "red"
		text.textContent = "Passwords don't match! Try again!"
	}
}
