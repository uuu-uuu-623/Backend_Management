<template>
  <CardSlot title="预约渠道数据统计">
    <template #chart>
      <div class="countBox" ref="countChart"></div>
    </template>
  </CardSlot>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CardSlot from '../component/CardSlot.vue'
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'

defineOptions({
  name: 'Count',
})

const countChart = ref<HTMLDivElement | null>(null)
let mycharts: EChartsType | null = null

/* =================== 数据 =================== */
// ✅ 预约渠道数据（value 为预约量，proportion 为占比）
const PIE_DATA = [
  { name: '官方小程序', value: 22500, proportion: '45%' },
  { name: 'OTA平台', value: 15000, proportion: '30%' },
  { name: '线下窗口', value: 7500, proportion: '15%' },
  { name: '旅行社', value: 5000, proportion: '10%' },
]

const TOTAL = PIE_DATA.reduce((sum, i) => sum + i.value, 0)

const HIDDEN_OPTIONS = {
  normal: { show: false },
  emphasis: { show: false },
}

const BASE_PIE_CONFIG = {
  center: ['23%', '50%'],
  type: 'pie' as const,
  label: HIDDEN_OPTIONS,
  labelLine: HIDDEN_OPTIONS,
}

function formatNum(v: number) {
  return v.toLocaleString()
}

/* =================== 图表配置 =================== */
const option: EChartsOption = {
  backgroundColor: 'transparent',
  title: {
    text: formatNum(TOTAL),
    subtext: '预约总量',
    textStyle: { color: '#FDC200', fontSize: 32, fontWeight: 'bold' },
    subtextStyle: { fontSize: 14, color: '#8EA9E8' },
    textAlign: 'center',
    textVerticalAlign: 'middle',
    left: '23%',
    top: '46%',
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(0,12,39,0.92)',
    borderColor: 'rgba(255,255,255,0.15)',
    textStyle: { color: '#fff', fontSize: 13 },
    formatter: (p: any) => `${p.name}<br/>${formatNum(p.value)} 人（${p.percent}%）`,
  },
  legend: {
    right: 10,
    top: 'center',
    orient: 'vertical',
    itemGap: 25,
    itemWidth: 12,
    itemHeight: 12,
    icon: 'circle',
    textStyle: {
      color: '#f2f2f2',
      fontSize: 13,
      lineHeight: 22,
      rich: {
        // ✅ 三列固定宽度，列与列之间自动对齐
        name: {
          width: 78,
          color: '#f2f2f2',
          fontSize: 13,
        },
        value: {
          width: 56,
          color: '#FDC200',
          fontSize: 13,
          align: 'right',
        },
        percent: {
          width: 46,
          color: '#8EA9E8',
          fontSize: 13,
          align: 'right',
        },
      },
    },
    formatter: (params: string) => {
      const item = PIE_DATA.find((i) => i.name === params)
      if (!item) return params
      // ✅ 单行三列，用 rich 控制对齐
      return `{name|${params}}{value|${formatNum(item.value)}}{percent|${item.proportion}}`
    },
    data: PIE_DATA.map((i) => i.name),
  },
  series: [
    // 主饼图
    {
      ...BASE_PIE_CONFIG,
      color: ['#00C6FF', '#04BFB6', '#FF9200', '#A855F7'],
      radius: ['50%', '60%'],
      padAngle: 4,
      data: PIE_DATA,
    },
    // 内边框1
    {
      ...BASE_PIE_CONFIG,
      silent: true,
      radius: ['30%', '44%'],
      startAngle: -30,
      endAngle: -10,
      data: [{ value: 1, itemStyle: { color: '#0C3D6B' } }],
    },
    // 内边框2
    {
      ...BASE_PIE_CONFIG,
      silent: true,
      radius: ['33%', '41%'],
      data: [{ value: 1, itemStyle: { color: '#0C3D6B' } }],
    },
    // 内边框3
    {
      ...BASE_PIE_CONFIG,
      silent: true,
      radius: ['46%', '48%'],
      data: [{ value: 0, itemStyle: { color: '#0C3D6B' } }],
    },
    // 外边框
    {
      ...BASE_PIE_CONFIG,
      silent: true,
      name: '外边框',
      radius: ['66%', '66%'],
      data: [
        {
          value: 0,
          itemStyle: { borderWidth: 4, borderColor: '#1148B8' },
        },
      ],
    },
    // 刻度盘
    {
      name: '刻度盘',
      type: 'gauge',
      min: 0,
      max: 100,
      radius: '78%',
      center: ['23%', '50%'],
      startAngle: 0,
      endAngle: 360,
      axisLine: { show: false },
      axisTick: {
        show: true,
        lineStyle: { color: '#093B5A', width: 4 },
        length: 26,
        splitNumber: 20,
      },
      silent: true,
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: { show: false },
    },
  ] as EChartsOption['series'],
}

onMounted(() => {
  if (!countChart.value) return
  mycharts = echarts.init(countChart.value)
  mycharts.setOption(option)
})

onBeforeUnmount(() => {
  mycharts?.dispose()
  mycharts = null
})
</script>

<style scoped lang="scss">
.countBox {
  width: 100%;
  height: 100%;
}
</style>
