import { createServer } from 'vite'
import viteConfig from './viteConfig.mjs'

const server = await createServer({
  ...viteConfig,
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})

await server.listen()
server.printUrls()
