<template>
  <div class="login_container">
    <!-- element 默认24位 -->
    <el-row>
      <!-- 用于占位 当屏幕宽度少于768 占位的位置要消失 -->
      <el-col :span="12" :xs="0"></el-col>
      <!-- 表单 -->
      <el-col :span="12" :xs="23">
        <el-form class="login-form" ref="loginFormCheck" :rules="rules" :model="loginForm">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              placeholder="Please input Your Username"
              v-model="loginForm.username"
              :prefix-icon="User"
              clearable
              :clear-icon="CloseBold"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="Please input Your Password"
              v-model="loginForm.password"
              :prefix-icon="Lock"
              show-password
              clearable
              :clear-icon="CloseBold"
            ></el-input>
          </el-form-item>
          <el-button type="primary" class="btn" @click="login" :loading="isloading">登录</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// 引入element 图标
import { User, CloseBold, Lock } from '@element-plus/icons-vue'
// 引入user仓库
import useUserStore from '@/stores/modules/user.ts'
// 引入封装的时间工具
import { getLoginTime } from '@/utils/Time'

defineOptions({
  name: 'Login',
})
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// 收集用户名和密码
const loginForm = ref({ username: 'admin', password: '111111' })
let isloading = ref(false)

// 表单dom  校验表单数据
const loginFormCheck = ref()
// console.log(loginFormCheck)

// 用户登录函数
const login = async () => {
  // 保证全部表单校验通过 才可以发请求
  const res = await loginFormCheck.value.validate()
  if (!res) return
  // console.log(res)

  isloading.value = true
  // 发起登录请求 (带参数 - 用户名和密码)
  // 成功 => 跳到首页 展示对应用户的信息
  // 失败 => 弹出失败信息
  try {
    // 保证登陆成功
    // await 没错才会继续走下去
    await userStore.userLogin(loginForm.value)
    await userStore.GetuserInfo() // ✅ 先加载好动态路由

    // 如果路径中含有query参数 -- (有关于用户退出登陆前的路径信息)
    // 则用户重新登陆的时候要跳转到退出登陆前的路径中
    // 如果没有query参数 则默认跳转到首页

    /* 为什么要这么做呢 
    因为要做路由鉴权 当用户发现当前账户没有访问某个路由的权限的时候 就需要切换账号
    所以需要记录下用户退出登陆前的路径信息
    然后用户重新登陆的时候 跳转到退出登陆前的路径中 */
    let redirect = route.query.redirect as string
    router.push({ path: redirect || '/' })

    ElNotification.success({
      title: `Hi,${getLoginTime()}`,
      message: '登录成功',
      duration: 2000,
    })

    // setTimeout(() => router.push('/'), 600)
  } catch (error: any) {
    // 账号密码错误时，后端返回的 "用户名或密码错误"
    // 已经被拦截器提取并包装成了 error.message
    // 这里直接使用，不会与拦截器重复弹窗
    ElNotification({
      type: 'error',
      title: '登录失败',
      message: '账号或密码错误，请重试',
      duration: 3000,
    })
  } finally {
    isloading.value = false
  }
}

// 表单校验
// 定义表单校验的配置对象 - element plus
// required:必须校验
// min:长度最短到多少
// max:长度最长到多少
// message:错误的信息提示
// trigger:出发表单校验的时机 change blur

// 自定义表单校验规则函数
// 1.检验用户名
/* const validatorUsername = (rule: object, value: string, callback: any) => {
  // rule:校验的规则对象
  // value:表单元素文本内容
  // 回调函数: 通过callback 放行
  if (/^\d{5,10}/.test(value)) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}

// 2.校验密码
const validatorPassword = (rule: object, value: string, callback: any) => {
  if (/^(?=.*[a-zA-Z])(?=.*\d).+$/s.test(value) && value.length >= 6 &&value.length <= 15) {
    callback()
  } else {
    callback(new Error('密码必须同时包含字母和数字'))
  }
}

 */

//  表单校验规则对象
const rules = {
  username: [
    {
      required: true,
      min: 5,
      max: 10,
      message: '用户名大于5,不超过10',
      trigger: ['blur', 'change'],
    },
  ],
  password: [
    { required: true, min: 5, max: 15, message: '密码大于5,不超过15', trigger: 'blur' },
    /* {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
      message: '密码必须同时包含字母和数字',
      trigger: ['blur', 'change'],
    }, */
  ],
  // 使用自定义校验表单规则
  // username: { validator: validatorUsername, trigger: 'blur' },
  // password: { validator: validatorPassword, trigger: 'blur' },
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/background.jpg') no-repeat;
  background-size: cover;
  padding-left: 50px;

  .login-form {
    position: relative;
    background-color: pink;
    padding: 20px;
    top: 30vh;
    width: 80%;
    background: url('../../assets/images/login_form.png');

    .btn {
      width: 100%;
    }

    h1 {
      font-size: 40px;
      color: #fff;
    }
    h2 {
      font-size: 20px;
      font-weight: normal;
      color: #fff;
      margin: 20px 0;
    }
  }
}
</style>
