const crypto = require("crypto")

const ALGORITHM = {
	BLOCK_CIPHER: "aes-256-gcm",
	AUTH_TAG_BYTE_LEN: 16,
	IV_BYTE_LEN: 12,
	KEY_BYTE_LEN: 32,
	SALT_BYTE_LEN: 16,
}

module.exports = {
	generateSalt: () => {
		return crypto.randomBytes(ALGORITHM.SALT_BYTE_LEN)
	},

	generateKey: (password, salt) => {
		return crypto.scryptSync(password, salt, ALGORITHM.KEY_BYTE_LEN)
	},

	encrypt: (text, key) => {
		const iv = crypto.randomBytes(ALGORITHM.IV_BYTE_LEN)
		const cipher = crypto.createCipheriv(ALGORITHM.BLOCK_CIPHER, key, iv, {
			authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN,
		})
		let encryptedMessage = cipher.update(text)
		encryptedMessage = Buffer.concat([encryptedMessage, cipher.final()])
		return Buffer.concat([iv, encryptedMessage, cipher.getAuthTag()])
	},

	decrypt: (text, key) => {
		const authTag = text.slice(-16)
		const iv = text.slice(0, 12)
		const encryptedMessage = text.slice(12, -16)
		const decipher = crypto.createDecipheriv(ALGORITHM.BLOCK_CIPHER, key, iv, {
			authTagLength: ALGORITHM.AUTH_TAG_BYTE_LEN,
		})
		decipher.setAuthTag(authTag)
		const messagetext = decipher.update(encryptedMessage)
		return Buffer.concat([messagetext, decipher.final()])
	},
}
