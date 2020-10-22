const { ipcMain } = require("electron")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const Cryptr = require("cryptr")
const cryptr = new Cryptr("-3Lu)g%#11h7FpM?")
const qrcode = require("qrcode")

const file_path = path.join(process.env.APPDATA, "/Levminer/Authme")

let names = []
let secret = []
let issuer = []
let type = []

let exp = () => {
	fs.readFile(path.join(file_path, "hash.md"), "utf-8", (err, content) => {
		if (err) {
			console.log("The hash.md fle dont exist!")
		} else {
			let decrypted = cryptr.decrypt(content)

			console.log(decrypted)

			let result = document.querySelector("#result")
			result.value = decrypted
			result.style.display = "flex"

			processdata(decrypted)
		}
	})
}

let separation = () => {
	document.querySelector("#but0").style.display = "none"

	let c0 = 0
	let c1 = 1
	let c2 = 2
	let c3 = 3

	for (let i = 0; i < data.length; i++) {
		if (i == c0) {
			names.push(data[i])
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

	console.log(names)
	console.log(secret)
	console.log(issuer)
	console.log(type)

	go()
}

let go = () => {
	for (let i = 0; i < names.length; i++) {
		// create div
		let element = document.createElement("div")

		qrcode.toDataURL(`otpauth://totp/${issuer[i]}?secret=${secret[i]}`, (err, data) => {
			qr_data = data

			element.innerHTML = `
			<div class="qr">
				<img src="${data}">
				<h2>${issuer[i]}</h2>
			</div>`
		})

		// set div elements

		// set div in html
		document.querySelector(".center").appendChild(element)

		// add one to counter
	}
}

let hide = () => {
	ipc.send("hide2")
}
