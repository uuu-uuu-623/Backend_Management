<template>
  <div class="tabbar">
    <!-- 左侧 -->
    <Breadcrumb></Breadcrumb>
    <!-- 右侧 -->
    <Setting></Setting>
  </div>
</template>

<script lang="ts" setup>
import Setting from './setting/Setting.vue'
import Breadcrumb from './breadcrumb/Breadcrumb.vue'

defineOptions({ name: 'Tabbar' })
</script>

<style scoped lang="scss">
.tabbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  position: relative;
  z-index: 10;

  /* ✅ 亮色模式：保留原有淡雅渐变 + 柔和阴影 */
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

  /* ✅ 暗黑模式：自动切换为 EP 深色背景 + 适配阴影 */
  html.dark & {
    background: var(--el-bg-color);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  }
}
</style>
