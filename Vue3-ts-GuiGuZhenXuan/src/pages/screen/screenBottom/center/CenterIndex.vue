<template>
  <div class="box1">
    <Map class="map"></Map>
    <Line class="line"></Line>
  </div>
</template>

<script lang="ts" setup>
import Map from './Map.vue'
import Line from './Line.vue'

defineOptions({
  name: 'CenterIndex',
})
</script>

<style scoped lang="scss">
.box1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px 20px 20px;
  width: 100%;
  height: 100%;

  .map {
    flex: 3;
  }
  .line {
    flex: 1;
  }
}
</style>
