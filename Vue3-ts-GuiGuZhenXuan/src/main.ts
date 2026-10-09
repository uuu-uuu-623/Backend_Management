import { createApp } from 'vue'
// 引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // ① 先引入基础样式
import 'element-plus/theme-chalk/dark/css-vars.css' // ② 再引入暗黑变量（必须在后面）

//@ts-ignore
//让ts忽略
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

//@ts-ignore
import 'virtual:svg-icons-register'
// 引入scss
import '@/styles/index.scss' // ③ 最后才是你的自定义样式

// 引入全局组件的自定义插件
import GlobalComponentsPlugin from './components/index.ts'

import App from './App.vue'
// 引入pinia
import stores from './stores/index.ts'
// 引入路由
import router from './router/index.ts'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
app.use(stores)
app.use(router)
// 成功注册全局组件
app.use(GlobalComponentsPlugin)
// 引入路由鉴权
import './permission.ts'

app.mount('#app')
