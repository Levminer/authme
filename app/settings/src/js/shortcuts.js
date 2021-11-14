// ? settings
const default_shortcuts = {
	shortcuts: {
		show: "CmdOrCtrl+q",
		settings: "CmdOrCtrl+s",
		exit: "CmdOrCtrl+w",
		zoom_reset: "CmdOrCtrl+0",
		zoom_in: "CmdOrCtrl+1",
		zoom_out: "CmdOrCtrl+2",
		edit: "CmdOrCtrl+t",
		import: "CmdOrCtrl+i",
		export: "CmdOrCtrl+e",
		release: "CmdOrCtrl+n",
		support: "CmdOrCtrl+p",
		docs: "CmdOrCtrl+d",
		licenses: "CmdOrCtrl+l",
		update: "CmdOrCtrl+u",
		info: "CmdOrCtrl+o",
	},
	global_shortcuts: {
		show: "CmdOrCtrl+Shift+a",
		settings: "CmdOrCtrl+Shift+s",
		exit: "CmdOrCtrl+Shift+d",
	},
}

/**
 * Load storage
 * @type {LibStorage}
 */
let storage

if (dev === false) {
	storage = JSON.parse(localStorage.getItem("storage"))
} else {
	storage = JSON.parse(localStorage.getItem("dev_storage"))
}

// ? shortcuts
let modify = true

let inp_name
let svg_name
let id

const hk0 = document.querySelector("#hk0_input")
const hk1 = document.querySelector("#hk1_input")
const hk2 = document.querySelector("#hk2_input")
const hk3 = document.querySelector("#hk3_input")
const hk4 = document.querySelector("#hk4_input")
const hk5 = document.querySelector("#hk5_input")
const hk6 = document.querySelector("#hk6_input")
const hk7 = document.querySelector("#hk7_input")
const hk8 = document.querySelector("#hk8_input")
const hk9 = document.querySelector("#hk9_input")
const hk10 = document.querySelector("#hk10_input")
const hk11 = document.querySelector("#hk11_input")
const hk12 = document.querySelector("#hk12_input")
const hk13 = document.querySelector("#hk13_input")
const hk14 = document.querySelector("#hk14_input")
const hk100 = document.querySelector("#hk100_input")
const hk101 = document.querySelector("#hk101_input")
const hk102 = document.querySelector("#hk102_input")

hk0.value = file.shortcuts.show
hk1.value = file.shortcuts.settings
hk2.value = file.shortcuts.exit
hk3.value = file.shortcuts.edit
hk4.value = file.shortcuts.import
hk5.value = file.shortcuts.export
hk6.value = file.shortcuts.release
hk7.value = file.shortcuts.support
hk8.value = file.shortcuts.docs
hk9.value = file.shortcuts.licenses
hk10.value = file.shortcuts.update
hk11.value = file.shortcuts.info
hk12.value = file.shortcuts.zoom_reset
hk13.value = file.shortcuts.zoom_in
hk14.value = file.shortcuts.zoom_out
hk100.value = file.global_shortcuts.show
hk101.value = file.global_shortcuts.settings
hk102.value = file.global_shortcuts.exit

const call = (event) => {
	if (event.ctrlKey === true) {
		inp_name.value = `CmdOrCtrl+${event.key.toLowerCase()}`
	}

	if (event.altKey === true) {
		inp_name.value = `Alt+${event.key.toLowerCase()}`
	}

	if (event.shiftKey === true) {
		inp_name.value = `Shift+${event.key.toLowerCase()}`
	}

	if (event.ctrlKey === true && event.shiftKey === true) {
		inp_name.value = `CmdOrCtrl+Shift+${event.key.toLowerCase()}`
	}

	if (event.ctrlKey === true && event.altKey === true) {
		inp_name.value = `CmdOrCtrl+Alt+${event.key.toLowerCase()}`
	}

	if (event.shiftKey === true && event.altKey === true) {
		inp_name.value = `Shift+Alt+${event.key.toLowerCase()}`
	}
}

