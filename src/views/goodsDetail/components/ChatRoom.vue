<script setup>
import NavigationComponent from '../../components/NavigationComponent.vue'
import FooterComponent from '../../components/FooterComponent.vue'
import { ref, computed, onMounted } from 'vue'
import { GetStoreDetailService } from '@/api/store'
import { useRoute } from 'vue-router'
import { userStore } from '@/store'
import { queryMessageService } from '@/api/message'
import { userGetDetailService } from '@/api/user'
import { userConstant } from '@/constant/constants'
const userStoreInstance = userStore()
const route = useRoute()
const store = ref(null)
const user = ref(null)
const curUser = ref({
  inputContent: '',
  userId: userStoreInstance.user.id,
  storeId: userStoreInstance.user.store?.id,
  status: userStoreInstance.user.status,
  username: userStoreInstance.user.username,
  // 如果是自己查自己，也就是说店家点击私信链接进来的
  type: userStoreInstance.user.store?.id === Number(route.params.id) ? 0 : 1
})

// 搜索联系人
const searchContact = ref('')

const textareaRef = ref('')
const calculateContentLength = computed(() => {
  return curUser.value.inputContent.length
})
const ws = ref()
const sendMessage = async () => {
  if (curUser.value.inputContent.length > 0) {
    const map = new Map()
    // 发送消息
    map.set('content', curUser.value.inputContent)
    map.set('send', curUser.value.userId)
    map.set('type', curUser.value.type)
    // 如果是用户进来，那么说明是接收对象是商店，否则是用户
    map.set('receive', curUser.value.type === 1 ? store.value?.id : user.value?.id)
    ws.value.send(JSON.stringify(Object.fromEntries(map)))
    // 然后清空输入框中的内容
    curUser.value.inputContent = ''
  }

  await queryMessage()
}

const stopEnter = (event) => {
  event.stopPropagation()
  // 如果直接回车
  if (!event.shiftKey && event.key === 'Enter') {
    sendMessage()
  }

  if (event.shiftKey && event.key === 'Enter') {
    handleShiftEnter()
  }
}

const handleShiftEnter = () => {
  const len = curUser.value.inputContent.length
  curUser.value.inputContent = [
    curUser.value.inputContent.slice(0, len),
    '\n',
    curUser.value.inputContent.slice(len)
  ].join('')
}

const queryDetail = async (id) => {
  if (id === null) {
    const res = await GetStoreDetailService(route.params.id)
    store.value = res.data
    return
  }

  if (curUser.value.type === 0) {
    // 如果是自查，那么查询的应该是用户
    const res = await userGetDetailService(id, 1)
    user.value = res.data
    console.log(123)
  } else if (curUser.value.type === 1) {
    // 如果是用户应该查询的是店家
    // 如果不空
    const res = await GetStoreDetailService(id)
    store.value = res.data
  }
}

