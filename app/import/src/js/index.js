const fs = require("fs")
const electron = require("electron")
const { dialog, shell } = require("electron").remote
const ipc = electron.ipcRenderer
const path = require("path")
const QrcodeDecoder = require("qrcode-decoder")
const spawn = require("child_process").spawn
const { is } = require("electron-util")

let python_path

// ? if development
if (is.development === true) {
	python_path = path.join(__dirname, "src/py/extract_2fa_secret.py")
} else {
	python_path = path.join(__dirname, "../../../app.asar.unpacked/app/import/src/py/extract_2fa_secret.py")
	console.log(python_path)
}

const error_not_found = (name) => {
	dialog.showMessageBox({
		title: "Authme",
		buttons: ["Close"],
		type: "error",
		message: `
		No QR code found on the picture: ${name}.
		
		Try to take a better picture and try again!
		`,
	})
}

// ? link
const link0 = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=import")
}

const link1 = () => {
	shell.openExternal("https://github.com/Levminer/authme/tree/main/extract#usage")
}

// ? hide
const hide = () => {
	ipc.send("hide1")
}
