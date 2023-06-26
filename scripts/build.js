const path = require('path')

const esbuild = require('esbuild')
const alias = require('esbuild-plugin-path-alias')
const { copy } = require('esbuild-plugin-copy')

esbuild.build({
    entryPoints: ['src/index.js', 'src/temp.js'],
    bundle: true,
    platform: 'node',
    target: ['node10.4'],
    outdir: '_dist',
    plugins: [
        alias({
            '@': path.resolve(__dirname, '../src'),
        }),
        copy({
            resolveFrom: 'cwd',
            assets: {
                from: ['./types/*'],
                to: ['./_dist'],
            },
        }),
    ],
})
