<template>
  <div>
    <el-form label-position="right" label-width="100px">
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" style="width: 300px" v-model="localSkuParams.skuName" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          style="width: 300px"
          type="number"
          v-model="localSkuParams.price"
        />
      </el-form-item>
      <el-form-item label="重量(g)">
        <el-input
          placeholder="重量(g)"
          style="width: 300px"
          type="number"
          v-model="localSkuParams.weight"
        />
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input placeholder="SKU描述" type="textarea" v-model="localSkuParams.skuDesc" />
      </el-form-item>
      <!-- 平台属性 下拉框 -->
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item v-for="attr in attrDataList" :key="attr.id" :label="attr.attrName">
            <el-select
              placeholder="请选择"
              style="width: 240px"
              v-model="attr.CollectSkuFormInPingTaiSelect"
            >
              <el-option
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
                :value="`${attrValue.attrId}:${attrValue.id}`"
                :label="attrValue.valueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 下拉框 -->
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item v-for="sale in saleList" :key="sale.id" :label="sale.saleAttrName">
            <el-select
              placeholder="请选择"
              style="width: 240px"
              v-model="sale.CollectSkuFormInSaleSelect"
            >
              <el-option
                v-for="saleAttrValue in sale.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :value="`${sale.id}:${saleAttrValue.id}`"
                :label="saleAttrValue.saleAttrValueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 照片墙 数据 -->
      <el-form-item>
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="imageList"
          ref="tableRef"
          @selection-change="checkBoxChange"
        >
          <el-table-column type="selection" width="80"></el-table-column>
          <el-table-column label="图片">
            <template #="{ row }">
              <el-image
                :src="row.imgUrl"
                fit="cover"
                lazy
                :preview-src-list="[row.imgUrl]"
                preview-teleported
                hide-on-click-modal
                :scale="1.5"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="warning" @click="CollectImgUrl(row)">设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!isSaveDis" @click="save">保存</el-button>
        <el-button @click="changeViewToZone">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { attrArr } from '@/api/product/attr/type'
