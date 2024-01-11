import { navigate } from "../../utils/navigate"
import { getSettings, setSettings } from "../../stores/settings"
import { getState, setState } from "../../stores/state"
import { dialog, invoke } from "@tauri-apps/api"
import { setEntry, generateRandomKey, setEncryptionKey, createWebAuthnLogin, verifyWebAuthnLogin } from "interface/utils/encryption"
import { search } from "interface/utils/password"
import { encodeBase64 } from "@utils/convert"
import { getLanguage } from "@utils/language"

const language = getLanguage()

export const noPassword = async () => {
	const settings = getSettings()
	const state = getState()

	if (settings.security.hardwareAuthentication === true) {
		const createRes = await createWebAuthnLogin()

		if (createRes === "error") {
			return
		}

		const loginRes = await verifyWebAuthnLogin()

		if (loginRes === "error") {
			return
		}
	}

	const key = await generateRandomKey(32)
	const decoder = new TextDecoder()

	await setEntry("encryptionKey", encodeBase64(decoder.decode(key)))
	await setEncryptionKey()

	settings.security.requireAuthentication = false
	state.authenticated = true

	setSettings(settings)
	setState(state)

	navigate("codes")
}

export const requirePassword = () => {
	document.querySelector(".requirePassword").style.display = "block"
	document.querySelector(".landing").style.display = "none"
}

export const createPassword = async () => {
	const settings = getSettings()

	const input0 = document.querySelector(".passwordInput0")
	const input1 = document.querySelector(".passwordInput1")

	if (input0.value !== input1.value) {
		dialog.message(language.landing.dialog.passwordsNotMatch, { type: "error" })
	}

	if (input0.value.length < 8) {
		return dialog.message(language.landing.dialog.passwordMinLength, { type: "error" })
	} else if (input0.value.length > 64) {
		return dialog.message(language.landing.dialog.passwordMaxLength, { type: "error" })
	}

	if (search(input0.value)) {
		return dialog.message(language.landing.dialog.commonPassword, { type: "error" })
	}

	if (settings.security.hardwareAuthentication === true) {
		const createRes = await createWebAuthnLogin()

		if (createRes === "error") {
			return
		}

		const loginRes = await verifyWebAuthnLogin()

		if (loginRes === "error") {
			return
		}
	}

	settings.security.password = encodeBase64(await invoke("encrypt_password", { password: input0.value }))
	settings.security.requireAuthentication = true

	setSettings(settings)

	navigate("confirm")
}

export const appController = async () => {
	const settings = getSettings()
	const state = getState()

	if (settings.security.requireAuthentication === false) {
		await setEncryptionKey()

		state.authenticated = true
		setState(state)

		navigate("codes")
	} else if (settings.security.requireAuthentication === true) {
		navigate("confirm")
	}
}

export const showPassword = (id: number) => {
	const inputState = document.querySelector(`.passwordInput${id}`).getAttribute("type")

	if (inputState === "password") {
		document.querySelector(`.showPassword${id}`).style.display = "none"
		document.querySelector(`.hidePassword${id}`).style.display = "block"

		document.querySelector(`.passwordInput${id}`).setAttribute("type", "text")
	} else {
		document.querySelector(`.showPassword${id}`).style.display = "block"
		document.querySelector(`.hidePassword${id}`).style.display = "none"

		document.querySelector(`.passwordInput${id}`).setAttribute("type", "password")
	}
}
