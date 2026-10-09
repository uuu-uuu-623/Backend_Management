<template>
  <div class="bar-right">
    <!-- 右侧工具按钮组 -->
    <div class="action-group">
      <el-button :icon="Refresh" circle class="action-btn" title="刷新页面" @click="refresh" />
      <el-button :icon="FullScreen" circle class="action-btn" title="全屏" @click="toFullScreen" />
      <el-popover
        placement="bottom"
        title="主题设置"
        :width="200"
        v-model:visible="popVisible"
        trigger="click"
        :hide-after="300"
      >
        <template #default>
          <div style="display: flex; flex-direction: column">
            <div>
              <span style="margin-right: 10px">主题颜色设置:</span>
              <el-color-picker
                v-model="layoutSettingStore.themeColor"
                show-alpha
                :predefine="predefineColors"
                :teleported="false"
              />
            </div>
            <div style="margin: 10px 0">
              <span style="margin-right: 15px">暗黑模式: {{ isDark ? '开' : '关' }}</span>
              <!-- 暗黑模式开: #4c4d4f 黑色-->
              <!--  控制 暗黑模式切换的开关 -->
              <el-switch
                v-model="isDark"
                class="mt-2"
                inline-prompt
                active-icon="Moon"
                inactive-icon="Sunny"
                style="--el-switch-off-color: #409eff; --el-switch-on-color: #4c4d4f"
              />
            </div>
          </div>
        </template>
        <template #reference>
          <el-button :icon="Setting" circle class="action-btn" title="设置" />
        </template>
      </el-popover>
    </div>

    <!-- 用户信息区 -->
    <div class="user-info">
      <el-avatar :src="userInfo.avatar" :size="32" />
      <span class="username">{{ userInfo.username }}</span>
      <el-dropdown trigger="click" :hide-on-click="false">
        <span class="dropdown-trigger">
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="userLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 引入layout相关仓库
import useLayoutSettingStore from '@/stores/modules/layout'
// 引入用户相关仓库
import useUserStore from '@/stores/modules/user'
// 引入图标
import { FullScreen, Refresh, Setting } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'
// 引入路由
import { useRouter, useRoute } from 'vue-router'
// 引入topbar
import topbar from 'topbar'

// 路由相关
const router = useRouter()
const route = useRoute()

defineOptions({
  name: 'Setting',
})

// layout组件 相关仓库
const layoutSettingStore = useLayoutSettingStore()
const { isClickRefresh, isDark } = storeToRefs(layoutSettingStore)
// 获取用户个人信息
const UserStore = useUserStore()
const { userInfo } = storeToRefs(UserStore)

// 控制气泡弹出框的 显示
const popVisible = ref(false)

// 颜色选择器 预选颜色
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

//  监听暗黑模式变化，实时预览 + 自动持久化
watch(
  () => isDark.value,
  (val) => {
    document.documentElement.className = val ? 'dark' : ''
    localStorage.setItem('APP_DARK_MODE', String(val))
  },
)

// ✅ 监听主题色变化，实时预览 + 自动持久化
watch(
  () => layoutSettingStore.themeColor,
  (val) => {
    document.documentElement.style.setProperty('--el-color-primary', val)
    localStorage.setItem('APP_THEME_COLOR', val)
  },
)

// 挂载
onMounted(async () => {
  // 初始化时应用已持久化的主题
  layoutSettingStore.applyTheme()
  try {
    await UserStore.GetuserInfo()
  } catch (error) {
    console.error('用户信息获取失败:', error)
  }
})

// 刷新功能
const refresh = () => {
  topbar.show()
  isClickRefresh.value = !isClickRefresh.value
  topbar.hide()
}

// 全屏功能
const toFullScreen = () => {
  // 使用原生Dom 的元素来实现全屏功能
  // console.log(document.fullscreenElement)
  // document.fullscreenElement -- 是否为全屏状态 是为true 不是为null
  let isFull = document.fullscreenElement
  if (isFull === null) {
    // 全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}

// 退出登录功能
const userLogout = async () => {
  try {
    const res = await UserStore.userLogout()
    if (res === 'ok') {
      // 退出登录后 跳转到登录页 并记录下用户退出登陆前的路径信息 方便后续跳转
      await router.push({ path: '/login', query: { redirect: route.path } })
    }
  } catch (error) {
    console.error('用户登录退出失败:', error)
  }
}
</script>

<style scoped lang="scss">
.bar-right {
  display: flex;
  align-items: center;
  gap: 20px;

  .action-group {
    display: flex;
    align-items: center;
    gap: 8px;

    .action-btn {
      border: none;
      background: transparent;
      color: #606266;
      transition: all 0.3s ease;

      &:hover {
        color: #409eff;
        background-color: rgba(64, 158, 255, 0.08);
      }
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 20px;
    border-left: 1px solid #ebeef5; // 分割线增强区域感

    .username {
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      white-space: nowrap;
    }

    .dropdown-trigger {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #909399;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        color: #409eff;
        background-color: rgba(64, 158, 255, 0.08);
      }
    }
  }
}
</style>
