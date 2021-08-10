const { shell, app, dialog } = require("@electron/remote")
const fs = require("fs")
const electron = require("electron")
const ipc = electron.ipcRenderer
const path = require("path")

// ? error in window
window.onerror = (error) => {
	ipc.send("rendererError", { renderer: "edit", error: error })
}

// ? if development
let dev = false

if (app.isPackaged === false) {
	dev = true
}

// ? platform
let folder

if (process.platform === "win32") {
	folder = process.env.APPDATA
} else {
	folder = process.env.HOME
}

// ? build
const res = ipc.sendSync("info")

if (res.build_number.startsWith("alpha")) {
	document.querySelector(".build-content").textContent = `You are running an alpha version of Authme - Version ${res.authme_version} - Build ${res.build_number}`
	document.querySelector(".build").style.display = "block"
}

// ? settings folder
const file_path = dev ? path.join(folder, "Levminer", "Authme Dev") : path.join(folder, "Levminer", "Authme")

// ? rollback
const cache_path = path.join(file_path, "cache")
const rollback_con = document.querySelector(".rollback")
const rollback_text = document.querySelector("#rollbackBut")

fs.readFile(path.join(cache_path, "latest.authmecache"), "utf-8", (err, data) => {
	if (err) {
		console.warn("Authme - Cache file don't exist")
	} else {
		console.log("Authme - Cache file exists")

		rollback_con.style.display = "block"

		const edited_date = fs.statSync(cache_path).atime

		const temp_date = `${edited_date.toLocaleDateString().split("/").reverse().join(".")}.`
		const temp_time = edited_date.toLocaleTimeString()

		rollback_text.textContent = `Latest rollback: ${temp_date} ${temp_time}`
	}
})

const rollback = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
			cancelId: 1,
			type: "warning",
			noLink: true,
			message: `Are you sure you want to rollback to the latest save?
			
			This requires a restart and will overwrite your saved codes!`,
		})
		.then((result) => {
			if (result.response === 0) {
				fs.readFile(path.join(cache_path, "latest.authmecache"), "utf-8", (err, data) => {
					if (err) {
						console.error("Authme - Error reading hash file", err)
					} else {
						fs.writeFile(path.join(file_path, "hash.authme"), data, (err) => {
							if (err) {
								console.error("Authme - Failed to create cache folder", err)
							} else {
								console.log("Authme - Hash file created")
							}
						})
					}
				})

				restart()
			}
		})
}

// ? separete value
const names = []
const secrets = []
const issuers = []
const types = []

const separation = () => {
	rollback_con.style.display = "none"

	let c0 = 0
	let c1 = 1
	let c2 = 2
	let c3 = 3

	for (let i = 0; i < data.length; i++) {
		if (i == c0) {
			const name_before = data[i]
			const name_after = name_before.slice(8)
			names.push(name_after.trim())
			c0 = c0 + 4
		}

		if (i == c1) {
			const secret_before = data[i]
			const secret_after = secret_before.slice(8)
			secrets.push(secret_after.trim())
			c1 = c1 + 4
		}

		if (i == c2) {
			const issuer_before = data[i]
			const issuer_after = issuer_before.slice(8)
			issuers.push(issuer_after.trim())
			c2 = c2 + 4
		}

		if (i == c3) {
			types.push(data[i])
			c3 = c3 + 4
		}
	}

	go()
}

const go = () => {
	createCache()

	document.querySelector(".beforeLoad").style.display = "none"
	document.querySelector(".afterLoad").style.display = "block"

	for (let i = 0; i < names.length; i++) {
		const codes_container = document.querySelector(".codes_container")

		const div = document.createElement("div")

		div.innerHTML = `
		<div class="grid" id="grid${[i]}">
		<div class="div1">
		<h2>${issuers[i]}</h2>
		</div>
		<div class="div2">
		<input type="text" class="input1" id="edit_inp_${[i]}" value="${names[i]}" readonly/> 
		</div>
		<div class="div3">
		<button class="buttoni button" id="edit_but_${[i]}" onclick="edit(${[i]})">
		<svg id="edit_svg_${[i]}" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
		</svg>
		</button>
		<button class="buttoni" id="del_but_${[i]}" onclick="del(${[i]})">
		<svg id="del_svg_${[i]}" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
		</svg>
		</button>
		</div>
		</div>
		`

		codes_container.appendChild(div)
	}
}

