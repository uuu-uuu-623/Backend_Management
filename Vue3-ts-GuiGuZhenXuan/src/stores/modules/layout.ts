import { defineStore } from 'pinia'
import { ref } from 'vue'

// 这layout 后代组件 用的数据 的小仓库
const useLayoutSettingStore = defineStore('LayoutSetting', () => {
  const isfold = ref(false) //控制菜单折叠or展开

  const isClickRefresh = ref(false) //反应是否点击 刷新按钮键 要刷新页面

  // 暗黑模式主题相关
  // 从 localStorage 读取初始值
  const isDark = ref(localStorage.getItem('APP_DARK_MODE') === 'true')
  const themeColor = ref(localStorage.getItem('APP_THEME_COLOR') || '#409eff')

  // 页面加载时统一应用主题（防止闪烁）
  function applyTheme() {
    document.documentElement.className = isDark.value ? 'dark' : ''
    // 通过 js 改变主题颜色
    document.documentElement.style.setProperty('--el-color-primary', themeColor.value)
  }

  return { isfold, isClickRefresh, isDark, applyTheme, themeColor }
})

export default useLayoutSettingStore
