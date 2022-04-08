/**
 * Default shortcuts
 */
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
 * Create shortcuts
 */
const createShortcuts = () => {
	const names = lang.menu

	delete names.file
	delete names.hide_app
	delete names.view
	delete names.tools
	delete names.help
	delete names.about

	let i = 0

	for (const name in names) {
		const element = `
		<div class="flex flex-col md:w-4/5 lg:w-2/3 mx-auto rounded-2xl bg-gray-800 mb-20">
		<div class="flex justify-center items-center">
		<h3>${names[name]}</h3>
		</div>
		<div class="flex justify-center items-center">
		<input class="input" disabled type="text" id="hk${i}_input" />
		</div>
		<div class="flex justify-center items-center mb-10 mt-5 gap-2">
		<button class="buttonr button" id="hk${i}_button_edit" onclick="hk_edit(${i})">
		<svg id="hk${i}_svg_edit" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
		</svg>
		</button>
		<button class="buttonr button" id="hk${i}_button_reset" onclick="hk_reset(${i})">
		<svg id="hk${i}_svg_reset" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
		</svg>
		</button>
		<button class="buttonr button" id="hk${i}_button_delete" onclick="hk_delete(${i})">
		<svg id="hk${i}_svg_delete" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
		</svg>
		</button>
		</div>
		</div>
		`
		const div = document.createElement("div")
		div.innerHTML = element
		document.querySelector(".shortcutsDiv").appendChild(div)

		i++
	}
}

createShortcuts()

/**
 * Create global shortcuts
 */
const createGlobalShortcuts = () => {
	const names = lang.tray

	delete names.hide_app

	let i = 100

	for (const name in names) {
		const element = `
		<div class="flex flex-col md:w-4/5 lg:w-2/3 mx-auto rounded-2xl bg-gray-800 mb-20">
		<div class="flex justify-center items-center">
		<h3>${names[name]}</h3>
		</div>
		<div class="flex justify-center items-center">
		<input class="input" disabled type="text" id="hk${i}_input" />
		</div>
		<div class="flex justify-center items-center mb-10 mt-5 gap-2">
		<button class="buttonr button" id="hk${i}_button_edit" onclick="hk_edit(${i})">
		<svg id="hk${i}_svg_edit" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
		</svg>
		</button>
		<button class="buttonr button" id="hk${i}_button_reset" onclick="hk_reset(${i})">
		<svg id="hk${i}_svg_reset" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
		</svg>
		</button>
		<button class="buttonr button" id="hk${i}_button_delete" onclick="hk_delete(${i})">
		<svg id="hk${i}_svg_delete" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
		</svg>
		</button>
		</div>
		</div>
		`
		const div = document.createElement("div")
		div.innerHTML = element
		document.querySelector(".globalShortcutsDiv").appendChild(div)

		i++
	}
}

createGlobalShortcuts()

/**
 * Edit, reset, delete codes
 */
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

hk0.value = settings.shortcuts.show
hk1.value = settings.shortcuts.settings
hk2.value = settings.shortcuts.exit
hk3.value = settings.shortcuts.zoom_reset
hk4.value = settings.shortcuts.zoom_in
hk5.value = settings.shortcuts.zoom_out
hk6.value = settings.shortcuts.edit
hk7.value = settings.shortcuts.import
hk8.value = settings.shortcuts.export
hk9.value = settings.shortcuts.docs
hk10.value = settings.shortcuts.release
hk11.value = settings.shortcuts.support
hk12.value = settings.shortcuts.licenses
hk13.value = settings.shortcuts.update
hk14.value = settings.shortcuts.info
hk100.value = settings.global_shortcuts.show
hk101.value = settings.global_shortcuts.settings
hk102.value = settings.global_shortcuts.exit

/**
 * Detect pressed keys
 * @param {KeyboardEvent} event
 */
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

