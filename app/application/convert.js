let data = []
let save_text

const handlefiles = (files) => {
	// read file
	if (window.FileReader) {
		getastext(files[0])
		console.log("File uploaded successfully!")
		/* state = 1 */
	} else {
		console.log("Can't upload file!")
	}
}

const getastext = (fileToRead) => {
	const reader = new FileReader()
	reader.onload = loadhandler
	reader.onerror = errorhandler
	reader.readAsText(fileToRead)
}

const loadhandler = (event) => {
	const text = event.target.result
	console.log(text)
	save_text = text
	console.log(save_text)
	processdata(text)
}

const errorhandler = (evt) => {
	if (evt.target.error.name == "NotReadableError") {
		alert("Failed to upload the file! You uploaded a corrupted or not supported file!")
	}
}

const processdata = (text) => {
	// remove double qoutes
	const pre_data1 = text.replace(/"/g, "")

	// new line
	const pre_data2 = pre_data1.replace(/,/g, "\n")

	// make the array
	const pre_data3 = pre_data2.split(/\n/)
	while (pre_data3.length) {
		data.push(pre_data3.shift())
	}

	// remove first blank
	data.splice(0, 1)

	data = data.filter((_, i) => {
		return (i + 1) % 5
	})

	console.log("Data:")
	console.log(data.length)
	console.log(data)

	separation()
}
