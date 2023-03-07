import esbuild from "esbuild"
import esbuildSvelte from "esbuild-svelte"
import sveltePreprocess from "svelte-preprocess"
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"
import postCssPlugin from "esbuild-style-plugin"
import tw from "tailwindcss"
import ap from "autoprefixer"
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import { existsSync, copyFileSync, mkdirSync } from "fs"
import { copy } from "esbuild-plugin-copy"
import { replace } from "esbuild-plugin-replace"
import { ZBAR_WASM_REPOSITORY } from "@undecaf/barcode-detector-polyfill/zbar-wasm"

if (existsSync("./dist/index.html") === false) {
	mkdirSync("./dist")
	copyFileSync("./interface/layout/index.html", "./dist/index.html")
}

esbuild
	.build({
		entryPoints: ["interface/layout/app.ts"],
		mainFields: ["svelte", "browser", "module", "main"],
		bundle: true,
		logLevel: "info",
		outdir: "./dist",
		format: "esm",
		minify: true,
		plugins: [
			postCssPlugin({
				postcss: {
					plugins: [tw, ap],
				},
			}),
			esbuildSvelte({
				preprocess: sveltePreprocess(),
			}),
			NodeModulesPolyfillPlugin(),
			NodeGlobalsPolyfillPlugin({
				buffer: true,
			}),
			replace({
				values: {
					[ZBAR_WASM_REPOSITORY]: "@undecaf/zbar-wasm",
					"/dist/main.js": "",
					"/dist/index.js": "",
				},
			}),

			copy({
				assets: {
					from: ["node_modules/@undecaf/zbar-wasm/dist/zbar.wasm"],
					to: ["."],
				},
			}),
		],
	})
	.catch(() => process.exit(1))
