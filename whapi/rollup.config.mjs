// rollup.config.mjs
// import eslint from '@rollup/plugin-eslint';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import externals from 'rollup-plugin-node-externals';
import packageJson from './package.json' assert { type: 'json' };
import fs from 'fs/promises';
import prettier from 'prettier';

const usePreferConst = true; // Use "const" instead of "var"
const useStrict = true; // Use "strict"
const useThrowOnError = true; // On error throw and exception
const useSourceMap = false; // Generate source map files
const useEsbuild = true; // `true` -> use esbuild, `false` use tsc
const modules = [];
const external = [];
const defaultExports = {
	'.': {
		import: './dist/esm/index.mjs',
		require: './dist/cjs/index.cjs',
		types: './dist/index.d.ts',
		default: './dist/esm/index.mjs'
	}
};

const createTsDefinitionConfigForModule = (moduleName) => {
	return {
		// .d.ts build
		input: `src/modules/${moduleName}/index.ts`,
		output: {
			file: `${moduleName}/index.d.ts`,
			format: 'es'
		},
		external,
		plugins: [
			externals(),
			json({
				preferConst: usePreferConst
			}),
			typescriptPaths({
				preserveExtensions: true
			}),
			dts()
		]
	};
};
const createExportTemplate = (moduleName) => {
	return {
		[`./${moduleName}`]: {
			import: `./${moduleName}/index.mjs`,
			require: `./${moduleName}/index.cjs`,
			types: `./${moduleName}/index.d.ts`,
			default: `./${moduleName}/index.mjs`
		}
	};
};
const createCjsConfigForModules = (moduleNames = []) => {
	return moduleNames.map((moduleName) => {
		return {
			// CJS build
			input: `src/modules/${moduleName}/index.ts`,
			output: {
				file: `${moduleName}/index.cjs`,
				format: 'cjs',
				generatedCode: {
					constBindings: usePreferConst
				},
				// preserveModules: usePreserveModules,
				// preserveModulesRoot: preserveModulesRoot,
				strict: useStrict,
				entryFileNames: '[name].cjs',
				sourcemap: useSourceMap
			},
			external,
			plugins: [
				externals(),
				json({
					preferConst: usePreferConst
				}),
				useEsbuild
					? typescriptPaths({
							preserveExtensions: true
					  })
					: undefined,
				useEsbuild
					? esbuild()
					: typescript({
							noEmitOnError: useThrowOnError,
							removeComments: true
					  })
			]
		};
	});
};

const createEsmConfigForModules = (moduleNames = []) => {
	return moduleNames.map((moduleName) => {
		return {
			// CJS build
			input: `src/modules/${moduleName}/index.ts`,
			output: {
				file: `${moduleName}/index.mjs`,
				format: 'es',
				generatedCode: {
					constBindings: usePreferConst
				},
				// preserveModules: usePreserveModules,
				// preserveModulesRoot: preserveModulesRoot,
				strict: useStrict,
				entryFileNames: '[name].mjs',
				sourcemap: useSourceMap
			},
			external,
			plugins: [
				externals(),
				json({
					preferConst: usePreferConst
				}),
				useEsbuild
					? typescriptPaths({
							preserveExtensions: true
					  })
					: undefined,
				useEsbuild
					? esbuild()
					: typescript({
							noEmitOnError: useThrowOnError,
							removeComments: true
					  })
			]
		};
	});
};

function updatePackageJsonExports() {
	return {
		name: 'update-package-json-exports', // A unique name for the plugin
		async writeBundle(options, bundle) {
			console.log('updating package.json for exports');
			const packageJsonDuplicate = { ...packageJson };
			const updatedExports = {
				...defaultExports
			};
			for (let moduleName of modules) {
				Object.assign(updatedExports, { ...updatedExports, ...createExportTemplate(moduleName) });
			}
			packageJsonDuplicate.exports = updatedExports;
			await fs.writeFile(
				'./package.json',
				prettier.format(JSON.stringify(packageJsonDuplicate), {
					semi: true,
					trailingComma: 'none',
					parser: 'json',
					singleQuote: true,
					printWidth: 180,
					useTabs: true,
					tabWidth: 4,
					arrowParens: 'always'
				})
			);
		}
	};
}

export default [
	{
		// .d.ts build
		input: 'src/index.ts',
		output: {
			file: 'dist/index.d.ts',
			format: 'es'
		},
		external,
		plugins: [
			externals(),
			json({
				preferConst: usePreferConst
			}),
			typescriptPaths({
				preserveExtensions: true
			}),
			dts(),
			updatePackageJsonExports()
		]
	},
	{
		// esm build
		input: 'src/index.ts',
		output: {
			file: `dist/esm/index.mjs`,
			format: 'es',
			generatedCode: {
				constBindings: usePreferConst
			},
			strict: useStrict,
			entryFileNames: '[name].mjs',
			sourcemap: useSourceMap
		},
		external,
		plugins: [
			externals(),
			json({
				preferConst: usePreferConst
			}),
			useEsbuild
				? typescriptPaths({
						preserveExtensions: true
				  })
				: undefined,
			useEsbuild
				? esbuild()
				: typescript({
						noEmitOnError: useThrowOnError,
						removeComments: true
				  })
		]
	},
	{
		// CJS build
		input: 'src/index.ts',
		output: {
			file: `dist/cjs/index.cjs`,
			format: 'cjs',
			generatedCode: {
				constBindings: usePreferConst
			},
			strict: useStrict,
			entryFileNames: '[name].cjs',
			sourcemap: useSourceMap
		},
		external,
		plugins: [
			externals(),
			json({
				preferConst: usePreferConst
			}),
			useEsbuild
				? typescriptPaths({
						preserveExtensions: true
				  })
				: undefined,
			useEsbuild
				? esbuild()
				: typescript({
						noEmitOnError: useThrowOnError,
						removeComments: true
				  })
		]
	},
	...modules.map((moduleName) => createTsDefinitionConfigForModule(moduleName)),
	...createCjsConfigForModules(modules),
	...createEsmConfigForModules(modules)
];
