import request from '@/utils/request'

// 登录
export const userLoginService = ({ username, password, verifyCode }) =>
  request.post('/api/user/login', { username, password, verifyCode })

// 注册
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/user/register', { username, password, repassword })

// 获取验证码
export const userGetVerifyCode = ({ date }) => {
  request.get('/api/user/verify', { date })
}

// 获取个人信息
export const userGetInfoService = () =>
  request.get('/api/user/getUserInfo')

// 退出
export const userLogoutService = () =>
  request.get('/api/user/userLogout')
// 修改
export const userUpdateInfoService = (obj) =>
  request.put('/api/user/updateUser', obj)

// 得到用户信息
export const userGetDetailService = (id, isDefault) =>
  request.get('/api/user/getDetail', {
    params: {
      id,
      isDefault
    }
  })
// 重置密码
export const userUpdatePassService = (params) =>
  request.patch('/api/user/updatePwd', params)

// 忘记密码
export const userForgetPassService = (params) =>
  request.patch('/api/user/forgetPwd', params)
// 用户开店
export const userCreateStoreService = (obj) =>
  request.post('/api/user/createStore', obj)

// 用户充值
export const userRechargeService = (value) =>
  request.get(`/api/user/recharge/${value}`)

// 设为默认地址
export const updateAddressDefault = (row) =>
  request.post('/api/user/addressDefault', row)

// 发送开店的申请
export const sendCreateStoreRequestService = (params) =>
  request.post('/api/user/send', params)

// 检查申请格式是否正确
export const checkApply = (params) =>
  request.post('/api/user/check', params)

// 查看审核是否通过
export const checkApplyApprove = (params) =>
  request.get(`/api/user/findApply/${params}`)
// 立即购买
export const buyGoodsService = (params) =>
  request.post('/api/user/buy', params)

// 用户查询其订单
export const userQueryOrdersService = (userId, target, currentPage, pageSize) => {
  return request({
    url: `/api/user/queryOrders/${userId}`,
    method: 'get',
    params: { target, currentPage, pageSize }
  })
}

// 用户申请退款
export const applyRefundService = (id) =>
  request.get(`/api/user/applyRefund/${id}`)

// 添加地址
export const userAddAddress = (params) =>
  request.post('/api/user/addAddress', params)

// 删除非默认地址
export const deleteAddress = (id) => {
  return request({
    url: '/api/user/deleteAddress',
    method: 'delete',
    params: { id }
  })
}

// 用户催单
export const ordersReminder = (storeId, ordersNumber) => {
  return request({
    url: '/api/user/reminder',
    method: 'post',
    data: { storeId, ordersNumber }
  })
}
