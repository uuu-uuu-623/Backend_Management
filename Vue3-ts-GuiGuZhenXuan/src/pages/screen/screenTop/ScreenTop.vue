<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="ToHome">首页</span>
    </div>
    <div class="center">
      <h2>智慧旅游可视化大数据平台</h2>
    </div>
    <div class="right">
      <span class="report">统计报告</span>
      <span class="currentTime">当前时间: {{ curTime }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 引入时间 dayjs库
import dayjs from 'dayjs'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'ScreenTop',
})

const router = useRouter()
// 正确声明定时器变量类型，初始值为 null
let timer: ReturnType<typeof setInterval> | null = null
// 设置 当前时间
const curTime = ref<string>(dayjs().format('YY年MM月DD日 HH:mm:ss'))

onMounted(() => {
  curTime.value = dayjs().format('YY年MM月DD日 HH:mm:ss')
  timer = setInterval(() => {
    curTime.value = dayjs().format('YY年MM月DD日 HH:mm:ss')
  }, 1000)
})

const ToHome = () => {
  router.push('/home')
}

onBeforeUnmount(() => {
  // 4. 安全清理，防止空指针
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped lang="scss">
.top {
  display: flex;
  width: 100%;
  height: 40px;

  .left {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    background: url(../images/dataScreen-header-left-bg.png) no-repeat center/cover;

    .lbtn {
      width: 150px;
      height: 40px;
      background: url(../images/dataScreen-header-btn-bg-l.png) no-repeat center/cover;
      color: #29fcff;
      font-size: 20px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
  }
  .center {
    flex: 2;
    height: 74px;
    background: url(../images/dataScreen-header-center-bg.png) no-repeat center/cover;
    text-align: center;
    line-height: 74px;
    font-size: 25px;
    color: #29fcff;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: start;
    gap: 20px;
    background: url(../images/dataScreen-header-right-bg.png) no-repeat center/cover;
    text-align: center;

    .report {
      width: 150px;
      height: 40px;
      background: url(../images/dataScreen-header-btn-bg-r.png) no-repeat center/cover;
      color: #29fcff;
      font-size: 20px;
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }

    .currentTime {
      color: #29fcff;
      font-size: 20px;
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>
