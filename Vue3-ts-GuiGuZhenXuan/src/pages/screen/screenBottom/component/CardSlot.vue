<template>
  <div class="card">
    <!-- 标题 -->
    <div class="card-title">
      <span>{{ title }}</span>
      <div class="img"></div>
    </div>
    <!-- echarts 图表 -->
    <div class="card-chart">
      <slot name="chart"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'CardSlot',
})

defineProps({
  title: {
    require: true,
    type: String,
  },
})
</script>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat center/cover;

  .card-title {
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 3px;
    padding: 0px 10px;
    width: 100%;
    color: #fff;
    font-size: 20px;
    .img {
      width: 80px;
      height: 10px;
      background: url(../../images/dataScreen-title.png) no-repeat;
    }
  }

  .card-chart {
    width: 100%;
    flex: 1; /* 占据剩余所有高度 */
    min-height: 200px; /* 最小保底高度 */
  }
}
</style>
