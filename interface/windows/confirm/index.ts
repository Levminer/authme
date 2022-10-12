import { navigate } from "../../utils/navigate"
import { getSettings } from "../../stores/settings"
import { dialog, invoke } from "@tauri-apps/api"
import { getState, setState } from "../../stores/state"
import { sendEncryptionKey, verifyWebAuthnLogin } from "interface/utils/encryption"

export const confirmPassword = async () => {
	const settings = getSettings()
	const state = getState()
	const input = document.querySelector(".passwordInput").value

	const result = await invoke("verify_password", { password: input, hash: Buffer.from(settings.security.password, "base64").toString() })

	if (result === true) {
		if (settings.security.hardwareAuthentication === true) {
			const res = await verifyWebAuthnLogin()

			if (res === "error") {
				return
			}
		}

		await sendEncryptionKey(input)

		state.authenticated = true
		setState(state)

		navigate("codes")
	} else {
		dialog.message("Passwords don't match! \n\nPlease try again!", { type: "error" })
	}
}

export const showPassword = () => {
	const inputState = document.querySelector(".passwordInput").getAttribute("type")

	if (inputState === "password") {
		document.querySelector(".showPassword").style.display = "none"
		document.querySelector(".hidePassword").style.display = "block"

		document.querySelector(".passwordInput").setAttribute("type", "text")
	} else {
		document.querySelector(".showPassword").style.display = "block"
		document.querySelector(".hidePassword").style.display = "none"

		document.querySelector(".passwordInput").setAttribute("type", "password")
	}
}
