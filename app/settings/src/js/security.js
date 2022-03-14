const { shell, app, dialog, BrowserWindow, screen } = require("@electron/remote")
const { aes } = require("@levminer/lib")

module.exports = {
	backupFile: async () => {
		const /** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

		let password
		let key

		if (settings.security.require_password === true) {
			password = Buffer.from(await ipc.invoke("request_password"))
			key = Buffer.from(aes.generateKey(password, Buffer.from(settings.security.key, "base64")))
		} else {
			password = Buffer.from(storage.password, "base64")
			key = Buffer.from(aes.generateKey(password, Buffer.from(storage.key, "base64")))
		}

		fs.readFile(path.join(folder_path, "codes", "codes.authme"), async (err, fileContent) => {
			if (err) {
				logger.warn("The file codes.authme don't exists")

				password.fill(0)
				key.fill(0)
			} else {
				const codes_file = JSON.parse(fileContent)

				const decrypted = aes.decrypt(Buffer.from(codes_file.codes, "base64"), key)

				const salt = aes.generateSalt()
				const backup_key = aes.generateRandomKey(salt)

				const backup_file = aes.encrypt(decrypted, backup_key)

				console.log(backup_file.toString("base64"))

				decrypted.fill(0)
				password.fill(0)
				key.fill(0)
			}
		})
	},

	changePassword: () => {},
}
