import karma from 'karma'
import { rollup } from 'rollup'
import path from 'path'
import fs from 'fs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const karmaConfigPath = path.resolve('karma.config.cjs')
const karmaServer = new karma.Server({
  configFile: karmaConfigPath
})

const buildDirectory = path.resolve('build')

async function build () {
  console.clear()
  console.log('Building...')
  if (fs.existsSync(buildDirectory)) fs.rmSync(buildDirectory, { recursive: true })

  const inputOption = {
    input: path.resolve('src/index.js'),
    plugins: [
      nodeResolve(),
      commonjs()
    ],
    onwarn (warning) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') return
      throw new Error(warning.message)
    }
  }
  const outputOption = {
    dir: buildDirectory,
    format: 'esm',
    sourcemap: true
  }
  const bundle = await rollup(inputOption)
  await bundle.write(outputOption)
}

build()
  .then(() => {
    console.log('Build complete')
    karmaServer.start()
    fs.watch(path.resolve('src'), { recursive: true }, async e => {
      if (e !== 'change') return
      await build()
      await karmaServer.refreshFiles()
    })
  })
