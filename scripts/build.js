import esbuild from "esbuild"
import esbuildSvelte from "esbuild-svelte"
import sveltePreprocess from "svelte-preprocess"
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"
import postCssPlugin from "esbuild-style-plugin"
import tw from "tailwindcss"
import ap from "autoprefixer"
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import { existsSync, copyFileSync, mkdirSync } from "fs"

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
		],
	})
	.catch(() => process.exit(1))