const hk_edit = (value) => {
	id = value
	inp_name = document.querySelector(`#hk${value}_input`)
	btn_name = document.querySelector(`#hk${value}_button_edit`)
	svg_name = document.querySelector(`#hk${value}_svg_edit`)

	if (modify === true) {
		document.addEventListener("keydown", call, true)

		inp_name.value = "Press any key combination"
		inp_name.style.borderColor = "green"
		btn_name.style.borderColor = "green"
		svg_name.style.color = "green"

		modify = false
	} else if (inp_name.value !== "Press any key combination") {
		document.removeEventListener("keydown", call, true)
		svg_name.style.color = ""
		btn_name.style.border = ""
		inp_name.style.border = ""

		switch (id) {
			case 0:
				const hk0 = document.querySelector("#hk0_input").value

				file.shortcuts.show = hk0
				break
			case 1:
				const hk1 = document.querySelector("#hk1_input").value

				file.shortcuts.settings = hk1
				break
			case 2:
				const hk2 = document.querySelector("#hk2_input").value

				file.shortcuts.exit = hk2
				break
			case 3:
				const hk3 = document.querySelector("#hk3_input").value

				file.shortcuts.edit = hk3
				break
			case 4:
				const hk4 = document.querySelector("#hk4_input").value

				file.shortcuts.import = hk4
				break
			case 5:
				const hk5 = document.querySelector("#hk5_input").value

				file.shortcuts.export = hk5
				break

			case 6:
				const hk6 = document.querySelector("#hk6_input").value

				file.shortcuts.release = hk6
				break
			case 7:
				const hk7 = document.querySelector("#hk7_input").value

				file.shortcuts.support = hk7
				break
			case 8:
				const hk8 = document.querySelector("#hk8_input").value

				file.shortcuts.docs = hk8
				break
			case 9:
				const hk9 = document.querySelector("#hk9_input").value

				file.shortcuts.licenses = hk9
				break
			case 10:
				const hk10 = document.querySelector("#hk10_input").value

				file.shortcuts.update = hk10
				break
			case 11:
				const hk11 = document.querySelector("#hk11_input").value

				file.shortcuts.info = hk11
				break
			case 12:
				const hk12 = document.querySelector("#hk12_input").value

				file.shortcuts.zoom_reset = hk12
				break
			case 13:
				const hk13 = document.querySelector("#hk13_input").value

				file.shortcuts.zoom_in = hk13
				break
			case 14:
				const hk14 = document.querySelector("#hk14_input").value

				file.shortcuts.zoom_out = hk14
				break

			// global shortcuts
			case 100:
				const hk100 = document.querySelector("#hk100_input").value

				file.global_shortcuts.show = hk100
				break
			case 101:
				const hk101 = document.querySelector("#hk101_input").value

				file.global_shortcuts.settings = hk101
				break
			case 102:
				const hk102 = document.querySelector("#hk102_input").value

				file.global_shortcuts.exit = hk102
				break

			default:
				console.warn("No save file found")
				break
		}

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))

		modify = true
	} else {
		document.removeEventListener("keydown", call, true)
		svg_name.style.color = ""
		btn_name.style.border = ""
		inp_name.style.border = ""

		document.querySelector(`#hk${value}_input`).value = "None"
		modify = true
	}
}

// ? delete shortcut
const hk_delete = (value) => {
	id = value
	inp_name = document.querySelector(`#hk${value}_input`)
	btn_name = document.querySelector(`#hk${value}_button_delete`)
	svg_name = document.querySelector(`#hk${value}_svg_delete`)

	inp_name.value = "None"

	svg_name.style.color = "red"
	btn_name.style.borderColor = "red"

	setTimeout(() => {
		svg_name.style.color = ""
		btn_name.style.border = ""
	}, 500)

	switch (id) {
		case 0:
			const hk0 = document.querySelector("#hk0_input").value

			file.shortcuts.show = hk0
			break
		case 1:
			const hk1 = document.querySelector("#hk1_input").value

			file.shortcuts.settings = hk1
			break
		case 2:
			const hk2 = document.querySelector("#hk2_input").value

			file.shortcuts.exit = hk2
			break
		case 3:
			const hk3 = document.querySelector("#hk3_input").value

			file.shortcuts.edit = hk3
			break
		case 4:
			const hk4 = document.querySelector("#hk4_input").value

			file.shortcuts.import = hk4
			break
		case 5:
			const hk5 = document.querySelector("#hk5_input").value

			file.shortcuts.export = hk5
			break

		case 6:
			const hk6 = document.querySelector("#hk6_input").value

			file.shortcuts.release = hk6
			break
		case 7:
			const hk7 = document.querySelector("#hk7_input").value

			file.shortcuts.support = hk7
			break
		case 8:
			const hk8 = document.querySelector("#hk8_input").value

			file.shortcuts.docs = hk8
			break
		case 9:
			const hk9 = document.querySelector("#hk9_input").value

			file.shortcuts.licenses = hk9
			break
		case 10:
			const hk10 = document.querySelector("#hk10_input").value

			file.shortcuts.update = hk10
			break
		case 11:
			const hk11 = document.querySelector("#hk11_input").value

			file.shortcuts.info = hk11
			break
		case 12:
			const hk12 = document.querySelector("#hk12_input").value

			file.shortcuts.zoom_reset = hk12
			break
		case 13:
			const hk13 = document.querySelector("#hk13_input").value

			file.shortcuts.zoom_in = hk13
			break
		case 14:
			const hk14 = document.querySelector("#hk14_input").value

			file.shortcuts.zoom_out = hk14
			break

		// global shortcuts
		case 100:
			const hk100 = document.querySelector("#hk100_input").value

			file.global_shortcuts.show = hk100
			break
		case 101:
			const hk101 = document.querySelector("#hk101_input").value

			file.global_shortcuts.settings = hk101
			break
		case 102:
			const hk102 = document.querySelector("#hk102_input").value

			file.global_shortcuts.exit = hk102
			break

		default:
			console.warn("No save file found")
			break
	}

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))
}

