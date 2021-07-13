const gaImport = () => {
	let i = 0
	let j = 0
	let string = ""
	const corrects = []
	const datas = []
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

			qrcodedecoder.default.prototype.decodeFromImage(element).then((res) => {
				if (res === false) {
					dialog.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						message: `No Google Authenticator QR code found on the picture: ${element}.
						
						Try to take a better picture and try again!`,
					})

					return console.warn("Authme - No QR code found (GA)")
				} else if (res.data.startsWith("otpauth-migration://")) {
					// split string
					const uri = res.data.split("=")

					// decode data
					const data = qr.convert(uri[1])

					// make a string
					data.forEach((element) => {
						const tempsring = `\nName:   ${element.name} \nSecret: ${element.secret} \nIssuer: ${element.issuer} \nType:   OTP_TOTP\n`
						string += tempsring
					})

					// correct pictures
					corrects.push(element)

					// add to final array
					datas.push(string)

					j++

					if (images.length == j) {
						let str = ""

						// make final string
						datas.forEach((element) => {
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
													console.warn(`Authme - Error creating file - ${err}`)
												} else {
													console.warn("Authme - File created")
												}
											})
										} else {
											return console.warn("Authme - Saveing cancled")
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

					return console.warn("Authme - Wrong QR code found (QR)")
				}
			})
		}
	}
}
