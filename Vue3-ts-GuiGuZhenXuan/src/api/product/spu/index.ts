// 用于spu管理模块的 api接口
import instance from '@/utils/instance'
import type {
  SpuLimitResponseData,
  AllTrademarkList,
  SpuImagesList,
  SpuSaleList,
  BaseSaleList,
  AddOrUpdateSpuResponseData,
  RecordFromSpuLimitData as Spudata,
  DataFromAddSku,
  AddSkuInfo,
  DelSpu,
} from './type'

enum API {
  // 获取spu数据的分页列表
  Get_SpuLimit = '/admin/product',
  // 获取所有品牌的列表 用于选择spu品牌
  Get_AllTrademark = '/admin/product/baseTrademark/getTrademarkList',
  // 获取商品图片列表 图片墙
  Get_SpuImagesList = '/admin/product/spuImageList',
  // 获取所有销售属性列表
  Get_AllBaseSaleList = '/admin/product/baseSaleAttrList',
  // 获取某个商品的 spu销售属性列表接口
  Get_SpuSaleList = '/admin/product/spuSaleAttrList',
  // 新增 spu数据的接口
  Add_SpuData = '/admin/product/saveSpuInfo',
  // 更改 spu数据的接口
  Update_Spudata = '/admin/product/updateSpuInfo',
  // 新增sku 的接口
  Add_SkuData = '/admin/product/saveSkuInfo',
  // 根据spuId 获取某spu中已有sku的信息
  Get_SkuInfoBySpuId = '/admin/product/findBySpuId',
  // 删除spu
  Del_spu = '/admin/product/deleteSpu',
}

// 获取响应分页的spu模块数据
export const reqSpuLimitData = (page: number, limit: number, category3Id: number) => {
  return instance<any, SpuLimitResponseData>({
    url: `${API.Get_SpuLimit}/${page}/${limit}?category3Id=${category3Id}`,
  })
}

// 获取所有品牌的列表的数据 返回值用于选择spu品牌
export const reqAllTrademarkList = () => {
  return instance<any, AllTrademarkList>({
    url: API.Get_AllTrademark,
  })
}

// 获取商品图片列表 图片墙
export const reqSpuImagesList = (spuId: number) => {
  return instance<any, SpuImagesList>({
    url: `${API.Get_SpuImagesList}/${spuId}`,
  })
}

// 获取所有的销售列表
export const reqAllBaseSpuSaleList = () => {
  return instance<any, BaseSaleList>({
    url: `${API.Get_AllBaseSaleList}`,
  })
}

// 获取某个商品的 spu销售属性列表
export const reqSpuSaleList = (spuId: number) => {
  return instance<any, SpuSaleList>({
    url: `${API.Get_SpuSaleList}/${spuId}`,
  })
}

// 新增或修改 spu的数据 根据有无id判断
export const AddOrUpdateSpuData = (data: Spudata) => {
  if (data.id) {
    // 存在id 则是修改数据
    return instance<any, AddOrUpdateSpuResponseData>({
      url: API.Update_Spudata,
      method: 'post',
      data,
    })
  } else {
    return instance<any, AddOrUpdateSpuResponseData>({
      url: API.Add_SpuData,
      method: 'post',
      data,
    })
  }
}

// 请求 新增sku
export const reqAddSkuData = (data: DataFromAddSku) => {
  return instance<any, AddSkuInfo>({
    url: API.Add_SkuData,
    method: 'post',
    data,
  })
}

// 根据spuId 获取某spu中已有sku的信息
export const reqSkuInfoBySpuId = (spuId: number) => {
  return instance<any, AddSkuInfo>({
    url: `${API.Get_SkuInfoBySpuId}/${spuId}`,
  })
}

// 删除spu
export const reqDelSpu = (spuId: number) => {
  return instance<any, DelSpu>({
    url: `${API.Del_spu}/${spuId}`,
    method: 'delete',
  })
}
