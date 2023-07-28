/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			inset: {
				"-30": "-1.875rem",
			},
			colors: {
				gray: {
					600: "#1E1E1E",
					700: "#141414",
					800: "#0a0a0a",
					900: "#000000",
				},
			},
			screens: {
				small: { max: "800px" },
			},
		},
	},
	plugins: [],
}