// ? reset shortcut
const hk_reset = (value) => {
	id = value
	inp_name = document.querySelector(`#hk${value}_input`)
	btn_name = document.querySelector(`#hk${value}_button_reset`)
	svg_name = document.querySelector(`#hk${value}_svg_reset`)

	svg_name.style.color = "orange"
	btn_name.style.borderColor = "orange"

	setTimeout(() => {
		svg_name.style.color = ""
		btn_name.style.border = ""
	}, 500)

	switch (id) {
		case 0:
			document.querySelector("#hk0_input").value = default_shortcuts.shortcuts.show

			file.shortcuts.show = default_shortcuts.shortcuts.show
			break
		case 1:
			document.querySelector("#hk1_input").value = default_shortcuts.shortcuts.settings

			file.shortcuts.settings = default_shortcuts.shortcuts.settings
			break
		case 2:
			document.querySelector("#hk2_input").value = default_shortcuts.shortcuts.exit

			file.shortcuts.exit = default_shortcuts.shortcuts.exit
			break
		case 3:
			document.querySelector("#hk3_input").value = default_shortcuts.shortcuts.edit

			file.shortcuts.edit = default_shortcuts.shortcuts.edit
			break
		case 4:
			document.querySelector("#hk4_input").value = default_shortcuts.shortcuts.import

			file.shortcuts.import = default_shortcuts.shortcuts.import
			break
		case 5:
			document.querySelector("#hk5_input").value = default_shortcuts.shortcuts.export

			file.shortcuts.export = default_shortcuts.shortcuts.export
			break

		case 6:
			document.querySelector("#hk6_input").value = default_shortcuts.shortcuts.release

			file.shortcuts.release = default_shortcuts.shortcuts.release
			break
		case 7:
			document.querySelector("#hk7_input").value = default_shortcuts.shortcuts.support

			file.shortcuts.support = default_shortcuts.shortcuts.support
			break
		case 8:
			document.querySelector("#hk8_input").value = default_shortcuts.shortcuts.docs

			file.shortcuts.docs = default_shortcuts.shortcuts.docs
			break
		case 9:
			document.querySelector("#hk9_input").value = default_shortcuts.shortcuts.licenses

			file.shortcuts.licenses = default_shortcuts.shortcuts.licenses
			break
		case 10:
			document.querySelector("#hk10_input").value = default_shortcuts.shortcuts.update

			file.shortcuts.update = default_shortcuts.shortcuts.update
			break
		case 11:
			document.querySelector("#hk11_input").value = default_shortcuts.shortcuts.info

			file.shortcuts.info = default_shortcuts.shortcuts.info
			break
		case 12:
			document.querySelector("#hk12_input").value = default_shortcuts.shortcuts.zoom_reset

			file.shortcuts.zoom_reset = default_shortcuts.shortcuts.zoom_reset
			break
		case 13:
			document.querySelector("#hk13_input").value = default_shortcuts.shortcuts.zoom_in

			file.shortcuts.zoom_in = default_shortcuts.shortcuts.zoom_in
			break
		case 14:
			document.querySelector("#hk14_input").value = default_shortcuts.shortcuts.zoom_out

			file.shortcuts.zoom_out = default_shortcuts.shortcuts.zoom_out
			break

		// global shortcuts
		case 100:
			document.querySelector("#hk100_input").value = default_shortcuts.global_shortcuts.show

			file.global_shortcuts.show = default_shortcuts.global_shortcuts.show
			break
		case 101:
			document.querySelector("#hk101_input").value = default_shortcuts.global_shortcuts.settings

			file.global_shortcuts.settings = default_shortcuts.global_shortcuts.settings
			break
		case 102:
			document.querySelector("#hk102_input").value = default_shortcuts.global_shortcuts.exit

			file.global_shortcuts.exit = default_shortcuts.global_shortcuts.exit
			break

		default:
			console.warn("No save file found")
			break
	}

	fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file, null, 4))
}

