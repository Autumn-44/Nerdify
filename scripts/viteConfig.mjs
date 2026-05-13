import react from '@vitejs/plugin-react'

export default {
  configFile: false,
  plugins: [react({ jsxRuntime: 'automatic' })],
  esbuild: {
    jsx: 'automatic',
  },
}
