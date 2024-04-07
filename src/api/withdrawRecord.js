import request from '@/utils/request'

export const queryWithdrawRecordService = (params) =>
  request.post('/api/withdrawRecord/pageQuery', params)
