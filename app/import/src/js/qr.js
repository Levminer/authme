const qr_import = () => {
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
				qr_import_resume()
			}
		})

	const qr_import_resume = () => {
		for (let i = 0; i < images.length; i++) {
			const element = images[i]

			QrcodeDecoder.default.prototype.decodeFromImage(element).then((res) => {
				if (res === false) {
					dialog.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						message: `
						No QR code found on the picture: ${element}.
						
						Try to take a better picture and try again!
						`,
					})

					return console.warn("Authme - No QR code found (QR)")
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
								message: `
								QR codes found on these pictures: ${corrects_str}
								
								Now select where do you want to save the file!
								`,
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
										}
									})
							})
					}
				} else {
					dialog.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						message: `
						Wrong QR code found on the picture: ${element}.
						
						Make sure this is a correct QR code and try again!
						`,
					})

					return console.warn("Authme - Wrong QR code found (QR)")
				}
			})
		}
	}
}