// ? quick shortcuts
const issuers = storage.issuers

const generateCodes = () => {
	for (let i = 0; i < issuers.length; i++) {
		let content = "None"

		if (file.quick_shortcuts[issuers[i]] !== undefined) {
			content = file.quick_shortcuts[issuers[i]]
		}

		const element = `
		<div class="flex flex-col md:w-4/5 lg:w-2/3 mx-auto rounded-2xl bg-gray-800 mb-20">
		<div class="flex justify-center items-center">
		<h3>${issuers[i]}</h3>
		</div>
		<div class="flex justify-center items-center">
		<input class="input" disabled type="text" id="qs${i}_input" value="${content}"/>
		</div>
		<div class="flex justify-center items-center mb-10 mt-5 gap-2">
		<button class="buttonr button" id="qs${i}_button_edit" onclick="qsEdit(${i})">
		<svg id="qs${i}_svg_edit" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
		</svg>
		</button>
		<button class="buttonr button" id="qs${i}_button_delete" onclick="qsDelete(${i})">
		<svg id="qs${i}_svg_delete" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
		</svg>
		</button>
		</div>
		</div>
		`

		const div = document.createElement("div")
		div.innerHTML = element
		document.querySelector(".quick").appendChild(div)
	}
}

if (issuers !== undefined) {
	generateCodes()
} else {
	document.querySelector(".quick").innerHTML = `
	<div class="mx-auto rounded-2xl bg-gray-800 w-2/3">
	<h3 class="pt-5">Please save your codes on the main page and click reload to be able to create quick shortcuts!</h3>
	<button class="buttoni mb-8" onclick="location.reload()">
	<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  	</svg>
	Reload
	</button>
	</div>
	`
}

const qsEdit = (value) => {
	id = value
	inp_name = document.querySelector(`#qs${value}_input`)
	btn_name = document.querySelector(`#qs${value}_button_edit`)
	svg_name = document.querySelector(`#qs${value}_svg_edit`)

	if (modify === true) {
		document.addEventListener("keydown", call, true)

		inp_name.value = "Press any key combination"
		inp_name.style.borderColor = "green"
		btn_name.style.borderColor = "green"
		svg_name.style.color = "green"

		modify = false
	} else if (inp_name.value !== "Press any key combination") {
		document.removeEventListener("keydown", call, true)
		svg_name.style.color = ""
		btn_name.style.border = ""
		inp_name.style.border = ""

		modify = true
	} else {
		document.removeEventListener("keydown", call, true)
		svg_name.style.color = ""
		btn_name.style.border = ""
		inp_name.style.border = ""

		document.querySelector(`#qs${value}_input`).value = "None"
		modify = true
	}

	const input = document.querySelector(`#qs${value}_input`).value

	if (input !== "Press any key combination" && input !== "None") {
		file.quick_shortcuts[issuers[id]] = input

		save()
	} else if (input === "None") {
		delete file.quick_shortcuts[issuers[value]]

		save()
	}
}

const qsDelete = (value) => {
	inp_name = document.querySelector(`#qs${value}_input`)
	btn_name = document.querySelector(`#qs${value}_button_delete`)
	svg_name = document.querySelector(`#qs${value}_svg_delete`)

	inp_name.value = "None"

	svg_name.style.color = "red"
	btn_name.style.borderColor = "red"

	setTimeout(() => {
		svg_name.style.color = ""
		btn_name.style.border = ""
	}, 500)

	delete file.quick_shortcuts[issuers[value]]

	save()
}
