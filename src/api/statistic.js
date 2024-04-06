import request from '@/utils/request'
// 查询商店的营业额
export const queryStoreSales = (day) =>
  request.get(`/api/statistic/queryStoreSales/${day}`)

// 查询每个订单的数量
export const queryOrdersUserCount = (day) =>
  request.get(`/api/statistic/queryOrdersUserCount/${day}`)

// 查询订单完成率
export const queryOrdersCountService = (day) =>
  request.get(`api/statistic/queryOrdersCount/${day}`)

// 查询用户数量和在线用户数量
export const queryUserAndRegisterUser = (day) =>
  request.get(`/api/statistic/queryUserCount/${day}`)

// 查询销量排名前十
export const querySalesTop10Service = (day) =>
  request.get(`/api/statistic/top10/${day}`)

// 数据导出
export const exportDate = () => {
  return request({
    url: '/api/statistic/export',
    method: 'get',
    responseType: 'blob'
  })
}
