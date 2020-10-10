const { ipcMain } = require("electron")
const bcrypt = require("bcrypt")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer

let text = document.querySelector("#text")

//? match passwords
let match_passwords = () => {
	let password_input1 = document.querySelector("#password_input1").value
	let password_input2 = document.querySelector("#password_input2").value

	if (password_input1 == password_input2) {
		console.log("Passwords match!")

		text.style.color = "green"
		text.textContent = "Passwords match! Please wait!"

		hash_password()
	} else {
		console.log("Passwords dont match!")

		text.style.color = "red"
		text.textContent = "Passwords don't match! Try again!"
	}
}

//? hash password
let hash_password = async () => {
	let password_input1 = document.querySelector("#password_input1").value

	const salt = await bcrypt.genSalt(10).then(console.log("Salt completed!"))

	const hashed = await bcrypt.hash(password_input1, salt).then(console.log("Hash completed!"))

	fs.writeFile("pass.md", hashed, (err) => {
		if (err) {
			console.log("Password file dont created!")
		} else {
			console.log("Password file created!")

			to_confirm()
		}
	})
}

//? to_confirm
let to_confirm = () => {
	console.log("Sending to confirm...")
	setInterval(() => {
		ipc.send("to_confirm")
	}, 3000)
}
