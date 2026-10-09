<template>
  <div class="rightContainer">
    <Rank class="rank"></Rank>
    <Year class="year"></Year>
    <Count class="count"></Count>
  </div>
</template>

<script lang="ts" setup>
import Rank from './Rank.vue'
import Count from './Count.vue'
import Year from './Year.vue'

defineOptions({
  name: 'RightIndex',
})
</script>

<style scoped lang="scss">
.rightContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  .rank {
    flex: 1.3;
    margin: 20px 0;
  }
  .year,
  .count {
    flex: 1.1;
    margin: 20px 0;
  }
}
</style>
