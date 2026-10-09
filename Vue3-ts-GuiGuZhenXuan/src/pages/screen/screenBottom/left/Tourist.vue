<template>
  <div class="box">
    <div class="top">
      <div class="left">
        <span>实时游客统计</span>
        <div class="img"></div>
      </div>
      <div class="right">
        <div class="total">
          可预约总数:
          <span>999999</span>
          人
        </div>
      </div>
    </div>
    <div class="number">
      <span v-for="(item, index) in number" :key="index">{{ item }}</span>
    </div>
    <!-- 水球图 -->
    <div class="chart" ref="chartRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts'
// 引入水球图
import 'echarts-liquidfill'
import type { EChartsType } from 'echarts'

defineOptions({
  name: 'Tourist',
})

const number = ref('216908人')

// 水球图的ref标识
const chartRef = ref<HTMLDivElement>()
const mycharts = ref<EChartsType>()

const option = {
  title: {
    text: '72%',
    subtext: '预约量',
    top: 'middle',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold',
    },
    subtextStyle: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 20,
    },
  },
  series: [
    {
      type: 'liquidFill',
      data: [0.72, 0.6, 0.45],
      radius: '80%',
      center: ['50%', '50%'],
      color: ['#5ee4fa', '#3ab0d2', '#2a8ab5'],
      backgroundStyle: {
        color: 'rgba(94, 228, 250, 0.1)',
        borderColor: 'rgba(94, 228, 250, 0.3)',
        borderWidth: 1,
      },
      outline: {
        borderDistance: 0,
        itemStyle: {
          borderColor: '#5ee4fa',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(94, 228, 250, 0.5)',
        },
      },
      label: { show: false }, // 隐藏默认label，用title代替
      waveAnimation: true,
      animationDuration: 2000,
    },
  ],
}

onMounted(() => {
  if (!chartRef.value) return
  mycharts.value = echarts.init(chartRef.value)
  mycharts.value.setOption(option)
})

// 卸载时 销毁echarts
onBeforeUnmount(() => {
  mycharts.value?.dispose()
})
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat center/cover;

  .top {
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #fff;
    font-size: 20px;

    .left {
      .img {
        width: 80px;
        height: 10px;
        margin-top: 3px;
        background: url(../../images/dataScreen-title.png) no-repeat;
      }
    }

    .right {
      display: flex;
      align-items: flex-end;
      padding: 0 10px;
      .total {
        span {
          color: #c46234;
          font-size: 23px;
          font-weight: 700;
        }
      }
    }
  }

  .number {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    padding: 0 20px;
    width: 100%;

    span {
      flex: 1;
      height: 60px;
      background: url(../../images/total.png) no-repeat center/cover;
      color: #5ee4fa;
      font-size: 30px;
      font-weight: 600;
      text-align: center;
      line-height: 60px;
    }
  }

  .chart {
    width: 100%;
    flex: 1; /* 占据剩余所有高度 */
    min-height: 200px; /* 最小保底高度 */
  }
}
</style>
