import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'

// Re-use the production security headers from vercel.json for `vite preview`,
// so the end-to-end tests run under the same Content-Security-Policy as Vercel.
type VercelConfig = { headers: { headers: { key: string; value: string }[] }[] }
const vercel = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as VercelConfig
const securityHeaders = Object.fromEntries(vercel.headers[0].headers.map((h) => [h.key, h.value]))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: { headers: securityHeaders },
})
