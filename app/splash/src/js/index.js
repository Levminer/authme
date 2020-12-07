const { ipcRenderer } = require("electron")

const version = ipcRenderer.sendSync("ver")

document.querySelector("#ver").textContent = `Authme ${version}`
