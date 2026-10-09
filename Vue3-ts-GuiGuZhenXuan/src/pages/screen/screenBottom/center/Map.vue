<template>
  <div class="mapBox" ref="mapChartRef">地图</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'
import map from '@/pages/screen/screenBottom/center/mapJson/map.json'

defineOptions({
  name: 'Map',
})

const mapChartRef = ref<HTMLDivElement | null>(null)
const mycharts = ref<EChartsType>()
// ⭐ 定义多条飞线数据：每条线只有 [起点, 终点]
const linesData = [
  {
    coords: [
      [116.405285, 39.904989],
      [119.306239, 26.075302],
    ],
  }, // 北京 → 福州
  {
    coords: [
      [116.405285, 39.904989],
      [106.504962, 29.533155],
    ],
  }, // 北京 → 重庆
  {
    coords: [
      [116.405285, 39.904989],
      [117.190182, 39.125596],
    ],
  }, // 北京 → 天津
  {
    coords: [
      [117.000923, 36.675807],
      [114.298572, 30.584355],
    ],
  }, //山东 -> 湖北
  {
    coords: [
      [111.670801, 40.818311],
      [115.892151, 28.676493],
    ], //内蒙古 -> 南昌
  },
  {
    coords: [
      [116.405285, 39.904989],
      [112.982279, 28.19409],
    ], //北京 -> 湖南
  },
  {
    coords: [
      [113.280637, 23.125178],
      [116.405285, 39.904989],
    ], //广东 -> 北京
  },
  {
    coords: [
      [116.405285, 39.904989],
      [108.320004, 22.82402],
    ], //北京-> 广西
  },
  {
    coords: [
      [116.405285, 39.904989],
      [102.712251, 25.040609],
    ], //北京-> 云南
  },
  {
    coords: [
      [116.405285, 39.904989],
      [121.472644, 31.231706],
    ], //北京-> 云南
  },
]

// ⭐ 定义多省份高亮/着色数据
const provinceData = [
  { name: '北京', value: 200 },
  { name: '福建', value: 80 },
  { name: '江西', value: 60 },
  { name: '天津', value: 70 },
  { name: '广东', value: 95 },
  { name: '广西', value: 50 },
  { name: '上海', value: 110 },
  { name: '云南', value: 55 },
  { name: '重庆', value: 78 },
]

// 辅助函数：根据省份名获取中心坐标（实际项目中建议从 GeoJSON properties 中提取）
function getCoordByName(name: string): number[] {
  const coordMap: Record<string, number[]> = {
    北京: [116.405285, 39.904989],
    福建: [119.306239, 26.075302],
    江西: [115.892151, 28.676493],
    天津: [117.190182, 39.125596],
    重庆: [106.504962, 29.533155],
    广东: [113.280637, 23.125178],
    广西: [108.320004, 22.82402],
    云南: [102.712251, 25.040609],
    上海: [121.472644, 31.231706],
  }
  return coordMap[name] || [0, 0]
}

const option: EChartsOption = {
  geo: {
    map: 'china', //中国地图
    roam: true, //鼠标缩放
    top: 30,
    left: 72,
    right: 72,
    label: {
      show: true,
      color: '#fff',
      fontSize: 14,
    },
    itemStyle: {
      color: '#0FA3F0',
      opacity: 0.5,
    },
    emphasis: {
      itemStyle: {
        color: '#11144e',
      },
      label: {
        fontSize: 20,
        color: '#fff',
      },
    },
  },
  series: [
    // ⭐ 飞线系列
    {
      type: 'lines',
      coordinateSystem: 'geo', // ⚠️ 必须指定坐标系为 geo
      data: linesData,
      lineStyle: { color: '#f2a841', width: 3, curveness: 0.2 },
      effect: {
        show: true,
        symbol: 'circle',
        symbolSize: 10,
        color: '#f2a841',
      },
    },
    // ⭐ 散点标记省份位置（配合飞线端点使用）
    {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: provinceData.map((item) => ({
        name: item.name,
        value: [...getCoordByName(item.name), item.value],
      })),
      symbolSize: 12,
      rippleEffect: { brushType: 'stroke', scale: 4 },
      itemStyle: { color: '#f2a841' },
      label: { show: true, position: 'right', formatter: '{b}', color: '#fff' },
    },
  ],
}

onMounted(() => {
  if (!mapChartRef.value) return
  echarts.registerMap('china', map as any)
  mycharts.value = echarts.init(mapChartRef.value)
  mycharts.value.setOption(option)
})

onBeforeUnmount(() => {
  mycharts.value?.dispose()
})
</script>

<style scoped lang="scss">
.mapBox {
  width: 100%;
  height: 100%;
}
</style>
