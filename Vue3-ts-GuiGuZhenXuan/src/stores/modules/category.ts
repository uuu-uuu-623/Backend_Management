// 商品三级分类的相关仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
// 发送请求 api
import { reqCategoryOne, reqCategoryTwo, reqCategoryThree } from '@/api/product/attr'
//
import type { CategoryObj } from '@/api/product/attr/type'

const useCategoryStore = defineStore(
  'categoryStore',
  () => {
    // 存储商品一级分类的数据
    let c1Arr = ref<Array<CategoryObj>>([])
    // 存储商品一级分类的id
    let c1Id = ref<number | string>('')
    // 存储商品二级分类的数据
    let c2Arr = ref<Array<CategoryObj>>([])
    // 存储商品二级分类的id
    let c2Id = ref<number | string>('')
    // 存储商品三级分类的数据
    let c3Arr = ref<Array<CategoryObj>>([])
    // 存储商品三级分类的id
    let c3Id = ref<number | string>('')

    // 发送请求 得到一级分类的数据
    const getC1 = async () => {
      const res = await reqCategoryOne()
      c1Arr.value = res.data
    }

    // 发送请求 得到二级分类的数据
    const getC2 = async (idfromC1: number) => {
      const res = await reqCategoryTwo(idfromC1)
      c2Arr.value = res.data
    }

    // 发送请求 得到三级分类的数据
    const getC3 = async (idfromC2: number) => {
      const res = await reqCategoryThree(idfromC2)
      c3Arr.value = res.data
    }

    // 重置仓库的数据
    const resetCategory = () => {
      c1Arr.value = []
      c1Id.value = ''
      c2Arr.value = []
      c2Id.value = ''
      c3Arr.value = []
      c3Id.value = ''
    }

    return { c1Arr, c1Id, getC1, c2Arr, c2Id, getC2, c3Arr, c3Id, getC3, resetCategory }
  },
  {
    // 开启持久化配置
    persist: {
      key: 'app-category-state', // 本地存储的 key
      pick: ['c1Id', 'c2Id', 'c3Id', 'c1Arr', 'c2Arr', 'c3Arr'], // 只持久化这三个ID，不要存整个列表
      storage: sessionStorage, // 推荐用 sessionStorage（关闭标签页即清除）
    }, // 如果希望跨标签页/长期保留，改用 localStorage
  },
)

export default useCategoryStore
