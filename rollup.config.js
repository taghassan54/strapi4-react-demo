const babel = require('@rollup/plugin-babel');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports= {
    input: 'src/index.ts',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs',
        exports: 'auto'
    },
    plugins: [
        resolve({
            extensions: ['.js', '.ts']
        }),
        commonjs(),
        babel({ babelHelpers: 'bundled' })
    ],
    external: ['react', 'react-dom']
};
