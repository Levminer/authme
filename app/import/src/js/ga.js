const ga_import = () => {
	let i = 0
	let j = 0
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
				ga_import_resume()
			}
		})

	const ga_import_resume = () => {
		const qr = new QrcodeDecoder()

		for (i = 0; i < images.length; i++) {
			const element = images[i]

			qr.decodeFromImage(element).then((res) => {
				if (res === false) {
					dialog.showMessageBox({
						title: "Authme",
						buttons: ["Close"],
						type: "error",
						message: `
						No Google Authenticator QR code found on the picture: ${element}.
						
						Try to take a better picture and try again!
						`,
					})

					return console.warn("Authme - No QR code found (GA)")
				} else if (res.data.startsWith("otpauth-migration://")) {
					const python = spawn("python", [python_path, `${res.data}`])

					python.stdout.on("data", (res) => {
						// correct pictures
						corrects.push(element)

						// stringify data
						data = res.toString()
						console.warn("Authme - Python data recived")
						datas.push(data)

						j++

						if (images.length == j) {
							let str = ""

							datas.forEach((element) => {
								str += element
							})

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
									Google Authenticator QR codes found on these pictures: ${corrects_str}
									
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
					})
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
