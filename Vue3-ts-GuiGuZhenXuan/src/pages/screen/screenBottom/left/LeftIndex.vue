<template>
  <div class="leftContainer">
    <div class="tourist">
      <Tourist></Tourist>
    </div>
    <div class="gender">
      <Gender></Gender>
    </div>
    <div class="age">
      <Age></Age>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Tourist from './Tourist.vue'
import Gender from './Gender.vue'
import Age from './Age.vue'

defineOptions({
  name: 'LeftIndex',
})
</script>

<style scoped lang="scss">
.leftContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;

  .tourist {
    flex: 1.3;
    margin: 20px 0;
  }
  .gender,
  .age {
    flex: 1.1;
    margin: 20px 0;
  }
}
</style>
