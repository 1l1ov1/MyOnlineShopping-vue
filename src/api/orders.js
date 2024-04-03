import request from '@/utils/request'

// 得到订单列表 分页查询
export const getOrdersListService = (params) =>
  request.post('/api/orders/page', params)

// 批量删除
export const batchDeleteOrdersService = (ids) => {
  return request({
    url: '/api/orders/delete',
    method: 'delete',
    params: { ids }
  })
}

// 修改订单状态
export const updateOrdersService = (status, id) => {
  return request({
    url: `/api/orders/update/${status}`,
    method: 'get',
    params: { id }
  })
}
