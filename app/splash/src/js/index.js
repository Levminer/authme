const { ipcRenderer } = require("electron")
const dns = require("dns")

let counter = 0
let loading_title = "Starting..."

// ? get version and release date
const res = ipcRenderer.sendSync("ver")
document.querySelector("#ver").textContent = `Authme ${res.authme_version} (${res.release_date})`

// ? platform
if (process.platform !== "win32") {
	document.querySelector(".mask").style.backgroundColor = "rgb(10, 10, 10)"
}

// ? check for internet
dns.lookup("google.com", (err) => {
	if (err && err.code == "ENOTFOUND") {
		document.querySelector("#loading").textContent = "Starting in offline mode... (0s)"

		loading_title = "Starting in offline mode..."

		console.warn("Authme - Can't connect to the internet")
	}
})

// ? splash title
setInterval(() => {
	counter++
	if (counter <= 1) {
		document.querySelector("#loading").textContent = `${loading_title} (${counter}s)`
	} else {
		document.querySelector("#loading").textContent = `Loading... (${counter}s)`
	}
}, 1000)
