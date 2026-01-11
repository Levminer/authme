import esbuild from "esbuild"
import esbuildSvelte from "esbuild-svelte"
import sveltePreprocess from "svelte-preprocess"
import postCssPlugin from "esbuild-style-plugin"
import tw from "tailwindcss"
import { createServer, request } from "http"
import { copy } from "esbuild-plugin-copy"
import { replace } from "esbuild-plugin-replace"
import { ZBAR_WASM_REPOSITORY } from "@undecaf/barcode-detector-polyfill/zbar-wasm"

const clients = []

esbuild
	.context({
		entryPoints: ["interface/layout/app.ts"],
		mainFields: ["svelte", "browser", "module", "main"],
		bundle: true,
		outdir: "./dist",
		logLevel: "info",
		format: "esm",
		sourcemap: "linked",
		plugins: [
			postCssPlugin({
				postcss: {
					plugins: [tw],
				},
			}),
			esbuildSvelte({
				preprocess: sveltePreprocess(),
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
			{
				name: "rebuild-notify",
				setup(build) {
					build.onEnd((result) => {
						clients.forEach((res) => res.write("data: update\n\n"))
						clients.length = 0
						console.log(result.errors.length ? `[reload] Hot reload: ${result.errors[0]}` : "[reload] Hot reload complete")
					})
				},
			},
		],
		banner: { js: " (() => new EventSource('/esbuild').onmessage = () => location.reload());" },
	})
	.then((ctx) => ctx.watch())
	.catch(() => process.exit(1))

esbuild
	.context({
		entryPoints: ["interface/layout/app.ts"],
		mainFields: ["svelte", "browser", "module", "main"],
		bundle: true,
		outdir: "./dist",
		logLevel: "info",
		format: "esm",
		sourcemap: "linked",
		plugins: [
			postCssPlugin({
				postcss: {
					plugins: [tw],
				},
			}),
			esbuildSvelte({
				preprocess: sveltePreprocess(),
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
			{
				name: "rebuild-notify",
				setup(build) {
					build.onEnd((result) => {
						clients.forEach((res) => res.write("data: update\n\n"))
						clients.length = 0
						console.log(result.errors.length ? `[reload] Hot reload: ${result.errors[0]}` : "[reload] Hot reload complete")
					})
				},
			},
		],
		banner: { js: " (() => new EventSource('/esbuild').onmessage = () => location.reload());" },
	})
	.then((ctx) => {
		return Promise.all([ctx.watch(), ctx.serve({ servedir: "./dist" })])
	})
	// eslint-disable-next-line promise/always-return
	.then(() => {
		createServer((req, res) => {
			const { url, method, headers } = req
			if (req.url === "/esbuild")
				return clients.push(
					res.writeHead(200, {
						"Content-Type": "text/event-stream",
						"Cache-Control": "no-cache",
						Connection: "keep-alive",
					}),
				)
			const path = ~url.split("/").pop().indexOf(".") ? url : "/index.html"
			req.pipe(
				request({ hostname: "0.0.0.0", port: 8000, path, method, headers }, (prxRes) => {
					res.writeHead(prxRes.statusCode, prxRes.headers)
					prxRes.pipe(res, { end: true })
				}),
				{ end: true },
			)
		}).listen(3000)
	})
	.catch(() => process.exit(1))