/**
 * Edit selected shortcut
 * @param {Number} value
 */
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

				settings.shortcuts.show = hk0
				break
			case 1:
				const hk1 = document.querySelector("#hk1_input").value

				settings.shortcuts.settings = hk1
				break
			case 2:
				const hk2 = document.querySelector("#hk2_input").value

				settings.shortcuts.exit = hk2
				break
			case 3:
				const hk3 = document.querySelector("#hk3_input").value

				settings.shortcuts.zoom_reset = hk3
				break
			case 4:
				const hk4 = document.querySelector("#hk4_input").value

				settings.shortcuts.zoom_in = hk4
				break
			case 5:
				const hk5 = document.querySelector("#hk5_input").value

				settings.shortcuts.zoom_out = hk5
				break

			case 6:
				const hk6 = document.querySelector("#hk6_input").value

				settings.shortcuts.edit = hk6
				break
			case 7:
				const hk7 = document.querySelector("#hk7_input").value

				settings.shortcuts.import = hk7
				break
			case 8:
				const hk8 = document.querySelector("#hk8_input").value

				settings.shortcuts.export = hk8
				break
			case 9:
				const hk9 = document.querySelector("#hk9_input").value

				settings.shortcuts.docs = hk9
				break
			case 10:
				const hk10 = document.querySelector("#hk10_input").value

				settings.shortcuts.release = hk10
				break
			case 11:
				const hk11 = document.querySelector("#hk11_input").value

				settings.shortcuts.support = hk11
				break
			case 12:
				const hk12 = document.querySelector("#hk12_input").value

				settings.shortcuts.licenses = hk12
				break
			case 13:
				const hk13 = document.querySelector("#hk13_input").value

				settings.shortcuts.update = hk13
				break
			case 14:
				const hk14 = document.querySelector("#hk14_input").value

				settings.shortcuts.info = hk14
				break

			// global shortcuts
			case 100:
				const hk100 = document.querySelector("#hk100_input").value

				settings.global_shortcuts.show = hk100
				break
			case 101:
				const hk101 = document.querySelector("#hk101_input").value

				settings.global_shortcuts.settings = hk101
				break
			case 102:
				const hk102 = document.querySelector("#hk102_input").value

				settings.global_shortcuts.exit = hk102
				break

			default:
				console.warn("No save file found")
				break
		}

		fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), convert.fromJSON(settings))

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

/**
 * Delete selected shortcut
 * @param {Number} value
 */
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

			settings.shortcuts.show = hk0
			break
		case 1:
			const hk1 = document.querySelector("#hk1_input").value

			settings.shortcuts.settings = hk1
			break
		case 2:
			const hk2 = document.querySelector("#hk2_input").value

			settings.shortcuts.exit = hk2
			break
		case 3:
			const hk3 = document.querySelector("#hk3_input").value

			settings.shortcuts.zoom_reset = hk3
			break
		case 4:
			const hk4 = document.querySelector("#hk4_input").value

			settings.shortcuts.zoom_in = hk4
			break
		case 5:
			const hk5 = document.querySelector("#hk5_input").value

			settings.shortcuts.zoom_out = hk5
			break

		case 6:
			const hk6 = document.querySelector("#hk6_input").value

			settings.shortcuts.edit = hk6
			break
		case 7:
			const hk7 = document.querySelector("#hk7_input").value

			settings.shortcuts.import = hk7
			break
		case 8:
			const hk8 = document.querySelector("#hk8_input").value

			settings.shortcuts.export = hk8
			break
		case 9:
			const hk9 = document.querySelector("#hk9_input").value

			settings.shortcuts.docs = hk9
			break
		case 10:
			const hk10 = document.querySelector("#hk10_input").value

			settings.shortcuts.release = hk10
			break
		case 11:
			const hk11 = document.querySelector("#hk11_input").value

			settings.shortcuts.support = hk11
			break
		case 12:
			const hk12 = document.querySelector("#hk12_input").value

			settings.shortcuts.licenses = hk12
			break
		case 13:
			const hk13 = document.querySelector("#hk13_input").value

			settings.shortcuts.update = hk13
			break
		case 14:
			const hk14 = document.querySelector("#hk14_input").value

			settings.shortcuts.info = hk14
			break

		// global shortcuts
		case 100:
			const hk100 = document.querySelector("#hk100_input").value

			settings.global_shortcuts.show = hk100
			break
		case 101:
			const hk101 = document.querySelector("#hk101_input").value

			settings.global_shortcuts.settings = hk101
			break
		case 102:
			const hk102 = document.querySelector("#hk102_input").value

			settings.global_shortcuts.exit = hk102
			break

		default:
			console.warn("No save file found")
			break
	}

	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), convert.fromJSON(settings))
}

