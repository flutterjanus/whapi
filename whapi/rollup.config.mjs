// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json'
import externals from 'rollup-plugin-node-externals';

const usePreferConst = true; // Use "const" instead of "var"
const useSourceMap = false; // Generate source map files
const external = ['oas', 'api'];

export default [
	{
		// .d.ts build
		input: 'src/index.ts',
		output: {
			interop: 'default',
			file: 'dist/index.d.ts',
			format: 'es'
		},
		external,
		plugins: [
			typescript(), // If you're using TypeScript
			commonjs(),
			resolve(),
			externals(),
			json()
		]
	},
	{
		// CJS build
		input: 'src/index.ts',
		output: {
			file: `dist/index.cjs`,
			format: 'cjs',
			interop: 'default',
			generatedCode: {
				constBindings: usePreferConst
			},
			entryFileNames: '[name].cjs',
			sourcemap: useSourceMap
		},
		external,
		plugins: [
			typescript(), // If you're using TypeScript
			commonjs(),
			resolve(),
			externals(),
			json()
		]
	}
];
