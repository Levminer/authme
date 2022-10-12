import esbuild from "esbuild"
import esbuildSvelte from "esbuild-svelte"
import sveltePreprocess from "svelte-preprocess"
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill"
import postCssPlugin from "esbuild-style-plugin"
import tw from "tailwindcss"
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill"
import { createServer, request } from "http"

const clients = []

esbuild
	.build({
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
			NodeModulesPolyfillPlugin(),
			NodeGlobalsPolyfillPlugin({
				buffer: true,
			}),
		],
		banner: { js: " (() => new EventSource('/esbuild').onmessage = () => location.reload())();" },
		watch: {
			onRebuild(error, result) {
				clients.forEach((res) => res.write("data: update\n\n"))
				clients.length = 0
				console.log(error || "Hot reload complete")
			},
		},
	})
	.catch(() => process.exit(1))

esbuild
	.serve({ servedir: "./dist" }, {})
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
					})
				)
			const path = ~url.split("/").pop().indexOf(".") ? url : "/index.html"
			req.pipe(
				request({ hostname: "0.0.0.0", port: 8000, path, method, headers }, (prxRes) => {
					res.writeHead(prxRes.statusCode, prxRes.headers)
					prxRes.pipe(res, { end: true })
				}),
				{ end: true }
			)
		}).listen(3000)
	})
	.catch(() => process.exit(1))
