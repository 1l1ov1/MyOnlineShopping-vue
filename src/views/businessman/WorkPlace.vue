<script setup>
import {
  UserFilled,
  //   Promotion,
  HomeFilled,
  User,
  EditPen,
  SwitchButton,
  CaretBottom,
  PieChart,
  Box
} from '@element-plus/icons-vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { userStore } from '@/store/index.js'
import { onMounted, ref } from 'vue'
import { userLogoutService } from '@/api/user.js'
import { useRouter } from 'vue-router'
import { BASE_URL } from '@/constant/baseUrl.js'
import { websocketTypeConstant } from '@/constant/constants.js'
const userStoreInstance = userStore()
const router = useRouter()

const audioVo = ref()
const audioVo2 = ref()
const onCommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm('你确认退出在线商城吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确 认',
      cancelButtonText: '取消'
    })
    await userLogoutService()
    // 清除本地数据（token + userInfo）
    userStoreInstance.removeToken()
    userStoreInstance.setUser({})
    router.push('/login')
  } else if (command === '/') {
    router.push('/')
  } else {
    router.push(`/managerBack/person/${command}`)
  }
}

// 导航结束后回调
const GuideFinished = () => {
  userStoreInstance.firstComing = false
}

// 当关闭引导时
const onClose = () => {
  userStoreInstance.firstComing = false
}

// 当引导状态发生改变的时候的回调
const onChange = (number) => {
  enableClick.value = false
  if (number === 2 || number === 17) {
    enableClick.value = true
  }
}

