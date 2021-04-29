const { ipcRenderer } = require("electron")

const res = ipcRenderer.sendSync("ver")

document.querySelector("#ver").textContent = `Authme ${res.authme_version} (${res.release_date})`

if (process.platform !== "win32") {
	document.querySelector(".mask").style.backgroundColor = "rgb(10, 10, 10)"
}
