<script setup>
import {
  //   Promotion,
  UserFilled,
  HomeFilled,
  User,
  EditPen,
  SwitchButton,
  CaretBottom,
  PieChart
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

import { userStore } from '@/store/index.js'
import { onMounted, ref } from 'vue'
import { userLogoutService } from '@/api/user.js'
import { useRouter } from 'vue-router'
const userStoreInstance = userStore()
const router = useRouter()

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
onMounted(() => {
  userStoreInstance.getUser()

  // 如果不是第一次来访问，则关闭引导
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
    <el-container class="layout-container">
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#232323" :default-active="$route.path"
                text-color="#fff" router>
                <el-menu-item index="/managerBack/statistic" id="manage-statistic-item">
                    <el-icon>
                        <PieChart />
                    </el-icon>
                    <span>数据统计</span>
                </el-menu-item>
                <el-menu-item v-if="userStoreInstance.user.status === 0" index="/managerBack/withdrawRecord"
                    id="manage-withdraw-item">
                    <el-icon>
                        <PieChart />
                    </el-icon>
                    <span>提现记录</span>
                </el-menu-item>
                <el-menu-item index="/managerBack/user" id="manage-user-item">
                    <el-icon>
                        <UserFilled />
                    </el-icon>
                    <span>用户管理</span>
                </el-menu-item>
                <el-menu-item index="/managerBack/goods" id="manage-goods-item">
                    <!--  <el-icon>
                        <Promotion />
                    </el-icon> -->
                    <svg t="1711414207044" class="icon" viewBox="0 0 1025 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="3453" width="20" height="20">
                        <path
                            d="M67.503669 314.247662 0.290781 967.374566C-2.877087 998.157824 20.686742 1024 51.54763 1024L972.465964 1024C1003.33056 1024 1026.870025 997.958532 1023.722637 967.374566L956.509749 314.247662C953.634251 286.30498 929.70037 264.827586 901.665015 264.827586L726.307134 264.827586 726.307134 212.032812C726.307134 94.840497 631.186361 0 513.731796 0 396.307421 0 301.156634 94.931209 301.156634 212.032812L301.275454 264.827586 122.348403 264.827586C94.426394 264.827586 70.359746 286.495285 67.503669 314.247662ZM372.014963 335.448276 372.014963 212.032812C372.014963 133.917343 435.458119 70.62069 513.731796 70.62069 592.045903 70.62069 655.448629 133.836729 655.448629 212.032812L655.448629 335.448276 901.665015 335.448276C893.404337 335.448276 886.856739 329.572723 886.02112 321.453021L953.234008 974.579924C952.100193 963.562355 961.304717 953.37931 972.465964 953.37931L51.54763 953.37931C62.569931 953.37931 71.907399 963.619646 70.779586 974.579924L137.992298 321.453021C137.142378 329.713311 130.772392 335.448276 122.348403 335.448276L372.014963 335.448276ZM655.448629 335.448276 655.448629 494.174084C655.448629 513.675458 671.310919 529.484429 690.87797 529.484429 710.444844 529.484429 726.307134 513.675458 726.307134 494.174084L726.307134 264.827586 371.896143 264.827586 371.896143 335.448276 655.448629 335.448276ZM372.014963 335.448276 301.156634 335.448276 301.156634 494.174084C301.156634 513.675458 317.018748 529.484429 336.585799 529.484429 356.15285 529.484429 372.014963 513.675458 372.014963 494.174084L372.014963 335.448276Z"
                            fill="#389BFF" p-id="3454"></path>
                    </svg>
                    <span>&nbsp;商品管理</span>
                </el-menu-item>
                <el-menu-item index="/managerBack/category" id="manage-category-item">
                    <svg t="1711414928090" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="8329" width="20" height="20">
                        <path
                            d="M345.6 441.6H179.2c-53.333333 0-96-42.666667-96-96V179.2c0-53.333333 42.666667-96 96-96h166.4c53.333333 0 96 42.666667 96 96v166.4c0 53.333333-42.666667 96-96 96zM179.2 147.2c-17.066667 0-32 14.933333-32 32v166.4c0 17.066667 14.933333 32 32 32h166.4c17.066667 0 32-14.933333 32-32V179.2c0-17.066667-14.933333-32-32-32H179.2zM345.6 940.8H179.2c-53.333333 0-96-42.666667-96-96v-166.4c0-53.333333 42.666667-96 96-96h166.4c53.333333 0 96 42.666667 96 96v166.4c0 51.2-42.666667 96-96 96zM179.2 646.4c-17.066667 0-32 14.933333-32 32v166.4c0 17.066667 14.933333 32 32 32h166.4c17.066667 0 32-14.933333 32-32v-166.4c0-17.066667-14.933333-32-32-32H179.2zM844.8 441.6h-166.4c-53.333333 0-96-42.666667-96-96V179.2c0-53.333333 42.666667-96 96-96h166.4c53.333333 0 96 42.666667 96 96v166.4c0 53.333333-44.8 96-96 96zM678.4 147.2c-17.066667 0-32 14.933333-32 32v166.4c0 17.066667 14.933333 32 32 32h166.4c17.066667 0 32-14.933333 32-32V179.2c0-17.066667-14.933333-32-32-32h-166.4zM844.8 940.8h-166.4c-53.333333 0-96-42.666667-96-96v-166.4c0-53.333333 42.666667-96 96-96h166.4c53.333333 0 96 42.666667 96 96v166.4c0 51.2-44.8 96-96 96z m-166.4-294.4c-17.066667 0-32 14.933333-32 32v166.4c0 17.066667 14.933333 32 32 32h166.4c17.066667 0 32-14.933333 32-32v-166.4c0-17.066667-14.933333-32-32-32h-166.4z"
                            fill="#0000FF" p-id="8330"></path>
                    </svg>
                    <span>&nbsp;分类管理</span>
                </el-menu-item>
                <el-menu-item index="/managerBack/store" id="manage-store-item">
                    <!--  <el-icon>
                        <Promotion />
                    </el-icon> -->
                    <svg t="1711414354779" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="6322" width="20" height="20">
                        <path
                            d="M243.2 704h537.6V521.6a35.2 35.2 0 0 1 35.2-35.2h6.4a35.2 35.2 0 0 1 35.2 35.2v339.2a35.072 35.072 0 0 1-3.2576 14.8032A51.2192 51.2192 0 0 1 806.4 908.8H217.6a51.2192 51.2192 0 0 1-47.9424-33.1968A35.072 35.072 0 0 1 166.4 860.8v-339.2a35.2 35.2 0 0 1 35.2-35.2h6.4a35.2 35.2 0 0 1 35.2 35.2V704z m677.7472-358.4l-0.1152 0.1984c0.512 4.128 0.768 8.3328 0.768 12.6016 0 56.5568-45.8432 102.4-102.4 102.4s-102.4-45.8432-102.4-102.4c0 56.5568-45.8432 102.4-102.4 102.4s-102.4-45.8432-102.4-102.4c0 56.5568-45.8432 102.4-102.4 102.4s-102.4-45.8432-102.4-102.4c0 56.5568-45.8432 102.4-102.4 102.4s-102.4-45.8432-102.4-102.4c0-4.3328 0.2688-8.608 0.7936-12.8h817.7536z m-3.2512-38.4H112.0256l47.8336-155.8272A51.2 51.2 0 0 1 208.8 115.2h612.0832a51.2 51.2 0 0 1 48.9408 36.16L917.696 307.2z"
                            fill="#59AAFF" p-id="6323"></path>
                    </svg>
                    <span>&nbsp;商店管理</span>
                </el-menu-item>
                <el-sub-menu index="/managerBack/apply" id="manage-apply-item">
                    <template #title>
                        <svg t="1711348932273" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="6762" width="20" height="20">
                            <path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#72AEFD"
                                p-id="6763"></path>
                            <path d="M650.5 251.7l-74.7 74.7-93.6-93.6 74.7-74.7" fill="#FFFFFF" p-id="6764"></path>
                            <path
                                d="M556.9 158.1c0.6-0.6 1.5-0.6 2.1 0l91.5 91.5c0.6 0.6 0.6 1.5 0 2.1M458.4 256.6l93.7 93.6-189.6 189.6-93.6-93.7zM245.1 469.9l93.7 93.6-108.5 14.8z"
                                fill="#FFFFFF" p-id="6765"></path>
                            <path
                                d="M813 702.3c0 20.9-16.9 37.8-37.8 37.8H259.7c-20.9 0-37.8-16.9-37.8-37.8s16.9-37.8 37.8-37.8h515.5c20.9 0 37.8 16.9 37.8 37.8zM813 551.1c0 20.9-16.9 37.8-37.8 37.8H567.1c-20.9 0-37.8-16.9-37.8-37.8s16.9-37.8 37.8-37.8h208.1c20.9 0 37.8 16.9 37.8 37.8z"
                                fill="#E9F5FF" p-id="6766"></path>
                        </svg>
                        <span>&nbsp;申请管理</span>
                    </template>
                    <el-menu-item index="/managerBack/apply/all">所有申请</el-menu-item>
                    <el-menu-item index="/managerBack/apply/under_review">待审核的申请</el-menu-item>
                    <el-menu-item index="/managerBack/apply/approved">已通过的申请</el-menu-item>
                    <el-menu-item index="/managerBack/apply/review_rejection">被拒绝的申请</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="/managerBack/orders" id="manage-orders-item">
                    <template #title>
                        <!--  <el-icon>
                            <UserFilled />
                        </el-icon> -->
                        <svg t="1711414402317" class="icon" viewBox="0 0 1024 1024" version="1.1"
                            xmlns="http://www.w3.org/2000/svg" p-id="7331" width="20" height="20">
                            <path
                                d="M714.666667 117.333333v64h170.666666v704h-746.666666v-704h170.666666v-64h405.333334z m-405.333334 128h-106.666666v576h618.666666v-576h-106.666666v64h-405.333334v-64zM704 618.666667v64H320v-64h384z m0-192v64H320v-64h384zM650.666667 181.333333h-277.333334v64h277.333334v-64z"
                                fill="#1677FF" p-id="7332"></path>
                        </svg>
                        <span>&nbsp;订单管理</span>
                    </template>
                    <el-menu-item index="/managerBack/orders/all">
                        全部订单
                    </el-menu-item>
                    <el-menu-item index="/managerBack/orders/UnfilledOrders">
                        未发货订单
                    </el-menu-item>
                    <el-menu-item index="/managerBack/orders/ShippedOrders">
                        已发货订单
                    </el-menu-item>
                    <el-menu-item index="/managerBack/orders/RefundOrder">
                        退款订单
                    </el-menu-item>
                    <el-menu-item index="/managerBack/orders/UserReceiveProduct">
                        用户已签收订单
                    </el-menu-item>
                    <el-menu-item index="/managerBack/orders/SuccessfulOrder">
                        交易完成订单
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/managerBack/report/comment-report">
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
                <el-sub-menu index="/managerBack/person" id="manage-person-info-item">
                    <!-- 多级菜单的标题 - 具名插槽 title-->

                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>个人中心</span>
                    </template>
                    <!-- 展开内容 -->
                    <el-menu-item index="/managerBack/person/profile">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>基本资料</span>
                    </el-menu-item>
                    <el-menu-item index="/managerBack/person/password">
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
                    管理员：<strong>{{
                userStoreInstance.user.username
            }}</strong>
                </div>
                <el-dropdown placement="bottom-end" @command="onCommand">
                    <!-- 展示给用户，默认看到的 -->
                    <span class="el-dropdown__box">
                        <el-avatar :src="require('@/assets/uploadAvatar/' + userStoreInstance.user.avatar)" />
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
            description="管理员您好，欢迎来到您的工作界面，接下来由我来告诉您每个工作区的功能吧(*^_^*)" />
        <el-tour-step title="拥有的功能" target=".el-menu--vertical" description="这是您可以拥有的功能，让我一一为您解答吧🤭(●'◡'●)" />
        <el-tour-step target="#manage-user-item" title="用户管理" description="请点击它。" />
        <el-tour-step target=".el-main" placement="left-start" title="用户管理" description="这个区域是您管理用户的账号，即查询、修改和删除的地方。" />
        <el-tour-step target=".header" title="添加和批量删除按钮" description="这里有两个按钮，分别为添加用户按钮和批量删除用户按钮。" />
        <el-tour-step target=".el-form--default" title="根据条件搜索用户"
            description="这个部分你可以输入条件，然后点击搜索按钮进行搜索或者点击重置按钮清空搜索条件。" />
        <el-tour-step target=".el-table" title="查询结果" type="primary" description="这个表格是分页查询后查询到的结果，
        您可以在这里看到所有账户状态，注意当某一行账号的身份为管理员时，您无法对其账号状态进行修改。当某一行账号的账号状态为禁用的时候，
        会用颜色标记出这一行来提示您。并且用户修改用户的当前账号状态将是永久性的。" />
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
        <el-tour-step target="#manage-statistic-item" title="数据统计" description="这里是您管理平台数据的地方哦" />
        <el-tour-step target="#manage-statistic-item" title="数据统计" description="请点击它" />
        <el-tour-step target=".el-main" placement="left-start" title="数据统计" description="这个区域是您可以查看平台的营业额情况，分别可以选择昨天、近7日、本周和本月的营业额情况" />
        <el-tour-step target=".el-button" placement="left-start" title="导出数据" description="点击这个按钮，你可以将本月的营业额数据导出为Excel文档" />

        <el-tour-step target="#manage-withdraw-item" title="提现记录" description="这里是管理平台抽成的地方，每当用户购买商品时，平台都会从商家那里抽取平台费。" />
        <el-tour-step target="#manage-goods-item" title="商品管理" description="这里是您管理店家商品的地方哦" />
        <el-tour-step target="#manage-category-item" title="分类管理" description="这里是您管理商品分类的地方哦" />
        <el-tour-step target="#manage-store-item" title="商店管理" description="这里是您管理店家的地方哦" />
        <el-tour-step target="#manage-apply-item" title="用户申请开店管理" description="这里是您管理用户开店的地方哦" />
        <el-tour-step target="#manage-orders-item" title="订单管理" description="这里是您管理店家订单的地方哦" />
        <el-tour-step target="#manage-person-info-item" title="个人信息" description="这里是您的个人信息，您可以在这里修改您的个人资料" />
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
