// 用于管理 品牌管理模块的接口
// 引入二次封装的axios
import instance from '@/utils/instance'
// 引入相关ts类型
import type {
  TrademarkLimitListResponseData,
  addTrademarkResponseData,
  updateTrademarkResponseData,
  deleteTrademarkResponseData,
} from './type'
enum API {
  GET_Trademark_Limit_List = '/admin/product/baseTrademark',
  GET_AllTrademark_List = '/admin/product/baseTrademark/getTrademarkList',
  ADD_Trademark = '/admin/product/baseTrademark/save',
  Update_Trademark = '/admin/product/baseTrademark/update',
  Delete_Trademark = '/admin/product/baseTrademark/remove',
}

// 请求获取品牌列表
export const reqTrademarkLimitList = (page: number, limit: number) => {
  return instance<any, TrademarkLimitListResponseData>({
    url: `${API.GET_Trademark_Limit_List}/${page}/${limit}`,
  })
}

// 请求获取所有品牌
export const reqAllTrademarkList = () => {
  return instance<any>({
    url: API.GET_AllTrademark_List,
  })
}

// 请求添加品牌
export const reqAddTrademark = (logoUrl: string, tmName: string) => {
  return instance<any, addTrademarkResponseData>({
    url: API.ADD_Trademark,
    method: 'post',
    data: {
      logoUrl,
      tmName,
    },
  })
}

// 修改品牌信息
export const reqUpdateTrademark = (id: number, logoUrl: string, tmName: string) => {
  return instance<any, updateTrademarkResponseData>({
    url: API.Update_Trademark,
    method: 'put',
    data: {
      id,
      logoUrl,
      tmName,
    },
  })
}

// 删除品牌
export const reqDeleteTrademark = (id: number) => {
  return instance<any, deleteTrademarkResponseData>({
    url: `${API.Delete_Trademark}/${id}`,
    method: 'DELETE',
  })
}
