<template>
  <CardSlot title="年龄比例">
    <template #chart>
      <div class="box"></div>
      <div class="age-rate" ref="chartRef"></div>
    </template>
  </CardSlot>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CardSlot from '../component/CardSlot.vue'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'

defineOptions({
  name: 'Age',
})

const chartRef = ref<HTMLDivElement>()
const mycharts = ref<EChartsType>()
const option: EChartsOption = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: '20%',
    right: 'right',
    textStyle: {
      color: '#fff',
      fontSize: 17,
    },
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: false,
        position: 'center',
      },

      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
    },
  ],
}

onMounted(() => {
  if (!chartRef.value) return
  mycharts.value = echarts.init(chartRef.value)
  mycharts.value.setOption(option)
})

onBeforeUnmount(() => {
  mycharts.value?.dispose()
})
</script>

<style scoped lang="scss">
.age-rate {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
