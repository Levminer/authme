const electron = require("electron")
const { app, dialog, shell } = require("electron").remote
const fs = require("fs")
const path = require("path")
const qrcode = require("qrcode")
const { is } = require("electron-util")

// ? if development
let dev

if (is.development === true) {
	dev = true
}

// ? init ipc
const ipc = electron.ipcRenderer

// ? init file for save to file
let file

// ? init codes for save to qr codes
const codes = []

// ? os specific folders
let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = dev ? path.join(folder, "Levminer/Authme Dev") : path.join(folder, "Levminer/Authme")

const name = []
const secret = []
const issuer = []
const type = []

// ? separete value
const separation = () => {
	document.querySelector(".before_export").style.display = "none"
	document.querySelector(".after_export").style.display = "block"

	let c0 = 0
	let c1 = 1
	let c2 = 2
	let c3 = 3

	for (let i = 0; i < data.length; i++) {
		if (i == c0) {
			const name_before = data[i]
			const name_after = name_before.slice(8)
			name.push(name_after)
			c0 = c0 + 4
		}

		if (i == c1) {
			const secret_before = data[i]
			const secret_after = secret_before.slice(8)
			secret.push(secret_after)
			c1 = c1 + 4
		}

		if (i == c2) {
			const issuer_before = data[i]
			const issuer_after = issuer_before.slice(8)
			issuer.push(issuer_after)
			c2 = c2 + 4
		}

		if (i == c3) {
			type.push(data[i])
			c3 = c3 + 4
		}
	}

	go()
}

// ? render values
const go = () => {
	for (let i = 0; i < name.length; i++) {
		const element = document.createElement("div")

		qrcode.toDataURL(`otpauth://totp/${name[i]}?secret=${secret[i]}&issuer=${issuer[i]}`, (err, data) => {
			if (err) {
				console.warn(`Authme - Failed to generate QR code - ${err}`)
			}

			qr_data = data

			const text = `
			<div data-scroll class="qr">
				<img src="${data}">
				<h2>${issuer[i]}</h2>
			</div>`

			element.innerHTML = text

			codes.push(text)
		})

		document.querySelector(".center").appendChild(element)
	}
}

// ? save file
const save_file = () => {
	dialog
		.showSaveDialog({
			title: "Save exported file",
			filters: [{ name: "Text file", extensions: ["txt"] }],
			defaultPath: "~/authme_export.txt",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			if (canceled === false) {
				fs.writeFile(output, file, (err) => {
					if (err) {
						return console.warn(`Authme - Error creating file - ${err}`)
					} else {
						return console.warn("Authme - File created")
					}
				})
			}
		})
		.catch((err) => {
			console.warn(`Authme - Failed to save - ${err}`)
		})
}

// ? save qr codes
const save_qr_codes = () => {
	dialog
		.showSaveDialog({
			title: "Save QR codes",
			filters: [{ name: "HTML file", extensions: ["html"] }],
			defaultPath: "~/authme_export.html",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			if (canceled === false) {
				for (let i = 0; i < codes.length; i++) {
					fs.appendFile(output, `${codes[i]} \n`, (err) => {
						if (err) {
							return console.warn(`Authme - Error creating file - ${err}`)
						} else {
							return console.warn("Authme - File created")
						}
					})
				}
			}
		})
		.catch((err) => {
			console.warn(`Authme - Failed to save - ${err}`)
		})
}

// ? hide
const hide = () => {
	ipc.send("hide_export")
}

// ? authme web
const aw = () => {
	shell.openExternal("https://web.authme.levminer.com")
}

// ? error handeling
const error = () => {
	fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, content) => {
		if (err) {
			dialog.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				type: "error",
				message: `
				No save file found.
				
				Go back to the main page and save your codes!
				`,
			})
		}
	})
}
