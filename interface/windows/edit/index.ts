import { textConverter } from "../../utils/convert"
import { dialog } from "@tauri-apps/api"
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
	document.querySelector(".loadedCodes").style.display = "block"

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
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>
					Edit
				</button>

				<button id="deleteCode${i}" class="button">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
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
		dialog.message("No save file found. \n\nGo to the codes or the import page and import your codes!", { type: "error" })

		return navigate("import")
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
	let saveText = ""

	for (let i = 0; i < names.length; i++) {
		const string = `\nName:   ${names[i]} \nSecret: ${secrets[i]} \nIssuer: ${issuers[i]} \nType:   OTP_TOTP\n`
		saveText += string
	}

	const encryptedText = await encryptData(saveText)

	settings.vault.codes = encryptedText
	setSettings(settings)
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
		settings.vault.codes = null
		setSettings(settings)

		navigate("codes")
	}
}

/**
 * Edit a specific code
 */
export const editCode = async (id: number) => {
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

		const res = await dialog.ask("Do you want to save your changes?", { type: "warning" })

		if (res === true) {
			issuers[id] = newIssuer
			names[id] = newName

			saveChanges()
		} else {
			issuer.value = issuers[id]
			name.value = names[id]
		}
	}
}

/**
 * Delete a specific code
 */
export const deleteCode = async (id: number) => {
	const res = await dialog.ask("Are you sure you want to delete this code? \n\nYou can not revert this.", { type: "warning" })

	if (res === true) {
		names.splice(id, 1)
		secrets.splice(id, 1)
		issuers.splice(id, 1)

		document.querySelector(`#edit${id}`).remove()

		saveChanges()
	}
}
