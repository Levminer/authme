// ? shortcuts
let modify = true

let inp_name
let but_name
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

hk0.value = file.shortcuts.show
hk1.value = file.shortcuts.settings
hk2.value = file.shortcuts.exit
hk3.value = file.shortcuts.web
hk4.value = file.shortcuts.import
hk5.value = file.shortcuts.export
hk6.value = file.shortcuts.release
hk7.value = file.shortcuts.issues
hk8.value = file.shortcuts.docs
hk9.value = file.shortcuts.licenses
hk10.value = file.shortcuts.update
hk11.value = file.shortcuts.info

const call = (event) => {
	console.log(event)
	console.log(event.key + event.ctrlKey)

	if (event.ctrlKey === true) {
		inp_name.value = `CommandOrControl+${event.key}`
	}

	if (event.altKey === true) {
		inp_name.value = `Alt+${event.key}`
	}

	if (event.shiftKey === true) {
		inp_name.value = `Shift+${event.key.toLowerCase()}`
	}
}

const hk_modify = (value) => {
	id = value
	inp_name = document.querySelector(`#hk${value}_input`)
	but_name = document.querySelector(`#hk${value}_button`)

	if (modify === true) {
		document.addEventListener("keydown", call, true)

		inp_name.value = "Press any key combiantion"
		but_name.textContent = "Done"

		modify = false
	} else {
		but_name.textContent = "Modify"

		document.removeEventListener("keydown", call, true)

		console.log(id)
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

				file.shortcuts.web = hk3
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

				file.shortcuts.issues = hk7
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

		fs.writeFileSync(path.join(file_path, "settings.json"), JSON.stringify(file))

		modify = true
	}
}

// ? global shortcuts

const hk100 = document.querySelector("#hk100_input")
const hk101 = document.querySelector("#hk101_input")
const hk102 = document.querySelector("#hk102_input")

hk100.value = file.global_shortcuts.show
hk101.value = file.global_shortcuts.settings
hk102.value = file.global_shortcuts.exit
