// @ts-nocheck
const { shell, app, dialog, BrowserWindow, screen } = require("@electron/remote")
const { aes, sha } = require("@levminer/lib")
const fs = require("fs")

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

	loadBackupFile: () => {},

	changePassword: async () => {
		const password_input0 = document.querySelector("#password_input1").value
		const password_input1 = document.querySelector("#password_input2").value
		const password_input2 = document.querySelector("#password_input3").value
		const text = document.querySelector(".passwordText")

		const hashPasswords = async () => {
			const password_input = Buffer.from(document.querySelector("#password_input1").value)

			const salt = await bcrypt.genSalt(10)
			const hashed = await bcrypt.hash(password_input.toString(), salt)

			/**
			 * Read settings
			 * @type {LibSettings}
			 */
			settings = JSON.parse(fs.readFileSync(path.join(folder_path, "settings", "settings.json"), "utf-8"))

			settings.security.require_password = true
			settings.security.password = hashed
			settings.security.key = aes.generateSalt().toString("base64")

			/** @type{LibStorage} */ storage = dev ? JSON.parse(localStorage.getItem("dev_storage")) : JSON.parse(localStorage.getItem("storage"))

			storage.require_password = settings.security.require_password
			storage.password = hashed
			storage.key = settings.security.key

			fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), JSON.stringify(settings, null, "\t"))

			dev ? localStorage.setItem("dev_storage", JSON.stringify(storage)) : localStorage.setItem("storage", JSON.stringify(storage))

			// get saved codes

			password_input.fill(0)

			app.relaunch()
			app.quit()
		}

		const validateNewPass = () => {
			if (password_input1.toString().length > 64) {
				text.style.color = "#CC001B"
				text.textContent = lang.landing_text.maximum_password
			} else if (password_input1.toString().length < 8) {
				text.style.color = "#CC001B"
				text.textContent = lang.landing_text.minimum_password
			} else {
				if (password_input1.toString() == password_input2.toString()) {
					if (!password.search(password_input1.toString())) {
						logger.log("Passwords match!")

						text.style.color = "#28A443"
						text.textContent = lang.landing_text.passwords_match
						text.textContent = "WIP!!!"

						hashPasswords()
					} else {
						text.style.color = "#CC001B"
						text.textContent = lang.landing_text.top_1000_password
					}
				} else {
					logger.warn("Passwords dont match!")

					text.style.color = "#CC001B"
					text.textContent = lang.landing_text.passwords_dont_match
				}
			}
		}

		const compare = await bcrypt.compare(Buffer.from(password_input0).toString(), settings.security.password).then(logger.log("Passwords compared!"))

		if (compare === true) {
			validateNewPass()
		} else {
			dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
				title: "Authme",
				buttons: [lang.button.close],
				defaultId: 1,
				cancelId: 1,
				noLink: true,
				type: "error",
				message: "This is not your current password. \n\n Please try again!",
			})
		}
	},
}
