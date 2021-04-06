const { ipcRenderer } = require("electron")

const ipc = ipcRenderer.sendSync("ver")

document.querySelector("#ver").textContent = `Authme ${ipc.authme_version} (${ipc.release_date})`
