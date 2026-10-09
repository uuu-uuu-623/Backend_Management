<!-- 用于layout的路由展示router-view -->
<template>
  <!-- 
   路由组件出口位置 
    为什么要封装? -- 可以来做过渡动画 
  -->
  <router-view v-slot="{ Component, route }">
    <transition name="fade">
      <!-- 一开始没搞动画 导致页面刷新了 感觉不出来 -->
      <component :is="Component" :key="route.path" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import useLayoutSettingStore from '@/stores/modules/layout'
import { storeToRefs } from 'pinia'
import { ref, reactive, watch, nextTick } from 'vue'
import { RouterView } from 'vue-router'
const layoutSettingStore = useLayoutSettingStore()
const { isClickRefresh } = storeToRefs(layoutSettingStore)
defineOptions({
  name: 'Main',
})

// dom节点 处于销毁状态 还是 正常状态
let flag = ref(true)

// 监听 isClickRefresh 是否有变化
watch(
  () => isClickRefresh.value,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style scoped lang="scss">
// 在 Main.vue 的 <style scoped> 中添加
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
  transition: all 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
