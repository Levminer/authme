const { dialog, shell } = require("electron").remote
const qrcodedecoder = require("qrcode-decoder")
const { is } = require("electron-util")
const electron = require("electron")
const path = require("path")
const fs = require("fs")
const qr = require(path.join(__dirname, "../../lib/qrcode-converter.js"))
const ipc = electron.ipcRenderer

// ? link
const onlineDocs = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=import")
}

const qrLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=qr-codes")
}

const gaLink = () => {
	shell.openExternal("https://docs.authme.levminer.com/#/import?id=google-authenticator")
}

// ? hide
const hide = () => {
	ipc.send("hide_import")
}
