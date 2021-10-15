/**
 * Read google authenticator qr codes from images(s)
 */
const gaImport = () => {
	let i = 0
	let j = 0
	let string = ""
	const corrects = []
	const final = []
	let images = []

	dialog
		.showOpenDialog({
			title: "Import from Google Authenticator QR code(s)",
			properties: ["openFile", "multiSelections"],
			filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "bmp"] }],
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
						buttons: ["Close"],
						type: "error",
						message: `No Google Authenticator QR code found on the picture: ${element}.
						
						Try to take a better picture and try again!`,
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
								buttons: ["Close"],
								type: "info",
								defaultId: 0,
								message: `Google Authenticator QR codes found on these pictures: ${corrects_str}
								
								Now select where do you want to save the file!`,
							})
							.then(() => {
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
											fs.writeFile(output, str, (err) => {
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
						message: `Wrong QR code found on the picture: ${element}.
						
						Make sure this is a correct QR code and try again!`,
					})

					return logger.error("Wrong QR code found (GA)")
				}
			})
		}
	}
}

/**
 * Read google authenticator qr codes from camera
 */
const gaCamera = () => {
	checkWebcam((hasWebcam) => {
		if (hasWebcam === false) {
			dialog.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				type: "error",
				message: `Not found webcam!
				
				Please check if your webcam is working correctly or not used by another application.`,
			})

			return logger.error("Not found webcam")
		} else {
			const video = document.querySelector("#gaCamera")
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
								buttons: ["Close"],
								type: "info",
								defaultId: 0,
								message: "Google Authenticator QR codes found on camera!\n\nNow select where do you want to save the file!",
							})
							.then(() => {
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
											fs.writeFile(output, string, (err) => {
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
							message: `Wrong QR code found on camera!
						
						Make sure this is a correct QR code and try again!`,
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
						buttons: ["Close"],
						type: "error",
						message: `Webcam in use!
				
					Please check if your webcam is not used by another application.`,
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
