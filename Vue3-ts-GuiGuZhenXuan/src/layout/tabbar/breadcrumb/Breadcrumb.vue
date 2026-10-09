<template>
  <div class="bar-left">
    <!-- 折叠按钮增加 hover 效果 -->
    <el-icon class="collapse-btn" :size="30">
      <component :is="!isfold ? 'Expand' : 'Fold'" @click="changeFold"></component>
    </el-icon>

    <!-- 面包屑垂直居中 -->
    <el-breadcrumb :separator-icon="ArrowRight">
      <!-- 要动态生成面包屑 -->
      <el-breadcrumb-item
        v-for="(item, index) in route.matched"
        :key="index"
        v-show="item.meta?.title"
        :to="{ path: item.path }"
      >
        <el-icon>
          <component :is="item.meta?.icon"></component>
        </el-icon>
        <span style="margin: 0 5px; vertical-align: top">{{ item.meta?.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import useLayoutSettingStore from '@/stores/modules/layout'
import { ArrowRight } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
const route = useRoute()
// console.log(route.matched)

defineOptions({
  name: 'Breadcrumb',
})

const layoutSettingStore = useLayoutSettingStore()
const { isfold } = storeToRefs(layoutSettingStore)

const changeFold = () => {
  isfold.value = !isfold.value
}
</script>

<style scoped lang="scss">
.bar-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .collapse-btn {
    cursor: pointer;
    color: #606266;
    transition: all 0.3s ease;
    padding: 6px;
    border-radius: 6px;

    &:hover {
      color: #409eff;
      background-color: rgba(64, 158, 255, 0.08);
    }

    span {
      vertical-align: top;
    }
  }

  // 修正面包屑垂直对齐
  :deep(.el-breadcrumb) {
    line-height: 1;
  }
}
</style>
