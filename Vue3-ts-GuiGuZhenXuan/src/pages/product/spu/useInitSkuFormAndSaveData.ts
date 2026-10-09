// 初始化skuForm组件的初始数据
import { reqAttrAndAttrValue } from '@/api/product/attr'
import type { attrResponseData, attrArr } from '@/api/product/attr/type'
import { reqSpuSaleList, reqSpuImagesList } from '@/api/product/spu'
import type {
  RecordFromSpuLimitData,
  DataFromSpuSale,
  DataFromSpuImagesList,
  SpuImagesList,
  SpuSaleList,
  DataFromAddSku,
} from '@/api/product/spu/type'

import { ref } from 'vue'

// 模块级别的状态，HMR 刷新时不会丢失
const attrDataList = ref<Array<attrArr>>([])
const saleList = ref<DataFromSpuSale[]>([])
const imageList = ref<DataFromSpuImagesList[]>([])
const skuParams = ref<DataFromAddSku>({
  category3Id: 0,
  price: '',
  spuID: 0,
  tmId: 0,
  weight: '',
  skuDefaultImg: '',
  skuDesc: '',
  skuName: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
})

export const useInitSkuFormData = () => {
  // 初始化数据：获取平台属性、销售属性、照片墙，并设置 skuParams 的 id 字段
  const initSkuFormData = async (c1Id: number, c2Id: number, spu: RecordFromSpuLimitData) => {
    const getAttrRes: attrResponseData = await reqAttrAndAttrValue(c1Id, c2Id, spu.category3Id)
    if (getAttrRes.code === 200) {
      attrDataList.value = getAttrRes.data
    }

    const getSaleRes: SpuSaleList = await reqSpuSaleList(spu.id as number)
    if (getSaleRes.code === 200) {
      saleList.value = getSaleRes.data
    }

    const getImageRes: SpuImagesList = await reqSpuImagesList(spu.id as number)
    if (getImageRes.code === 200) {
      imageList.value = getImageRes.data
    }

    skuParams.value.category3Id = String(spu.category3Id)
    skuParams.value.tmId = String(spu.tmId)
    skuParams.value.spuID = String(spu.id)
  }

  return { initSkuFormData, attrDataList, saleList, imageList, skuParams }
}
