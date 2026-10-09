<template>
  <CardSlot title="年度游客量对比">
    <template #chart>
      <div class="yearBox" ref="yearChart"></div>
    </template>
  </CardSlot>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CardSlot from '../component/CardSlot.vue'
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'

defineOptions({
  name: 'Year',
})

const yearChart = ref<HTMLDivElement | null>(null)
let mycharts: EChartsType | null = null

/* =================== 数据 =================== */
// ✅ 横轴：12 个月
const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

// ✅ 三条年度游客量曲线（单位：万人）
const visitors2024 = [12.5, 15.2, 28.6, 42.3, 55.8, 61.2, 78.5, 82.1, 58.6, 48.3, 26.5, 18.2]
const visitors2023 = [8.3, 10.6, 20.4, 33.5, 45.2, 52.8, 68.3, 71.5, 48.2, 38.6, 20.1, 13.5]
const visitors2022 = [5.2, 6.8, 12.5, 18.6, 28.3, 35.2, 48.6, 52.3, 32.5, 25.8, 13.2, 8.6]

/* =================== 主题色定义 =================== */
const line2024 = {
  line: '#04BFB6',
  grad1: 'rgba(4,191,182,0.4)',
  grad2: 'rgba(4,191,182,0)',
}
const line2023 = {
  line: '#FFA500',
  grad1: 'rgba(255,165,0,0.4)',
  grad2: 'rgba(255,215,0,0)',
}
const line2022 = {
  line: '#1E90FF',
  grad1: 'rgba(30,144,255,0.4)',
  grad2: 'rgba(30,144,255,0)',
}

/* 封装渐变，避免三处重复写 */
function areaGradient(grad1: string, grad2: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: grad1 },
      { offset: 1, color: grad2 },
    ],
  }
}

/* =================== 图表配置 =================== */
const option: EChartsOption = {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0,12,39,0.92)',
    borderColor: 'rgba(255,255,255,0.15)',
    textStyle: { color: '#fff', fontSize: 13 },
    axisPointer: {
      type: 'line',
      lineStyle: { color: 'rgba(255,255,255,0.25)', type: 'dashed' },
    },
    valueFormatter: (v) => `${Number(v).toFixed(1)} 万人`,
  },
  legend: {
    bottom: 0,
    itemWidth: 14,
    itemHeight: 8,
    itemGap: 18,
    icon: 'roundRect',
    textStyle: { color: '#4E5969', fontSize: 12 },
  },
  grid: {
    top: '12%',
    left: '8%',
    right: '6%',
    bottom: '18%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: months,
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#E2DEDE' } },
    axisTick: { show: false },
    axisLabel: { color: '#4E5969', margin: 12 },
  },
  yAxis: {
    type: 'value',
    name: '万人',
    nameTextStyle: { color: '#4E5969', padding: [0, 0, 4, 0] },
    position: 'left',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#4E5969', margin: 10 },
    splitLine: {
      lineStyle: {
        color: '#E2DEDE',
        width: 1,
        type: 'dashed',
      },
    },
  },
  series: [
    {
      name: '2024年',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: visitors2024,
      lineStyle: { width: 2 },
      itemStyle: { color: line2024.line },
      areaStyle: { color: areaGradient(line2024.grad1, line2024.grad2) },
    },
    {
      name: '2023年',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: visitors2023,
      lineStyle: { width: 2 },
      itemStyle: { color: line2023.line },
      areaStyle: { color: areaGradient(line2023.grad1, line2023.grad2) },
    },
    {
      name: '2022年',
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: visitors2022,
      lineStyle: { width: 2 },
      itemStyle: { color: line2022.line },
      areaStyle: { color: areaGradient(line2022.grad1, line2022.grad2) },
    },
  ],
  animationDuration: 1200,
  animationEasing: 'cubicOut',
}

onMounted(() => {
  if (!yearChart.value) return
  mycharts = echarts.init(yearChart.value)
  mycharts.setOption(option)
})

onBeforeUnmount(() => {
  mycharts?.dispose()
  mycharts = null
})
</script>

<style scoped lang="scss">
.yearBox {
  width: 100%;
  height: 100%;
}
</style>
