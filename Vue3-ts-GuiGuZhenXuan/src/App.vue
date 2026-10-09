<template>
  <!-- <router-link to="/login">登录</router-link> -->
  <router-view></router-view>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
defineOptions({
  name: 'App',
})
</script>

<style scoped></style>
