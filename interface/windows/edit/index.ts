import { textConverter } from "../../utils/convert"
import { dialog, fs, path } from "@tauri-apps/api"
import { getSettings, setSettings } from "../../stores/settings"
import { navigate } from "../../utils/navigate"
import { decryptData, encryptData } from "interface/utils/encryption"

const settings = getSettings()
let names: string[] = []
let issuers: string[] = []
let secrets: string[] = []

/**
 * Generate the edit elements from the saved codes
 */
const generateEditElements = () => {
	document.querySelector(".editSavedCodes").style.display = "block"
	document.querySelector(".loadedCodes").style.display = "block"
	document.querySelector(".loadSavedCodes").style.display = "none"

	for (let i = 0; i < names.length; i++) {
		// create div
		const element = document.createElement("div")

		// set div content
		element.innerHTML = `
		<div class="flex flex-wrap gap-3">
				<div>
					<h5>Name</h5>
					<input id="issuer${i}" class="input mt-1" type="text" value="${issuers[i]}" readonly />
				</div>

				<div>
					<h5>Description</h5>
					<input id="name${i}" class="input mt-1 w-96" type="text" value="${names[i]}" readonly />
				</div>
			</div>
			<div class="ml-10 flex gap-3 flex-wrap sm:mt-10 sm:w-full sm:ml-0">
				<button id="editCode${i}" class="button">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
					</svg>
					Edit
				</button>

				<button id="deleteCode${i}" class="button">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
					Delete
				</button>
			</div>`

		// add div
		element.classList.add("edit")
		element.setAttribute("id", `edit${i}`)

		document.querySelector(".content").appendChild(element)

		document.querySelector(`#editCode${i}`).addEventListener("click", () => {
			editCode(i)
		})

		document.querySelector(`#deleteCode${i}`).addEventListener("click", () => {
			deleteCode(i)
		})
	}
}

/**
 * Load the saved codes
 */
export const loadSavedCodes = async () => {
	const codes = settings.vault.codes

	if (codes === null) {
		return dialog.message("No save file found. \n\nGo to the codes or the import page and import your codes!", { type: "error" })
	}

	const decryptedText = await decryptData(codes)
	const data = textConverter(decryptedText, 0)

	names = data.names
	issuers = data.issuers
	secrets = data.secrets

	generateEditElements()
}

/**
 * Save the current changes
 */
export const saveChanges = async () => {
	const confirm = await dialog.ask("Are you sure you want to save the changes? \n\nThis will overwrite your saved codes!", { type: "warning" })

	if (confirm === false) {
		return
	}

	let saveText = ""

	for (let i = 0; i < names.length; i++) {
		const string = `\nName:   ${names[i]} \nSecret: ${secrets[i]} \nIssuer: ${issuers[i]} \nType:   OTP_TOTP\n`
		saveText += string
	}

	const encryptedText = await encryptData(saveText)

	settings.vault.codes = encryptedText
	setSettings(settings)

	navigate("codes")
}

/**
 * Revert all current changes
 */
export const revertChanges = async () => {
	const confirm = await dialog.ask("Are you sure you want to revert all changes? \n\nYou will lose all current changes!", { type: "warning" })

	if (confirm === false) {
		return
	}

	location.reload()
}

/**
 * Delete all imported codes
 */
export const deleteCodes = async () => {
	const confirm0 = await dialog.ask("Are you sure you want to delete all codes? \n\nYou can not revert this!", { type: "warning" })

	if (confirm0 === false) {
		return
	}

	const confirm1 = await dialog.ask("Are you absolutely sure? \n\nThere is no way back!", { type: "warning" })

	if (confirm1 === true) {
		const filePath = await path.join(await path.configDir(), "Levminer", "Authme 4", "codes", "codes.authme")
		await fs.removeFile(filePath)

		navigate("codes")
	}
}

/**
 * Edit a specific code
 */
export const editCode = (id: number) => {
	const issuer: HTMLInputElement = document.querySelector(`#issuer${id}`)
	const name: HTMLInputElement = document.querySelector(`#name${id}`)

	issuer.focus()
	const length = issuer.value.length
	issuer.setSelectionRange(length, length)

	if (issuer.readOnly === true) {
		issuer.readOnly = false
		name.readOnly = false

		issuer.style.color = "#28A443"
		name.style.color = "#28A443"
	} else {
		issuer.readOnly = true
		name.readOnly = true

		issuer.style.color = "white"
		name.style.color = "white"

		const newIssuer = document.querySelector(`#issuer${id}`).value
		const newName = document.querySelector(`#name${id}`).value

		issuers[id] = newIssuer
		names[id] = newName

		dialog.message("Code edited. \n\nYou can save or revert this change at the top of the page.")
	}
}

/**
 * Delete a specific code
 */
export const deleteCode = async (id: number) => {
	const res = await dialog.ask("Are you sure you want to delete this code? \n\nYou can save or revert this change at the top of the page.", { type: "warning" })

	if (res === true) {
		names.splice(id, 1)
		secrets.splice(id, 1)
		issuers.splice(id, 1)

		document.querySelector(`#edit${id}`).remove()
	}
}
