import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoutes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

// 解决 用户登出时没有移除动态路由，导致权限越权
// 重置路由表：移除所有动态添加的路由，只保留静态路由
// 必须用官方 API removeRoute 逐条删除动态路由。
/**
const constantNames = new Set<string | symbol>(constantRoutes.map((r) => r.name))
export const resetRouter = () => {
  router.getRoutes().forEach((route) => {
    if (route.name && !constantNames.has(route.name)) {
      router.removeRoute(route.name)
    }
  })
}
  */

/** 收集路由（含子路由）的所有 name */
// 递归遍历常量路由配置数组，提取出所有拥有 name 属性的路由名称。
const collectNames = (routes: any[]): (string | symbol)[] => {
  const names: (string | symbol)[] = []
  const walk = (list: any[]) => {
    list.forEach((r) => {
      if (r.name) names.push(r.name)
      //递归遍历 子路由
      if (r.children?.length) walk(r.children)
    })
  }
  walk(routes)
  return names
}

export const resetRouter = () => {
  // 配置 常量路由的白名单
  const constantNames = new Set(collectNames(constantRoutes))

  router.getRoutes().forEach((route) => {
    // 只要常量路由的白名单里没有的 name 就是动态路由 要去掉
    if (route.name && !constantNames.has(route.name)) {
      router.removeRoute(route.name)
    }
  })
}

export default router
