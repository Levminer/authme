import { invoke, dialog } from "@tauri-apps/api"
import { getSettings, setSettings } from "interface/stores/settings"
import logger from "./logger"
import { dev } from "../../build.json"

const settings = getSettings()
const service = dev ? "authme_dev" : "authme"

/**
 * Generates random key
 */
export const generateRandomKey = async (length: number): Promise<Buffer> => {
	return Buffer.from(await invoke("random_values", { length }))
}

/**
 * Encrypts a string with the encryption key
 */
export const encryptData = async (data: string): Promise<string> => {
	return await invoke("encrypt_data", { data })
}

/**
 * Decrypts a string with the encryption key
 */
export const decryptData = async (data: string): Promise<string> => {
	const res: string = await invoke("decrypt_data", { data })

	if (res === "error") {
		dialog.message("Failed to decrypt your codes!\n\n Please restart the app and try again!", { type: "error" })
	}

	return res
}

/**
 * Sets an entry on the system keychain
 */
export const setEntry = async (name: string, data: string) => {
	const res = await invoke("set_entry", { name, data, service })

	if (res === "error") {
		dialog.message("Failed to set the encryption key on your systems keychain!\n\n You can use the password method.", { type: "error" })
	}

	return res
}

/**
 * Set the encryption key on the backend
 */
export const setEncryptionKey = async () => {
	const res: string = await invoke("set_encryption_key", { service })

	if (res === "error") {
		dialog.message("Failed to set the encryption key on your systems keychain!\n\n Please restart the app and try again!", { type: "error" })
	}

	return res
}

/**
 * Set the encryption key on the backend
 */
export const sendEncryptionKey = async (key: string) => {
	return await invoke("receive_encryption_key", { key })
}

/**
 * Delete encryption key
 */
export const deleteEncryptionKey = async (name: string) => {
	return await invoke("delete_entry", { name, service })
}

/**
 * Create a new WebAuthn credential
 */
export const createWebAuthnLogin = async () => {
	try {
		const res = await navigator.credentials.create({
			publicKey: {
				rp: {
					name: "Authme Hardware Authentication",
				},

				user: {
					id: new Uint8Array(16),
					name: "Authme",
					displayName: "Authme User",
				},

				pubKeyCredParams: [
					{
						type: "public-key",
						alg: -257,
					},
					{
						type: "public-key",
						alg: -7,
					},
				],

				attestation: "none",

				timeout: 60000,

				challenge: await generateRandomKey(64),
			},
		})

		settings.security.hardwareAuthentication = true
		settings.security.hardwareKey = res.id
		setSettings(settings)
	} catch (error) {
		dialog.message(`Failed to register your authenticator! This feature might not be supported on your machine. \n\n${error}`, { type: "error" })

		logger.error(`Failed to register hardware key: ${error}`)

		return "error"
	}
}

/**
 * Get an existing WebAuthn credential
 */
export const verifyWebAuthnLogin = async () => {
	try {
		const res = await navigator.credentials.get({
			publicKey: {
				timeout: 60000,
				challenge: await generateRandomKey(64),
				userVerification: "discouraged",
			},
		})

		if (res.id !== settings.security.hardwareKey) {
			dialog.message("Failed to login with your authenticator. The selected hardware key ID does not match the saved key ID.", { type: "error" })

			return "error"
		}
	} catch (error) {
		dialog.message(`Failed to login with your authenticator. Please try again! \n\n${error}`, { type: "error" })

		logger.error(`Failed to login with hardware key: ${error}`)

		return "error"
	}
}
