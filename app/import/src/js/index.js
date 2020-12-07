const fs = require("fs")
const electron = require("electron")
const { dialog, shell } = require("electron").remote
const ipc = electron.ipcRenderer
const path = require("path")
const Qr_Reader = require("qrcode-reader")
const jimp = require("jimp")
const readline = require("readline")
const spawn = require("child_process").spawn

// ? os specific folders
let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

const file_path = path.join(folder, "Levminer/Authme")
const python_path = path.join(__dirname, "src/py/extract_2fa_secret.py")

console.log(python_path)

// ? init
let canceled
let output

// ? import from qr code
const import_qrcode = () => {
	// request file
	dialog
		.showOpenDialog({
			title: "Import from QR code",
			properties: ["openFile", "multiSelections"],
			filters: [{ name: "Images", extensions: ["jpg", "png"] }],
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePaths

			console.log(canceled)
			console.log(output)

			if (canceled === false) {
				resume()
			}
		})
		.catch((err) => {
			console.log(err)
		})

	// process picture
	const resume = () => {
		for (let i = 0; i < output.length; i++) {
			const run = async () => {
				const error = () => {
					dialog.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						message: `
						No QR code found on the picture: ${output[i]}.
						
						Try to take a better picture and try again!
						`,
					})
				}

				const img = await jimp.read(fs.readFileSync(output[i]))

				const qr = new Qr_Reader()

				const value = await new Promise((resolve, reject) => {
					qr.callback = (err, v) => (err != null ? error() : resolve(v))
					qr.decode(img.bitmap)
				})

				fs.appendFile(path.join("output.txt"), `${value.result}\n`, (err) => {
					if (err) {
						console.log("Output don't modified and don't created!")
					} else {
						console.log("Output modified or created")
					}
				})

				if (i + 1 == output.length) {
					dialog
						.showMessageBox({
							title: "Authme",
							buttons: ["Close"],
							type: "info",
							defaultId: 0,
							message: `
							QR code(s) found on the picture(s).
							
							Now select where do you want to save the file!
							`,
						})
						.then((result) => {
							if (result.response === 0) {
								generate()
							}
						})
				}
			}

			run()
		}
	}
}

// ? start input text
const import_text = () => {
	const text_inputs = document.querySelector(".text-inputs")
	text_inputs.style.display = "block"

	document.querySelector(".choose").style.display = "none"
}

// resume input text
const import_text_resume = () => {
	const input0 = document.querySelector("#input0").value
	const input1 = document.querySelector("#input1").value

	if (input0 !== "") {
		fs.writeFile(path.join("output.txt"), `${input0} \n${input1}`, (err) => {
			if (err) {
				console.log("Output file don't created!")
				document.querySelector("#but2").textContent = "Error, restart the app please"
			} else {
				console.log("Output file created!")
				document.querySelector("#but2").textContent = "File created"
			}
		})

		dialog
			.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				type: "info",
				defaultId: 0,
				message: `
				QR code(s) found.
				
				Now select where do you want to save the file!
			`,
			})
			.then((result) => {
				if (result.response === 0) {
					generate()
				}
			})
	} else {
		document.querySelector("#but2").textContent = "Error, fill in at least the frist input"
	}
}

