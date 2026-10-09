// spu模块的组合式函数 hook
// spu模块专用数据
import {
  reqAllTrademarkList,
  reqSpuImagesList,
  reqAllBaseSpuSaleList,
  reqSpuSaleList,
} from '@/api/product/spu'
import type {
  DataFromTrademarkList,
  RecordFromSpuLimitData as spuData,
  AllTrademarkList,
  DataFromSpuImagesList,
  SpuImagesList,
  DataFromBaseSale,
  BaseSaleList,
  SpuSaleList,
  DataFromSpuSale,
} from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

import { ref } from 'vue'
// 用作 骨架屏 load 防止用户重复点击
const loading = ref(false) // ← 新增

// 存储请求到的所有 Spu品牌
const allTrademarkList = ref<DataFromTrademarkList[]>([])

// 存储 已有的某个spu数据
const hasSpuData = ref<spuData>({
  category3Id: 0, //三级分类id
  description: '', //spu描述
  tmId: undefined as unknown as number, //品牌id
  //照片墙
  spuImageList: [],
  spuName: '', //spu名字
  spuSaleAttrList: [],
})

// 存储 某个spu商品的照片墙数据
const imagesList = ref<imagesFileList[]>([])

// 存储 所有销售属性列表
const allBaseSpuSaleList = ref<DataFromBaseSale[]>([])

// 存储 某个商品的 spu销售属性列表
const spuSaleList = ref<DataFromSpuSale[]>([])

// 主要是照片墙的格式定义
interface imagesFileList {
  name: string
  url: string
}

export const useSpuData = () => {
  // 发送请求 用于渲染数据到场景一
  // 请求得到所有的SPU品牌的函数
  const getAllTrademarkList = async () => {
    if (allTrademarkList.value.length > 0) return
    const res: AllTrademarkList = await reqAllTrademarkList()
    if (res.code === 200) {
      allTrademarkList.value = res.data
    }
  }

  // 发送请求得到 某个spu商品的照片墙
  const getSpuImagesList = async (spuId: number) => {
    const imagesListRes: SpuImagesList = await reqSpuImagesList(spuId)
    if (imagesListRes.code === 200) {
      imagesList.value = imagesListRes.data.map((item) => {
        // 按照elementplus照片墙的规定格式 修改
        return {
          name: item.imgName,
          url: item.imgUrl,
        }
      })
    }
  }

  // 发送请求 得到所有的spu销售列表
  const getAllBaseSpuSaleList = async () => {
    const res: BaseSaleList = await reqAllBaseSpuSaleList()
    if (res.code === 200) {
      allBaseSpuSaleList.value = res.data
    }
  }

  // 发送请求 得到某个商品的spu 销售属性列表
  const getSpuSaleList = async (spuId: number) => {
    const res: SpuSaleList = await reqSpuSaleList(spuId)
    if (res.code === 200) {
      spuSaleList.value = res.data
    }
  }

  // 初始化 点击 要修改的spu数据
  // 要从父组件中得到对应spu数据 并提供给子组件渲染到表单中
  const initHasSpuData = async (spuData: spuData) => {
    // 骨架屏出现
    loading.value = true // ← 新增
    try {
      await Promise.all([
        getAllTrademarkList(), // 请求得到所有的SPU品牌
        getAllBaseSpuSaleList(), // 请求得到照片墙
        getSpuImagesList(spuData.id as number), // 请求得到所有的spu销售列表
        getSpuSaleList(spuData.id as number), // 请求得到某个商品的spu 销售属性列表
      ])
      hasSpuData.value = JSON.parse(JSON.stringify(spuData))
    } catch (error) {
      ElMessage.error('请求错误，请稍后再试')
    } finally {
      // 骨架屏消失
      loading.value = false // ← 新增
    }
  }

  // 点击添加spu按钮的时候 重置hasSpuData 以防数据残留
  const resetSpuData = (c3Id: number) => {
    getAllTrademarkList()
    getAllBaseSpuSaleList()
    const initSpuData: spuData = {
      category3Id: c3Id, //三级分类id
      description: '', //spu描述
      tmId: undefined as unknown as number, //品牌id
      spuImageList: [],
      spuName: '', //spu名字
      spuSaleAttrList: [],
    }
    hasSpuData.value = { ...initSpuData }
    imagesList.value = []
    spuSaleList.value = []
  }

  return {
    initHasSpuData,
    resetSpuData,
    loading,
    hasSpuData,
    allTrademarkList,
    imagesList,
    allBaseSpuSaleList,
    spuSaleList,
  }
}
