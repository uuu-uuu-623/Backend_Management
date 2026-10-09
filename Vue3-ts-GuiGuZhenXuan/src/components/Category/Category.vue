<template>
  <!-- 这是三级分类的全局组件 在品牌分类模块应用 -->
  <el-card style="margin-bottom: 20px">
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <!-- el-select中的v-model是 选中项绑定值 -->
        <el-select
          placeholder="请选择"
          clearable
          style="width: 240px"
          v-model="categoryStore.c1Id"
          :disabled="props.isAddorEdit || !categoryStore.c1Arr.length"
          @change="WhenchangeC1(categoryStore.c1Id as number)"
        >
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          clearable
          style="width: 240px"
          v-model="categoryStore.c2Id"
          :disabled="props.isAddorEdit"
          @change="WhenchangeC2(categoryStore.c2Id as number)"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          clearable
          style="width: 240px"
          v-model="categoryStore.c3Id"
          :disabled="props.isAddorEdit"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeMount } from 'vue'

// 引入分类相关仓库
import useCategoryStore from '@/stores/modules/category'

// 接收父组件-属性管理 传来的参数 用于是否禁用下拉框
// defineProps(['isAddorEdit'])
const props = defineProps({
  isAddorEdit: {
    type: Boolean,
    required: true,
  },
})

defineOptions({
  name: 'Category',
})

const categoryStore = useCategoryStore()

// 组件挂载的时候 获取一级分类的数据
// 在生命周期函数 最好不要await操作
onMounted(() => {
  getC1()
})

const getC1 = () => {
  categoryStore.getC1()
}

// 当c1Id发生变化的时候 就发送请求 获取二级分类数据
const WhenchangeC1 = (idfromC1: number) => {
  // 发生变化发送请求的同时 也要清空二级三级分类的数据 不然不匹配
  // 同时也要注意 如果不手动清空c2Arr和c3Arr 用户在弱网环境下的话 是可以看到更新之前的数据的
  // 所以要手动清空
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c2Arr = []
  categoryStore.c3Arr = []
  categoryStore.getC2(idfromC1)
}

// 当c1Id发生变化的时候 就发送请求 获取三级分类数据
const WhenchangeC2 = (idfromC2: number) => {
  categoryStore.c3Id = ''
  categoryStore.c3Arr = []
  categoryStore.getC3(idfromC2)
}
</script>

<style scoped lang="scss"></style>
