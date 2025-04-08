/**
 * @type {import("prettier").Config}
 */
const config = {
	trailingComma: "all",
	tabWidth: 4,
	printWidth: 1000,
	useTabs: true,
	singleQuote: false,
	semi: false,
	svelteSortOrder: "options-markup-scripts-styles",
	plugins: ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
	pluginSearchDirs: false,
}

export default config
