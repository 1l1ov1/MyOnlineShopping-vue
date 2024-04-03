import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'
// 用户模块
export const userStore = defineStore(
  // 独一无二的名字，用来连接store
  'online-shopping',
  () => {
    // 设置token
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    // 是否是第一次访问该页码
    const firstComing = ref(true)

    // 设置用户
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data
    }

    const setUser = (obj) => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      firstComing,
      user,
      getUser,
      setUser
    }
  },
  {
    // 打开持久化保存
    persist: true
  }
)