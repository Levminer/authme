const { ipcMain } = require("electron")
const bcrypt = require("bcrypt")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer

let text = document.querySelector("#text")

document.querySelector("#password_input").addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		unhash_password()
	}
})

let unhash_password = () => {
	let password_input = document.querySelector("#password_input").value

	fs.readFile("pass.md", "utf-8", async (err, data) => {
		if (err) {
			console.log("ERROR 2")
		} else {
			console.log("SUCCES 2")
			const compare = await bcrypt.compare(password_input, data).then(console.log("Passwords compared!"))
			if (compare == true) {
				console.log("Passwords match!")

				text.style.color = "green"
				text.textContent = "Passwords match! Please wait!"

				to_application()
			} else {
				console.log("Passwords dont match!")

				text.style.color = "red"
				text.textContent = "Passwords don't match! Try again!"
			}
		}
	})
}

//? to_application
let to_application = () => {
	console.log("Sending to application...")
	setInterval(() => {
		ipc.send("to_application")
	}, 1000)
}
