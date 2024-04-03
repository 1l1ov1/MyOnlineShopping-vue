import request from '@/utils/request'

// 分页查询
export const getCategoryListService = (params) =>
  request.post('/api/category/page', params)

// 修改
export const updateCategoryService = (params) =>
  request.put('/api/category/update', params)

// 批量删除
export const batchDeleteCategoryService = (ids) => {
  return request({
    url: '/api/category/delete',
    method: 'delete',
    params: { ids }
  })
}

// 添加
export const addCategoryService = (params) =>
  request.post('/api/category/add', params)

// 得到详情
export const getCategoryDetailService = (id) =>
  request.get(`/api/category/${id}`)