// 启用蒙层时，target 元素区域是否可以点击。
const enableClick = ref(false)
const open = ref(true)
// 当商家进入后台，就开始进行socket连接
const Websocket = () => {
  const wsUrl = `ws://${BASE_URL}/api/ws/store/` + userStoreInstance.user.store.id
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
  }

  // 从服务器接收到消息
  function handleMessage (msg) {
    // 清空时间
    audioVo.value.currentTime = 0
    audioVo2.value.currentTime = 0
    const jsonMsg = JSON.parse(msg.data)
    // 如果是下订单消息
    if (jsonMsg.type === 1) {
      audioVo2.value.play()
    } else if (jsonMsg.type === 2) {
      // 如果是用户催单
      audioVo.value.play()
    }
    // 显示数据
    ElNotification.success({
      title: websocketTypeConstant.getWebSocketTypeLabel(jsonMsg.type),
      dangerouslyUseHTMLString: true,
      message: `${
            jsonMsg.type === 1
              ? `<span>您有1个<span style=color:#419EFF>订单待处理</span>,${jsonMsg.content},请及时查收</span>`
              : `${jsonMsg.content}<span style='color:#419EFF;cursor: pointer'>去处理</span>`
          }`,
      type: 'warning'
    })
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
onMounted(() => {
  userStoreInstance.getUser()
  Websocket()
  if (!userStoreInstance.firstComing) {
    open.value = false
  }
})
</script>

<template>
    <!--
    el-menu 整个菜单组件
     :default-active="$route.path"  配置默认高亮的菜单项
     router                         router选项开启：el-menu-item 的 index 就是点击跳转的路径

    el-menu-item 菜单项
     index="/article/channel" 配置的是访问的跳转路径，配合 :default-active的值，实现高亮
   -->
   <audio ref="audioVo"
               hidden>
          <source src="@/assets/用户催单提示音.mp3" type="audio/mp3" />
        </audio>
        <audio ref="audioVo2"
               hidden>
          <source src="@/assets/新订单提示音.mp3" type="audio/mp3" />
    </audio>
    <el-container class="layout-container">
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323" :default-active="$route.path"
                text-color="#fff" router>
                <el-menu-item index="/businessBack/statistics" id="business-statistics-item">
                    <el-icon>
                        <PieChart />
                    </el-icon>
                    <span>数据统计</span>
                </el-menu-item>
                <el-menu-item index="/businessBack/withdrawRecord" id="business-withdraw-item">
                    <el-icon>
                        <PieChart />
                    </el-icon>
                    <span>提现记录</span>
                </el-menu-item>
                <el-menu-item index="/businessBack/goods" id="business-goods-item">
                    <el-icon>
                        <Box />
                    </el-icon>
                    <span>商品管理</span>
                </el-menu-item>
                <el-menu-item index="/businessBack/store" id="business-store-item">
                   <!--  <el-icon>
                        <Promotion />
                    </el-icon> -->
                    <svg t="1711414354779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6322" width="20" height="20"><path d="M243.2 704h537.6V521.6a35.2 35.2 0 0 1 35.2-35.2h6.4a35.2 35.2 0 0 1 35.2 35.2v339.2a35.072 35.072 0 0 1-3.2576 14.8032A51.2192 51.2192 0 0 1 806.4 908.8H217.6a51.2192 51.2192 0 0 1-47.9424-33.1968A35.072 35.072 0 0 1 166.4 860.8v-339.2a35.2 35.2 0 0 1 35.2-35.2h6.4a35.2 35.2 0 0 1 35.2 35.2V704z m677.7472-358.4l-0.1152 0.1984c0.512 4.128 0.768 8.3328 0.768 12.6016 0 56.5568-45.8432 102.4-102.4 102.4s-102.4-45.8432-102.4-102.4c0 56.5568-45.8432 102.4-102.4 102.4s-102.4-45.8432-102.4-102.4c0 56.5568-45.8432 102.4-102.4 102.4s-102.4-45.8432-102.4-102.4c0 56.5568-45.8432 102.4-102.4 102.4s-102.4-45.8432-102.4-102.4c0-4.3328 0.2688-8.608 0.7936-12.8h817.7536z m-3.2512-38.4H112.0256l47.8336-155.8272A51.2 51.2 0 0 1 208.8 115.2h612.0832a51.2 51.2 0 0 1 48.9408 36.16L917.696 307.2z" fill="#59AAFF" p-id="6323"></path></svg>
                    <span>&nbsp;我的店铺</span>
                </el-menu-item>
                <el-sub-menu index="/businessBack/orders" id="business-orders-item">
                    <template #title>
                        <!-- <el-icon>
                            <UserFilled />
                        </el-icon> -->
                        <svg t="1711414402317" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7331" width="20" height="20"><path d="M714.666667 117.333333v64h170.666666v704h-746.666666v-704h170.666666v-64h405.333334z m-405.333334 128h-106.666666v576h618.666666v-576h-106.666666v64h-405.333334v-64zM704 618.666667v64H320v-64h384z m0-192v64H320v-64h384zM650.666667 181.333333h-277.333334v64h277.333334v-64z" fill="#1677FF" p-id="7332"></path></svg>
                        <span>&nbsp;订单管理</span>
                    </template>
                    <el-menu-item index="/businessBack/orders/all">
                        全部订单
                    </el-menu-item>
                    <el-menu-item index="/businessBack/orders/UnfilledOrders">
                        未发货订单
                    </el-menu-item>
                    <el-menu-item index="/businessBack/orders/ShippedOrders">
                        已发货订单
                    </el-menu-item>
                    <el-menu-item index="/businessBack/orders/RefundOrder">
                        退款订单
                    </el-menu-item>
                    <el-menu-item index="/businessBack/orders/UserReceiveProduct">
                        用户已签收订单
                    </el-menu-item>
                    <el-menu-item index="/businessBack/orders/SuccessfulOrder">
                        交易完成订单
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/businessBack/report/comment-report">
                    <svg t="1713537420374" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="2717" width="20" height="20">
                            <path
                              d="M924.8 908H284v-32h640.8c8 0 15.2-4 20-11.2 4-7.2 4-15.2 0-22.4L532 128c-4-7.2-11.2-11.2-20-11.2-8 0-15.2 4-20 11.2l-320 555.2-28-16L464.8 112c9.6-16.8 27.2-27.2 47.2-27.2 20 0 37.6 10.4 47.2 27.2l412.8 714.4c9.6 16.8 9.6 37.6 0 54.4-9.6 17.6-27.2 27.2-47.2 27.2z"
                              fill="#666666" p-id="2718"></path>
                            <path d="M517.6 737.6m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#666666" p-id="2719">
                            </path>
                            <path
                              d="M517.6 672c-17.6 0-32-14.4-32-32V416c0-17.6 14.4-32 32-32s32 14.4 32 32v224c0 17.6-14.4 32-32 32z"
                              fill="#666666" p-id="2720"></path>
                            <path d="M158.4 675.2m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2721">
                            </path>
                            <path d="M284 892m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2722">
                            </path>
                            <path d="M208 892m-16 0a16 16 0 1 0 32 0 16 16 0 1 0-32 0Z" fill="#666666" p-id="2723">
                            </path>
                    </svg>
                    <span>&nbsp;评论举报管理</span>
                </el-menu-item>
                <el-sub-menu index="/businessBack/person" id="business-person-info-item">
                    <!-- 多级菜单的标题 - 具名插槽 title-->

                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <!-- 展开内容 -->
                    <el-menu-item index="/businessBack/person/profile">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/businessBack/person/password">
                        <el-icon>
                            <EditPen />
                        </el-icon>
                        <span>重置密码</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>
                <div>
                    商家：<strong>{{
                userStoreInstance.user.username
            }}</strong>
                </div>
                <el-dropdown placement="bottom-end" @command="onCommand">
                    <!-- 展示给用户，默认看到的 -->
                    <span class="el-dropdown__box">
                        <el-avatar :src=" require('@/assets/uploadAvatar/' + userStoreInstance.user.avatar)" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <!-- 折叠的下拉部分 -->

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="/" :icon="HomeFilled">首页</el-dropdown-item>
                            <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
            <el-footer>在线商城 ©2024 Created by 万一苇</el-footer>
        </el-container>
    </el-container>

    <el-tour v-model="open" @finish="GuideFinished"
    @change="onChange" @close="onClose"
    :target-area-clickable="enableClick" :mask="{
     style: {
           boxShadow: 'insert 0 0 15px'
            }
    }">
        <el-tour-step target=".el-header" title="欢迎( ＾∀＾）／欢迎＼( ＾∀＾）"
            description="店家您好，欢迎来到您的工作界面，接下来由我来告诉您每个工作区的功能吧(*^_^*)" />
        <el-tour-step title="拥有的功能" target=".el-menu--vertical" description="这是您可以拥有的功能，让我一一为您解答吧🤭(●'◡'●)" />
        <el-tour-step target="#business-goods-item" title="商品管理" description="这里是您管理店家商品的地方哦，请点击它" />
        <el-tour-step target=".el-main" placement="left-start" title="商品管理" description="这个区域是您管理商品，即查询、修改和删除的地方。" />
        <el-tour-step target=".header" title="添加和批量删除按钮" description="这里有两个按钮，分别为添加商品按钮和批量删除商品按钮。" />
        <el-tour-step target=".el-form--default" title="根据条件搜索商品"
            description="这个部分你可以输入条件，然后点击搜索按钮进行搜索或者点击重置按钮清空搜索条件。" />
        <el-tour-step target=".el-table" title="查询结果" type="primary" description="这个表格是分页查询后查询到的结果。展示您商店的所有商品" />
        <el-tour-step target=".el-checkbox" title="单选框" description="当您勾选最上层的单选框时，会将这一页的所有行选中
        ，而点击其中的某一个单选框会将该行选中" />
        <el-tour-step target=".is-plain" title="修改和删除" description="这两个按钮分别为修改和删除该行账号信息" />
        <el-tour-step target=".el-pagination" title="分页" description="这是分页部分" />
        <el-tour-step target=".el-pagination__jump " title="跳页" description="您可以在输入框中输入您想去的页数并按回车进行跳页" />
        <el-tour-step target=".el-pagination__total" title="总页数" description="这是所有数据条数" />
        <el-tour-step target=".el-pagination__sizes" title="每页展示数据条数" description="这是展示每一页最多展示的条数，点击可以修改" />
        <el-tour-step target=".btn-prev" title="向前按钮" description="这是去往前面一页" />
        <el-tour-step target=".el-pager" title="页码数" description="这是所有数据按每页展示最多数据进行的计算得出的结果" />
        <el-tour-step target=".btn-next" title="向后按钮" description="这是去往后面一页" />
        <el-tour-step target="#business-statistics-item" title="数据统计" description="这里是您管理平台数据的地方哦" />
        <el-tour-step target="#business-statistics-item" title="数据统计" description="请点击它" />
        <el-tour-step target=".el-main" placement="left-start" title="数据统计" description="这个区域是您可以查看平台的营业额情况，分别可以选择昨天、近7日、本周和本月的营业额情况" />
        <el-tour-step target=".el-button" placement="left-start" title="导出数据" description="点击这个按钮，你可以将本月的营业额数据导出为Excel文档" />

        <el-tour-step target="#business-withdraw-item" title="提现记录" description="这里是管理平台抽成的地方，每当用户购买商品时，平台都会从商家那里抽取平台费。" />
        <el-tour-step target="#business-store-item" title="商店管理" description="这里是您管理自己店铺的地方哦" />
        <el-tour-step target="#business-orders-item" title="订单管理" description="这里是您管理订单的地方哦" />
        <el-tour-step target="#business-person-info-item" title="个人信息" description="这里是您的个人信息，您可以在这里修改您的个人资料" />
        <el-tour-step target=".el-dropdown" title="头像" description="最后，在这个地方您也可以退出在线商城" />

        <!-- 自定义指示器 -->

        <template #indicators="{ current, total }">
            <span>{{ current + 1 }} / {{ total }}</span>
        </template>
    </el-tour>
</template>

<style lang="less" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/logo2.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
