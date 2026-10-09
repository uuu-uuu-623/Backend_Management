<template>
  <div class="navTop" :class="{ folded: isfold }">
    <img :src="logo.logo" v-show="logo.isHiddenLogo" alt="硅谷甄选运营平台" />
    <h1 class="title" :class="{ noTitle: isfold ? true : false }">{{ ptitle }}</h1>
  </div>
</template>

<script lang="ts" setup>
import { logo } from '@/setting'
import useLayoutSettingStore from '@/stores/modules/layout'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

defineOptions({
  name: 'Logo',
})

const layoutSettingStore = useLayoutSettingStore()
const { isfold } = storeToRefs(layoutSettingStore)
const ptitle = computed(() => {
  if (isfold.value) return ''
  else return logo.title
})
</script>

<style scoped lang="scss">
.navTop {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 19.9988px;
  flex-wrap: wrap;
  padding: 19.9988px;
  color: #fff;
  &.folded {
    padding: 20px 0px 20px 10px;
    justify-content: center;

    .logo-img {
      width: 28px;
      height: 28px;
    }

    .logo-text {
      opacity: 0;
      transform: translateX(-10px); // 向左滑出 + 淡出
      transition:
        opacity 0.15s ease,
        // 折叠时立即淡出，不延迟
        transform 0.2s ease;
      pointer-events: none; // 隐藏后不可点击
    }
  }

  img {
    flex-shrink: 0;
    width: 30px;
  }

  .title {
    opacity: 1;
    font-size: 20px;
    transform: translateX(0);
    transition:
      opacity 0.2s ease 0.08s,
      // 延迟 0.08s 开始淡入，等容器先动
      transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    &.noTitle {
      width: 0;
      height: 0;
      padding: 0;
      margin: 0;
    }
  }
}
</style>
