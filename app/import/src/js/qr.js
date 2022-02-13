const { dialog, desktopCapturer } = require("@electron/remote")
const { localization } = require("@levminer/lib")
const { ipcRenderer: ipc } = require("electron")

const lang = localization.getLang()

module.exports = {
	/**
	 * Read qr code from image(s)
	 */
	qrImport: () => {
		let images = []
		const corrects = []
		const names = []
		const secrets = []
		const issuers = []

		// open dialog
		dialog
			.showOpenDialog({
				title: lang.import_dialog.import_qrcode,
				properties: ["openFile", "multiSelections"],
				filters: [{ name: lang.import_dialog.image_file, extensions: ["jpg", "jpeg", "png", "bmp"] }],
			})
			.then((result) => {
				canceled = result.canceled
				images = result.filePaths

				if (canceled === false) {
					qrImportResume()
				}
			})

		const qrImportResume = async () => {
			for (let i = 0; i < images.length; i++) {
				const element = images[i]

				const reader = new QrcodeDecoder()

				const res = await reader.decodeFromImage(element)

				if (res === false) {
					dialog.showMessageBox({
						title: "Authme",
						buttons: [lang.button.close],
						type: "error",
						noLink: true,
						message: `${lang.import_dialog.no_qrcode_found_0} ${element}. ${lang.import_dialog.no_qrcode_found_1}`,
					})

					return logger.warn("No QR code found (QR)")
				} else if (res.data.startsWith("otpauth://totp/")) {
					// correct pictures
					corrects.push(element)

					// construct
					let url = res.data.replaceAll(/\s/g, "")
					url = url.slice(15)

					// get name
					const name_index = url.match(/[?]/)
					const name = url.slice(0, name_index.index)
					url = url.slice(name.length + 1)

					// get secret
					const secret_index = url.match(/[&]/)
					const secret = url.slice(7, secret_index.index)
					url = url.slice(secret.length + 14 + 1)

					// get issuer
					const issuer = url
					names.push(name)
					secrets.push(secret)
					issuers.push(issuer)

					if (images.length === i + 1) {
						let str = ""
						for (let j = 0; j < names.length; j++) {
							const substr = `\nName:   ${names[j]} \nSecret: ${secrets[j]} \nIssuer: ${issuers[j]} \nType:   OTP_TOTP\n`
							str += substr
						}

						const saveFile = async () => {
							const result = await dialog.showSaveDialog({
								title: lang.import_dialog.save_file,
								filters: [{ name: lang.application_dialog.authme_file, extensions: ["authme"] }],
								defaultPath: "~/import.authme",
							})

							canceled = result.canceled
							output = result.filePath

							/**
							 * .authme import file
							 * @type {LibAuthmeFile}
							 */
							const save_file = {
								role: "import",
								encrypted: false,
								codes: Buffer.from(str).toString("base64"),
								date: time.timestamp(),
								version: 3,
							}

							if (canceled === false) {
								fs.writeFile(output, JSON.stringify(save_file, null, "\t"), (err) => {
									if (err) {
										logger.error(`Error creating file - ${err}`)
									} else {
										logger.log("File created")
									}
								})
							} else {
								return logger.warn("Saving canceled")
							}
						}

						const save_exists = fs.existsSync(path.join(folder_path, "codes", "codes.authme"))

						if (save_exists === true) {
							await dialog.showMessageBox({
								title: "Authme",
								buttons: [lang.button.close],
								type: "info",
								noLink: true,
								defaultId: 0,
								message: `${lang.import_dialog.correct_qrcode_found_0} ${lang.import_dialog.correct_qrcode_found_1}`,
							})

							saveFile()
						} else {
							const result = await dialog.showMessageBox({
								title: "Authme",
								buttons: [lang.button.yes, lang.button.no],
								type: "info",
								noLink: true,
								defaultId: 1,
								cancelId: 1,
								message: `${lang.import_dialog.correct_qrcode_found_2} ${lang.import_dialog.correct_qrcode_found_3}`,
							})

							if (result.response === 1) {
								ipc.invoke("importedCodes", Buffer.from(str).toString("base64"))
							} else {
								ipc.invoke("importedCodes", Buffer.from(str).toString("base64"))

								saveFile()
							}
						}
					}
				} else {
					dialog.showMessageBox({
						title: "Authme",
						buttons: [lang.button.close],
						type: "error",
						noLink: true,
						message: `${lang.import_dialog.wrong_qrcode_found_0} ${element}. ${lang.import_dialog.wrong_qrcode_found_1}`,
					})

					return logger.error("Wrong QR code found (QR)")
				}
			}
		}
	},

	/**
	 * Read qr code from camera
	 */
	qrCamera: () => {
		checkWebcam((hasWebcam) => {
			if (hasWebcam === false) {
				dialog.showMessageBox({
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: lang.import_dialog.no_webcam,
				})

				return logger.error("Not found webcam")
			} else {
				const video = document.querySelector("#qrVideo")
				const button = document.querySelector("#qrStop")

				const reader = new QrcodeDecoder()

				button.addEventListener("click", () => {
					video.style.display = "none"
					button.style.display = "none"

					reader.stop()
				})

				setTimeout(() => {
					video.style.display = "block"
					button.style.display = "inline"
				}, 300)

				reader
					.decodeFromCamera(video)
					.then(async (res) => {
						if (res.data.startsWith("otpauth://totp/")) {
							// construct
							let url = res.data.replaceAll(/\s/g, "")
							url = url.slice(15)

							// get name
							const name_index = url.match(/[?]/)
							const name = url.slice(0, name_index.index)
							url = url.slice(name.length + 1)

							// get secret
							const secret_index = url.match(/[&]/)
							const secret = url.slice(7, secret_index.index)
							url = url.slice(secret.length + 14 + 1)

							// get issuer
							const issuer = url

							const str = `\nName:   ${name} \nSecret: ${secret} \nIssuer: ${issuer} \nType:   OTP_TOTP\n`

							const saveFile = async () => {
								const result = await dialog.showSaveDialog({
									title: lang.import_dialog.save_file,
									filters: [{ name: lang.application_dialog.authme_file, extensions: ["authme"] }],
									defaultPath: "~/import.authme",
								})

								canceled = result.canceled
								output = result.filePath

								/**
								 * .authme import file
								 * @type {LibAuthmeFile}
								 */
								const save_file = {
									role: "import",
									encrypted: false,
									codes: Buffer.from(str).toString("base64"),
									date: time.timestamp(),
									version: 3,
								}

								if (canceled === false) {
									fs.writeFile(output, JSON.stringify(save_file, null, "\t"), (err) => {
										if (err) {
											logger.error(`Error creating file - ${err}`)
										} else {
											logger.log("File created")
										}
									})
								} else {
									return logger.warn("Saving canceled")
								}
							}

							const save_exists = fs.existsSync(path.join(folder_path, "codes", "codes.authme"))

							if (save_exists === true) {
								await dialog.showMessageBox({
									title: "Authme",
									buttons: [lang.button.close],
									type: "info",
									noLink: true,
									defaultId: 0,
									message: `${lang.import_dialog.correct_qrcode_found_0} ${lang.import_dialog.correct_qrcode_found_1}`,
								})

								saveFile()
							} else {
								const result = await dialog.showMessageBox({
									title: "Authme",
									buttons: [lang.button.yes, lang.button.no],
									type: "info",
									noLink: true,
									defaultId: 1,
									cancelId: 1,
									message: `${lang.import_dialog.correct_qrcode_found_2} ${lang.import_dialog.correct_qrcode_found_3}`,
								})

								if (result.response === 1) {
									ipc.invoke("importedCodes", Buffer.from(str).toString("base64"))
								} else {
									ipc.invoke("importedCodes", Buffer.from(str).toString("base64"))

									saveFile()
								}
							}
						} else {
							dialog.showMessageBox({
								title: "Authme",
								buttons: [lang.button.close],
								type: "error",
								noLink: true,
								message: lang.import_dialog.wrong_qrcode,
							})

							video.style.display = "none"
							button.style.display = "none"

							reader.stop()

							return logger.error("Wrong QR code found (QR)")
						}

						video.style.display = "none"
						button.style.display = "none"

						reader.stop()
					})
					.catch(() => {
						dialog.showMessageBox({
							title: "Authme",
							buttons: [lang.button.close],
							type: "error",
							noLink: true,
							message: lang.import_dialog.webcam_used,
						})

						reader.stop()

						setTimeout(() => {
							video.style.display = "none"
							button.style.display = "none"
						}, 300)

						logger.error("Webcam in use")
					})
			}
		})
	},

	/**
	 * Read QR code from screen capture
	 */
	qrScreen: () => {
		desktopCapturer.getSources({ types: ["screen"] }).then(async (sources) => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: "desktop",
							chromeMediaSourceId: sources[0].id,
							minWidth: 1280,
							maxWidth: 1280,
							minHeight: 720,
							maxHeight: 720,
						},
					},
				})

				qrHandleStream(stream)
			} catch (error) {
				dialog.showMessageBox({
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: `Error starting capture! \n\n${error}`,
				})

				logger.error("Error starting capture!", error.stack)
			}
		})

		const qrHandleStream = async (stream) => {
			const track = stream.getTracks()[0]

			const video = document.querySelector("#qrVideo")
			video.style.display = "flex"
			video.srcObject = stream

			const button = document.querySelector("#qrStop")
			button.style.display = "inline"

			button.addEventListener("click", () => {
				video.style.display = "none"
				button.style.display = "none"

				reader.stop()
				track.stop()
			})

			await dialog.showMessageBox(currentWindow, {
				title: "Authme",
				buttons: [lang.button.close],
				type: "info",
				noLink: true,
				defaultId: 0,
				message: "Authme is trying to detect a QR code from your screen! \n\nMake sure the QR code is visible.",
			})

			const reader = new QrcodeDecoder()

			const res = await reader.decodeFromVideo(video)

			if (res.data.startsWith("otpauth://totp/")) {
				// construct
				let url = res.data.replaceAll(/\s/g, "")
				url = url.slice(15)

				// get name
				const name_index = url.match(/[?]/)
				const name = url.slice(0, name_index.index)
				url = url.slice(name.length + 1)

				// get secret
				const secret_index = url.match(/[&]/)
				const secret = url.slice(7, secret_index.index)
				url = url.slice(secret.length + 14 + 1)

				// get issuer
				const issuer = url

				const str = `\nName:   ${name} \nSecret: ${secret} \nIssuer: ${issuer} \nType:   OTP_TOTP\n`

				dialog
					.showMessageBox(currentWindow, {
						title: "Authme",
						buttons: [lang.button.close],
						type: "info",
						noLink: true,
						defaultId: 0,
						message: "QR codes found on the screen! \n\nNow select where do you want to save the file!",
					})
					.then(() => {
						dialog
							.showSaveDialog(currentWindow, {
								title: "Save file",
								filters: [{ name: "Authme file", extensions: ["authme"] }],
								defaultPath: "~/import.authme",
							})
							.then((result) => {
								canceled = result.canceled
								output = result.filePath

								/**
								 * .authme import file
								 * @type {LibAuthmeFile}
								 */
								const save_file = {
									role: "import",
									encrypted: false,
									codes: Buffer.from(str).toString("base64"),
									date: time.timestamp(),
									version: 3,
								}

								if (canceled === false) {
									fs.writeFile(output, JSON.stringify(save_file, null, "\t"), (err) => {
										if (err) {
											logger.error(`Error creating file - ${err}`)
										} else {
											logger.log("File created")
										}
									})
								} else {
									return logger.warn("Saving canceled")
								}
							})
					})
			} else if (res.data !== "") {
				dialog.showMessageBox(currentWindow, {
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: "Wrong QR code found on the screen! \n\nMake sure this is a correct QR code and try again!",
				})

				return logger.error("Wrong QR code found (QR)")
			}

			if (res.data !== "") {
				video.style.display = "none"
				button.style.display = "none"

				reader.stop()
				track.stop()
			}
		}
	},
}
