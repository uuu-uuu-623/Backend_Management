<template>
  <div>
    <!-- 三级分类 -->
    <Category :isAddorEdit="sence"></Category>
    <!-- 卡片 -->
    <!-- 
      该页面卡片分三个场景 分别是: 
      展示分类已有的spu信息、添加或修改spu、添加某个spu的sku 
    -->
    <el-card>
      <!-- 场景一:表格 => 展示分类已有的spu信息 -->
      <div v-show="view === 0">
        <ButtonPermission value="btn.Spu.add">
          <el-button
            icon="Plus"
            type="primary"
            :disabled="c3Id ? false : true"
            @click="changeViewToOneAddSpu"
          >
            添加SPU
          </el-button>
          <template #fallback>
            <el-button icon="Plus" type="primary" disabled>添加SPU</el-button>
          </template>
        </ButtonPermission>

        <el-table border style="width: 100%; margin: 20px 0" :data="records">
          <el-table-column label="序号" width="80" type="index" align="center" />
          <el-table-column label="SPU名称" width="120" prop="spuName" />
          <el-table-column label="SPU描述" prop="description">
            <template #default="{ row }">
              <div class="desc-cell" @click="openDetail(row)">
                <div class="text-ellipsis-2">{{ row.description }}</div>
                <span v-if="row.description?.length > 50" class="view-more">查看详情 &gt;</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="SPU操作" min-width="120">
            <template #="{ row }">
              <ButtonPermission value="btn.Spu.addsku">
                <template #default>
                  <el-tooltip content="添加sku" :hide-after="0">
                    <el-button type="primary" icon="Plus" circle @click="addSku(row)" />
                  </el-tooltip>
                </template>
                <template #fallback>
                  <el-button type="primary" icon="Plus" circle disabled />
                </template>
              </ButtonPermission>

              <ButtonPermission value="btn.Spu.update">
                <el-tooltip content="编辑" :hide-after="0">
                  <el-button
                    type="warning"
                    icon="Edit"
                    circle
                    @click="changeViewToOneUpdateSpu(row)"
                  />
                </el-tooltip>
                <template #fallback>
                  <el-button type="warning" icon="Edit" circle disabled />
                </template>
              </ButtonPermission>

              <ButtonPermission value="btn.Spu.skus">
                <el-tooltip content="查看" :hide-after="0">
                  <el-button type="info" icon="View" circle @click="find(row)" />
                </el-tooltip>
                <template #fallback>
                  <el-button type="info" icon="View" circle disabled />
                </template>
              </ButtonPermission>

              <ButtonPermission value="btn.Spu.delete">
                <template #default>
                  <!-- 删除按钮的气泡提示框 -->
                  <el-popconfirm
                    width="220"
                    icon="InfoFilled"
                    icon-color="#626AEF"
                    :title="`你确定要删除 ${row.spuName} 吗`"
                    @confirm="del_spu(row)"
                  >
                    <template #reference>
                      <!-- 关键：用 div 包裹 el-tooltip，解决嵌套冲突 -->
                      <div style="display: inline-block; margin-left: 10px">
                        <el-tooltip content="删除" placement="bottom" :hide-after="0">
                          <el-button type="danger" icon="Delete" circle />
                        </el-tooltip>
                      </div>
                    </template>

                    <template #actions="{ confirm, cancel }">
                      <el-button size="small" @click="cancel">No!</el-button>
                      <el-button type="danger" size="small" @click="confirm">Yes?</el-button>
                    </template>
                  </el-popconfirm>
                </template>

                <template #fallback>
                  <el-button type="danger" icon="Delete" circle disabled />
                </template>
              </ButtonPermission>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          background
          v-model:current-page="currentPage"
          v-model:page-size="pageSize3"
          :page-sizes="[1, 2, 3, 4]"
          size="default"
          :disabled="false"
          layout=" prev, pager, next, jumper,->, sizes,total,"
          :total="total"
          @change="getSpuLimit"
          @size-change="currentPage = 1"
        />
      </div>

      <!-- 场景二: 添加或修改spu -->
      <SpuForm v-show="view === 1" @updateView="changeViewToZone"></SpuForm>

      <!-- 场景三: 添加某个spu的sku -->
      <SkuForm
        v-show="view === 2"
        @updateView="changeViewToZone"
        :attrDataList="attrDataList"
        :saleList="saleList"
        :imageList="imageList"
        :skuNeedC3Id="skuParams.category3Id"
        :skuNeedtmId="skuParams.tmId"
        :skuNeedSpuId="skuParams.spuID"
      ></SkuForm>
    </el-card>
    <!-- spu描述详情弹窗 -->
    <el-dialog v-model="detailVisible" title="Spu描述详情" width="600px">
      <div class="detail-content">{{ currentDesc }}</div>
    </el-dialog>

    <!-- 查看sku 的详情弹窗  -->
    <el-dialog v-model="dialogTableVisible" title="sku列表" width="600" center>
      <el-table :data="hasSkuData" border>
        <el-table-column prop="skuName" label="sku名字" />
        <el-table-column prop="price" label="sku价格" />
        <el-table-column prop="weight" label="sku重量" />
        <el-table-column label="sku图片">
          <template #="{ row }">
            <el-image
              style="width: 100px; height: 100px"
              fit="fill"
              :src="row.skuDefaultImg"
              :preview-src-list="[row.skuDefaultImg]"
              preview-teleported
              :scale="1.5"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import useCategoryStore from '@/stores/modules/category'
