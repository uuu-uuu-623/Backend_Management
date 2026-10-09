<template>
  <div>
    <!-- 三级分类选择器  (已注册成 全局组件) -->
    <Category :isAddorEdit="isAddorEditAttr"></Category>
    <el-card>
      <!-- 表格 场景一：展示分类品牌属性 -->
      <div v-show="!isAddorEditAttr">
        <!-- 下面添加品牌属性按钮 要看是否有第三级分类的id 来决定是否禁用 -->
        <ButtonPermission value="btn.Attr.add">
          <template #default>
            <el-button
              type="primary"
              icon="Plus"
              style="margin-bottom: 20px"
              :disabled="categoryStore.c3Id ? false : true"
              @click="AddAttr"
            >
              添加品牌属性
            </el-button>
          </template>
          <template #fallback>
            <el-button type="primary" icon="Plus" style="margin-bottom: 20px" disabled>
              添加品牌属性
            </el-button>
          </template>
        </ButtonPermission>
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
          <el-table-column
            label="属性名称"
            width="120"
            align="center"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称" prop="attrValueList">
            <!-- row 是attrList 中的每一个对象 -->
            <template #="{ row, $index }">
              <el-tag
                v-for="(item, index) in row.attrValueList"
                :type="['success', 'warning'][index % 2]"
                style="margin: 5px 5px 5px 0"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" align="center">
            <template #="{ row, $index }">
              <ButtonPermission value="btn.Attr.update">
                <template #default>
                  <el-button type="warning" icon="Edit" circle @click="EditAttr(row)"></el-button>
                </template>
                <template #fallback>
                  <el-button type="warning" icon="Edit" circle disabled></el-button>
                </template>
              </ButtonPermission>

              <ButtonPermission value="btn.Attr.remove">
                <el-popconfirm
                  title="你确定要删除吗?"
                  icon="InfoFilled"
                  icon-color="#626AEF"
                  @confirm="DelAttr(row.id)"
                >
                  <template #reference>
                    <el-button type="danger" icon="Delete" circle></el-button>
                  </template>
                </el-popconfirm>
                <template #fallback>
                  <el-button type="danger" icon="Delete" circle disabled></el-button>
                </template>
              </ButtonPermission>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 场景二：添加或修改品牌属性 -->
      <div v-show="isAddorEditAttr">
        <el-form>
          <el-form-item label="属性名称">
            <el-input
              v-model="CollectAddOrEditAttrData.attrName"
              style="width: 240px"
              placeholder="请输入属性名"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="Plus"
              :disabled="CollectAddOrEditAttrData.attrName === ''"
              @click="addAttrValue"
            >
              添加属性值
            </el-button>
            <el-button type="default" @click="isAddorEditAttr = false">取消</el-button>
          </el-form-item>
        </el-form>
        <el-table
          border
          style="width: 100%; margin-bottom: 20px"
          :data="CollectAddOrEditAttrData.attrValueList"
        >
          <el-table-column label="序号" width="80" align="center" type="index"></el-table-column>
          <el-table-column label="属性值">
            <template #="{ row, $index }">
              <!-- 利用ref绑定函数 将变化的input组件 添加到InputArr中 -->
              <el-input
                :ref="(ele: any) => (InputArr[$index] = ele)"
                v-if="row.flag"
                v-model="row.valueName"
                placeholder="请输入属性值"
                @blur="showDiv(row, $index)"
              ></el-input>
              <div v-else>{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <!-- 修改属性值 -->
              <el-button
                type="warning"
                icon="Edit"
                circle
                @click="showInput(row, $index)"
              ></el-button>
              <!-- 删除属性值 -->
              <el-button
                type="danger"
                icon="Delete"
                circle
                @click="CollectAddOrEditAttrData.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="saveToPost" :disabled="isDisabledSave">保存</el-button>
        <el-button type="default" @click="isAddorEditAttr = false">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
// 引入 获取属性和属性值的请求
import { reqAttrAndAttrValue, reqAddOrEditAttrInfo, reqDelAttr } from '@/api/product/attr'
import type { attrArr, attrValue } from '@/api/product/attr/type'
// 引入分类相关仓库
import useCategoryStore from '@/stores/modules/category'

import { storeToRefs } from 'pinia'
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'Attr',
})

const categoryStore = useCategoryStore()
const { c1Id, c2Id, c3Id } = storeToRefs(categoryStore)

// 存储 请求到的属性的数据
let attrList = ref<Array<attrArr>>([])

// 收集添加或修改属性的数据 并发送请求
let CollectAddOrEditAttrData = ref<attrArr>({
  attrName: '',
  categoryId: 0,
  categoryLevel: 0,
  attrValueList: [], //属性值
})

// 添加或修改品牌属性 代表 展示表格还是添加或者修改的表单
// true => 展示场景二 表单
let isAddorEditAttr = ref<boolean>(false)

// 收集 输入框发生改变的组件实例el-input
let InputArr = ref<any>([])

