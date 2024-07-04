<script setup>
import { userStore } from '@/store'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { userLogoutService, userRechargeService } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import { userConstant } from '@/constant/constants'
import { checkFiledIsNotNull } from '@/utils/FiledUtils'
const userStoreInstance = userStore()
const router = useRouter()
onMounted(() => {
  if (checkFiledIsNotNull(userStoreInstance.token)) {
    // 如果用户登录过，就去获取用户的信息
    userStoreInstance.getUser()
  }
})

const props = defineProps({
  refreshNavigation: Boolean
})
const emit = defineEmits(['updateUserInfo'])
watch(
  () => props.refreshNavigation,
  (newValue) => {
    if (newValue) {
      userStoreInstance.getUser()
    }
    emit('updateUserInfo', false)
  }
)
// 退出
const logout = async () => {
  // 如果没有登录
  if (!userStoreInstance.user) {
    ElMessage.error('您并没有登录账号，无法退出')
    return
  }
  // 如果登录了
  await userLogoutService()
  // 删除token
  userStoreInstance.removeToken()
  // 删除refreshToken
  userStoreInstance.removeRefreshToken()
  // 清空用户信息
  userStoreInstance.setUser({})
  ElMessage.success('账号已退出')
  router.push('/login')
}

const goToBack = () => {
  const status = userStoreInstance.user.status
  // 如果是管理员
  if (status === userConstant.userStatus.SUPER_ADMINISTRATOR.value ||
      status === userConstant.userStatus.MANAGER.value) {
    router.push('/managerBack')
    // 如果是商家
  } else if (status === userConstant.userStatus.BUSINESSMAN.value) {
    router.push('/businessBack')
  }
}
// 充值
const openRecharge = () => {
  ElMessageBox.prompt('请输入充值金额', 'Tip', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    // 最大9999999 最小1
    inputPattern:
      /^[1-9]\d{0,6}(\.[0-9]{1,2})?$/,
    inputErrorMessage: '非法金额, 最小为1 最大为999999.99'
  })
    .then(async ({ value }) => {
      await userRechargeService(value)
      ElMessage({
        type: 'success',
        message: '充值成功φ(゜▽゜*)♪'
      })
      userStoreInstance.getUser()
    })
    .catch(() => {
      /* ElMessage({
        type: 'error',
        message: 'Input canceled'
      }) */
    })
}
</script>

<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
    @select="handleSelect">
    <el-sub-menu index="0">
      <template #title><el-text class="mx-1" type="primary"> {{ userStoreInstance.user === null ? '亲，您还未登录' :
    userStoreInstance.user.isOnline
      === 1 ? userStoreInstance.user.username + ' 欢迎光临' : '亲，您还未登录' }}
        </el-text></template>
      <el-menu-item index="0-1">
        <el-text type="primary" id="moneyPacket" v-if="userStoreInstance.user.money !== undefined">钱
          包：{{ userStoreInstance.user.money.toFixed(2) }}</el-text>
        <el-text type="primary" id="moneyPacket" v-else>钱 包: 0.00</el-text>
      </el-menu-item>
      <el-menu-item index="0-2">
        <span @click="openRecharge" style="width: 100%;" id="rechargeBtn">充 值</span>
      </el-menu-item>
      <el-menu-item index="0-3">
        <span @click="() => router.push('/userProfile')" style="width: 100%;" id="rechargeBtn">个 人 中 心</span>
      </el-menu-item>
      <el-menu-item index="0-4">
        <el-popconfirm width="220" confirm-button-text="确认" cancel-button-text="取消" :icon="InfoFilled"
          icon-color="#626AEF" title="您确定要退出账号吗？" @confirm="logout">

          <template #reference>
            <el-text type="primary" id="log-out">账 号 退 出</el-text>
          </template>
        </el-popconfirm>
      </el-menu-item>
    </el-sub-menu>
    <div class="flex-grow" />
    <el-menu-item index="1"><el-link @click="() => router.push('/')">首页</el-link></el-menu-item>
    <el-menu-item index="2"><el-link @click="() => router.push('/login')">登录</el-link></el-menu-item>
    <el-menu-item index="3"><el-link @click="() => router.push('/register')">注册</el-link></el-menu-item>
    <el-menu-item index="4" v-if="checkFiledIsNotNull(userStoreInstance.token) && userStoreInstance.user.status !== userConstant.userStatus.COMMON_USER.value"><el-link
        @click="goToBack">工作区</el-link></el-menu-item>
    <el-menu-item index="5" v-if="userStoreInstance.user.status === userConstant.userStatus.COMMON_USER.value"><el-link
        @click="() => router.push('/createStore')">成为店家</el-link></el-menu-item>
    <el-menu-item index="6" v-if="userStoreInstance.user.status ===userConstant.userStatus.BUSINESSMAN.value">
      <el-link @click="() => router.push('/chatRoom/' + userStoreInstance.user.store.id)">私信</el-link>
    </el-menu-item>
        <el-sub-menu index="7">

      <template #title>操作</template>
      <el-menu-item index="7-1"><el-link style="width: 100%; font-size: 1.2em; text-align: center"
          @click="() => router.push('/myCart')">我的购物车</el-link></el-menu-item>
      <el-menu-item index="7-2"><el-link style="width: 100%; font-size: 1.2em; text-align: center"
          @click="() => router.push('/myFavorite')">我收藏的宝贝</el-link></el-menu-item>
      <el-menu-item index="7-3">
        <template #title><el-link style="width: 100%; font-size: 1.2em; text-align: center"
            @click="() => router.push('/myOrders')">我的订单</el-link></template>
        <!-- <el-menu-item index="6-3-1"><el-link style="width: 100%; font-size: 1.2em; text-align: center"
            @click="() => router.push('/myUnfilledOrders')">未发货订单</el-link></el-menu-item>
        <el-menu-item index="6-3-2"><el-link style="width: 100%; font-size: 1.2em; text-align: center"
            @click="() => router.push('/myFilledOrders')">已发货订单</el-link></el-menu-item>
        <el-menu-item index="6-3-3"><el-link style="width: 100%; font-size: 1.2em; text-align: center"
            @click="() => router.push('/myRefundOrders')">退款订单</el-link></el-menu-item> -->
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped lang="less">
.flex-grow {
  flex-grow: 1;
}

.el-menu {
  background-color: #CDD0D6;

  .el-header {
    height: 20%;
  }

  #log-out {
    width: 100%;
  }

}

#rechargeBtn {
  text-align: left;
  color: #409eff;
}
</style>