/**
 * Reset selected shortcut to its default value
 * @param {Number} value
 */
const hk_reset = (value) => {
	ipc.send("shortcuts")

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

			settings.shortcuts.show = default_shortcuts.shortcuts.show
			break
		case 1:
			document.querySelector("#hk1_input").value = default_shortcuts.shortcuts.settings

			settings.shortcuts.settings = default_shortcuts.shortcuts.settings
			break
		case 2:
			document.querySelector("#hk2_input").value = default_shortcuts.shortcuts.exit

			settings.shortcuts.exit = default_shortcuts.shortcuts.exit
			break
		case 3:
			document.querySelector("#hk3_input").value = default_shortcuts.shortcuts.zoom_reset

			settings.shortcuts.zoom_reset = default_shortcuts.shortcuts.zoom_reset
			break
		case 4:
			document.querySelector("#hk4_input").value = default_shortcuts.shortcuts.zoom_in

			settings.shortcuts.zoom_in = default_shortcuts.shortcuts.zoom_in
			break
		case 5:
			document.querySelector("#hk5_input").value = default_shortcuts.shortcuts.zoom_out

			settings.shortcuts.zoom_out = default_shortcuts.shortcuts.zoom_out
			break

		case 6:
			document.querySelector("#hk6_input").value = default_shortcuts.shortcuts.edit

			settings.shortcuts.edit = default_shortcuts.shortcuts.edit
			break
		case 7:
			document.querySelector("#hk7_input").value = default_shortcuts.shortcuts.import

			settings.shortcuts.import = default_shortcuts.shortcuts.import
			break
		case 8:
			document.querySelector("#hk8_input").value = default_shortcuts.shortcuts.export

			settings.shortcuts.export = default_shortcuts.shortcuts.export
			break
		case 9:
			document.querySelector("#hk9_input").value = default_shortcuts.shortcuts.docs

			settings.shortcuts.docs = default_shortcuts.shortcuts.docs
			break
		case 10:
			document.querySelector("#hk10_input").value = default_shortcuts.shortcuts.release

			settings.shortcuts.release = default_shortcuts.shortcuts.release
			break
		case 11:
			document.querySelector("#hk11_input").value = default_shortcuts.shortcuts.support

			settings.shortcuts.support = default_shortcuts.shortcuts.support
			break
		case 12:
			document.querySelector("#hk12_input").value = default_shortcuts.shortcuts.licenses

			settings.shortcuts.licenses = default_shortcuts.shortcuts.licenses
			break
		case 13:
			document.querySelector("#hk13_input").value = default_shortcuts.shortcuts.update

			settings.shortcuts.update = default_shortcuts.shortcuts.update
			break
		case 14:
			document.querySelector("#hk14_input").value = default_shortcuts.shortcuts.info

			settings.shortcuts.info = default_shortcuts.shortcuts.info
			break

		// global shortcuts
		case 100:
			document.querySelector("#hk100_input").value = default_shortcuts.global_shortcuts.show

			settings.global_shortcuts.show = default_shortcuts.global_shortcuts.show
			break
		case 101:
			document.querySelector("#hk101_input").value = default_shortcuts.global_shortcuts.settings

			settings.global_shortcuts.settings = default_shortcuts.global_shortcuts.settings
			break
		case 102:
			document.querySelector("#hk102_input").value = default_shortcuts.global_shortcuts.exit

			settings.global_shortcuts.exit = default_shortcuts.global_shortcuts.exit
			break

		default:
			console.warn("No save file found")
			break
	}

	fs.writeFileSync(path.join(folder_path, "settings", "settings.json"), convert.fromJSON(settings))
	svg_name.style.color = "red"
	btn_name.style.borderColor = "red"

	setTimeout(() => {
		svg_name.style.color = ""
		btn_name.style.border = ""
	}, 500)

	delete settings.quick_shortcuts[issuers[value]]

	save()
}
