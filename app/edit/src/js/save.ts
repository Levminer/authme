const saveCodes = () => {
	const Cryptr = require("cryptr")
	const cryptr = new Cryptr("secret")

	const encryptedString = cryptr.encrypt(save_text)
	fs.writeFile(path.join(file_path, "hash.authme"), encryptedString, (err) => {
		if (err) {
			console.warn("Authme - Hash not created!")
		}
	})
}
