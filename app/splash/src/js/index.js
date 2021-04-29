const { ipcRenderer } = require("electron")
const os = require("os")

const res = ipcRenderer.sendSync("ver")

document.querySelector("#ver").textContent = `Authme ${res.authme_version} (${res.release_date})`

if (os.type() !== "Windows_NT") {
	document.querySelector(".mask").style.backgroundColor = "rgb(10, 10, 10)"
}