const Websocket = () => {
  const wsUrl = `ws://${process.env.VUE_APP_API_URL}/ws/chat/` + userStoreInstance.user.id
  let socket

  // 如果浏览器支持，创建 WebSocket 连接
  if ('WebSocket' in window) {
    socket = new WebSocket(wsUrl)
    ws.value = socket
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
  }

  // 从服务器接收到消息
  function handleMessage (msg) {
    console.log('接收到的消息：', msg)
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
// 查询消息
const messageList = ref([])
const contactList = ref([])
// 用户是否点击了某个会话列表
const active = ref(new Map())
const queryMessage = async () => {
  const res = await queryMessageService(curUser.value.userId,
    store.value.id, curUser.value.type)
  messageList.value = res.data.userChatVOList
  // 得到商店联系人
  contactList.value = res.data.storeContactList
  if (contactList.value === null || contactList.value.length === 0) {
    // 如果没有, 就去找用户联系人
    contactList.value = res.data.userContactList
  }
  initActive()
  // 更新
  active.value.set(store.value.id, true)
}
// 初始化
const initActive = () => {
  for (let i = 0; i < contactList.value.length; i++) {
    active.value.set(contactList.value[i].id, false)
  }
}

const yAxis = ref(0)
const SCROLLBAR_HEIGHT = 200
const MAX_SCROLL = SCROLLBAR_HEIGHT - 2 // 减去边框或其他间距
const MIN_SCROLL = 0
const handleScroll = (event) => {
  const delta = event.deltaY || event.detail || -event.wheelDelta
  const direction = delta > 0 ? 'down' : 'up'

  if (direction === 'down') {
    yAxis.value = Math.min(yAxis.value + 23.652, MAX_SCROLL) // 防止超出最大值
  } else {
    yAxis.value = Math.max(yAxis.value - 23.652, MIN_SCROLL) // 防止低于最小值
  }
}

// 点击切换active
const setActive = async (id) => {
  for (const key of active.value.keys()) {
    active.value.set(key, false)
  }
  active.value.set(id, true)

  // 查询当前的消息
  await queryDetail(id)

  queryMessage()
}
const isFilter = ref(false)
const query = ref('')
// 监听搜索框的输入
const handleSearch = (event) => {
  // event.target.value 将包含输入框的新值
  query.value = event.target.value.trim() // 去除前后空白字符
  // 得到关键字后，然后去联系人列表中查询
  if (query.value === '') {
    isFilter.value = false
    return
  }

  // 得到结果后，隐藏其他的会话列表
  isFilter.value = true
}

const getFiled = (contact, filedName, returnName) => {
  let pre = ''
  // 如果不存在
  if (contact[filedName] === null || contact[filedName] === '' || contact[filedName] === undefined) {
    if (returnName === 'avatar') {
      pre = 'uploadAvatar/'
    }
    // 就返回次要的属性
    return pre + contact[returnName]
  }
  if (filedName === 'logo') {
    pre = 'uploadStore/'
  }
  // 否则就返回第一属性
  return pre + contact[filedName]
}
const index = ref(0)
onMounted(async () => {
  await queryDetail(null)
  Websocket()
  await queryMessage()
  setTimeout(queryMessage(), 2000)
  if (curUser.value.type === 0 && index.value === 0) {
    queryDetail(contactList.value[0].id)
    index.value += 1
  }
  textareaRef.value.focus()
  window.addEventListener('wheel', handleScroll)
})
</script>

<template>
    <NavigationComponent></NavigationComponent>
    <div id="ice-container">
        <div class="ww">
            <div class="ww_content">
                <div class="ww_conversation">
                    <div class="ww_user_panel">
                        <div class="ww_user">
                            <div class="ww-title"><img class="ww-icon"
                                    src="https://gw.alicdn.com/imgextra/i4/O1CN01Hcnlgc29APyMf1ApF_!!6000000008027-2-tps-36-36.png">聊天列表
                            </div>
                        </div>
                    </div>
                    <span class="next-input next-medium ww_search">
                        <span class="next-input-inner next-before">
                            <img src="https://gw.alicdn.com/imgextra/i1/O1CN01XCivIy1DC1fESbO1b_!!6000000000179-2-tps-36-36.png"
                                class="search-icon"></span>
                        <input v-model="searchContact" @input="handleSearch" placeholder="搜索最近联系人" height="100%" autocomplete="off" value="">
                    </span>
                    <div class="ww_conversation_list" style="position: relative;">
                        <div style="overflow: visible; height: 0px; width: 0px;">
                            <div
                                style="position: relative; height: 500px; width: 270px; overflow: auto; will-change: transform; direction: ltr;">
                                <div style="height: 594px; width: 100%;">
                                    <div v-for="(contact, index) in contactList" :key="contact.id"
                                    :style="{position: 'absolute', left:'0px', height: '54px', width: '100%', top: isFilter ? '0px' : `${index * 54}px`}">

                                    <div v-if="(!isFilter || (isFilter && contact.storeName?.includes(query)))
                                    || (!isFilter || (isFilter && contact.username?.includes(query)))" @click="setActive(contact.id)" :class="{'conversation-item': true, 'active': active.get(contact.id)}">
                                            <img class="content-close" src="https://gw.alicdn.com/imgextra/i1/O1CN01vX0hGf1IXcPp8vtPz_!!6000000000903-2-tps-200-200.png">
                                            <div class="avatar">
                                                <img class="avatar-img" :src="require('@/assets/' + getFiled(contact, 'logo', 'avatar'))">
                                            </div>
                                            <div class="content">
                                                <!-- 想办法得到最后一条消息 -->
                                                <div class="conversation">
                                                    <div class="name">{{ getFiled(contact, 'storeName', 'username') }}</div>
                                                    <div class="time">11:10</div>
                                                </div>
                                                <div class="conversation-secondary-line">
                                                    <div class="desc">123</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="resize-triggers">
                            <div class="expand-trigger">
                                <div style="width: 270px; height: 501px;"></div>
                            </div>
                            <div class="contract-trigger"></div>
                        </div>
                    </div>
                </div>
                <!-- 如何修改对话的头？？ -->
                <div class="ww_container" v-if="store !== null || user !== null">
                    <div class="ww_header">
                        <div class="conversation-header">
                            <div>
                                <div class="name">{{ curUser.type === 0 ? user?.username : store.storeName }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="ww_body">
                        <div class="ww_box">
                            <div class="ww_message">
                                <div class="message-list">
                                    <div class="rc-scrollbars-container"
                                        style="position: relative; overflow: hidden; width: 100%; height: 100%;">
                                        <div class="rc-scrollbars-view"
                                            style="position: absolute; inset: 0px; overflow: scroll; margin-right: -15px; margin-bottom: -15px;">
                                            <div class="message-item-line" v-for="message in messageList"
                                                :key="message.id">
                                                <div
                                                    :class="{ 'message-item': true, 'self': message.sendId === curUser.userId }">
                                                    <div
                                                        :class="{ 'item': true, 'self': message.sendId === curUser.userId }">
                                                        <!-- 如果是发送的消息等于当前用户,如果发送者的身份不是商家，就返回自己的头像
                                                        ，如果是商家，如果是作为用户  如果是作为商家 -->
                                                        <img v-if="message.sendId === curUser.userId"
                                                            :class="{ 'headPic': true, 'self': message.sendId === curUser.userId }"
                                                            :src="message.status !== userConstant.userStatus.BUSINESSMAN.value ?
                                                            require('@/assets/' + getFiled(message, null, 'avatar')) :
                                                            message.receiveStatus === userConstant.userStatus.BUSINESSMAN.value ?
                                                            require('@/assets/' + getFiled(message, 'logo', null)) : require('@/assets/' + getFiled(message, 'null', 'avatar'))">
                                                        <!-- 如果不等于，也就是说接受者的id等于当前用户, 如果当前用户的身份不是商家
                                                        即发送方是商家 -->
                                                        <img v-else
                                                            :class="{ 'headPic': true, 'self': message.sendId === curUser.userId }"
                                                            :src="message.status !== userConstant.userStatus.BUSINESSMAN.value ?
                                                            require('@/assets/' + getFiled(message, null, 'avatar')):
                                                            require('@/assets/' + getFiled(message, 'logo', null))">
                                                        <div>
                                                            <div
                                                                :class="{ 'first-line': true, 'self': message.sendId === curUser.userId }">
                                                                <div
                                                                    :class="{ 'nick': true, 'self': message.sendId === curUser.userId }">
                                                                    {{ message.sendId === curUser.userId ?
                    (curUser.type === 1 ? curUser.username : store.storeName) :  (curUser.type === 1 ? store.storeName : user.username)}}
                                                                </div>

                                                                <div
                                                                    :class="{ 'time': true, 'self': message.sendId === curUser.userId }">
                                                                    {{ message.createTime }}
                                                                </div>
                                                            </div>
                                                            <div
                                                                :class="{ 'content': true, 'self': message.sendId === curUser.userId }">
                                                                <div data-before-current-y="295.8125"
                                                                    data-appeared="true" data-has-appeared="true">
                                                                    <div
                                                                        class="biz-expression-editor biz-expression-editor-no-ui expression-parser">
                                                                        <div class="editBox">
                                                                            <div class="placeholder">

                                                                            </div>
                                                                            <div class="edit">{{ message.content }}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div
                                                                    style="font-size: 12px; padding: 8px; margin-top: -3px; text-align: right;">
                                                                    <span style="color: rgb(153, 153, 153);"></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="rc-scrollbars-track rc-scrollbars-track-h"
                                            style="position: absolute; right: 2px; bottom: 2px; z-index: 100; border-radius: 3px; left: 2px; height: 6px;">
                                            <div class="rc-scrollbars-thumb rc-scrollbars-thumb-h"
                                                style="position: relative; display: block; height: 100%; cursor: pointer; border-radius: inherit; background-color: rgba(0, 0, 0, 0.2); width: 0px;">
                                            </div>
                                        </div>
                                        <div class="rc-scrollbars-track rc-scrollbars-track-v"
                                            style="position: absolute; right: 2px; bottom: 2px; z-index: 100; border-radius: 5px; top: 2px; width: 10px;">
                                            <div class="rc-scrollbars-thumb rc-scrollbars-thumb-v"
                                                style="position: relative; display: block; height: 172px; cursor: pointer; border-radius: inherit; background-color: rgba(0, 0, 0, 0.2);" :style="{transform: `translateY(${yAxis}px)`}">
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="ww_input">
                                <div class="input-area">
                                    <div class="send-box">
                                        <div class="text-panel">
                                            <div class="biz-expression-editor text-area">
                                                <div class="title"
                                                    style="display: flex; justify-content: flex-start; align-items: center;">
                                                    <div class="maxLength">{{ calculateContentLength }} / 500</div>
                                                </div>
                                                <div class="editBox">
                                                  <!--   <div ref="placeholderRef" class="placeholder">请输入消息，按Enter键 或 点击发送按钮发送（Shift + Enter 进行换行）</div>
                                                    <pre @keyup.enter="stopEnter" ref="textareaRef" class="edit" contenteditable="true" spellcheck="false"></pre> -->
                                                        <el-input v-model="curUser.inputContent"
                                                        resize="none"
                                                        placeholder="请输入消息，按Enter键 或 点击发送按钮发送（Shift + Enter 进行换行）"
                                                        type="textarea" ref="textareaRef" maxlength="500" class="edit"
                                                        @keyup.enter="stopEnter">
                                                        </el-input>
                                                </div>
                                            </div>
                                            <div class="btn-container">
                                                <el-button type="primary"
                                                @click="sendMessage" class="next-btn next-small next-btn-primary send-btn">
                                                    <span class="send-text"
                                                   >发送</span>
                                                </el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ww_tab"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <FooterComponent></FooterComponent>
</template>
<style lang='less' scoped>
body .ww .ww_content,
body .ww .ww_reconnect_container .btn {
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-flex-pack: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
}

body .ww .ww_content .ww_conversation {
    background: #f7f8fa;
    border-bottom-left-radius: 12px;
    border-right: 1px solid #eee;
    border-top-left-radius: 12px;
    width: 270px;
}

body .ww .ww_content .ww_conversation .ww_user_panel {
    color: #7a5222;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    height: 47px;
    letter-spacing: 0;
    margin: 0 18px 10px;
    padding: 18px 0;
    width: 240px;
}

body .ww .ww_content .ww_conversation .ww_user_panel .ww_user {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
}

body .ww .ww_content .ww_conversation .ww_user_panel .ww_user .ww-title {
    color: #111;
    font-size: 11px;
}

body .ww .ww_content .ww_conversation .ww_user_panel .ww_user .ww-icon {
    margin-right: 4px;
    position: relative;
    top: 2px;
    width: 15px;
}

img {
    border-style: none;
}

body .ww .ww_content .ww_conversation .ww_search {
    background: #fff;
    border: none;
    border-radius: 20px;
    color: #999;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    height: 34px;
    letter-spacing: 0;
    margin-bottom: 8px;
    margin-left: 18px;
    margin-top: -12px;
    width: 240px;
}

.next-input.next-medium {
    border-radius: 3px;
    height: 32px;

}

.next-input {
    background-color: #fff;
    border: 1px solid #ddd;
    border-collapse: separate;
    border-spacing: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: inline-table;
    font-size: 0;
    line-height: 1;
    -webkit-transition: all .1s linear;
    transition: all .1s linear;
    vertical-align: middle;
    width: 200px;
}

.next-input.next-medium .next-input-inner,
.next-input.next-medium .next-input-label {
    font-size: 14px;
}

.next-input-control,
.next-input-inner,
.next-input-label {
    background-color: transparent;
    display: table-cell;
    line-height: 1;
    vertical-align: middle;
    white-space: nowrap;
    width: 1px;
}

body .search-icon {
    margin-left: 14px;
    width: 20px;
}

body .ww .ww_content .ww_conversation .ww_search input {
    padding: 1px 0 0 13px !important;
}

.next-input.next-medium input {
    font-size: 14px;
    height: 30px;
    line-height: 30px \0;
    padding: 0 8px;
}

.next-input input,
.next-input textarea {
    background-color: transparent;
    border: none;
    color: #333;
    font-weight: 400;
    margin: 0;
    outline: none;
    padding: 0;
    vertical-align: middle;
    width: 100%;
}

body .ww .ww_content .ww_conversation .ww_conversation_list {
    border-right: 1px solid #eee;
    height: 56vh;
    max-height: 603px;
    min-height: 500px;
    overflow: hidden;
    width: 270px;
}

.resize-triggers,
.resize-triggers>div,
.contract-trigger:before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: -1;
}

.resize-triggers {
    animation: 1ms resizeanim;
    visibility: hidden;
    opacity: 0;
}

.resize-triggers>div {
    background: #eee;
    overflow: auto;
}

.resize-triggers,
.resize-triggers>div,
.contract-trigger:before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: -1;
}

/* message */
body .ww .ww_content .ww_container {
    background: #f0f2f5;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    padding: 20px 20px 0;
}

body .ww .ww_content .ww_container .ww_header {
    height: 29px;
}

.conversation-header .name {
    color: #333;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    height: 22px;
    letter-spacing: 0;
    margin-bottom: 5px;
    width: 100%;
}

body .ww .ww_content .ww_container .ww_body {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    height: 57.7vh;
    max-height: 620px;
    min-height: 526px;
}

body .ww .ww_content .ww_container .ww_body .ww_box {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    background: #f0f2f5;
    border-top: 1px solid #d5dae0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    max-width: 560px;
    min-width: 480px;
    width: 40.7vw;
}

body .ww .ww_content .ww_container .ww_body .ww_box .ww_message {
    background: #f0f2f5;
    height: 72%;
    overflow: hidden;
}

.ww_message .message-list {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 100%;
    position: relative;
    width: 100%;
}

.ww_message .message-list .rc-scrollbars-view {
    padding: 10px 16px;
}

.ww_message .message-list .message-item-line {
    margin-top: 10px;
    min-height: 50px;
    overflow: hidden;
}

.ww_message .message-list .message-item-line .message-item {
    -webkit-box-align: start;
    -moz-box-align: start;
    -ms-flex-align: start;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    -webkit-align-items: flex-start;
    align-items: flex-start;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}

.ww_message .message-list .message-item-line .message-item.self {
    -webkit-box-align: end;
    -moz-box-align: end;
    -ms-flex-align: end;
    -webkit-align-items: flex-end;
    align-items: flex-end;
}

.ww_message .message-list .message-item-line .message-item .item {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -moz-box-orient: horizontal;
    -moz-box-direction: normal;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
}

.ww_message .message-list .message-item-line .message-item .item.self {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -moz-box-orient: horizontal;
    -moz-box-direction: reverse;
    -webkit-flex-direction: row-reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
}

.ww_message .message-list .message-item-line .message-item .item .headPic {
    background: #d8d8d8;
    border-radius: 18px;
    height: 36px;
    margin: 0 10px 0 0;
    min-width: 36px;
    width: 36px;
}

.ww_message .message-list .message-item-line .message-item .item .headPic.self {
    margin: 0 0 0 10px;
}

.ww_message .message-list .message-item-line .message-item .item .first-line {
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -moz-box-orient: horizontal;
    -moz-box-direction: normal;
    -webkit-align-items: center;
    align-items: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    margin-bottom: 10px;
}

.ww_message .message-list .message-item-line .message-item .item .first-line.self {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -moz-box-orient: horizontal;
    -moz-box-direction: reverse;
    -webkit-flex-direction: row-reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
}

.ww_message .message-list .message-item-line .message-item .item .first-line .nick {
    color: #303f9f;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 14px;
    margin: 0 8px 0 0;
}

.ww_message .message-list .message-item-line .message-item .item .first-line .nick.self {
    color: #999;
    margin: 0 0 0 8px;
}

.ww_message .message-list .message-item-line .message-item .item .first-line .time {
    color: #959595;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 14px;
    visibility: visible;
}

.ww_message .message-list .message-item-line .message-item .item .content {
    display: inline-block;
}

.ww_message .message-list .message-item-line .message-item .item .content.self {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: reverse;
    -moz-box-orient: horizontal;
    -moz-box-direction: reverse;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: row-reverse;
    -ms-flex-direction: row-reverse;
    flex-direction: row-reverse;
}

body .ww .ww_content .ww_container .expression-parser {
    background: #fff;
    border-radius: 6px;
}

body .ww .ww_content .ww_container .self .expression-parser {
    background: #cfe2f7;
    border-radius: 6px;
}

.biz-expression-editor-no-ui {
    border: none;
}

.biz-expression-editor,
.biz-expression-editor * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
}

