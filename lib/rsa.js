const crypto = require("crypto")

module.exports = {
	/**
	 * Generate a public and private key
	 * @return {string} public and private key
	 */
	generateKeys: () => {
		const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
			modulusLength: 2048,
		})

		const public_key = publicKey.export({
			type: "pkcs1",
			format: "pem",
		})

		const private_key = privateKey.export({
			type: "pkcs1",
			format: "pem",
		})

		return `${public_key.trim()}@${private_key.trim()}`
	},

	/**
	 * Encrypt message with public key
	 * @param {string} puclicKey
	 * @param {string} data
	 * @return {string} encrypted data
	 */
	encrypt: (puclicKey, data) => {
		const encrypted_data = crypto.publicEncrypt(
			{
				key: puclicKey,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha512",
			},
			Buffer.from(data)
		)

		return encrypted_data.toString("base64")
	},

	/**
	 * Decrypt message with private key
	 * @param {string} privateKey
	 * @param {string} data
	 * @return {string} decrypted data
	 */
	decrypt: (privateKey, data) => {
		const decrypted_data = crypto.privateDecrypt(
			{
				key: privateKey,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha512",
			},
			Buffer.from(data, "base64")
		)

		return decrypted_data.toString("utf8")
	},
}
