import { preview } from 'vite'
import viteConfig from './viteConfig.mjs'

const server = await preview({
  ...viteConfig,
  preview: {
    host: '127.0.0.1',
    port: 5173,
  },
})

server.printUrls()
