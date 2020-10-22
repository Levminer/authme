const { ipcMain, shell } = require("electron")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")
const QrCode = require("qrcode-reader")
const Jimp = require("jimp")

let file_path = path.join(__dirname, "src/py/extract_2fa_secret.py")
let counter = 0

//? import from qr code
let import_qrcode = () => {
	let full_folder = path.join(__dirname, "/img/place_your_images_inside_this_folder")
	let folder = path.join(__dirname, "/img/")

	// create img folder
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder)
	}

	// create place folder
	if (!fs.existsSync(full_folder)) {
		fs.mkdirSync(full_folder)
	}

	// open folder
	if (counter == 0) {
		shell.showItemInFolder(full_folder)
		document.querySelector("#choose").textContent = "Folder opened, place the images in the folder"
		document.querySelector("#but0").textContent = "Convert"
		document.querySelector("#but1").style.display = "none"
	}

	if (counter == 1) {
		let buffer0
		let buffer1

		//! TRY FIRST PIC
		try {
			buffer0 = fs.readFileSync(path.join(full_folder, "pic0.jpg"), (err) => {
				if (err) {
					return console.log("NO PIC0.jpg")
				}

				return console.log("FOUND PIC0.jpg")
			})
		} catch (err) {
			document.querySelector("#but0").textContent = "Error, no picture found"
			return console.log("ESCAPED PIC0.jpg")
		}

		//! FIRST PIC
		Jimp.read(buffer0, (err, image) => {
			if (err) {
				console.error(err)
			}

			let qr = new QrCode()

			qr.callback = (err, value) => {
				if (err) {
					console.error(err)
					document.querySelector("#but0").textContent = "Error, no QR code on the picture"
				}

				fs.writeFile("output.txt", value.result, (err) => {
					if (err) {
						document.querySelector("#but0").textContent = "Error, no picture found"
						console.log("Output don't created!")
					} else {
						document.querySelector("#but0").textContent = "File created"
						console.log("Output started file created!")
					}
				})
			}

			qr.decode(image.bitmap)
		})

		//! TRY SECOND PIC
		try {
			buffer1 = fs.readFileSync(path.join(full_folder, "pic1.jpg"), (err) => {
				if (err) {
					return console.log("NO PIC1.jpg")
				}

				return console.log("FOUND PIC1.jpg")
			})
		} catch (err) {
			generate()
			return console.log("ESCAPED PIC1.jpg")
		}

		//! SECOND PIC
		Jimp.read(buffer1, (err, image) => {
			if (err) {
				console.error(err)
			}

			let qr = new QrCode()

			qr.callback = (err, value) => {
				if (err) {
					console.error(err)
				}

				fs.appendFile("output.txt", `\n${value.result}`, (err) => {
					if (err) {
						console.log("Output don't modified!")
					} else {
						console.log("Output modified")
					}
				})
			}

			qr.decode(image.bitmap)
		})
	}

	if (counter == 1) {
		setTimeout(() => {
			let python = require("child_process").spawn("python", [file_path, "output.txt"])
		}, 1000)
	}
	counter++
}

let generate = () => {
	setTimeout(() => {
		let python = require("child_process").spawn("python", [file_path, "output.txt"])
	}, 1000)
}

//? start input text
let import_text0 = () => {
	let text_inputs = document.querySelector(".text-inputs")
	text_inputs.style.display = "block"

	document.querySelector("#choose").style.display = "none"
	document.querySelector("#but0").style.display = "none"
	document.querySelector("#but1").style.display = "none"
}

//? resume input text
let import_text1 = () => {
	let input0 = document.querySelector("#input0").value
	let input1 = document.querySelector("#input1").value

	if (input0 !== "") {
		fs.writeFile("output.txt", `${input0} \n${input1}`, (err) => {
			if (err) {
				console.log("Output file don't created!")
				document.querySelector("#but2").textContent = "Error, restart the app please"
			} else {
				console.log("Output file  created!")
				document.querySelector("#but2").textContent = "File created"
			}
		})

		// convert
		let python = require("child_process").spawn("python", [file_path, "output.txt"])
	} else {
		document.querySelector("#but2").textContent = "Error, fill in at least the frist input"
	}
}

//? hide
let hide = () => {
	ipc.send("hide1")
}
