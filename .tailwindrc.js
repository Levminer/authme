module.exports = {
	purge: {
		enabled: true,
		content: ["./app/**/*.html"],
	},
	theme: {
		extend: {
			inset: {
				"-30": "-1.875rem",
			},

			colors: {
				gray: {
					700: "#141414",
					800: "#0a0a0a",
					900: "#000000",
				},
				popup: {
					red: "#FF0000",
					green: "#008000",
					blue: "#0000FF",
				},
			},

			fontFamily: {
				sans: ["Arial", "Helvetica", "sans-serif"],
			},
		},
	},
	corePlugins: {
		preflight: false,
	},
}
