<template>
  <CardSlot title="未来7天游客数量趋势图">
    <template #chart>
      <div class="lineBox" ref="lineChart"></div>
    </template>
  </CardSlot>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'
import CardSlot from '../component/CardSlot.vue'

defineOptions({
  name: 'Line',
})

const lineChart = ref<HTMLDivElement>()
const mychatrs = ref<EChartsType>()
const option: EChartsOption = {
  // 1. 增加交互提示与图例
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#eee',
    borderWidth: 1,
    textStyle: { color: '#333', fontSize: 13 },
    axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
  },
  grid: {
    top: 40, // ⚠️ 原 top:0 会导致标题/标签被裁切
    left: 12,
    right: 20,
    bottom: 8,
    containLabel: true, // 自动计算Y轴标签宽度，防止溢出
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    boundaryGap: false, // 让折线起点紧贴Y轴
    axisLine: { lineStyle: { color: '#e0e0e0' } },
    axisTick: { show: false }, // 去掉X轴小刻度线
    axisLabel: { color: '#526da7', fontSize: 14 },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed', // 虚线网格更轻盈
        color: '#f0f0f0',
      },
    },
    axisLine: { show: false }, // 隐藏Y轴线
    axisTick: { show: false },
    axisLabel: { color: '#526da7', fontSize: 14 },
  },
  series: [
    {
      name: '访问量',
      data: [150, 182, 167, 214, 618, 940, 670],
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: false, // 默认不显示点，hover时显示
      emphasis: { focus: 'series', itemStyle: { borderWidth: 3 } },
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' },
        ]),
      },
      itemStyle: {
        color: '#667eea',
        borderColor: '#fff',
        borderWidth: 2,
      },
      // ⭐ 面积渐变填充（提升视觉重量感）
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.35)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.02)' },
        ]),
      },
    },
  ],
}

onMounted(() => {
  if (!lineChart.value) return
  mychatrs.value = echarts.init(lineChart.value)
  mychatrs.value.setOption(option)
})
onBeforeUnmount(() => {
  mychatrs.value?.dispose()
})
</script>

<style scoped lang="scss">
.lineBox {
  width: 100%;
  height: 100%;
}
</style>
