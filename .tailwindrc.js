module.exports = {
	mode: "jit",
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
					500: "#282828",
					600: "#1E1E1E",
					700: "#141414",
					800: "#0a0a0a",
					900: "#000000",
				},
				popup: {
					red: "#FF0000",
					green: "#008000",
					blue: "#0000FF",
				},
				html: {
					gray: "#808080",
				},
			},

			fontFamily: {
				sans: ["Arial", "Helvetica", "sans-serif"],
			},

			borderRadius: {
				"2xl": "30px",
			},
		},
	},
	corePlugins: {
		preflight: false,
	},
}
