import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import javascriptObfuscator from 'rollup-plugin-javascript-obfuscator'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const isProd = process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || env.VITE_BACKEND_URL || 'https://backend.scagerwebsite.uk'

  const devPlugins = []
  if (!isProd) {
    try {
      const devtools = (await import('vite-plugin-vue-devtools')).default
      devPlugins.push(devtools())
    } catch (e) {
      // devtools optional; ignore if not installed
    }
  }

  return {
    base: '/',
    plugins: [
      vue(),
      ViteImageOptimizer({
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 75,
        },
        jpg: {
          quality: 75,
        },
        webp: {
          lossless: true,
        },
      }),
      ...devPlugins,
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      port: 5174,
      host: true,
      // Allow dev server to be accessed via specified hosts
      allowedHosts: ['localhost:8000','localhost:5174','frontend.scagerwebsite.uk'],
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          // Remove verbose proxy logging to avoid exposing URLs
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Ensure browser cookies are forwarded
              const cookies = proxyReq.getHeader('cookie')
              if (cookies) proxyReq.setHeader('cookie', cookies)
            })
            proxy.on('proxyRes', (proxyRes, req, res) => {
              // no-op
            })
            proxy.on('error', (err, req, res) => {
              console.error('⚠ Proxy error:', err.message)
            })
          }
        },
        '/logout': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        },
        // Proxy media to backend so images use same-origin path in dev
        '/media': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router'],
            'utils': ['axios']
          }
        },
        plugins: [
          javascriptObfuscator({
            compact: true,
            controlFlowFlattening: false,
            controlFlowFlatteningThreshold: 0,
            deadCodeInjection: false,
            deadCodeInjectionThreshold: 0,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            renameGlobals: false,
            stringArray: true,
            stringArrayEncoding: [],
            stringArrayThreshold: 0.75,
            transformObjectKeys: false,
            unicodeEscapeSequence: false,
          })
        ]
      }
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }
})
