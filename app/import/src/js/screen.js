// @ts-nocheck
const { dialog, desktopCapturer, BrowserWindow } = require("@electron/remote")
const { ipcRenderer: ipc } = require("electron")

module.exports = {
	/**
	 * Read QR code from screen capture
	 */
	captureFromScreen: async () => {
		const button = document.querySelector(".screenButton")
		const window = BrowserWindow.getFocusedWindow()
		let string = ""
		let counter = 0

		await dialog.showMessageBox(window, {
			title: "Authme",
			buttons: [lang.button.close],
			type: "info",
			noLink: true,
			defaultId: 1,
			cancelId: 1,
			message: `${lang.import_dialog.before_capture}`,
		})

		const interval = setInterval(() => {
			counter++

			button.textContent = `${10 - counter}s remaining`

			if (counter === 10) {
				clearInterval(interval)
			}
		}, 1000)

		setTimeout(async () => {
			const sources = await ipc.invoke("captureSources")

			const thumbnail = sources[0].thumbnail.toDataURL()

			document.querySelector(".thumbnail").src = thumbnail
			document.querySelector(".thumbnailContainer").style.display = "block"

			document.querySelector(".removeThumbnail").addEventListener("click", () => {
				document.querySelector(".thumbnailContainer").style.display = "none"
			})

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
				dialog.showMessageBox(window, {
					title: "Authme",
					buttons: [lang.button.close],
					type: "error",
					noLink: true,
					message: `${lang.import_dialog.capture_error} \n\n${error}`,
				})

				logger.error("Error starting capture!", error.stack)
			}

			button.textContent = "Screen capture"
		}, 10000)

		const qrHandleStream = async (stream) => {
			const track = stream.getTracks()[0]

			const video = document.querySelector("#qrVideo")
			video.srcObject = stream

			code_found = false

			const reader = new QrcodeDecoder()

			reader.decodeFromVideo(video).then(async (res) => {
				code_found = true

				if (res.data.startsWith("otpauth://totp/") || res.data.startsWith("otpauth-migration://")) {
					qrcode_found = true

					if (res.data.startsWith("otpauth://totp/")) {
						string += qrConvert(res.data)
					} else {
						string += gaConvert(res.data)
					}

					const save_exists = fs.existsSync(path.join(folder_path, "codes", "codes.authme"))

					const result = await dialog.showMessageBox(window, {
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

					reader.stop()
					track.stop()
				} else {
					dialog.showMessageBox(window, {
						title: "Authme",
						buttons: [lang.button.close],
						type: "error",
						noLink: true,
						message: lang.import_dialog.wrong_qrcode,
					})

					reader.stop()
					track.stop()
				}
			})

			setTimeout(() => {
				if (code_found === false) {
					dialog.showMessageBox(window, {
						title: "Authme",
						buttons: [lang.button.close],
						type: "error",
						noLink: true,
						message: lang.import_dialog.no_qrcode_captured,
					})

					reader.stop()
					track.stop()
				}
			}, 1000)
		}
	},
}
