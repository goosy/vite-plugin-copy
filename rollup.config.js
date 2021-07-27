import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';

const external = [
    'fs/promises',
    'fs',
    'util',
    'url',
];
export default { // main lib
    input: './src/index.js',
    output: [{
        file: pkg.exports['.'],
        format: 'es',
    },{
        file: pkg.exports['./cjs'],
        format: 'cjs',
    }],
    plugins: [
        resolve({
            preferBuiltins: true,
        }), 
    ],
    external,
}