const electron = require("electron")
const { app, dialog } = require("electron").remote
const fs = require("fs")
const path = require("path")
const qrcode = require("qrcode")

//? init ipc
const ipc = electron.ipcRenderer

//? init file for save to file
let file

//? init codes for save to qr codes
const codes = []

//? os specific folders
let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = path.join(folder, "Levminer/Authme")

//? read file from settings folder
let name = []
let secret = []
let issuer = []
let type = []

//? separete value
let separation = () => {
	document.querySelector(".before_export").style.display = "none"
	document.querySelector(".after_export").style.display = "block"

	let c0 = 0
	let c1 = 1
	let c2 = 2
	let c3 = 3

	for (let i = 0; i < data.length; i++) {
		if (i == c0) {
			let name_before = data[i]
			let name_after = name_before.slice(8)
			name.push(name_after)
			c0 = c0 + 4
		}

		if (i == c1) {
			let secret_before = data[i]
			let secret_after = secret_before.slice(8)
			secret.push(secret_after)
			c1 = c1 + 4
		}

		if (i == c2) {
			let issuer_before = data[i]
			let issuer_after = issuer_before.slice(8)
			issuer.push(issuer_after)
			c2 = c2 + 4
		}

		if (i == c3) {
			type.push(data[i])
			c3 = c3 + 4
		}
	}

	console.log(name)
	console.log(secret)
	console.log(issuer)
	console.log(type)

	go()
}

//? render values
let go = () => {
	for (let i = 0; i < name.length; i++) {
		let element = document.createElement("div")

		qrcode.toDataURL(`otpauth://totp/${name[i]}?secret=${secret[i]}&issuer=${issuer[i]}`, (err, data) => {
			qr_data = data

			let text = `
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

//? save file
let save_file = () => {
	dialog
		.showSaveDialog({
			title: "Save exported file",
			filters: [{ name: "Text file", extensions: ["txt"] }],
			defaultPath: "~/authme_export.txt",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			console.log(canceled)
			console.log(output)

			if (canceled === false) {
				fs.writeFile(output, file, (err) => {
					if (err) {
						return console.log(`error creating file ${err}`)
					} else {
						return console.log("file created")
					}
				})
			}
		})
		.catch((err) => {
			console.log(err)
		})
}

//? save qr codes
let save_qr_codes = () => {
	dialog
		.showSaveDialog({
			title: "Save QR codes",
			filters: [{ name: "HTML file", extensions: ["html"] }],
			defaultPath: "~/authme_export.html",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			console.log(canceled)
			console.log(output)

			if (canceled === false) {
				for (let i = 0; i < codes.length; i++) {
					fs.appendFile(output, `${codes[i]} \n`, (err) => {
						if (err) {
							return console.log(`error creating file ${err}`)
						} else {
							return console.log("file created")
						}
					})
				}
			}
		})
		.catch((err) => {
			console.log(err)
		})
}

//? hide
let hide = () => {
	ipc.send("hide2")
}
