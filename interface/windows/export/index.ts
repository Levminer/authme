import { fs, dialog } from "@tauri-apps/api"
import { generateTimestamp } from "../../utils/time"
import { encodeBase64, textConverter } from "../../utils/convert"
import { getSettings } from "../../stores/settings"
import qrcode from "qrcode-generator"
import { decryptData, verifyWebAuthnLogin } from "interface/utils/encryption"
import { navigate } from "@utils/navigate"
import { getLanguage } from "@utils/language"

let codesArray: LibImportFile
let codesText: string
const language = getLanguage()

/**
 * Export the saved codes
 */
export const exportCodes = async () => {
	const settings = getSettings()

	const codes = settings.vault.codes

	if (codes !== null) {
		if (settings.security.hardwareAuthentication === true) {
			const res = await verifyWebAuthnLogin()

			if (res === "error") {
				return
			}
		}

		document.querySelector(".saveExportedCodes").style.display = "block"

		const decryptedText = await decryptData(codes)

		codesArray = textConverter(decryptedText, 0)
		codesText = decryptedText
	} else {
		dialog.message(language.codes.dialog.noSaveFileFound, { type: "error" })

		return navigate("import")
	}
}

/**
 * Save the exported codes as an .authme file
 */
export const exportAuthmeFile = async () => {
	const saveFile: LibAuthmeFile = {
		role: "codes",
		encrypted: false,
		codes: encodeBase64(codesText),
		date: generateTimestamp(),
		version: 3,
	}

	const filePath = await dialog.save({ filters: [{ name: "Authme file", extensions: ["authme"] }] })

	if (filePath !== null) {
		fs.writeFile(filePath, JSON.stringify(saveFile, null, "\t"))
	}
}

/**
 * Save the exported codes as an .html file with pictures
 */
export const exportHtmlFile = async () => {
	const names = codesArray.names
	const secrets = codesArray.secrets
	const issuers = codesArray.issuers

	let htmlString = ""

	for (let i = 0; i < names.length; i++) {
		const qr = qrcode(10, "M")

		qr.addData(`otpauth://totp/${names[i]}?secret=${secrets[i]}&issuer=${issuers[i]}`)
		qr.make()

		const qrSrc = qr.createDataURL(3, 3)

		const element = `
			<div>
				<img class="img" src="${qrSrc}">
				<h1 style=font-family:Arial;>${issuers[i]}</h1>
			</div>`

		htmlString += element
	}

	const filePath = await dialog.save({ filters: [{ name: "HTML file", extensions: ["html"] }] })

	if (filePath !== null) {
		fs.writeFile(filePath, htmlString)
	}
}