.biz-expression-editor {
    padding: 8px;
    -webkit-transition: border .3s ease-out;
    -moz-transition: border .3s ease-out;
    transition: border .3s ease-out;
}

.biz-expression-editor .editBox {
    position: relative;
}

.biz-expression-editor-no-ui .edit,
.biz-expression-editor-no-ui .placeholder {
    padding: 0;
}

.biz-expression-editor .placeholder {
    user-modify: read-write-plaintext-only;
    color: #999;
    cursor: text;
    font-size: 14px;
    height: auto;
    left: 0;
    outline: none;
    overflow-y: auto;
    padding: .5em 0;
    position: relative;
    position: absolute;
    top: 0;
    white-space: normal;
    word-break: break-all;
}

body .ww .ww_content .ww_container .self .expression-parser .edit {
    height: auto;
    white-space: break-spaces;
}

body .ww .ww_content .ww_container .expression-parser .edit {
    height: auto;
    white-space: break-spaces;
}

.biz-expression-editor-no-ui .edit,
.biz-expression-editor-no-ui .placeholder {
    padding: 0;
}

.biz-expression-editor .edit {
    user-modify: read-write-plaintext-only;
    color: #333;
    cursor: text;
    font-family: inherit;
    font-size: 14px;
    height: 100px;
    margin: 0;
    outline: none;
    overflow-y: auto;
    padding: .5em 0;
    position: relative;
    white-space: normal;
    word-break: break-all;
}
::v-deep(.el-textarea__inner) {
    height: 100%
}
/* 输入框 */
body .ww .ww_content .ww_container .ww_body .ww_box .ww_input {
    background: #f0f2f5;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #d5dae0;
    height: 165px;
    position: relative;
}

