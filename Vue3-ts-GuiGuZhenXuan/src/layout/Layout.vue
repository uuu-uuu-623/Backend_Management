<template>
  <div class="common-layout">
    <!-- 最外层容器，占满全屏并防止整体出现滚动条 -->
    <el-container class="layout-container">
      <!-- 左侧边栏区域 -->
      <el-aside width="20%" class="layout-aside" :class="{ folded: isfold ? true : false }">
        <Logo></Logo>
        <!-- 使用了element plus 的滚动条 不用去在意浏览器兼容问题 -->
        <!-- 滚动条 - 展示菜单 -->
        <el-scrollbar>
          <!-- 菜单组件 -->
          <!-- 把后台返回的 菜单给到menu组件 -->
          <Menu :menuRoutes="menuRoutes"></Menu>
        </el-scrollbar>
      </el-aside>

      <!-- 右侧垂直排列的容器：Header + Main + Footer -->
      <el-container direction="vertical" class="right-container">
        <!-- 顶部导航栏 (注意: Header 不需要设置 width) -->
        <el-header height="60px" class="layout-header" style="padding: 0">
          <Tabbar></Tabbar>
        </el-header>

        <!-- 主内容区域 (使用 flex: 1 自适应剩余高度，并允许内部滚动) -->
        <el-scrollbar class="flex-1 main-scrollbar">
          <div class="scroll-content">
            <el-main class="routingSwitching">
              <!-- 使用了element plus 的滚动条 不用去在意浏览器兼容问题 -->

              <!-- 
              有两种方式
                1. 包裹你的 router-view 
                2. 封装成一个组件 -- 可以方便做 过渡动画
            -->
              <Main></Main>
            </el-main>
            <!-- 底部版权/信息区 -->
            <el-footer height="50px" class="layout-footer">硅谷甄选</el-footer>
          </div>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Logo from './logo/Logo.vue'
import Menu from './menu/Menu.vue'
import Main from './main/Main.vue'
import Tabbar from './tabbar/Tabbar.vue'
import useUserStore from '@/stores/modules/user.ts'
import useLayoutSettingStore from '@/stores/modules/layout.ts'
import { storeToRefs } from 'pinia'
const layoutSettingStore = useLayoutSettingStore()
const { isfold } = storeToRefs(layoutSettingStore)

defineOptions({
  name: 'Layout',
})

const { menuRoutes } = useUserStore()
</script>

<style scoped lang="scss">
.common-layout {
  width: 100%;
  height: 100vh;

  .layout-container {
    height: 100%;
    overflow: hidden;

    .layout-aside {
      width: $aside-width;
      // ✅ 侧边栏背景：浅色模式用自定义变量，暗黑模式自动跟随 EP
      background-color: var(--aside-bg-color, #00152b);
      transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;

      &.folded {
        width: $AfterFoldAside-width;
      }
    }

    .right-container {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;

      .layout-header {
        height: $header-height;
        // ✅ 顶栏背景 & 文字颜色
        background-color: var(--el-bg-color);
        color: var(--el-text-color-primary);
        text-align: center;
        line-height: $header-height;
        flex-shrink: 0;
      }

      .flex-1 {
        flex: 1;
        min-height: 0;
      }

      :deep(.main-scrollbar) {
        .el-scrollbar__wrap,
        .el-scrollbar__view {
          height: 100%;
        }
      }

      .scroll-content {
        min-height: 100%;
        display: flex;
        flex-direction: column;

        > * {
          flex-shrink: 0;
        }
      }

      .routingSwitching {
        flex: 1;
        padding: 20px;
        // ✅ 内容区背景色
        background-color: var(--el-fill-color-lighter);
        min-height: 0;
      }

      .layout-footer {
        height: $footer-height;
        // ✅ Footer 与 Header 保持一致
        background-color: var(--el-bg-color);
        color: var(--el-text-color-primary);
        text-align: center;
        line-height: $footer-height;
        flex-shrink: 0;
      }
    }
  }
}

// ✅ 局部滚动条样式适配暗黑模式
.layout-aside,
.routingSwitching {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--el-text-color-placeholder, rgba(0, 0, 0, 0.1));
    border-radius: 10px;
    // ✅ 边框颜色跟随容器背景，保持"融入感"
    border: 1px solid var(--el-fill-color-lighter, #f0f2f5);
    background-clip: content-box;

    &:hover {
      background-color: var(--el-text-color-secondary, rgba(0, 0, 0, 0.25));
    }
  }
}
</style>
