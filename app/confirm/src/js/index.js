const { ipcMain } = require("electron")
const bcrypt = require("bcrypt")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")

let text = document.querySelector("#text")

const file_path = path.join(process.env.APPDATA, "/Levminer/Authme")

document.querySelector("#password_input").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		unhash_password()
	}
})

let unhash_password = () => {
	let password_input = document.querySelector("#password_input").value

	fs.readFile(path.join(file_path, "pass.md"), "utf-8", async (err, data) => {
		if (err) {
			console.log("ERROR 2")
		} else {
			console.log("SUCCES 2")
			const compare = await bcrypt.compare(password_input, data).then(console.log("Passwords compared!"))
			if (compare == true) {
				console.log("Passwords match!")

				text.style.color = "green"
				text.textContent = "Passwords match! Please wait!"

				to_application0()
			} else {
				console.log("Passwords dont match!")

				text.style.color = "red"
				text.textContent = "Passwords don't match! Try again!"
			}
		}
	})
}

//? to_application
let to_application0 = () => {
	console.log("Sending to application...")
	setInterval(() => {
		ipc.send("to_application0")
	}, 1000)
}
