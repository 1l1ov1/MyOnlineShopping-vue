import request from '@/utils/request'

// 添加举报
export const addReportService = (params) => {
  return request({
    url: '/api/user/addReport',
    method: 'post',
    data: params
  })
}

// 举报的分页查询
export const getReportListService = (params) => {
  return request({
    url: '/api/report/page',
    method: 'post',
    data: params
  })
}
