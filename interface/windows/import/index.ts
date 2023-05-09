import { BarcodeDetectorPolyfill } from "@undecaf/barcode-detector-polyfill"
import { fs, dialog } from "@tauri-apps/api"
import { getState, setState } from "../../stores/state"
import { navigate } from "../../utils/navigate"
import logger from "interface/utils/logger"
import { decodeBase64, migrationImageConverter, totpImageConverter } from "@utils/convert"

/**
 * Choose images, then read QR codes
 */
export const chooseImages = async () => {
	const filePaths = await dialog.open({ multiple: true, filters: [{ name: "Image file", extensions: ["jpg", "jpeg", "png", "bmp"] }] })

	if (filePaths === null) {
		return
	}

	const images: ImageBitmap[] = []

	// Read images
	for (let i = 0; i < filePaths.length; i++) {
		const file = await fs.readBinaryFile(filePaths[i])

		const blob = new Blob([file], { type: "application/octet-binary" })
		const img = await createImageBitmap(blob)

		images.push(img)
	}

	let importString = ""

	// Read QR codes from images
	for (let i = 0; i < images.length; i++) {
		const processImages = async () => {
			try {
				const detector = new BarcodeDetectorPolyfill()
				const res = (await detector.detect(images[i]))[0]

				if (res.rawValue.startsWith("otpauth://totp/") || res.rawValue.startsWith("otpauth-migration://")) {
					if (res.rawValue.startsWith("otpauth://totp/")) {
						importString += totpImageConverter(res.rawValue)
					} else {
						const converted = await migrationImageConverter(res.rawValue)

						if (converted === "") {
							return dialog.message("Failed to decode QR code(s). \n\nPlease try again with another picture!", { type: "error" })
						} else {
							importString += converted
						}
					}

					// QR codes found on all images
					if (images.length === i + 1) {
						dialog.message("Codes imported. \n\nYou can edit your codes on the edit page.")

						const state = getState()
						state.importData = importString
						setState(state)

						navigate("codes")
					}
				} else {
					// Wrong QR code found
					logger.error(`Error while reading QR code: ${res.rawValue}}`)
					dialog.message(`Wrong QR code found on the #${i + 1} picture! \n\nPlease try again with another picture!`, { type: "error" })
				}
			} catch (error) {
				// Error while reading QR code
				logger.error(`Error while reading QR code: ${error}}`)
				dialog.message(`No QR code found on the #${i + 1} picture! \n\nPlease try again with another picture!`, { type: "error" })
			}
		}

		processImages()
	}
}

/**
 * Show manual entry dialog
 */
export const showManualEntry = () => {
	const dialog: LibDialogElement = document.querySelector(".dialog0")
	const closeDialog = document.querySelector(".dialog0Close")

	closeDialog.addEventListener("click", () => {
		document.querySelector(".name").value = ""
		document.querySelector(".secret").value = ""
		document.querySelector(".description").value = ""

		dialog.close()
	})

	dialog.showModal()
}

/**
 * Show Google Authenticator tutorial dialog
 */
export const showGADialog = () => {
	const dialog: LibDialogElement = document.querySelector(".dialog2")
	const closeDialog = document.querySelector(".dialog2Close")

	closeDialog.addEventListener("click", () => {
		dialog.close()
	})

	dialog.showModal()
}

/**
 * Show TOTP tutorial dialog
 */
export const showTOTPDialog = () => {
	const dialog: LibDialogElement = document.querySelector(".dialog3")
	const closeDialog = document.querySelector(".dialog3Close")

	closeDialog.addEventListener("click", () => {
		dialog.close()
	})

	dialog.showModal()
}

/**
 * Enter a TOTP code manually
 */
export const manualEntry = () => {
	const issuer = document.querySelector(".name").value
	const secret = document.querySelector(".secret").value
	let name = document.querySelector(".description").value

	if (issuer === "") {
		return dialog.message("The name field is required. \n\nPlease try again!", { type: "error" })
	}

	if (secret === "") {
		return dialog.message("The secret field is required. \n\nPlease try again!", { type: "error" })
	}

	if (name === "") {
		name = issuer
	}

	const importString = `\nName:   ${name} \nSecret: ${secret} \nIssuer: ${issuer} \nType:   OTP_TOTP\n`

	const state = getState()
	state.importData += importString
	setState(state)

	navigate("codes")
}

/**
 * Import all codes from an .authme file
 */
export const chooseFile = async () => {
	const state = getState()
	const filePath = await dialog.open({ filters: [{ name: "Authme file", extensions: ["authme"] }] })

	if (filePath !== null) {
		const loadedFile = await fs.readTextFile(filePath.toString())
		const file: LibAuthmeFile = JSON.parse(loadedFile)
		const importString = decodeBase64(file.codes)

		dialog.message("Codes imported. \n\nYou can edit your codes on the edit page.")

		state.importData = importString
		setState(state)

		navigate("codes")
	}
}

/**
 * Start a video capture, when a QR code detected try to read it
 */
