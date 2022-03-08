module.exports = {
	/**
	 * Read QR code from screen capture
	 */
	captureFromScreen: () => {
		let string = ""

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
				dialog.showMessageBox(currentWindow, {
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: `${lang.import_dialog.capture_error} \n\n${error}`,
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

			const reader = new QrcodeDecoder()
			const res = await reader.decodeFromVideo(video)

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
			} else if (res.data !== "") {
				dialog.showMessageBox(currentWindow, {
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: lang.import_dialog.wrong_qrcode,
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
