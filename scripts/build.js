const path = require('path')

const esbuild = require('esbuild')
const alias = require('esbuild-plugin-path-alias')

esbuild.build({
    entryPoints: ['src/main.js'],
    bundle: true,
    platform: 'node',
    target: ['node10.4'],
    outfile: '_dist/main.js',
    plugins: [
        alias({
            '@': path.resolve(__dirname, '../src'),
        }),
    ],
})
