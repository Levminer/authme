// ? settings
const default_shortcuts = {
	shortcuts: {
		show: "CommandOrControl+q",
		settings: "CommandOrControl+s",
		exit: "CommandOrControl+w",
		zoom_reset: "CommandOrControl+0",
		zoom_in: "CommandOrControl+1",
		zoom_out: "CommandOrControl+2",
		edit: "CommandOrControl+t",
		import: "CommandOrControl+i",
		export: "CommandOrControl+e",
		release: "CommandOrControl+n",
		support: "CommandOrControl+p",
		docs: "CommandOrControl+d",
		licenses: "CommandOrControl+l",
		update: "CommandOrControl+u",
		info: "CommandOrControl+o",
	},
	global_shortcuts: {
		show: "CommandOrControl+Shift+a",
		settings: "CommandOrControl+Shift+s",
		exit: "CommandOrControl+Shift+d",
	},
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
		inp_name.value = `CommandOrControl+${event.key.toLowerCase()}`
	}

	if (event.altKey === true) {
		inp_name.value = `Alt+${event.key.toLowerCase()}`
	}

	if (event.shiftKey === true) {
		inp_name.value = `Shift+${event.key.toLowerCase()}`
	}

	if (event.ctrlKey === true && event.shiftKey === true) {
		inp_name.value = `CommandOrControl+Shift+${event.key.toLowerCase()}`
	}

	if (event.ctrlKey === true && event.altKey === true) {
		inp_name.value = `CommandOrControl+Alt+${event.key.toLowerCase()}`
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

		inp_name.value = "Press any key combiantion"
		inp_name.style.border = "green 1px solid"
		btn_name.style.border = "green 1px solid"
		svg_name.style.color = "green"

		modify = false
	} else if (inp_name.value !== "Press any key combiantion") {
		document.removeEventListener("keydown", call, true)
		svg_name.style.color = ""
		btn_name.style.border = ""

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
	btn_name.style.border = "red 1px solid"

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
	btn_name.style.border = "orange 1px solid"

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
