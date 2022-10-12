export const encode = (input) => {
	const charJson = {
		0: "A",
		1: "B",
		2: "C",
		3: "D",
		4: "E",
		5: "F",
		6: "G",
		7: "H",
		8: "I",
		9: "J",
		10: "K",
		11: "L",
		12: "M",
		13: "N",
		14: "O",
		15: "P",
		16: "Q",
		17: "R",
		18: "S",
		19: "T",
		20: "U",
		21: "V",
		22: "W",
		23: "X",
		24: "Y",
		25: "Z",
		26: "2",
		27: "3",
		28: "4",
		29: "5",
		30: "6",
		31: "7",
	}

	if (typeof input === "undefined" || input == null) {
		return null
	}
	const aAscii2: any = []
	for (const ascii of input) {
		let ascii2 = ascii.toString(2)
		const gap = 8 - ascii2.length
		let zeros = ""
		for (let i = 0; i < gap; i++) {
			zeros = `0${zeros}`
		}
		ascii2 = zeros + ascii2

		aAscii2.push(ascii2)
	}

	const source = aAscii2.join("")

	const eArr: any = []
	for (let i = 0; i < source.length; i += 5) {
		let s5 = source.substring(i, i + 5)
		if (s5.length < 5) {
			const gap = 5 - s5.length
			let zeros = ""
			for (let gi = 0; gi < gap; gi++) {
				zeros += "0"
			}
			s5 += zeros
		}

		const eInt = parseInt(s5, 2)

		eArr.push(charJson[eInt])
	}
	if (eArr.length % 8 !== 0) {
		const gap = 8 - (eArr.length % 8)
		for (let i = 0; i < gap; i++) {
			eArr.push("=")
		}
	}
	const eStr = eArr.join("")

	return eStr
}
