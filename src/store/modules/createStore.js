import { ref } from 'vue'
import { defineStore } from 'pinia'
// import { userGetInfoService } from '@/api/user'
// 用户模块
export const userCreateStore = defineStore(
  // 独一无二的名字，用来连接store
  'online-shopping-createStore',
  () => {
    // 设置userCreateStore表单实体
    const userCreateStore = ref({})
    const removeUserCreateStore = () => {
      userCreateStore.value = ''
    }

    const setUserCreateStore = (obj) => {
      userCreateStore.value = obj
    }
    // 是否接收到拒绝消息
    const receiveRejection = ref(false)
    return {
      userCreateStore,
      removeUserCreateStore,
      setUserCreateStore,
      receiveRejection
    }
  },
  {
    // 打开持久化保存
    persist: true
  }
)
