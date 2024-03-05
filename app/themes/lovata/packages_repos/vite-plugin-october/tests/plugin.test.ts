import path from 'node:path'
import { expect, it } from 'vitest'
import { build } from 'vite'
import laravel from '../src'

it('runs the plugin as expected', async() => {
	const result = await build({
		root: path.resolve(__dirname),
		logLevel: 'silent',
		plugins: [
			laravel({
				config: {
					aliases: { '@': 'vite-plugin-laravel/tests/__fixtures__/assets' },
					build_path: 'build',
					dev_server: { url: 'http://localhost:5173' },
					entrypoints: { paths: path.resolve(__dirname, './__fixtures__/assets/scripts/app.ts') },
				},
			}),
		],
	}) as any

	expect(result.output[0].fileName).to.match(/assets\/app\..*\.js/)
	expect(result.output[0]).toMatchObject({
		code: 'console.log("app content");\n',
		isDynamicEntry: false,
		isEntry: true,
		isImplicitEntry: false,
		type: 'chunk',
	})

	expect(result.output[1].fileName).to.match(/assets\/app\..*\.css/)
	expect(result.output[1].name).to.include('app.css')
	expect(result.output[1]).toMatchObject({
		source: 'body{color:red}\n',
		isAsset: true,
		type: 'asset',
	})
})
