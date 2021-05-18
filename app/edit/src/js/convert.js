let data = []

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

	separation()
}
