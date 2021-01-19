const { ipcMain } = require("electron")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const { is } = require("electron-util")

// ? init
const text = document.querySelector("#text")

// ? if development
let dev = false
let integrity = false

if (is.development === true) {
	dev = true

	// check for integrity
	integrity = true
}

let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = dev ? path.join(folder, "Levminer/Authme Dev") : path.join(folder, "Levminer/Authme")

// ? match passwords
const match_passwords = () => {
	const password_input1 = document.querySelector("#password_input1").value
	const password_input2 = document.querySelector("#password_input2").value

	if (password_input1 == password_input2) {
		console.warn("Authme - Passwords match!")

		text.style.color = "green"
		text.textContent = "Passwords match! Please wait!"

		hash_password()
	} else {
		console.warn("Authme - Passwords dont match!")

		text.style.color = "red"
		text.textContent = "Passwords don't match! Try again!"
	}
}

// ? hash password
const hash_password = async () => {
	const password_input1 = document.querySelector("#password_input1").value

	const salt = await bcrypt.genSalt(10)

	const hashed = await bcrypt.hash(password_input1, salt).then(console.warn("Hash completed!"))

	const file = JSON.parse(
		fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", (err, data) => {
			if (err) {
				return console.warn(`Authme - Error reading settings.json - ${err}`)
			} else {
				return console.warn("Authme - File settings.json readed")
			}
		})
	)

	if (integrity === false) {
		const storage = {
			require_password: true,
			password: hashed,
		}

		localStorage.setItem("storage", JSON.stringify(storage))
	}

	file.security.require_password = true
	file.security.password = hashed

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

	setInterval(() => {
		ipc.send("to_confirm")
	}, 3000)
}

// ? no password
const no_password = () => {
	text.style.color = "green"
	text.textContent = "Please wait!"

	const file = JSON.parse(
		fs.readFileSync(path.join(file_path, "settings.json"), "utf-8", (err, data) => {
			if (err) {
				return console.warn(`Authme - Error reading settings.json - ${err}`)
			} else {
				return console.warn("Authme - File settings.json readed")
			}
		})
	)

	file.security.require_password = false

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

	setInterval(() => {
		ipc.send("to_application1")
	}, 3000)
}
