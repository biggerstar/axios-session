import {resolve} from 'node:path';
import {defineViteRunConfig, viteRunLogPlugin, ViteRunHandleFunctionOptions} from "vite-run";
import dtsPlugin from "vite-plugin-dts";
import copyDtsPlugin from "vite-plugin-copy-dts";

export default defineViteRunConfig({
  baseConfig: getBaseConfig,
  packages: [
    './'
  ],
  targets: {
    'axios-session': {
      build: [
        ['build_lib', 'es', 'cjs'],
      ],
      types: [
        ['types'],
      ],
      dev: [
        ['build_lib', 'es', 'watch']
      ]
    },
  },
  build: {
    cjs: {
      lib: {
        formats: ['cjs']
      }
    },
    es: {
      lib: {
        formats: ['es']
      },
    },
    watch: {
      watch: {},
    },
    minify: {
      minify: true
    },
    build_lib: (options: ViteRunHandleFunctionOptions) => {
      return {
        lib: {
          entry: resolve(options.packagePath, 'src/index.ts'),
          name: options.name,
          fileName: (format: string) => {
            const names = {
              es: 'mjs',
              cjs: 'cjs',
            }
            return `index.${names[format]}`
          },
        },
        rollupOptions: {
          external: [
            "axios",
            "user-agents",
            "tough-cookie",
            "https-proxy-agent",
            "axios-retry",
            "set-cookie-parser",
          ],
          output: {}
        },
      }
    },
  },
  server: {
    10000: {
      // open: true,
      port: 10000
    },
  },
  preview: {
    '20000': {
      port: 20000,
    }
  },
  plugins: {}
})

function getBaseConfig(options: ViteRunHandleFunctionOptions) {
  return {
    resolve: {
      extensions: [".ts", ".js", '.css', '.d.ts'],
      alias: {
        "@": resolve(options.packagePath, 'src'),
        types: resolve(options.packagePath, 'src/types')
      }
    },
    build: {
      emptyOutDir: true,
      minify: false,
      rollupOptions: {
        output: {
          sourcemap: false,
          globals: {}
        },
        treeshake: true
      },
    },
    plugins: [
      dtsPlugin({
        rollupTypes: true,
        copyDtsFiles: true,
        clearPureImport: true
      }),
      copyDtsPlugin({
        root: options.packagePath,
        files: [
          // {
          //   from: './typings/index.ts',
          //   to: "./dist/index.d.ts"
          // }
        ]
      }),
      viteRunLogPlugin({
        // server: {
        //     viteLog: true,
        //     viteRunLog: {
        //        sizeAntOutputPrint:false
        //     }
        // }
      }),
    ]
  }
}