.input-area {
    height: 100%;
}

.input-area .send-box .text-panel {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 100%;
}

.input-area .send-box .text-panel .text-area {
    padding: 15px 0 20px;
}

.biz-expression-editor .title .maxLength {
    color: #999;
    font-size: 12px;
}

.input-area .send-box .text-panel .btn-container {
    -webkit-box-pack: end;
    -moz-box-pack: end;
    -ms-flex-pack: end;
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    bottom: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    margin-right: 16px;
    position: absolute;
    right: -20px;
}

.input-area .send-box .text-panel .send-btn {
    background-color: #3d7fff;
    border-radius: 12px;
    color: #fff;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    height: 24px;
    letter-spacing: 0;
    text-align: center;
    width: 66px;
}

// .input-area .send-box .text-panel .send-text {
//     border-right: .5px solid hsla(0, 0%, 100%, .5);
//     font-size: 12px;
//     font-weight: 600;
//     margin-left: -15px;
//     padding-right: 5px;
// }

/* 联系人 */
.conversation-item {
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    height: 54px;
    margin-left: 10px;
}

.conversation-item:hover {
    background-color: #FFFAC8;
}

.conversation-item.active {
    background: #e6e9ed;
    border-radius: 4px;
}

.conversation-item .content-close {
    margin-left: 1px;
    margin-right: 1px;
    visibility: hidden;
    width: 9px;
}

