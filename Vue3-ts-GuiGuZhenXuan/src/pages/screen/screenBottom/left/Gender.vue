<template>
  <CardSlot title="男女比例">
    <template #chart>
      <div class="box">
        <div class="sex-img">
          <div class="man-bg">
            <span>男士</span>
            <div class="man"></div>
            <span class="strong">58%</span>
          </div>
          <div class="woman-bg">
            <span>女士</span>
            <div class="woman"></div>
            <span class="strong">42%</span>
          </div>
        </div>
        <div class="sex-rate" ref="chartRef"></div>
      </div>
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
  name: 'Gender',
})

// 图表 ref标识
const chartRef = ref<HTMLDivElement>()
// 配置项
const option: EChartsOption = {
  xAxis: {
    show: false,
  },
  yAxis: {
    type: 'category',
    show: false,
  },
  series: [
    {
      type: 'bar',
      barWidth: '20px',
      z: 99,
      data: [58],
      itemStyle: {
        color: 'skyblue',
        borderRadius: 20,
      },
    },
    {
      type: 'bar',
      barWidth: '20px',
      data: [100],
      barGap: '-100%',
      itemStyle: {
        color: 'pink',
        borderRadius: 20,
      },
    },
  ],
  animationDuration: 1000,
  animationEasing: 'cubicOut',
}

const mycharts = ref<EChartsType>()

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
.box {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .sex-img {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    padding-top: 30px;
    width: 100%;
    .man-bg,
    .woman-bg {
      width: 120px;
      height: 120px;
      background: url(../../images/man-bg.png) no-repeat center;
      text-align: center;

      span {
        width: 100%;
        color: #fff;
        font-size: 15px;
      }

      .strong {
        position: relative;
        z-index: 100;
        color: #fff;
        font-size: 22px;
        font-weight: 700;
      }

      .man,
      .woman {
        width: 100%;
        height: 100%;
        background: url(../../images/man.png) no-repeat center;
        background-position: 30px 10px;
      }
    }
    .woman-bg {
      background: url(../../images/woman-bg.png) no-repeat center;

      .woman {
        background: url(../../images/woman.png) no-repeat center;
        background-position: 30px 10px;
      }
    }
  }
  .sex-rate {
    flex: 1;
    padding: 20px 0;
  }
}
</style>
