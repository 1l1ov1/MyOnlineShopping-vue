<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { userStore } from '@/store/index.js'
import { ElNotification } from 'element-plus'
// import { BASE_URL } from '@/constant/baseUrl.js'
import { websocketTypeConstant } from '@/constant/constants.js'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStoreInstance = userStore()
// 当用户进入系统，就开始进行socket连接
const Websocket = (stopInterval) => {
  // 如果还没有登录
  if (userStoreInstance.user === null || userStoreInstance.user === undefined || !Object.entries(userStoreInstance.user).length) {
    return
  }
  // 如果登录了，就停止定时器
  stopInterval(websocketIntervalId.value)
  // const wsUrl = `ws://${BASE_URL}/ws/user/` + userStoreInstance.user.id
  const wsUrl = `ws://${process.env.VUE_APP_API_URL}/ws/user/` + userStoreInstance.user.id
  let socket
  // 如果浏览器支持，创建 WebSocket 连接
  if ('WebSocket' in window) {
    socket = new WebSocket(wsUrl)
  } else {
    console.error('您的浏览器不支持 WebSocket。')
    return
  }
  // 定义 WebSocket 连接的事件处理器
  socket.addEventListener('open', handleOpen)
  socket.addEventListener('message', handleMessage)
  socket.addEventListener('error', handleError)
  socket.addEventListener('close', handleClose)

  // 连接打开
  function handleOpen (event) {
    console.log('WebSocket 连接已建立。')
    // 可在此处发送初始消息或执行任何设置任务
    // 然后去获取用户的信息
    userStoreInstance.getUser()
  }

  // 从服务器接收到消息
  function handleMessage (msg) {
    const jsonMsg = JSON.parse(msg.data)
    // 显示数据
    ElNotification.success({
      title: websocketTypeConstant.getWebSocketTypeLabel(jsonMsg.type),
      dangerouslyUseHTMLString: true,
      message: `${`<span style='color:#419EFF;cursor: pointer'>${jsonMsg.content}</span>`
        }`,
      type: 'warning'
    })
    if (websocketTypeConstant.getWebSocketTypeLabel(jsonMsg.type) === '账号被解封') {
      // 如果是账号被解封

    } else if (websocketTypeConstant.getWebSocketTypeLabel(jsonMsg.type) === '账号被封禁') {
      // 如果是账号被封禁，则删除token
      userStoreInstance.removeToken()
      // 清空用户信息
      userStoreInstance.setUser({})
      // 然后跳转到登录页面
      router.push('/login')
    } else if (websocketTypeConstant.getWebSocketTypeLabel(jsonMsg.type) === '用户奖励') {
      // 如果是用户奖励
    }
  }

  // 发生错误
  function handleError (error) {
    console.error('WebSocket 错误:', error)
    // 适当地处理错误（例如：重试、通知用户）
  }

  // 连接关闭
  function handleClose (event) {
    console.log('WebSocket 连接已关闭。')
    // 在此处执行任何清理任务或重新连接逻辑
  }
}
// 删除定时器
const websocketIntervalId = ref(123)
const stopInterval = (interval) => {
  // 停止定时执行 WebSocket 操作
  if (interval !== undefined) {
    clearInterval(interval)
    // 可选：重置变量，防止误用
    websocketIntervalId.value = undefined
  }
}
onMounted(() => {
  // 每5秒执行一次
  websocketIntervalId.value = setInterval(() => {
    Websocket(stopInterval)
  }, 5000)
})
</script>

<template>
  <div id="app">
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style lang="less"></style>
