import request from '@/utils/request'

// 分页查询
export const getApplyListService = (params) =>
  request.post('/api/apply/page', params)

// 修改申请
export const updateApplyService = (status, id) => {
  return request({
    url: `/api/apply/update/${status}`,
    method: 'get',
    params: { id }
  })
}

// 批量删除
export const batchDeleteApplyService = (ids) => {
  return request({
    url: '/api/apply/delete',
    method: 'delete',
    params: { ids }
  })
}

// 回显
export const getApplyDetailService = (id) =>
  request.get(`/api/apply/getApplyDetail/${id}`)

// 修改申请
export const updateApply = (params) =>
  request.put('/api/apply/update', params)
