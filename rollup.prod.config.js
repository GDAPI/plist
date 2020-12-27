import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

console.clear()

export default {
  input: 'src/index.js',
  plugins: [
    nodeResolve(),
    commonjs(),
    terser()
  ],
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: true
  }
}
