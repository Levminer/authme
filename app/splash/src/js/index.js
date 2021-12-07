const { ipcRenderer } = require("electron")

// ? error in window
window.onerror = (error) => {
	ipcRenderer.send("rendererError", { renderer: "splash", error: error })
}

// ? get version and release date
const res = ipcRenderer.sendSync("info")
if (res.build_number.startsWith("alpha") || res.build_number.startsWith("beta")) {
	document.querySelector("#ver").textContent = `Authme ${res.authme_version} (${res.build_number})`
} else {
	document.querySelector("#ver").textContent = `Authme ${res.authme_version} (${res.release_date})`
}

// ? platform
if (process.platform !== "win32" && process.platform !== "darwin") {
	document.querySelector(".mask").style.backgroundColor = "rgb(20, 20, 20)"
}
