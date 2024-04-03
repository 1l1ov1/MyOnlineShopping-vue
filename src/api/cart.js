import request from '@/utils/request'

// 添加购物车
export const addCartService = (params) =>
  request.post('/api/cart/add', params)

// 得到用户的购物车
export const getUserCartsService = (id) =>
  request.get(`/api/cart/${id}`)

// 删除购物车
export const deleteUserCartItemService = (ids) => {
  return request({
    url: '/api/cart/delete',
    method: 'delete',
    params: { ids }
  })
}

export const submitUserCartService = (params) =>
  request.post('/api/cart/submit', params)
