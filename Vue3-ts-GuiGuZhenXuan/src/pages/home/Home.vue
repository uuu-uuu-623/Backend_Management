<template>
  <div v-loading="loading" element-loading-text="加载中...">
    <el-card>
      <div class="box">
        <div>
          <el-image
            v-if="userInfo.avatar"
            :src="userInfo.avatar"
            class="avater"
            fit="fill"
          ></el-image>
          <el-empty v-else description="暂无头像" :image-size="80" class="avater" />
        </div>
        <div>
          <h2>{{ timeMessage }}, {{ userInfo.username }}</h2>
          <h3 style="margin-top: 10px; color: #ccc">{{ logo.title }}</h3>
        </div>
      </div>
    </el-card>
    <div class="homeFooter"><SvgIcon name="welcome" width="500px" height="500"></SvgIcon></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// 引入用户信息相关仓库
import useUserStore from '@/stores/modules/user'
// 引入pinia的storeToRefs函数
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { getLoginTime } from '@/utils/Time'
import { logo } from '@/setting'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'

defineOptions({ name: 'Home' })
const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

// 该页面 的加载状态
const loading = ref(false)
// 获取时间信息
const timeMessage = getLoginTime()

// 首页挂载之后 携带token 向后台请求获取用户信息
onMounted(async () => {
  // 已有用户信息则跳过，避免与路由守卫重复请求
  if (userInfo.value.username) return

  loading.value = true
  try {
    await userStore.GetuserInfo()
  } catch (error) {
    ElMessage.error('请求错误,请重试')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;

  .avater {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}

.homeFooter {
  display: flex;
  justify-content: center;
}

:deep(.el-empty) {
  padding: 0;
  margin: 0;
}
</style>
