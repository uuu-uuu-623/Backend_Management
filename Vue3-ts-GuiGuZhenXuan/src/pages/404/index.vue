<template>
  <!-- 1. 给 el-row 添加全屏类名 -->
  <el-row class="full-viewport">
    <el-col :span="14">
      <div class="error-wrapper">
        <img src="@/assets/images/error_images/404.png" class="full-img" />
      </div>
    </el-col>
    <el-col :span="10">
      <div class="warning-info">
        <h1>你访问的页面不存在!</h1>
        <div class="center">
          <h3>管理员说你不能进入此页面</h3>
          <p>请检查你的访问路径是否正确,或点击下方回到首页</p>
        </div>
        <el-button type="primary" round @click="toHome">返回首页</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
defineOptions({
  name: 'ErrorPage', // 建议改为有意义的名称而非 index
})
const router = useRouter()

const toHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
/* 3. 直接使用视口单位，不依赖父级高度继承 */
.full-viewport {
  height: 100vh;
  width: 100vw;
  margin: 0;
  overflow: hidden; // 防止出现滚动条
}

.error-wrapper {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* 4. 确保图片容器撑满 */
.full-img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-left: 30px;
  width: 85%;
  height: 100%;
  object-fit: contain;
  display: block; // 消除图片底部默认的 inline 空白间隙
}

.warning-info {
  width: 100%;
  height: 100%;
  // 可在此处添加 flex 居中内容等样式
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: 20px;

  h1 {
    color: #1773d5;
  }
  .center {
    h3 {
      margin-bottom: 8px;
    }
    p {
      font-size: 14px;
      color: #9c9a98;
    }
  }
  .el-button {
    padding: 0 20px;
  }
}
</style>
