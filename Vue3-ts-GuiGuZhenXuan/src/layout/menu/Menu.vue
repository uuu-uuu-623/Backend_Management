<template>
  <!-- 动态高亮当前路由 -->
  <!-- 开启路由模式，点击菜单自动跳转 --- index作为path -->
  <!-- background-color="#00152b"
    text-color="#eee"
    active-text-color="" -->
  <el-menu
    :default-active="activeMenu"
    :default-openeds="isfold ? [] : openMenus"
    :collapse="isfold ? true : false"
    :collapse-transition="false"
    class="el-menu-vertical-demo"
    :background-color="'var(--aside-bg-color, #00152b)'"
    text-color="#eee"
    :active-text-color="'var(--el-color-primary, #409EFF)'"
    router
  >
    <!-- 补充渲染菜单 权限菜单管理 -->
    <template v-for="item in menuList" :key="item.path">
      <!-- 没有子路由的 -->
      <template v-if="!item.children || item.children.length === 0">
        <el-menu-item :index="getFullPath(item.path)">
          <el-icon>
            <component :is="item.meta?.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!-- 有子路由 但是只有一个 -->
      <template v-else-if="item.children.length === 1">
        <el-menu-item :index="getFullPath(item.children[0].path, item.path)">
          <el-icon>
            <component :is="item.children[0].meta?.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ item.children[0].meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>

      <!-- 两个以上的子路由 -->
      <template v-else>
        <el-sub-menu :index="item.path">
          <template #title>
            <el-icon>
              <component :is="item.meta?.icon"></component>
            </el-icon>
            <span>{{ item.meta?.title }}</span>
          </template>
          <!-- 递归调用时，把子路由重新再把上面的逻辑走一遍 和 把当前算好的完整路径传给下一层  -->
          <Menu :menu-routes="item.children" :parent-path="getFullPath(item.path)"></Menu>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import useLayoutSettingStore from '@/stores/modules/layout'
import { storeToRefs } from 'pinia'
import { computed, watch, ref } from 'vue'
import { type RouteRecordRaw, useRoute } from 'vue-router'
const LayoutSettingStore = useLayoutSettingStore()
const { isfold } = storeToRefs(LayoutSettingStore)

defineOptions({ name: 'Menu' })

const props = defineProps({
  menuRoutes: {
    type: Array as () => RouteRecordRaw[],
    required: true,
  },
  parentPath: {
    // 接收父级的完整路径
    type: String,
    default: '',
  },
})

const route = useRoute()
const activeMenu = ref('') //定义一个变量来存储当前激活的路由

// 获取完整的绝对路径
// 因为路由规则中 写的是相对路径
// 而在el-menu配置项中写了router 会把index的值 作为路由跳转 这样会导致出错
// 所以 需要拼接完整路由

const getFullPath = (path: string, pPath?: string) => {
  // 新增的可选父路由 传入
  // 是为了解决当父菜单里面 只有一个子菜单有权限的时候 用于拼接子菜单的路由
  // 如果不这么做  那么会走return 那一步 导致出现  /attr  这种路由 是错误的
  // 但又因为 只有一个子菜单的逻辑 没有递归调用组件 所以需要传入父亲路由
  if (pPath) {
    return `${pPath}/${path}`
  }

  // 如果已经是 / 开头，说明是绝对路径，直接返回
  if (path.startsWith('/')) return path

  // 否则，拼接父级路径
  return props.parentPath ? `${props.parentPath}/${path}` : `/${path}`
}

// 提取当前路由所有父级的完整路径（排除自身）
const openMenus = computed(() => {
  return route.matched
    .filter((record) => record.children && record.children.length > 0)
    .map((record) => record.path)
})

// 过滤掉不需要展示的菜单
const menuList = computed(() => {
  return props.menuRoutes.filter((route) => route.meta?.isShow !== false)
})

// 监听路由的 path 变化，实时更新激活项
watch(
  [() => route.path, () => menuList.value],
  ([path, list]) => {
    // 只有当菜单已加载时才设置激活项
    if (list.length > 0) {
      activeMenu.value = getFullPath(path)
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.el-menu {
  border-right: none; /* 消除侧边栏默认的右侧边框线 */
  h3 {
    font-weight: normal;
  }
  .el-sub-menu {
    .el-menu-item {
      padding-left: 30px;
    }
  }

  //  折叠态下，文字淡出要比容器收缩更快
  &.el-menu--collapse {
    > ul > li .el-menu-item__content span,
    > ul > li .el-sub-menu__title span,
    > .el-menu-item .el-menu-item__content span,
    > .el-sub-menu .el-sub-menu__title span {
      opacity: 0;
      transition: opacity 0.15s ease; // 快速淡出
    }
  }
  //  展开态下，文字淡入要稍微滞后
  &:not(.el-menu--collapse) {
    > ul > li .el-menu-item__content span,
    > ul > li .el-sub-menu__title span,
    > .el-menu-item .el-menu-item__content span,
    > .el-sub-menu .el-sub-menu__title span {
      opacity: 1;
      transition: opacity 0.2s ease 0.08s; // 延迟淡入
    }
  }

  // 暗黑模式完整适配
  html.dark & {
    // hover 状态适配
    :deep(.el-menu-item:hover),
    :deep(.el-sub-menu__title:hover) {
      background-color: var(--el-color-primary-light-9) !important;
    }
  }
}
</style>
