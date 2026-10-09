// 本文件用于路由鉴权 某一个路由在什么角色可以被访问 什么角色不可以被访问
import topbar from 'topbar' //进度条
import router from './router'
// 引入用户相关仓库 通过token 判断用户是否登陆成功
import useUserStore from './stores/modules/user'
// 引入三级分类相关仓库
import useCategoryStore from '@/stores/modules/category'
import { logo } from './setting'

// 路由守卫 是项目中任意路由切换会触发的钩子
// 全局前置守卫 - 访问路由之前

router.beforeEach(async (to, from) => {
  document.title = `${logo.title}-${to.meta?.title}`
  topbar.show()
  const userStore = useUserStore()
  const token = userStore.token
  const username = userStore.userInfo.username
  // ========== 1. 分类重置逻辑(只有从"商品模块"跳到"非商品模块"时才重置) ==========
  const isProductModule = (path: string) => path.startsWith('/product')
  const categoryStore = useCategoryStore()
  // 只有从"商品模块"跳到"非商品模块"时才重置
  if (isProductModule(from.path) && !isProductModule(to.path)) {
    // categoryStore.$reset() //因为组合式不支持$reset 重置仓库方法
    // 所以要在仓库中先写好 重置的方法 再调用
    categoryStore.resetCategory()
  }

  // 如果是从商品管理内部 含有全局三级分类组件间 切换 那就重置 因为做了持久化处理而且是全局组件 容易出错
  if (to.meta?.needResetCategory && from.meta?.needResetCategory) {
    categoryStore.resetCategory()
  }

  // ========== 2. 鉴权逻辑(token) ==========
  if (token) {
    // 存在token 登陆成功
    // 登陆成功后 不可以访问登录页
    if (to.path === '/login') {
      return { path: '/home' }
    } else {
      // 访问其他页面时

      //  用 username 判断动态路由是否已加载
      //  - 刷新后:pinia 内存态 username 为空 → 触发重新加载
      //  - 登出后:userLogout 把 username 清空 → 下次登录重新加载
      //  - token 持久化在 localStorage, username不持久化,两者刚好互补
      //  注意:不能用 hasRoute('Any') 判断,因为兜底路由已改为静态注册,永远存在
      if (!username) {
        // 没有用户信息 发请求获取
        try {
          await userStore.GetuserInfo() // 内部 addRoute 动态路由
          // 防御性检查：确保用户信息真正加载成功

          // 获取用户信息成功之后 会渲染用户的菜单权限
          // 如果用户要访问的是动态路由 则会导致 动态路由还未渲染完毕 就访问了 就会出现白屏
          // 在 beforeEach 守卫执行时，Vue Router 已经基于旧的路由表（此时只有静态路由）解析了当前的 URL。
          // 所以这里必须 强制路由器使用刚刚动态添加的新路由表，
          // 对当前 URL 重新进行一次匹配和导航。
          // 一定要 replace 重导航("静默替换")
          // 只要你在守卫中执行了 addRoute，就必须紧跟一个带 replace: true 的重导航。这两步是绑定操作，缺一不可。
          // 注意:不能用 { ...to }，展开的 to 里残留着初始解析失败的 name/matched，
          // vue-router 会按旧 name 匹配，导致有权限也跳 404。必须按 fullPath 重新解析。
          return { path: to.fullPath, replace: true } // 用新路由表重新匹配当前 URL
        } catch (error) {
          // token失效的时候 即获取不到用户信息 触发catch
          await userStore.userLogout()
          return { path: '/login', query: { redirect: to.fullPath } }
        }
      }
      return true
    }
  } else {
    // 没有登陆 无token
    // 只可以访问登录页 - 拦截
    if (to.path === '/login') {
      // 访问的是登录页
      return true
    } else {
      // 访问的不是登录页
      return { path: '/login', query: { redirect: to.fullPath } } //登录成功之后去哪
    }
  }
})

// 全局后置守卫 - 访问路由之后
router.afterEach(async (to, from) => {
  topbar.hide()
})
