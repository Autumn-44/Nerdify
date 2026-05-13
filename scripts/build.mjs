import { build } from 'vite'
import viteConfig from './viteConfig.mjs'

await build({
  ...viteConfig,
})
