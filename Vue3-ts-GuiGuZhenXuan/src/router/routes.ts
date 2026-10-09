// 配置的常量路由
// 有一个注意点 路由判权 是异步 动态的

import {
  Calendar,
  ChromeFilled,
  DataBoard,
  Goods,
  HomeFilled,
  Lock,
  Menu,
  Orange,
  ShoppingCartFull,
  User,
  UserFilled,
} from '@element-plus/icons-vue'
import { markRaw } from 'vue'

// 所以要交给pinia全局状态管理 来请求后台 从而判断权限

// 常量路由
export const constantRoutes = [
  // layout 菜单路由
  {
    // layout是通用的有路由显示区
    name: 'Layout',
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/home',
    meta: {
      title: '',
      isShow: true,
    },
    children: [
      {
        name: 'home',
        path: 'home',
        component: () => import('@/pages/home/Home.vue'),
        meta: {
          title: '首页',
          isShow: true,
          icon: markRaw(HomeFilled),
        },
      },
    ],
  },
  // 数据大屏
  // 因为骨架不同 所以不写在layout里了
  {
    name: 'Screen',
    path: '/screen',
    component: () => import('@/pages/screen/Screen.vue'),
    meta: {
      title: '数据大屏',
      isShow: true,
      icon: markRaw(DataBoard),
    },
  },
  // 登录
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/pages/login/Login.vue'),
    meta: {
      title: '登录',
      isShow: false,
    },
  },
  // 404
  {
    name: '404',
    path: '/404',
    component: () => import('@/pages/404/index.vue'),
    meta: {
      title: '404',
      isShow: false,
    },
  },
  // 任意路由(兜底 404)
  // 必须放在静态路由里:若等动态路由加载后才 addRoute,
  // 启动时解析未授权路径(如刷新 /acl/role)会触发
  // "No match found for location" 警告。静态注册后永远有兜底。
  {
    name: 'Any',
    path: '/:pathMatch(.*)',
    component: () => import('@/pages/404/index.vue'),
    meta: {
      title: '任意路由',
      isShow: false,
    },
  },
]

// 动态路由
export const asyncRoutes = [
  // 权限管理
  {
    name: 'Acl',
    path: '/acl',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      isShow: true,
      icon: markRaw(Lock),
    },
    children: [
      // 用户管理
      {
        name: 'User',
        path: 'user',
        component: () => import('@/pages/acl/user/User.vue'),
        meta: {
          title: '用户管理',
          isShow: true,
          icon: markRaw(User),
        },
      },
      // 角色管理
      {
        name: 'Role',
        path: 'role',
        component: () => import('@/pages/acl/role/Role.vue'),
        meta: {
          title: '角色管理',
          isShow: true,
          icon: markRaw(UserFilled),
        },
      },
      // 菜单管理
      {
        name: 'Permission',
        path: 'permission',
        component: () => import('@/pages/acl/menu/Menu.vue'),
        meta: {
          title: '菜单管理',
          isShow: true,
          icon: markRaw(Menu),
        },
      },
    ],
  },
  // 商品管理
  {
    name: 'Product',
    path: '/product',
    component: () => import('@/layout/Layout.vue'),
    redirect: '/product/trademark',
    meta: {
      title: '商品管理',
      isShow: true,
      icon: markRaw(Goods),
    },
    children: [
      {
        // 品牌管理
        name: 'Trademark',
        path: 'trademark',
        component: () => import('@/pages/product/trademark/Trademark.vue'),
        meta: {
          title: '品牌管理',
          isShow: true,
          icon: markRaw(ShoppingCartFull),
          needResetCategory: false,
        },
      },
      {
        // 属性管理
        name: 'Attr',
        path: 'attr',
        component: () => import('@/pages/product/attr/Attr.vue'),
        meta: {
          title: '属性管理',
          isShow: true,
          icon: markRaw(ChromeFilled),
          needResetCategory: true,
        },
      },
      {
        // spu管理
        name: 'Spu',
        path: 'spu',
        component: () => import('@/pages/product/spu/Spu.vue'),
        meta: {
          title: 'spu管理',
          isShow: true,
          icon: markRaw(Calendar),
          needResetCategory: true,
        },
      },
      {
        // sku管理
        name: 'Sku',
        path: 'sku',
        component: () => import('@/pages/product/sku/Sku.vue'),
        meta: {
          title: 'sku管理',
          isShow: true,
          icon: markRaw(Orange),
          needResetCategory: true,
        },
      },
    ],
  },
]