// 判断是否禁用保存键
const isDisabledSave = computed(() => {
  const data = CollectAddOrEditAttrData.value
  // 1. 属性名为空 → 禁用
  if (!data.attrName.trim()) return true
  // 2. 没有属性值 → 禁用
  if (data.attrValueList.length === 0) return true
  // 3. 存在空的属性值 → 禁用
  // !''.trim() → !'' → true，立刻返回 true
  if (data.attrValueList.some((item) => !item.valueName.trim())) return true
  return false
})

// 封装函数 获取属性分类数据
const getAttrList = async () => {
  attrList.value = []
  if (!c3Id.value) return
  const res = await reqAttrAndAttrValue(
    c1Id.value as number,
    c2Id.value as number,
    c3Id.value as number,
  )
  attrList.value = res.data
}

// 挂载时 主动用 Store 中（可能已被持久化恢复的）值发请求
onMounted(() => {
  getAttrList()
})

// 监听c3Id 是否变化 一旦变化就要渲染表格或清空表格
watch(
  () => c3Id.value,
  async (newVal, oldVal) => {
    // 只有当值真正发生变化时才重新请求 防止发挂载时的重复请求
    if (oldVal !== undefined && newVal !== oldVal) {
      getAttrList()
    }
  },
)

// 点击编辑属性(表格) 回调函数
const EditAttr = (row: attrArr) => {
  // 切换场景二
  isAddorEditAttr.value = true

  // 给场景二的表单输入框 赋值属性的数据
  // 这里要注意 直接Object.assign 是浅拷贝 引用的地址是一样的
  // 这样会造成 => 当修改完 不点保存值一样会修改
  Object.assign(CollectAddOrEditAttrData.value, JSON.parse(JSON.stringify(row)))
}

// 删除属性(表格)
const DelAttr = async (id: number) => {
  const res = await reqDelAttr(id)
  try {
    if (res.code === 200) {
      getAttrList()
      ElMessage.success('删除成功')
    }
  } catch (err) {
    ElMessage.error('删除失败')
  }
}

// 点击 添加属性的回调
const AddAttr = () => {
  isAddorEditAttr.value = true
  // 点击时要把数据清空
  Object.assign(CollectAddOrEditAttrData.value, {
    attrName: '',
    categoryId: 0,
    categoryLevel: 0,
    attrValueList: [],
  })
}

// 点击添加属性值的回调
const addAttrValue = () => {
  CollectAddOrEditAttrData.value.attrValueList.push({ valueName: '', flag: true })
  // 让新增的 属性值输入框自动获取焦点
  nextTick(() => {
    InputArr.value[CollectAddOrEditAttrData.value.attrValueList.length - 1]?.focus()
  })
}

// 点击保存按钮时 收集数据 发送请求
const saveToPost = async () => {
  // 保存的时候做出判断 判断还有没有空的属性值
  const isAttrValueNameEmpty = CollectAddOrEditAttrData.value.attrValueList.find((item) => {
    if (item.valueName === '') {
      return true
    }
  })
  if (isAttrValueNameEmpty) {
    ElMessage.error('属性值不能为空')
    return
  }

  // 点击保存的同时 要把三级分类的id 和分类类别带上 发请求时要用
  CollectAddOrEditAttrData.value.categoryId = c3Id.value as number
  CollectAddOrEditAttrData.value.categoryLevel = 3

  // 发送请求
  const res = await reqAddOrEditAttrInfo(CollectAddOrEditAttrData.value)
  if (res.code === 200) {
    // 成功则切换场景 并重新获取数据 提示添加成功或者获取成功
    isAddorEditAttr.value = false
    getAttrList()
    ElMessage.success({ message: CollectAddOrEditAttrData.value.id ? '修改成功' : '添加成功' })
  } else {
    ElMessage.error({ message: CollectAddOrEditAttrData.value.id ? '修改失败' : '添加失败' })
  }
}

// 编辑属性值的输入框 失焦后 显示div
const showDiv = (row: attrValue, $index: number) => {
  // 失焦的时候 先做出两个 违法判断 才可以变成div
  // 1.属性值不能为空
  if (row.valueName.trim() === '') {
    // 为空时
    // 删除属性值数组中 属性值为空的
    CollectAddOrEditAttrData.value.attrValueList.splice($index, 1)

    ElMessage.error('属性值不能为空')
    return
  }

  // 2.属性值不能重复
  // 遍历数组判断是否有重复
  let repeat = CollectAddOrEditAttrData.value.attrValueList.find(
    (item, index) => index !== $index && item.valueName.trim() === row.valueName,
  )

  // 如果重复了
  if (repeat) {
    // 在数组中删除重复的属性值
    CollectAddOrEditAttrData.value.attrValueList.splice($index, 1)

    // 报错
    ElMessage.error('该属性值已存在，请重新输入')
    return
  }

  // 改成div状态
  row.flag = false
}

// 点击属性值操作中的编辑按钮 编辑属性值 显示输入框
const showInput = (row: attrValue, $index: number) => {
  // v-if 展示输入框
  row.flag = true
  // console.log(InputArr.value[$index])

  // 因为输入框还没渲染 所以要等下一轮的时候再获取焦点
  nextTick(() => {
    InputArr.value[$index]?.focus()
  })
}

// 让输入框自动获取焦点 => 首先要用ref绑定函数 记录输入框是否变
</script>

<style scoped></style>
