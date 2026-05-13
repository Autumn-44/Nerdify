import { createReadStream, existsSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist', import.meta.url))
const port = 5173

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
}

createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`)
  const requestedPath = decodeURIComponent(url.pathname).replace(/^\/+/, '')
  const filePath = join(root, requestedPath || 'index.html')
  const resolvedPath = existsSync(filePath) ? filePath : join(root, 'index.html')
  const extension = extname(resolvedPath)

  response.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
  })

  createReadStream(resolvedPath).pipe(response)
}).listen(port, '127.0.0.1', () => {
  console.log(`Nerdify is running at http://127.0.0.1:${port}/`)
})
