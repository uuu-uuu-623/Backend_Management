// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import type { LoginForm, LoginResponseData, UserInfoDetail } from '@/api/user/type'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { Get_Token, Set_Token, Remove_Token } from '@/utils/localstorageToken'
// 引入路由 全部组件都可以使用路由 来控制权限
import { constantRoutes, asyncRoutes } from '@/router/routes'
// 引入路由总管理  最后追加 动态路由和任意路由
import router, { resetRouter } from '@/router'
import { ref } from 'vue'

// 根据 用户信息中的路由权限 进行路由鉴权
// 递归路由鉴权函数
// 注意：不能写成 asyncRoutes.filter(item => { ...; return true }) 的形式
// 因为 filter 保留的永远是【原始 item】，回调里修剪过 children 的 cloned 会被直接丢弃，
// 导致父级通过鉴权时它的所有子路由（未被授权的）也一并保留。
// 所以这里用 forEach + push(cloned)，把修剪后的克隆对象收集进结果数组。
const filterAsyncRoutes = (asyncRoutes: any[], userRoutes: string[]): any[] => {
  const result: any[] = []
  asyncRoutes.forEach((item: any) => {
    // 判断有无权限
    const hasPermission = userRoutes.includes(item.name)
    if (!hasPermission) return

    // 逐层浅拷贝 保护原始路由表
    const cloned = { ...item }

    // 处理子路由：如果有 children，进行递归修剪
    if (cloned.children && cloned.children.length > 0) {
      cloned.children = filterAsyncRoutes(cloned.children, userRoutes)
      // 防空壳：子节点被剪光了，父节点也不保留
      if (cloned.children.length === 0) return
    }

    // 通过所有关卡，收集修剪后的克隆对象（而不是原始 item）
    result.push(cloned)
  })
  return result
}

// 小仓库
const useUserStore = defineStore('user', () => {
  // 存储token、获得token
  const token = ref(Get_Token()) //用ref包裹，使其成为响应式变量

  // 存放路由
  const menuRoutes = ref([...constantRoutes])
  const userInfo = ref<{ avatar: string; username: string; buttons: string[] }>({
    avatar: '',
    username: '',
    buttons: [], //按钮权限
  })

  // 标记获取用户信息 加载的状态 避免重复请求
  const loadingGetInfo = ref<boolean>(false)

  // 用户登陆的回调
  const userLogin = async (loginData: LoginForm) => {
    try {
      const res: LoginResponseData = await reqLogin(loginData)

      if (res.data) {
        token.value = res.data
        Set_Token(res.data)
        return res
      }
      return Promise.reject(new Error('登录响应异常：未获取到凭证'))
    } catch (error) {
      // 原样抛出，让 Login.vue 决定用什么方式提示
      return Promise.reject(error)
    }
  }

  // 用户信息获取的回调
  const GetuserInfo = async () => {
    if (!token.value) {
      return
    }

    // 还未获取到的话 直接返回 避免重复请求
    if (loadingGetInfo.value) return

    loadingGetInfo.value = true

    try {
      const userData: UserInfoDetail = await reqUserInfo()
      // console.log(userData)

      if (userData.code === 200 && userData.data.name) {
        userInfo.value = {
          avatar: userData.data.avatar || '',
          username: userData.data.name || '',
          buttons: userData.data.buttons || [],
        }

        // 路由判权函数
        const asyncRoutesArr = filterAsyncRoutes(asyncRoutes, userData.data.routes)
        // 追加用户已有的权限 动态菜单
        // 注意:兜底任意路由 Any 已在 constantRoutes 中静态注册,无需再追加
        menuRoutes.value = [...constantRoutes, ...asyncRoutesArr]

        // 注册动态路由
        asyncRoutesArr.forEach((item: any) => {
          router.addRoute(item)
        })

        return 'ok'
      } else {
        // 接口返回非 200，也要抛出错误，触发守卫的 catch
        throw new Error(userData.message || '获取用户信息失败')
      }
    } catch (error: any) {
      return Promise.reject(new Error(error.message))
    } finally {
      loadingGetInfo.value = false
    }
  }

  // 用户退出登录的回调
  const userLogout = async () => {
    try {
      const res = await reqLogout()
      if (res.code === 200) {
        token.value = ''
        userInfo.value = { avatar: '', username: '', buttons: [] }
        Remove_Token()
        // 关键：清掉所有动态路由
        resetRouter()
        return 'ok'
      }
    } catch (error: any) {
      return Promise.reject(new Error(error.message))
    }
  }

  return { userLogin, token, menuRoutes, userInfo, GetuserInfo, userLogout }
})

export default useUserStore