import type {
  DataFromSpuSale,
  DataFromSpuImagesList,
  DataFromAddSku,
  AddSkuInfo,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
import { reqAddSkuData } from '@/api/product/spu'

defineOptions({ name: 'SkuForm' })

const p = defineProps<{
  attrDataList: attrArr[]
  saleList: DataFromSpuSale[]
  imageList: DataFromSpuImagesList[]
  skuNeedC3Id: number | string
  skuNeedtmId: number | string
  skuNeedSpuId: number | string
}>()

const emit = defineEmits(['updateView'])

const tableRef = ref<any>()

// 本地表单数据副本
const localSkuParams = ref<DataFromAddSku>({
  category3Id: p.skuNeedC3Id,
  spuID: p.skuNeedSpuId,
  tmId: p.skuNeedtmId,
  price: '',
  weight: '',
  skuDefaultImg: '',
  skuDesc: '',
  skuName: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
})

// 监听父组件 props 变化，同步 id 字段到本地副本
watch(
  () => [p.skuNeedC3Id, p.skuNeedSpuId, p.skuNeedtmId],
  ([newC3Id, newSpuId, newTmId]) => {
    if (newC3Id && newSpuId && newTmId) {
      localSkuParams.value.category3Id = newC3Id
      localSkuParams.value.spuID = newSpuId
      localSkuParams.value.tmId = newTmId
    }
  },
)
const isSaveDis = computed(() => {
  // 1. 基础字段判空（确保不为 null、undefined 或空字符串）
  const isBasicValid =
    localSkuParams.value.skuName?.trim() !== '' &&
    localSkuParams.value.price != null &&
    localSkuParams.value.price !== '' &&
    localSkuParams.value.weight != null &&
    localSkuParams.value.weight !== '' &&
    localSkuParams.value.skuDefaultImg?.trim() !== ''

  // 2. 下拉框判空（排除掉未选择时的 undefined 或空字符串）
  // 注意：因为你的 v-model 绑定的是 "attrId:valueId" 格式，只要选了就一定有值
  const isPlatformAttrValid = p.attrDataList.some((item) => item.CollectSkuFormInPingTaiSelect)

  const isSaleAttrValid = p.saleList.some((item) => item.CollectSkuFormInSaleSelect)

  // 3. 所有条件都满足时，才返回 true
  return isBasicValid && isPlatformAttrValid && isSaleAttrValid
})

// 点击照片墙表格中 设置默认按钮的回调
// 收集被选择的图片地址 并调整表格复选框状态
const CollectImgUrl = (row: any) => {
  // console.log(row)
  // 1.收集被选择的图片地址
  localSkuParams.value.skuDefaultImg = row.imgUrl

  // 2.调整表格复选框状态
  // 先让表格复选框 改为未选状态
  tableRef.value?.clearSelection()
  // 选中的复选框 状态改变
  tableRef.value?.toggleRowSelection(row, true)
}
// 让表格多选框 变单选
// 当 被选择的复选框>1 (val.length > 1) 时，先 clearSelection，
// 再把数组 (val[]) 最后一项（最新点击的行）设为选中：
const checkBoxChange = (val: DataFromSpuImagesList[]) => {
  // 取消全部勾选时（包括 clearSelection 触发的空数组），清空默认图片
  if (val.length === 0) {
    localSkuParams.value.skuDefaultImg = ''
    return
  }

  // 1. 获取最新选中的那一行
  const lastSelectedRow = val[val.length - 1]

  // 2. 同步更新默认图片地址
  localSkuParams.value.skuDefaultImg = lastSelectedRow.imgUrl

  if (val.length > 1) {
    // 3. 先清空所有选中状态
    tableRef.value?.clearSelection()

    // 4. 再把最后选中的那一行设置为选中状态
    tableRef.value?.toggleRowSelection(lastSelectedRow, true)
  }
}

// 点击保存按钮的回调函数
const save = async () => {
  // 1. 收集平台属性数据
  const CollectAttrData = p.attrDataList
    .filter((item: attrArr) => item.CollectSkuFormInPingTaiSelect)
    .map((data: attrArr) => {
      const [attrId, valueId] = data.CollectSkuFormInPingTaiSelect?.split(':') ?? []
      return { attrId, valueId }
    })
  localSkuParams.value.skuAttrValueList = CollectAttrData

  // 2. 收集销售属性数据
  const CollectSale_attrData = p.saleList
    .filter((item: DataFromSpuSale) => item.CollectSkuFormInSaleSelect)
    .map((data: DataFromSpuSale) => {
      const [saleAttrId, saleAttrValueId] = data.CollectSkuFormInSaleSelect?.split(':') ?? []
      return { saleAttrId, saleAttrValueId }
    })
  localSkuParams.value.skuSaleAttrValueList = CollectSale_attrData

  // 3. 发送新增 SKU 请求
  try {
    const res: AddSkuInfo = await reqAddSkuData(localSkuParams.value)
    if (res.code === 200) {
      ElMessage.success('添加成功')
      // 4. 成功后通知父组件：切换视图并刷新数据
      emit('updateView', { viewNum: 0, isUseCategory: false, refreshAfterSave: true })

      // 5.清空表单数据 防止数据残留
      Object.assign(localSkuParams.value, {
        category3Id: 0,
        spuID: 0,
        tmId: 0,
        price: '',
        weight: '',
        skuDefaultImg: '',
        skuDesc: '',
        skuName: '',
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
      })
    } else {
      ElMessage.error(res.message || '添加失败')
    }
  } catch (error) {
    ElMessage.error('添加失败，请重试')
    // 失败时不切换视图，保留表单数据让用户修改
  }
}

// 点击取消按钮的回调
// 调用父组件的函数 切换成场景零 并且解禁三级分类组件
const changeViewToZone = () => {
  emit('updateView', { viewNum: 0, isUseCategory: false })
  // 5.清空表单数据 防止数据残留
  Object.assign(localSkuParams.value, {
    category3Id: 0,
    spuID: 0,
    tmId: 0,
    price: '',
    weight: '',
    skuDefaultImg: '',
    skuDesc: '',
    skuName: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
  })
}
</script>

<style scoped lang="scss">
/* 隐藏表头的全选复选框 */
:deep(.el-table__header-wrapper .el-table__header .el-checkbox) {
  display: none;
}
</style>
