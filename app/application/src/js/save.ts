const Cryptr = require("cryptr")
const cryptr = new Cryptr("secret")

fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, content) => {
	if (err) {
		console.warn("Authme - The hash dont exist")
	} else {
		prev = true

		let decrypted = cryptr.decrypt(content)

		processdata(decrypted)
	}
})

let save = () => {
	const encryptedString = cryptr.encrypt(save_text)
	fs.writeFile(path.join(file_path, "hash.authme"), encryptedString, (err) => {
		if (err) {
			console.warn("Authme - Hash not created!")
		} else {
			console.warn("Authme - Hash created")

			document.querySelector("#save").style.display = "none"

			dialog.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				defaultId: 0,
				cancelId: 1,
				type: "info",
				message: "Code(s) saved! \n\nIf you want to add more code(s) or delete code(s) go to Edit codes!",
			})
		}
	})
}
