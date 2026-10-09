<template>
  <div class="container">
    <div class="screen" ref="screenRef">
      <div class="top">
        <ScreenTop></ScreenTop>
      </div>
      <div class="bottom">
        <div class="left">
          <LeftIndex></LeftIndex>
        </div>
        <div class="center">
          <CenterIndex></CenterIndex>
        </div>
        <div class="right">
          <RightIndex></RightIndex>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ScreenTop from './screenTop/ScreenTop.vue'
import LeftIndex from './screenBottom/left/LeftIndex.vue'
import CenterIndex from './screenBottom/center/CenterIndex.vue'
import RightIndex from './screenBottom/right/RightIndex.vue'

defineOptions({
  name: 'Screen',
})

// 定义 数据大屏的ref
const screenRef = ref()

// 计算数据大屏 缩放比例
const getScale = () => {
  const w = 1920
  const h = 1080
  const winW = window.innerWidth / w
  const winH = window.innerHeight / h
  const scale = Math.min(winW, winH)
  return scale
}

const updateScreenScale = () => {
  if (!screenRef.value) return
  screenRef.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

onMounted(() => {
  updateScreenScale()
})

// 监听 屏幕视口变化
window.addEventListener('resize', updateScreenScale)

// 组件 卸载时  移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenScale)
})
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat center/cover;
  overflow: hidden;

  .screen {
    position: fixed;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    width: 1920px;
    height: 1080px;

    .top {
      width: 100%;
    }
    .bottom {
      width: 100%;
      display: flex;

      .left,
      .right {
        flex: 1;
        height: 1040px;
      }
      .center {
        flex: 2;
      }
    }
  }
}
</style>
