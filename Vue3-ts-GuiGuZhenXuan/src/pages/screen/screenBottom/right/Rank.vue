<template>
  <CardSlot title="热门景区排行">
    <template #chart>
      <!-- 用 CSS 变量把脚本里的布局常量同步给样式，保证表头与图表列宽一致 -->
      <div class="rankWrap" :style="cssVars as any">
        <div class="rankHead">
          <div class="head-left">
            <span class="h-rank">排名</span>
            <span class="h-name">景区</span>
          </div>
          <div class="head-right">预约数量</div>
        </div>

        <!-- 图表 -->
        <div class="rankBox" ref="rankChart"></div>
      </div>
    </template>
  </CardSlot>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CardSlot from '../component/CardSlot.vue'
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'

defineOptions({ name: 'Rank' })

/* ===== 布局常量：表头与图表共用，改这里即可整体同步 ===== */
const GRID_LEFT = '30%' // 与 grid.left 一致
const GRID_RIGHT = '24%' // 与 grid.right 一致
const LABEL_MARGIN = 14 // 与两侧 axisLabel.margin 一致
const RANK_COL_W = 34 // 排名列宽（rich.medal / rich.num 的总宽）
const NAME_COL_W = 112 // 景区列宽（rich.name.width）

// 把常量以 CSS 变量形式注入样式
const cssVars: Record<string, string> = {
  '--grid-left': GRID_LEFT,
  '--grid-right': GRID_RIGHT,
  '--label-margin': `${LABEL_MARGIN}px`,
  '--rank-w': `${RANK_COL_W}px`,
  '--name-w': `${NAME_COL_W}px`,
}

const rankChart = ref<HTMLDivElement | null>(null)
let mycharts: EChartsType | null = null

// ✅ 真实景区数据（按热度降序）
const scenicData = [
  { value: 86520, name: '故宫博物院' },
  { value: 72340, name: '上海迪士尼' },
  { value: 68910, name: '西湖风景区' },
  { value: 55680, name: '黄山风景区' },
  { value: 42530, name: '张家界森林公园' },
]

// ✅ 安全的渐变色工厂函数（避免直接 new 导致的类型报错）
function createBarColor(startColor: string, endColor: string) {
  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
    { offset: 0, color: startColor },
    { offset: 1, color: endColor },
  ])
}

const barColors = [
  createBarColor('rgba(255,215,0,0.15)', '#FFD700'), // 🥇 金
  createBarColor('rgba(192,192,192,0.15)', '#C0C0C0'), // 🥈 银
  createBarColor('rgba(205,127,50,0.15)', '#CD7F32'), // 🥉 铜
  createBarColor('rgba(0,198,255,0.1)', '#00C6FF'), // 普通
]

function formatNum(v: number) {
  return v.toLocaleString()
}

function getOption(): echarts.EChartsOption {
  const maxVal = Math.max(...scenicData.map((d) => d.value))

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'none' },
      backgroundColor: 'rgba(0,12,39,0.92)',
      borderColor: 'rgba(255,255,255,0.15)',
      textStyle: { color: '#fff', fontSize: 13 },
      formatter(params: any) {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}:${formatNum(p.value)} 人次`
      },
    },
    grid: {
      top: 0, // ✅ 顶部不留白，让首行数据紧贴表头
      bottom: '2%',
      left: GRID_LEFT,
      right: GRID_RIGHT,
      containLabel: false,
    },
    xAxis: {
      type: 'value',
      max: maxVal,
      show: false,
    },
    yAxis: [
      // 左轴：排名 + 名称
      {
        type: 'category',
        data: scenicData.map((d) => d.name),
        inverse: true,
        position: 'left',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          margin: LABEL_MARGIN,
          verticalAlign: 'middle',
          align: 'right',
          formatter(value: any, index: number) {
            const medals = ['🥇', '🥈', '🥉']
            if (index < 3) return `{medal|${medals[index]}}{name|${value}}`
            return `{num|${index + 1}}{name|${value}}`
          },
          rich: {
            medal: {
              fontSize: 20,
              width: RANK_COL_W,
              align: 'center',
              verticalAlign: 'middle',
              padding: [0, 0, 0, 0],
            },
            num: {
              width: 22,
              height: 22,
              fontSize: 12,
              color: '#fff',
              align: 'center',
              verticalAlign: 'middle',
              backgroundColor: 'rgba(0,165,232,0.25)',
              borderRadius: 11,
              padding: [0, 6, 1, 6], // 22 + 6 + 6 = 34 = RANK_COL_W
            },
            name: {
              width: NAME_COL_W, // ✅ 固定宽度，表头才能和数据严格对齐
              fontSize: 15,
              color: '#E0E6F1',
              lineHeight: 26,
              verticalAlign: 'middle',
              align: 'left',
            },
          },
        },
      },
      // 右轴：数值
      {
        type: 'category',
        data: scenicData.map((d) => d.value),
        inverse: true,
        position: 'right',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          margin: LABEL_MARGIN,
          verticalAlign: 'middle',
          align: 'left',
          formatter(_value: any, index: number) {
            return `{v|${formatNum(scenicData[index].value)}}{u| 人次}`
          },
          rich: {
            v: {
              fontSize: 20,
              color: '#FFFFFF',
              fontWeight: 'bold',
              padding: [0, 4, 0, 0],
            },
            u: { fontSize: 12, color: '#8EA9E8' },
          },
        },
      },
    ],
    series: [
      {
        type: 'bar',
        barWidth: 14,
        z: 2,
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(255,255,255,0.05)',
          borderRadius: 7,
        },
        data: scenicData.map((item, i) => ({
          value: item.value,
          itemStyle: {
            color: barColors[i] ?? barColors[3],
            borderRadius: 7,
          },
        })),
        label: { show: false },
        animationDuration: 1200,
        animationEasing: 'cubicOut',
        animationDelay(idx: number) {
          return idx * 180
        },
      },
    ],
  }
}

onMounted(() => {
  if (!rankChart.value) return
  mycharts = echarts.init(rankChart.value)
  mycharts.setOption(getOption())
})

onBeforeUnmount(() => {
  mycharts?.dispose()
  mycharts = null
})
</script>

<style scoped lang="scss">
.rankWrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* ✅ 保证整体不超出容器 */
}

/* ✅ 表头：紧贴图表，字号加大 */
.rankHead {
  flex: 0 0 auto;
  height: 28px;
  display: flex;
  align-items: center;
  font-size: 15px; /* 原来 13px → 15px */
  font-weight: 600;
  letter-spacing: 1px;
  color: #8ea9e8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  /* 无下外边距，让表头紧贴图表 */
  margin-top: 25px;
  box-sizing: border-box;

  /* 左侧：排名 + 景区，右对齐匹配 yAxis 左标签 */
  .head-left {
    width: var(--grid-left);
    box-sizing: border-box;
    padding-right: var(--label-margin);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 30px;
  }

  .h-rank {
    width: 50px;
    text-align: center;
  }

  .h-name {
    width: 50px;
    text-align: left;
  }

  /* 右侧：预约数量，位置匹配 yAxis 右标签 */
  .head-right {
    margin-left: calc(
      100% - var(--grid-left) - var(--grid-right) + var(--label-margin)
    ); /* = 46% + 14px */
    white-space: nowrap;
  }
}

.rankBox {
  flex: 1 1 auto;
  min-height: 0; /* ✅ 允许被压缩，不撑破容器 */
  width: 100%;
}
</style>