.conversation-item .avatar {
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-flex-pack: center;
    -webkit-align-items: center;
    align-items: center;
    border-radius: 8px;
    color: #fff;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 20px;
    height: 36px;
    -webkit-justify-content: center;
    justify-content: center;
    width: 36px;
}

.conversation-item .avatar .avatar-img {
    background-size: cover;
    border-radius: 18px;
    height: 36px;
    min-height: 36px;
    min-width: 36px;
    width: 36px;
}

.conversation-item .content {
    margin-left: 10px;
    width: 190px;
}

.conversation-item .content .conversation {
    -webkit-box-pack: justify;
    -moz-box-pack: justify;
    -ms-flex-pack: justify;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
    margin-bottom: 6px;
}

.conversation-item .content .conversation .name {
    color: #333;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    letter-spacing: 0;
    line-height: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 110px;
}

.conversation-item .content .conversation .time {
    color: #8a8a8a;
    font-family: PingFangSC-Regular;
    font-size: 10px;
    letter-spacing: 0;
    text-align: right;
}

.conversation-item .content .conversation-secondary-line {
    -webkit-box-pack: justify;
    -moz-box-pack: justify;
    -ms-flex-pack: justify;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-justify-content: space-between;
    justify-content: space-between;
}

.conversation-item .content .conversation-secondary-line .desc {
    -webkit-box-flex: 150px;
    -moz-box-flex: 150px;
    color: #8a8a8a;
    -webkit-flex: 150px;
    -ms-flex: 150px;
    flex: 150px;
    font-family: PingFangSC-Regular;
    font-size: 11px;
    letter-spacing: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
}
</style>
