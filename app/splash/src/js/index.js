const { ipcRenderer } = require("electron")

// ? get version and release date
const res = ipcRenderer.sendSync("info")
if (res.build_number.startsWith("alpha")) {
	document.querySelector("#ver").textContent = `Authme ${res.authme_version} ${res.build_number} (${res.release_date})`
} else {
	document.querySelector("#ver").textContent = `Authme ${res.authme_version} (${res.release_date})`
}

// ? platform
if (process.platform !== "win32" && process.platform !== "darwin") {
	document.querySelector(".mask").style.backgroundColor = "rgb(20, 20, 20)"
}
