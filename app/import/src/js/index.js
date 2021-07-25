const { dialog, shell } = require("electron").remote
const qrcodedecoder = require("qrcode-decoder")
const { is } = require("electron-util")
const electron = require("electron")
const path = require("path")
const fs = require("fs")
const qr = require(path.join(__dirname, "../../lib/qrcode-converter.js"))
const ipc = electron.ipcRenderer

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "import", error: error })
}

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

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(
		".build-content"
	).textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}
