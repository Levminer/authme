module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		node: true,
	},
	parser: "@typescript-eslint/parser",
	extends: ["standard", "eslint:recommended", "plugin:promise/recommended", "plugin:prettier/recommended", "plugin:@typescript-eslint/eslint-recommended", "plugin:svelte/recommended"],
	plugins: ["@typescript-eslint"],
	ignorePatterns: ["/node_modules/*", "/dist/*", "/build/*"],
	parserOptions: {
		ecmaVersion: 12,
		extraFileExtensions: [".svelte"],
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
	],
	rules: {
		indent: ["off", "tab", { SwitchCase: 1 }],
		quotes: ["error", "double"],
		semi: ["error", "never"],

		"prettier/prettier": ["warn", { endOfLine: "auto" }],
		"prefer-const": ["warn"],
		"prefer-arrow-callback": ["error"],
		"prefer-template": ["error"],
		"func-style": ["error"],
		"no-var": ["error"],
		"no-unused-vars": ["warn"],
		"no-use-before-define": ["off"],
		"svelte/valid-compile": ["off"],
	},
}
