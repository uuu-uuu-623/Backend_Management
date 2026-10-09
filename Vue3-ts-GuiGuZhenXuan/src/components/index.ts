// 这是用于 注册全局组件 的自定义插件

// 引入要注册成全局的组件
import ButtonPermission from './ButtonPermission/ButtonPermission.vue'
import Category from './Category/Category.vue'
import SvgIcon from './SvgIcon/SvgIcon.vue'

// 需要从 @element-plus/icons-vue 中导入所有图标并进行全局注册。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入类型 App, Plugin
import type { App, Plugin, Component } from 'vue'

// 把要注册的组件放在一个对象里面 方便统一注册
const allGlobalComponents = { SvgIcon, Category, ButtonPermission }

// 1. 定义一个类型守卫函数
function isKey<T extends object>(key: string | number | symbol, obj: T): key is keyof T {
  return key in obj
}

// 注册全局组件
const GlobalComponentsPlugin: Plugin = {
  install(app: App, options?) {
    // 如果要注册成全局组件的组件有很多 那么我们就要使用 Object.keys 来统一注册
    Object.keys(allGlobalComponents).forEach((key) => {
      // 2. 只有在确认 key 合法时，才进行注册
      if (isKey(key, allGlobalComponents)) {
        app.component(key, allGlobalComponents[key])
      }
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}

export default GlobalComponentsPlugin