export const captureScreen = async () => {
	const dialogElement: LibDialogElement = document.querySelector(".dialog1")
	const videoElement: HTMLVideoElement = document.querySelector(".video")
	let interval: NodeJS.Timeout

	document.querySelector(".dialog1Title").textContent = "Capture screen import"

	try {
		videoElement.srcObject = await navigator.mediaDevices.getDisplayMedia({ audio: false })
		const track = videoElement.srcObject.getTracks()[0]

		dialogElement.showModal()

		document.querySelector(".stopVideo").addEventListener("click", () => {
			clearInterval(interval)
			track.stop()

			dialogElement.close()
		})

		const detect = async () => {
			logger.log("Checking for QR code on screen...")

			const detector = new BarcodeDetectorPolyfill()
			const results = await detector.detect(videoElement)

			// Check if a QR code was found
			if (results.length === 0) {
				return
			}

			const res = results[0]

			let importString = ""

			if (res.rawValue.startsWith("otpauth://totp/") || res.rawValue.startsWith("otpauth-migration://")) {
				if (res.rawValue.startsWith("otpauth://totp/")) {
					importString += totpImageConverter(res.rawValue)
				} else {
					const converted = await migrationImageConverter(res.rawValue)

					if (converted === "") {
						return dialog.message("Failed to decode QR code(s). \n\nPlease try again with another picture!", { type: "error" })
					} else {
						importString += converted
					}
				}

				const state = getState()
				state.importData = importString
				setState(state)

				clearInterval(interval)
				track.stop()

				dialog.message("Codes imported. \n\nYou can edit your codes on the edit page.")

				navigate("codes")
			} else {
				// Wrong QR code found
				logger.error(`Wrong type of QR code found during screen capture: ${JSON.stringify(res)}`)
				dialog.message("Wrong type of QR code found during screen capture! \n\nPlease try again with another picture!", { type: "error" })

				clearInterval(interval)
				track.stop()

				dialogElement.close()
			}
		}

		// Check for QR code every second
		interval = setInterval(detect, 1000)
	} catch (err) {
		logger.error(`Error during screen capture: ${err}`)
		dialog.message(`Error occurred during the screen capture: \n\n${err}`, { type: "error" })

		dialogElement.close()
	}
}

/**
 * Check for an available webcam
 */
const webcamAvailable = async () => {
	const md = navigator.mediaDevices

	if (!md || !md.enumerateDevices) {
		return false
	} else {
		const devices = await md.enumerateDevices()

		for (let i = 0; i < devices.length; i++) {
			if (devices[i].kind === "videoinput") {
				return true
			}

			if (i === devices.length - 1) {
				return false
			}
		}
	}
}

export const useWebcam = async () => {
	const hasWebcam = await webcamAvailable()

	document.querySelector(".dialog1Title").textContent = "Webcam import"

	if (hasWebcam === false) {
		// Not found webcam
		dialog.message("Not found webcam! \n\nPlease check if your webcam is working correctly or not used by another application.", { type: "error" })
	} else {
		const dialogElement: LibDialogElement = document.querySelector(".dialog1")
		const videoElement: HTMLVideoElement = document.querySelector(".video")
		let interval: NodeJS.Timeout

		document.querySelector(".dialog1Title").textContent = "Webcam import"

		try {
			videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
			const track = videoElement.srcObject.getTracks()[0]

			dialogElement.showModal()

			document.querySelector(".stopVideo").addEventListener("click", () => {
				clearInterval(interval)
				track.stop()

				dialogElement.close()
			})

			const detect = async () => {
				logger.log("Checking for QR code with webcam...")

				const detector = new BarcodeDetectorPolyfill()
				const results = await detector.detect(videoElement)

				// Check if a QR code was found
				if (results.length === 0) {
					return
				}

				const res = results[0]

				let importString = ""

				if (res.rawValue.startsWith("otpauth://totp/") || res.rawValue.startsWith("otpauth-migration://")) {
					if (res.rawValue.startsWith("otpauth://totp/")) {
						importString += totpImageConverter(res.rawValue)
					} else {
						const converted = await migrationImageConverter(res.rawValue)

						if (converted === "") {
							return dialog.message("Failed to decode QR code(s). \n\nPlease try again with another picture!", { type: "error" })
						} else {
							importString += converted
						}
					}

					const state = getState()
					state.importData = importString
					setState(state)

					clearInterval(interval)
					track.stop()

					dialog.message("Codes imported. \n\nYou can edit your codes on the edit page.")

					navigate("codes")
				} else {
					// Wrong QR code found
					dialog.message("Wrong type of QR code found during webcam import! \n\nPlease try again with another picture!", { type: "error" })
					logger.error(`Wrong type of QR code found during webcam import: ${JSON.stringify(res)}`)

					clearInterval(interval)
					track.stop()

					dialogElement.close()
				}
			}

			// Check for QR code every second
			interval = setInterval(detect, 1000)
		} catch (err) {
			logger.error(`Error occurred while using the webcam: ${err}`)
			dialog.message(`Error occurred while using the webcam:: \n\n${err}`, { type: "error" })

			dialogElement.close()
		}
	}
}
