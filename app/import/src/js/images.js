module.exports = {
	/**
	 * Read QR code(s) from image(s)
	 */
	chooseImages: async () => {
		let string = ""

		const open_dialog = await dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
			title: lang.import_dialog.choose_images,
			properties: ["openFile", "multiSelections"],
			filters: [{ name: lang.import_dialog.image_file, extensions: ["jpg", "jpeg", "png", "bmp"] }],
		})

		const images = open_dialog.filePaths

		for (let i = 0; i < images.length; i++) {
			const reader = new QrcodeDecoder()

			const res = await reader.decodeFromImage(images[i])

			if (res === false) {
				dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: `${lang.import_dialog.no_qrcode_found_0} ${images[i]}. ${lang.import_dialog.no_qrcode_found_1}`,
				})

				return logger.warn("No QR code found (QR)")
			} else if (res.data.startsWith("otpauth://totp/") || res.data.startsWith("otpauth-migration://")) {
				if (res.data.startsWith("otpauth://totp/")) {
					string += qrConvert(res.data)
				} else {
					string += gaConvert(res.data)
				}

				if (images.length === i + 1) {
					const save_exists = fs.existsSync(path.join(folder_path, "codes", "codes.authme"))

					const result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
						title: "Authme",
						buttons: [lang.button.yes, lang.button.no],
						type: "info",
						noLink: true,
						defaultId: 1,
						cancelId: 1,
						message: `${lang.import_dialog.correct_qrcode_found_0} ${lang.import_dialog.correct_qrcode_found_1}`,
					})

					if (result.response === 0) {
						if (save_exists === true) {
							ipc.invoke("importExistingCodes", Buffer.from(string).toString("base64"))
						} else {
							ipc.invoke("importCodes", Buffer.from(string).toString("base64"))
						}

						saveFile(string)
					} else {
						if (save_exists === true) {
							ipc.invoke("importExistingCodes", Buffer.from(string).toString("base64"))
						} else {
							ipc.invoke("importCodes", Buffer.from(string).toString("base64"))
						}
					}
				}
			} else {
				dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: `${lang.import_dialog.wrong_qrcode_found_0} ${images[i]}. ${lang.import_dialog.wrong_qrcode_found_1}`,
				})

				return logger.error("Wrong QR code found (QR)")
			}
		}
	},
}
