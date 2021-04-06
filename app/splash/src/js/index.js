const { ipcRenderer } = require("electron")

const res = ipcRenderer.sendSync("ver")

document.querySelector("#ver").textContent = `Authme ${res.authme_version} (${res.release_date})`
