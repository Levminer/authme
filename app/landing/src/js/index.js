const bcrypt = require("bcryptjs")
const fs = require("fs")
const { app, dialog } = require("@electron/remote")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "landing", error: error })
}

// ? init
const text = document.querySelector("#text")

// ? if development
let dev = false
let integrity = false

if (app.isPackaged === false) {
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

const file_path = dev ? path.join(folder, "Levminer", "Authme Dev") : path.join(folder, "Levminer", "Authme")

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

// ? match passwords
const comparePasswords = () => {
	const password_input1 = document.querySelector("#password_input1").value
	const password_input2 = document.querySelector("#password_input2").value

	if (password_input1.length > 64) {
		text.style.color = "#A30015"
		text.textContent = "Maximum password length is 64 charachters!"
	} else if (password_input1.length < 8) {
		text.style.color = "#A30015"
		text.textContent = "Minimum password length is 8 charachters!"
	} else {
		if (password_input1 == password_input2) {
			console.warn("Authme - Passwords match!")

			text.style.color = "#28A443"
			text.textContent = "Passwords match! Please wait!"

			hashPasswords()
		} else {
			console.warn("Authme - Passwords dont match!")

			text.style.color = "#A30015"
			text.textContent = "Passwords don't match! Try again!"
		}
	}
}

// ? hash password
const hashPasswords = async () => {
	const password_input1 = document.querySelector("#password_input1").value

	const salt = await bcrypt.genSalt(10)

	const hashed = await bcrypt.hash(password_input1, salt).then(console.warn("Hash completed!"))

	const file = JSON.parse(fs.readFileSync(path.join(file_path, "settings.json"), "utf-8"))

	if (integrity === false) {
		const storage = {
			require_password: true,
			password: hashed,
		}

		localStorage.setItem("storage", JSON.stringify(storage))
	}

	file.security.require_password = true
	file.security.password = hashed

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))

	setInterval(() => {
		ipc.send("to_confirm")
	}, 1000)
}

// ? no password
const noPassword = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "No"],
			type: "warning",
			defaultId: 1,
			cancelId: 1,
			noLink: true,
			message: "Are you sure? \n\nThis way nothing will protect your codes.",
		})
		.then((result) => {
			if (result.response === 0) {
				text.style.color = "#28A443"
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

				if (integrity === false) {
					const storage = {
						require_password: false,
						password: null,
					}

					localStorage.setItem("storage", JSON.stringify(storage))
				}

				file.security.require_password = false

				fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))

				setInterval(() => {
					ipc.send("to_application1")
				}, 1000)
			}
		})
}

// ? show password

// input 1
document.querySelector("#show_pass_0").addEventListener("click", () => {
	document.querySelector("#password_input1").setAttribute("type", "text")

	document.querySelector("#show_pass_0").style.display = "none"
	document.querySelector("#show_pass_01").style.display = "flex"
})

document.querySelector("#show_pass_01").addEventListener("click", () => {
	document.querySelector("#password_input1").setAttribute("type", "password")

	document.querySelector("#show_pass_0").style.display = "flex"
	document.querySelector("#show_pass_01").style.display = "none"
})

// input 2
document.querySelector("#show_pass_1").addEventListener("click", () => {
	document.querySelector("#password_input2").setAttribute("type", "text")

	document.querySelector("#show_pass_1").style.display = "none"
	document.querySelector("#show_pass_11").style.display = "flex"
})

document.querySelector("#show_pass_11").addEventListener("click", () => {
	document.querySelector("#password_input2").setAttribute("type", "password")

	document.querySelector("#show_pass_1").style.display = "flex"
	document.querySelector("#show_pass_11").style.display = "none"
})
