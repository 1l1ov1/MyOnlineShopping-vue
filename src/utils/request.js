import router from '@/router'
import { userStore } from '@/store'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { userLogoutService } from '@/api/user'
import { refreshTokenService } from '@/api/refreshToken'
const instance = axios.create({
  // 1. 超时时间
  timeout: 600000
})

instance.defaults.withCredentials = true

instance.interceptors.request.use(
  async config => {
    // 在发送请求之前做些什么
    // 携带Token
    const userStoreInstance = userStore()
    // 如果token不为null，那么设置到请求头中，此处哪怕为null，我们也不进行处理，因为后台会进行拦截
    if (userStoreInstance.token) {
      // 就设置Token头
      config.headers.Authorization = userStoreInstance.token
      config.headers['Refresh-Token'] = userStoreInstance.getRefreshToken()
    }
    // 放行
    return config
  },
  error => {
    return Promise.reject(error)
  })

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    // 如果返回结果的code为1
    if (res.data.code === 1) {
      return res.data
    }

    if (res.request.responseType === 'blob') {
      return res.data
    }
    // 处理业务失败，给错误提示，抛出错误
    ElMessage.error(res.data.msg || '服务异常')
    return Promise.reject(res.data)
  },
  async (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token过期 => 拦截到登录
    const userStoreInstance = userStore()
    if (err.response.status === 401) {
      // 说明没有刷新token，用户很长时间没有上线
      // 如果token过期，我就刷新的token去请求更新token
      const res = await refreshTokenService(userStoreInstance.getRefreshToken())
      // 如果说刷新成功
      if (res.data != null) {
        // 说明有刷新token
        userStoreInstance.setToken(res.data.token)
        // 刷新新令牌
        userStoreInstance.setRefreshToken(res.data.refreshToken)

        // 然后重新发送请求
        return instance(err.config)
      }
      // 清除缓存中的token
      userStoreInstance.removeToken()
      userStoreInstance.removeRefreshToken()
      // 清除缓存中的user
      userStoreInstance.setUser({})
      router.push('/login')
      ElMessage.error('权限过期，请重新登录授权')
      await userLogoutService()
    } else {
      // 错误的默认情况
      console.log(err)
      ElMessage.error(err.response.data.msg || err.response.data.error)
      return Promise.reject(err)
    }
  }
)
export default instance