// ? generate file
const generate = () => {
	const python = spawn("python", [python_path, "output.txt"])

	python.stdout.on("data", (data) => {
		console.log(data.toString())
	})

	setTimeout(() => {
		dialog
			.showSaveDialog({
				title: "Save import file",
				filters: [{ name: "Text file", extensions: ["txt"] }],
				defaultPath: "~/authme_import.txt",
			})
			.then((result) => {
				canceled = result.canceled
				output = result.filePath

				console.log(canceled)
				console.log(output)

				if (canceled === false) {
					const file = fs.readFileSync(path.join("exported.txt"), "utf-8", (err) => {
						if (err) {
							return console.log(`error creating file ${err}`)
						} else {
							return console.log("file created")
						}
					})

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

		clear()
	}, 800)
}

// ? clear
const clear = () => {
	fs.unlink(path.join(file_path, "exported.txt"), (err) => {
		if (err && err.code === "ENOENT") {
			return console.log("exported.txt not deleted")
		} else {
			console.log("exported.txt deleted")
		}
	})

	fs.unlink(path.join(file_path, "output.txt"), (err) => {
		if (err && err.code === "ENOENT") {
			return console.log("output.txt not deleted")
		} else {
			console.log("output.txt deleted")
		}
	})
}

// ? link
const link0 = () => {
	shell.openExternal("https://www.python.org/downloads/")
}

const link1 = () => {
	shell.openExternal("https://github.com/Levminer/authme")
}

// ? import from stand alone qr code
const import_sa_qrcode = () => {
	// request file
	dialog
		.showOpenDialog({
			title: "Import from stand alone QR code",
			properties: ["openFile", "multiSelections"],
			filters: [{ name: "Images", extensions: ["jpg", "png"] }],
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePaths

			console.log(canceled)
			console.log(output)

			if (canceled === false) {
				resume_sa_qrcode()
			}
		})
		.catch((err) => {
			console.log(err)
		})

	// process picture
	const resume_sa_qrcode = () => {
		for (let i = 0; i < output.length; i++) {
			const run_sa_qrcode = async () => {
				const error = () => {
					console.log(error)
				}

				const img = await jimp.read(fs.readFileSync(output[i]))

				const qr = new Qr_Reader()

				const value = await new Promise((resolve, reject) => {
					qr.callback = (err, v) => (err != null ? error() : resolve(v))
					qr.decode(img.bitmap)
				})

				fs.appendFile(path.join("output.txt"), `${value.result}\n`, (err) => {
					if (err) {
						console.log("Output don't modified and don't created!")
					} else {
						console.log("Output modified or created")
					}
				})

				if (i + 1 == output.length) {
					dialog
						.showMessageBox({
							title: "Authme",
							buttons: ["Close"],
							type: "info",
							defaultId: 0,
							message: `
							QR code(s) found on the picture(s).
							
							Now select where do you want to save the file!
							`,
						})
						.then((result) => {
							if (result.response === 0) {
								generte_sa()
							}
						})
				}
			}

			run_sa_qrcode()
		}
	}
}

const generte_sa = () => {
	dialog
		.showSaveDialog({
			title: "Save import file",
			filters: [{ name: "Text file", extensions: ["txt"] }],
			defaultPath: "~/authme_import.txt",
		})
		.then((result) => {
			canceled = result.canceled
			output = result.filePath

			console.log(canceled)
			console.log(output)

			if (canceled === false) {
				const lineReader = readline.createInterface({
					input: fs.createReadStream(path.join("output.txt")),
				})

				// set counter
				let counter = 0

				// detect last line
				lineReader.on("close", () => {
					done()
				})

				lineReader.on("line", (line) => {
					// line1
					if (counter === 0) {
						const fl = line.slice(15)
						fs.appendFileSync(path.join("exported.txt"), `\nName: ${fl} \n`, (err) => {
							if (err) {
								console.log("Output don't modified and don't created!")
							} else {
								console.log("Output modified or created")
							}
						})
					}

					// line2
					if (counter === 1) {
						const fl = line.slice(8)
						fs.appendFileSync(path.join("exported.txt"), `Secret: ${fl} \n`, (err) => {
							if (err) {
								console.log("Output don't modified and don't created!")
							} else {
								console.log("Output modified or created")
							}
						})
					}

					// line3
					if (counter === 2) {
						const fl = line.slice(8)
						fs.appendFileSync(path.join("exported.txt"), `Issuer: ${fl} \n`, (err) => {
							if (err) {
								console.log("Output don't modified and don't created!")
							} else {
								console.log("Output modified or created")
							}
						})

						// line 4
						fs.appendFileSync(path.join("exported.txt"), "Type:   OTP_TOTP  \n", (err) => {
							if (err) {
								console.log("Output don't modified and don't created!")
							} else {
								console.log("Output modified or created")
							}
						})
					}

					// increment on reset
					if (counter !== 2) {
						counter++
					} else {
						counter = 0
					}
				})

				const done = () => {
					// read exported.txt
					const file = fs.readFileSync(path.join("exported.txt"), "utf-8", (err) => {
						if (err) {
							return console.log(`error creating file ${err}`)
						} else {
							return console.log("file created")
						}
					})

					// write to destination
					fs.writeFileSync(output, file, (err) => {
						if (err) {
							return console.log(`error creating file ${err}`)
						} else {
							return console.log("file created")
						}
					})

					console.log("temp filed deleted")
					clear()
				}
			}
		})
		.catch((err) => {
			console.log(err)
		})
}

// ? hide
const hide = () => {
	ipc.send("hide1")
}
