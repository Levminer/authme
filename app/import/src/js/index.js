const fs = require("fs")
const electron = require("electron")
const { dialog, shell } = require("electron").remote
const ipc = electron.ipcRenderer
const path = require("path")
const Qr_Reader = require("qrcode-reader")
const jimp = require("jimp")
const readline = require("readline")
const spawn = require("child_process").spawn

const python_path = path.join(__dirname, "src/py/extract_2fa_secret.py")

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

			if (canceled === false) {
				resume()
			}
		})
		.catch((err) => {
			console.warn(`Authme - Error saving file - ${err}`)
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
						console.warn("Authme - Output don't modified and don't created")
					} else {
						console.warn("Authme - Output modified or created")
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

// ? generate file
const generate = () => {
	const python = spawn("python", [python_path, "output.txt"])

	python.stdout.on("data", (data) => {
		console.warn("Python data recived")
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

				if (canceled === false) {
					const file = fs.readFileSync(path.join("exported.txt"), "utf-8", (err) => {
						if (err) {
							return console.warn(`Authme - Error creating file - ${err}`)
						} else {
							return console.warn("Authme - File created")
						}
					})

					fs.writeFile(output, file, (err) => {
						if (err) {
							console.warn(`Authme - Error creating file - ${err}`)
						} else {
							console.warn("Authme - File created")

							clear()
						}
					})
				}
			})
			.catch((err) => {
				console.warn(`Authme - Error saving file - ${err}`)

				dialog.showMessageBox({
					title: "Authme",
					buttons: ["Close"],
					type: "error",
					message: `
					No Google Authenticator QR code found on the picture!
					
					Try to take a better picture and try again!
					`,
				})

				clear()
			})
	}, 800)
}

// ? clear
const clear = () => {
	fs.unlink("exported.txt", (err) => {
		if (err && err.code === "ENOENT") {
			return console.warn(`Authme - File exported.txt not deleted - ${err}`)
		} else {
			console.warn("Authme - File exported.txt deleted")
		}
	})

	fs.unlink("output.txt", (err) => {
		if (err && err.code === "ENOENT") {
			return console.warn(`Authme - File output.txt not deleted - ${err}`)
		} else {
			console.warn("Authme - File output.txt deleted")
		}
	})
}

// ? link
const link0 = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=import")
}

const link1 = () => {
	shell.openExternal("https://github.com/Levminer/authme/tree/main/extract#usage")
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

			if (canceled === false) {
				resume_sa_qrcode()
			}
		})
		.catch((err) => {
			console.warn(`Authme - Error opening file - ${err}`)
		})

	// process picture
	const resume_sa_qrcode = () => {
		for (let i = 0; i < output.length; i++) {
			const run_sa_qrcode = async () => {
				const error = () => {
					console.warn("Authme - Error loading qr code")

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
						console.warn("Authme - Output don't modified and don't created")
					} else {
						console.warn("Authme -Output modified or created")
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
								console.warn(`Authme - Output don't modified and don't created - ${err}`)
							} else {
								console.warn("Authme - Output modified or created")
							}
						})
					}

					// line2
					if (counter === 1) {
						const fl = line.slice(8)
						fs.appendFileSync(path.join("exported.txt"), `Secret: ${fl} \n`, (err) => {
							if (err) {
								console.warn(`Authme - Output don't modified and don't created - ${err}`)
							} else {
								console.warn("Authme - Output modified or created")
							}
						})
					}

					// line3
					if (counter === 2) {
						const fl = line.slice(8)
						fs.appendFileSync(path.join("exported.txt"), `Issuer: ${fl} \n`, (err) => {
							if (err) {
								console.warn(`Authme - Output don't modified and don't created - ${err}`)
							} else {
								console.warn("Authme - Output modified or created")
							}
						})

						// line 4
						fs.appendFileSync(path.join("exported.txt"), "Type:   OTP_TOTP  \n", (err) => {
							if (err) {
								console.warn(`Authme - Output don't modified and don't created - ${err}`)
							} else {
								console.warn("Authme - Output modified or created")
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
							return console.warn(`Authme - Error creating file - ${err}`)
						} else {
							return console.warn("Authme - File created")
						}
					})

					// write to destination
					fs.writeFileSync(output, file, (err) => {
						if (err) {
							return console.warn(`Authme - Error creating file - ${err}`)
						} else {
							return console.warn("Authme - File created")
						}
					})

					clear()
				}
			}
		})
		.catch((err) => {
			console.warn(`Authme - Error saving file - ${err}`)
		})
}

// ? hide
const hide = () => {
	ipc.send("hide1")
}
