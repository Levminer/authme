const { localization } = require("@levminer/lib")

const lang = localization.getLang()

module.exports = {
	/**
	 * Read google authenticator qr codes from images(s)
	 */
	gaImport: () => {
		let i = 0
		let j = 0
		let string = ""
		const corrects = []
		const final = []
		let images = []

		dialog
			.showOpenDialog({
				title: lang.import_dialog.import_qa_qrcode,
				properties: ["openFile", "multiSelections"],
				filters: [{ name: lang.import_dialog.image_file, extensions: ["jpg", "jpeg", "png", "bmp"] }],
			})
			.then((result) => {
				canceled = result.canceled
				images = result.filePaths

				if (canceled === false) {
					gaImportResume()
				}
			})

		const gaImportResume = () => {
			for (i = 0; i < images.length; i++) {
				const element = images[i]

				const reader = new QrcodeDecoder()

				reader.decodeFromImage(element).then((res) => {
					if (res === false) {
						dialog.showMessageBox({
							title: "Authme",
							buttons: [lang.button.close],
							type: "error",
							message: `${lang.import_dialog.no_qrcode_found_0} ${element}. ${lang.import_dialog.no_qrcode_found_1}`,
						})

						return logger.warn("No QR code found (GA)")
					} else if (res.data.startsWith("otpauth-migration://")) {
						// split string
						const uri = res.data.split("=")

						// decode data
						const data = qrcodeConverter.convert(uri[1])

						// make a string
						data.forEach((element) => {
							const temp_string = `\nName:   ${element.name} \nSecret: ${element.secret} \nIssuer: ${element.issuer} \nType:   OTP_TOTP\n`
							string += temp_string
						})

						// correct pictures
						corrects.push(element)

						// add to final array
						final.push(string)

						j++

						if (images.length == j) {
							let str = ""

							// make final string
							final.forEach((element) => {
								str += element
							})

							// correct pictures string
							let corrects_str = ""
							for (let k = 0; k < corrects.length; k++) {
								if (k === corrects.length - 1) {
									corrects_str += `${element}.`
								} else {
									corrects_str += `${element}, `
								}
							}

							dialog
								.showMessageBox({
									title: "Authme",
									buttons: [lang.button.close],
									type: "info",
									defaultId: 0,
									message: `${lang.import_dialog.correct_qrcode_found_0} ${corrects_str} ${lang.import_dialog.correct_qrcode_found_1}`,
								})
								.then(() => {
									dialog
										.showSaveDialog({
											title: lang.import_dialog.save_file,
											filters: [{ name: lang.application_dialog.authme_file, extensions: ["authme"] }],
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
						}
					} else {
						dialog.showMessageBox({
							title: "Authme",
							buttons: [lang.button.close],
							type: "error",
							message: `${lang.import_dialog.wrong_qrcode_found_0} ${element}. ${lang.import_dialog.wrong_qrcode_found_1}`,
						})

						return logger.error("Wrong QR code found (GA)")
					}
				})
			}
		}
	},

	/**
	 * Read google authenticator qr codes from camera
	 */
	gaCamera: () => {
		checkWebcam((hasWebcam) => {
			if (hasWebcam === false) {
				dialog.showMessageBox({
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					message: lang.import_dialog.no_webcam,
				})

				return logger.error("Not found webcam")
			} else {
				const video = document.querySelector("#gaVideo")
				const button = document.querySelector("#gaStop")

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
					.then((res) => {
						if (res.data.startsWith("otpauth-migration://")) {
							// split string
							const uri = res.data.split("=")

							// decode data
							const data = qrcodeConverter.convert(uri[1])

							// make a string
							let string = ""

							data.forEach((element) => {
								const temp_string = `\nName:   ${element.name} \nSecret: ${element.secret} \nIssuer: ${element.issuer} \nType:   OTP_TOTP\n`
								string += temp_string
							})

							dialog
								.showMessageBox({
									title: "Authme",
									buttons: [lang.button.close],
									type: "info",
									defaultId: 0,
									message: lang.import_dialog.qrcode_found,
								})
								.then(() => {
									dialog
										.showSaveDialog({
											title: lang.import_dialog.save_file,
											filters: [{ name: lang.application_dialog.authme_file, extensions: ["authme"] }],
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
												codes: Buffer.from(string).toString("base64"),
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
						} else {
							dialog.showMessageBox({
								title: "Authme",
								buttons: [lang.button.close],
								type: "error",
								message: lang.import_dialog.wrong_qrcode,
							})

							video.style.display = "none"
							button.style.display = "none"

							reader.stop()

							return logger.error("Wrong QR code found (GA)")
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
}
