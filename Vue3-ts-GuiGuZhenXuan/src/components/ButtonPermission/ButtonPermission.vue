<!-- 用于 按钮权限管理的 全局组件 -->
<template>
  <slot v-if="hasButtonPermission"></slot>
  <el-tooltip content="暂无权限,请联系管理员" v-else>
    <slot name="fallback"></slot>
  </el-tooltip>
</template>

<script lang="ts" setup>
import useUserStore from '@/stores/modules/user'
import { computed } from 'vue'

defineOptions({
  name: 'ButtonPermission',
})

const p = defineProps<{
  value: string
}>()

const userStore = useUserStore()

const hasButtonPermission = computed(() => {
  // 1. 必须在 computed 内部访问 store，保证响应式追踪不丢失
  // 用于存储按钮权限
  const buttons = userStore.userInfo.buttons || []
  return buttons.includes(p.value)
})
</script>

<style scoped></style>
