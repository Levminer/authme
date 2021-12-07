/**
 * Read qr code from image(s)
 */
const qrImport = () => {
	let images = []
	const corrects = []
	const names = []
	const secrets = []
	const issuers = []

	// open dialog
	dialog
		.showOpenDialog({
			title: "Import from QR code(s)",
			properties: ["openFile", "multiSelections"],
			filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "bmp"] }],
		})
		.then((result) => {
			canceled = result.canceled
			images = result.filePaths

			if (canceled === false) {
				qrImportResume()
			}
		})

	const qrImportResume = () => {
		for (let i = 0; i < images.length; i++) {
			const element = images[i]

			const reader = new QrcodeDecoder()

			reader.decodeFromImage(element).then((res) => {
				if (res === false) {
					dialog.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						message: `No QR code found on the picture: ${element}. \n\nTry to take a better picture and try again!`,
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
								buttons: ["Close"],
								type: "info",
								defaultId: 0,
								message: `QR codes found on these pictures: ${corrects_str} \n\nNow select where do you want to save the file!`,
							})
							.then(() => {
								dialog
									.showSaveDialog({
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
					}
				} else {
					dialog.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						message: `Wrong QR code found on the picture: ${element}. \n\nMake sure this is a correct QR code and try again!`,
					})

					return logger.error("Wrong QR code found (QR)")
				}
			})
		}
	}
}

/**
 * Read qr code from camera
 */
const qrCamera = () => {
	checkWebcam((hasWebcam) => {
		if (hasWebcam === false) {
			dialog.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				type: "error",
				message: "Not found webcam! \n\nPlease check if your webcam is working correctly or not used by another application.",
			})

			return logger.error("Not found webcam")
		} else {
			const video = document.querySelector("#qrCamera")
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
				.then((res) => {
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
							.showMessageBox({
								title: "Authme",
								buttons: ["Close"],
								type: "info",
								defaultId: 0,
								message: "QR codes found on camera! \n\nNow select where do you want to save the file!",
							})
							.then(() => {
								dialog
									.showSaveDialog({
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
					} else {
						dialog.showMessageBox({
							title: "Authme",
							buttons: ["Close"],
							type: "error",
							message: "Wrong QR code found on camera! \n\nMake sure this is a correct QR code and try again!",
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
						buttons: ["Close"],
						type: "error",
						message: "Webcam in use! \n\nPlease check if your webcam is not used by another application.",
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
}
