module.exports = {
	/**
	 * Capture QR codes from the webcam
	 */
	useWebcam: async () => {
		let string = ""

		const hasWebcam = await webcamAvailable()

		if (hasWebcam === false) {
			dialog.showMessageBox(currentWindow, {
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

			try {
				const res = await reader.decodeFromCamera(video)

				if (res.data.startsWith("otpauth://totp/") || res.data.startsWith("otpauth-migration://")) {
					if (res.data.startsWith("otpauth://totp/")) {
						string += qrConvert(res.data)
					} else {
						string += gaConvert(res.data)
					}

					const save_exists = fs.existsSync(path.join(folder_path, "codes", "codes.authme"))

					if (save_exists === true) {
						await dialog.showMessageBox(currentWindow, {
							title: "Authme",
							buttons: [lang.button.close],
							type: "info",
							noLink: true,
							defaultId: 0,
							message: `${lang.import_dialog.correct_qrcode_found_0} ${lang.import_dialog.correct_qrcode_found_1}`,
						})

						saveFile(string)
					} else {
						const result = await dialog.showMessageBox(currentWindow, {
							title: "Authme",
							buttons: [lang.button.yes, lang.button.no],
							type: "info",
							noLink: true,
							defaultId: 1,
							cancelId: 1,
							message: `${lang.import_dialog.correct_qrcode_found_2} ${lang.import_dialog.correct_qrcode_found_3}`,
						})

						if (result.response === 1) {
							ipc.invoke("importedCodes", Buffer.from(string).toString("base64"))
						} else {
							ipc.invoke("importedCodes", Buffer.from(string).toString("base64"))

							saveFile(string)
						}
					}
				} else {
					dialog.showMessageBox(currentWindow, {
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
			} catch (error) {
				dialog.showMessageBox(currentWindow, {
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: lang.import_dialog.webcam_used,
				})

				video.style.display = "none"
				button.style.display = "none"

				reader.stop()

				logger.error("Webcam probably in use", error)
			}
		}
	},
}
