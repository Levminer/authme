const crypto = require("crypto")

module.exports = {
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

		return {
			public_key,
			private_key,
		}
	},

	encrypt: (puclic_key, data) => {
		const encrypted_data = crypto.publicEncrypt(
			{
				key: puclic_key,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha3-512",
			},
			Buffer.from(data)
		)

		const binary_string = encrypted_data
		const base64_string = encrypted_data.toString("base64")

		return {
			binary_string,
			base64_string,
		}
	},

	decrypt: (private_key, data) => {
		const decrypted_data = crypto.privateDecrypt(
			{
				key: private_key,
				padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
				oaepHash: "sha3-512",
			},
			data
		)

		const binary_string = decrypted_data
		const utf8_string = decrypted_data.toString("utf8")

		return {
			binary_string,
			utf8_string,
		}
	},
}
