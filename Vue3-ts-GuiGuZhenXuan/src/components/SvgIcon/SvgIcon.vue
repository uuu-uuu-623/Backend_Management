<template>
  <!-- 测试svg -->
  <svg :style="{ width, height }">
    <use :xlink:href="icon" :fill="color"></use>
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({
  name: 'SvgIcon',
})

// 接受父组件传递的参数 - 用来自定义svg
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: '30px',
  },
  height: {
    type: String,
    default: '30px',
  },
  color: {
    type: String,
    default: '#000',
  },
})

const icon = computed(() => {
  return `#icon-${props.name}`
})
</script>

<style scoped>
svg {
  fill: currentColor;
}
</style>
