const fs = require('fs')
const path = require('path')

const esbuild = require('esbuild')
const alias = require('esbuild-plugin-path-alias')
const { copy } = require('esbuild-plugin-copy')

const stencil = () => {
    return {
        name: 'stencil',
        setup(build) {
            build.onResolve({ filter: /\.stencil$/ }, args => {
                return {
                    path: path.resolve(args.resolveDir, args.path),
                    namespace: 'stencil',
                }
            })
            build.onLoad({ filter: /.*/, namespace: 'stencil' }, args => {
                const result = fs.readFileSync(args.path, 'utf-8')

                return {
                    contents: result,
                    loader: 'text',
                }
            })
        },
    }
}

esbuild.build({
    entryPoints: ['src/index.js', 'src/temp.js'],
    bundle: true,
    platform: 'node',
    target: ['node10.4'],
    outdir: '_dist',
    plugins: [
        stencil(),
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
