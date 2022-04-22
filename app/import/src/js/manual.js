// @ts-nocheck
module.exports = {
	manualEntry: async () => {
		const manual_issuer = document.querySelector("#manual_issuer")
		const manual_secret = document.querySelector("#manual_secret")
		const manual_description = document.querySelector("#manual_description")

		if (manual_issuer.value === "") {
			dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
				title: "Authme",
				buttons: [lang.button.close],
				type: "error",
				noLink: true,
				defaultId: 0,
				cancelId: 0,
				message: lang.import_dialog.issuer_required,
			})

			return logger.warn("Issuer field empty")
		}

		if (manual_secret.value === "") {
			dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
				title: "Authme",
				buttons: [lang.button.close],
				type: "error",
				noLink: true,
				defaultId: 0,
				cancelId: 0,
				message: lang.import_dialog.secret_required,
			})

			return logger.warn("Secret field empty")
		}

		let description = manual_description.value

		if (description === "") {
			description = manual_issuer.value
		}

		const string = `\nName:   ${description} \nSecret: ${manual_secret.value} \nIssuer: ${manual_issuer.value} \nType:   OTP_TOTP\n`

		const result = await dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
			title: "Authme",
			buttons: [lang.button.yes, lang.button.no],
			type: "info",
			noLink: true,
			defaultId: 1,
			cancelId: 1,
			message: `${lang.import_dialog.correct_qrcode_found_0} ${lang.import_dialog.correct_qrcode_found_1}`,
		})

		const save_exists = fs.existsSync(path.join(folder_path, "codes", "codes.authme"))

		if (result.response === 0) {
			if (save_exists === true) {
				ipc.invoke("importExistingCodes", Buffer.from(string).toString("base64"))
			} else {
				ipc.invoke("importCodes", Buffer.from(string).toString("base64"))
			}

			saveFile(string)
		} else {
			if (save_exists === true) {
				ipc.invoke("importExistingCodes", Buffer.from(string).toString("base64"))
			} else {
				ipc.invoke("importCodes", Buffer.from(string).toString("base64"))
			}
		}

		const /** @type{LibDialogElement} */ dialog0 = document.querySelector(".dialog0")

		dialog0.close()

		manual_issuer.value = ""
		manual_secret.value = ""
		manual_description.value = ""
	},
}
