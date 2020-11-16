const { ipcRenderer } = require("electron")

let version = ipcRenderer.sendSync("ver")

document.querySelector("#ver").textContent = `Authme ${version}`
