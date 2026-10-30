import { invoke } from "@tauri-apps/api/core"
import * as dialog from "@tauri-apps/plugin-dialog"
import { getSettings, setSettings } from "interface/stores/settings"
import logger from "./logger"
import { dev } from "../../build.json"

const settings = getSettings()
const service = dev ? "authme_dev" : "authme"

/**
 * Encrypts a string with the encryption key
 */
export const encryptData = async (data: string): Promise<string> => {
	try {
		return await invoke("encrypt_data", { data })
	} catch (error) {
		dialog.message(`Failed to encrypt your codes!\n\n Please restart the app and try again!\n\n${error}`, { kind: "error" })
		logger.error(`Failed to encrypt codes: ${error}`)

		throw error
	}
}

/**
 * Decrypts a string with the encryption key
 */
export const decryptData = async (data: string): Promise<string> => {
	try {
		return await invoke("decrypt_data", { data })
	} catch (error) {
		dialog.message(`Failed to decrypt your codes!\n\n Please restart the app and try again!\n\n${error}`, { kind: "error" })
		logger.error(`Failed to decrypt codes: ${error}`)

		throw error
	}
}

/**
 * Creates the encryption key on the systems keychain and sets it on the backend
 */
export const createEncryptionKey = async () => {
	try {
		await invoke("create_encryption_key", { service })
	} catch (error) {
		dialog.message(`Failed to set the encryption key on your systems keychain!\n\n You can use the password method.\n\n${error}`, { kind: "error" })
		logger.error(`Failed to create encryption key: ${error}`)

		return "error"
	}
}

/**
 * Loads the encryption key from the systems keychain and sets it on the backend
 * Returns the re-encrypted codes if they were migrated from a legacy key
 */
export const loadEncryptionKey = async (codes: string | null): Promise<string | null | "error"> => {
	try {
		return await invoke("load_encryption_key", { service, codes })
	} catch (error) {
		dialog.message(`Failed to load the encryption key from your systems keychain!\n\n Please restart the app and try again!\n\n${error}`, { kind: "error" })
		logger.error(`Failed to load encryption key: ${error}`)

		return "error"
	}
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

				challenge: crypto.getRandomValues(new Uint8Array(32)),
			},
		})

		settings.security.hardwareAuthentication = true
		settings.security.hardwareKey = res.id
		setSettings(settings)
	} catch (error) {
		dialog.message(`Failed to register your authenticator! This feature might not be supported on your machine. \n\n${error}`, { kind: "error" })

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
				challenge: crypto.getRandomValues(new Uint8Array(32)),
				userVerification: "discouraged",
			},
		})

		if (res.id !== settings.security.hardwareKey) {
			dialog.message("Failed to login with your authenticator. The selected hardware key ID does not match the saved key ID.", { kind: "error" })

			return "error"
		}
	} catch (error) {
		dialog.message(`Failed to login with your authenticator. Please try again! \n\n${error}`, { kind: "error" })

		logger.error(`Failed to login with hardware key: ${error}`)

		return "error"
	}
}
