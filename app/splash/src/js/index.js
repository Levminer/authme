const { ipcRenderer } = require("electron")

// ? get version and release date
const res = ipcRenderer.sendSync("info")
document.querySelector("#ver").textContent = `Authme ${res.authme_version} (${res.release_date})`

// ? platform
if (process.platform !== "win32" && process.platform !== "darwin") {
	document.querySelector(".mask").style.backgroundColor = "rgb(20, 20, 20)"
}
