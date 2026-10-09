// https://vite.dev/config/

import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type ConfigEnv, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// vite的自动导入api和组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// elementplus
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// 引用mock 模拟接口
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command, mode }: ConfigEnv) => {
  // 获取各种环境下 对应的环境变量
  // mode - 默认开发环境
  // 根目录的位置 - 默认：process.cwd()
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // svg配置
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: false,
        prodEnabled: false,
        supportTs: true,
        watchFiles: true,
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables" as *;`,
        },
      },
    },
    // 跨域代理
    server: {
      proxy: {
        // 匹配所有以 /api 开头的请求
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE, // 你的真实后端服务器地址
          changeOrigin: true, // 允许跨域，修改请求头中的 Origin
          rewrite: (path) => path.replace(/^\/api/, ''), // 路径重写：去掉 /api 前缀
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
