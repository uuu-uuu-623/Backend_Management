// 用于管理  品牌管理模块的的ts类型
// 都有的返回数据
interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 返回的品牌数据的ts类型
export interface TrademarkArr {
  id: number
  tmName: string
  logoUrl: string
}

// 返回的品牌数据 他们是一个数组
export type Records = TrademarkArr[]

// 请求品牌管理模块分页列表 得到的整体数据的ts类型
export interface TrademarkLimitListResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 新增品牌接口 响应返回的ts类型
export interface addTrademarkResponseData extends ResponseData {
  data: string
}

// 修改品牌接口 响应返回的ts类型
export interface updateTrademarkResponseData extends ResponseData {
  data: string
}

// 删除品牌接口 响应返回的ts类型
export interface deleteTrademarkResponseData extends ResponseData {
  data: string
}