// ? edit
let edit_mode = false
const edit = (number) => {
	const edit_but = document.querySelector(`#edit_but_${number}`)
	const edit_inp = document.querySelector(`#edit_inp_${number}`)

	if (edit_mode === false) {
		edit_but.style.color = "green"
		edit_but.style.borderColor = "green"

		edit_inp.style.borderColor = "green"
		edit_inp.readOnly = false

		edit_mode = true
	} else {
		edit_but.style.color = ""
		edit_but.style.borderColor = "white"

		edit_inp.style.borderColor = "white"
		edit_inp.readOnly = true

		const inp_value = document.querySelector(`#edit_inp_${number}`)

		names[number] = inp_value.value

		edit_mode = false
	}
}

// ? delete
const del = (number) => {
	const del_but = document.querySelector(`#del_but_${number}`)

	del_but.style.color = "red"
	del_but.style.borderColor = "red"

	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "Cancel"],
			type: "warning",
			message: `Are you sure you want to delete this code?
			
			If you want to revert this don't save and restart the app!`,
		})
		.then((result) => {
			if (result.response === 0) {
				del_but.style.color = ""
				del_but.style.borderColor = "white"

				const input = document.querySelector(`#edit_inp_${number}`).value

				const div = document.querySelector(`#grid${number}`)
				div.remove()

				const querry = (element) => element === input

				const index = names.findIndex(querry)

				names.splice(index, 1)
				secrets.splice(index, 1)
				issuers.splice(index, 1)
			} else {
				del_but.style.color = ""
				del_but.style.borderColor = "white"
			}
		})
}

// ? create save
let save_text = ""

const createSave = () => {
	dialog
		.showMessageBox({
			title: "Authme",
			buttons: ["Yes", "Cancel"],
			defaultId: 1,
			cancelId: 1,
			type: "warning",
			noLink: true,
			message: `Are you sure you want to save the modified code(s)?
			
			This requires a restart and will overwrite your saved codes!`,
		})
		.then((result) => {
			if (result.response === 0) {
				for (let i = 0; i < names.length; i++) {
					const substr = `\nName:   ${names[i]} \nSecret: ${secrets[i]} \nIssuer: ${issuers[i]} \nType:   OTP_TOTP\n`
					save_text += substr
				}

				saveCodes()

				restart()
			}
		})
}

// ? load more
const addMore = () => {
	dialog
		.showOpenDialog({
			title: "Import from Authme Import Text file",
			properties: ["openFile", "multiSelections"],
			filters: [{ name: "Text file", extensions: ["txt"] }],
		})
		.then((result) => {
			canceled = result.canceled
			files = result.filePaths

			if (canceled === false) {
				dialog.showMessageBox({
					title: "Authme",
					buttons: ["Close"],
					defaultId: 0,
					cancelId: 0,
					type: "info",
					noLink: true,
					message: `Code(s) added!
	
					Scroll down to view them!`,
				})

				for (let i = 0; i < files.length; i++) {
					fs.readFile(files[i], (err, input) => {
						if (err) {
							console.log("Authme - Error loading file")
						} else {
							data = []

							const container = document.querySelector(".container")
							container.innerHTML = ""

							processdata(input.toString())
						}
					})

					console.log(files[i])
				}
			}
		})
}

// ? create cache
const createCache = () => {
	fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, data) => {
		if (err) {
			console.error("Authme - Error reading hash file", err)
		} else {
			if (!fs.existsSync(cache_path)) {
				fs.mkdirSync(cache_path)
			}

			fs.writeFile(path.join(cache_path, "latest.authmecache"), data, (err) => {
				if (err) {
					console.error("Authme - Failed to create cache folder", err)
				} else {
					console.log("Authme - Cache file created")
				}
			})
		}
	})
}

// ? error handeling
const loadError = () => {
	fs.readFile(path.join(file_path, "hash.authme"), "utf-8", (err, data) => {
		if (err) {
			dialog.showMessageBox({
				title: "Authme",
				buttons: ["Close"],
				type: "error",
				message: `No save file found.
				
				Go back to the main page and save your codes!`,
			})
		}
	})
}

// ? hide window
const hide = () => {
	ipc.send("hide_edit")
}

const restart = () => {
	setTimeout(() => {
		app.relaunch()
		app.exit()
	}, 500)
}