import { reqSpuLimitData, reqSkuInfoBySpuId, reqDelSpu } from '@/api/product/spu'
import type {
  Records,
  SpuLimitResponseData,
  RecordFromSpuLimitData,
  AddSkuInfo,
  DataFromAddSku,
} from '@/api/product/spu/type'
// 引入spu组合式函数
import { useSpuData } from './useSpuData'
// 引入 初始化skuForm数据的 组合式函数
import { useInitSkuFormData } from './useInitSkuFormAndSaveData.ts'

import { ref, reactive, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// 引入不同场景的子组件
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'Spu' })

// 控制不同场景的切换
let view = ref<number>(0) // 0为展示已有spu信息 1为添加或修改spu 2为给某spu添加sku

// 定义三级分类的禁用状态
let sence = ref<boolean>(false)
// 默认当前页
let currentPage = ref<number>(1)
// 设置每页显示多少条数
let pageSize3 = ref<number>(3)
// 设置 一共多少数据
let total = ref<number>(0)
// 初始化已有的spu数据
let records = ref<Records>([])
// 使用三级分类仓库
const categoryStore = useCategoryStore()
const { c1Id, c2Id, c3Id } = storeToRefs(categoryStore)
// 用于存储 根据spuId 查询到的 某spu已有sku的数据
const hasSkuData = ref<DataFromAddSku[]>()

// 获取 spu组合式函数 中的相应的数据
const { initHasSpuData, resetSpuData } = useSpuData()

// 获取 初始化skuForm 组合式函数的数据
const { initSkuFormData, attrDataList, saleList, imageList, skuParams } = useInitSkuFormData()

// Spu描述 字数过多时 要省略描述 并由用户选择是否查看描述
const detailVisible = ref(false)
const currentDesc = ref('')
const openDetail = (row: any) => {
  currentDesc.value = row.description
  detailVisible.value = true
}

// 控制查看sku 详情的对话框展示
const dialogTableVisible = ref<boolean>(false)

// 此方法用于三级分类id 发生变化的时候 发送不同的请求 获取当前分页 从而渲染
const getSpuLimit = async () => {
  if (!c3Id.value) return
  const res: SpuLimitResponseData = await reqSpuLimitData(
    currentPage.value,
    pageSize3.value,
    c3Id.value as number,
  )
  if (res.code === 200) {
    records.value = res.data.records
    total.value = res.data.total

    // 不论是 分页展示数改变 当前页码要归一
    // currentPage.value = 1
  }
}

onMounted(() => {
  getSpuLimit()
})

// 监听三级分类id的变化
watch(
  () => c3Id.value,
  (newV, oldV) => {
    getSpuLimit()
    records.value = []
    total.value = 0
  },
  { immediate: false },
)

// 点击添加spu按钮的回调 -- 切换场景一 添加或修改spu
const changeViewToOneAddSpu = async () => {
  // 并禁用 三级分类组件
  sence.value = true
  view.value = 1
  // 点击添加时 重置数据 避免残留
  resetSpuData(c3Id.value as number)
}
const changeViewToOneUpdateSpu = (row: RecordFromSpuLimitData) => {
  sence.value = true
  view.value = 1
  initHasSpuData(row)
}

// 场景一 取消按钮的回调 切换成场景零
// 父子通信 父组件调用函数 改数据

// 规范 可选形参的类型 接口
interface ChangeViewOptions {
  /** 目标视图编号 */
  viewNum: number
  /** 是否保存后刷新数据 */
  refreshAfterSave?: boolean
  /** 操作类型：新增时跳转到最后一页 */
  addOrUpdateStatus?: 'add' | 'update'
  // 是否禁用三级分类 全局组件
  isUseCategory: boolean
}

const changeViewToZone = (options: ChangeViewOptions) => {
  const { viewNum, refreshAfterSave, addOrUpdateStatus, isUseCategory } = options
  view.value = viewNum

  // 点击保存键 就重新获取新的数据
  if (refreshAfterSave) {
    getSpuLimit()
  }

  // addOrUpdateStatus 如果是add 则在最后一页 update则在当前页不变
  if (addOrUpdateStatus === 'add') {
    currentPage.value = Math.ceil(total.value / pageSize3.value)
  }

  // 解禁三级分类组件
  if (isUseCategory === false) {
    sence.value = false
  }
}

// 添加sku按钮的回调
const addSku = (spu: RecordFromSpuLimitData) => {
  // 切换场景二
  view.value = 2
  // 禁用三级分类组件
  sence.value = true
  // 初始化 添加sku中 表单的数据
  initSkuFormData(c1Id.value as number, c2Id.value as number, spu)
}

// 点击查看按钮的回调函数
const find = async (row: RecordFromSpuLimitData) => {
  const res: AddSkuInfo = await reqSkuInfoBySpuId(row.id as number)
  if (res.code === 200) {
    // 收集数据
    hasSkuData.value = res.data
    // 展示对话框
    dialogTableVisible.value = true
  }
}

// 点击删除按钮的回调函数
const del_spu = async (row: RecordFromSpuLimitData) => {
  try {
    const res = await reqDelSpu(row.id as number)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      getSpuLimit()
    }
  } catch (error) {
    ElMessage.error('删除失败,请稍后再试')
  }
}
</script>

<style scoped lang="scss">
.desc-cell {
  cursor: pointer;

  .text-ellipsis-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: break-all; /* 防止长英文/链接撑开 */
  }

  &:hover .text-ellipsis-2 {
    color: var(--el-color-primary);
  }
  .view-more {
    font-size: 12px;
    color: var(--el-color-primary);
    margin-top: 4px;
    display: inline-block;
  }
}

.detail-content {
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.8;
  max-height: 60vh;
  overflow-y: auto;
}
</style>
