<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { sendCreateStoreRequestService, checkApply, checkApplyApprove, userCreateStoreService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import FooterComponent from '../components/FooterComponent.vue'
import LogoComponent from '../components/LogoComponent.vue'
import { userStore, userCreateStore } from '@/store/index.js'
import SelectAddress from '@/components/selectAddress'
import {
  // regionData, // 省市区三级联动数据]
  codeToText
  // pcaTextArr // 省市区三级联动数据，纯汉字
} from 'element-china-area-data'
import { userConstant, applyConstant } from '@/constant/constants'
const userStoreInstance = userStore()
const userCreateStoreInstance = userCreateStore()
// 表单对象
const ruleForm = ref({
  username: '',
  password: '',
  storeName: '',
  address: {}
})
// 表单对象的引用
const ruleFormRef = ref()
// 自定义规则
const rules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      max: 11,
      min: 5,
      message: '用户名必须是5-11位的字母或数字',
      pattern: /^[a-zA-Z0-9]{5,11}$/
    }],
  password: [
    {
      required: true,
      trigger: 'blur',
      max: 15,
      min: 6,
      message: '密码必须是6-15位的非空字符',
      pattern: /^\S{6,15}$/
    }
  ],
  storeName: [
    {
      required: true,
      trigger: 'blur',
      max: 15,
      min: 2,
      message: '店名必须是2-15位的非空字符',
      pattern: /^\S{2,15}$/
    }
  ],
  'address.detail': [
    {
      required: true,
      trigger: 'blur',
      max: 200,
      min: 10,
      message: '详细地址必须是10-200位的非空字符'
    }
  ],
  address: [
    {
      required: true,
      trigger: 'blur',
      message: '请选择商店地址'
    }
  ]
})
// 发送请求
const sendApply = async () => {
  // 向后
  active.value++
  // 在发送 请求之前，先把表单保存起来
  const obj = ruleForm.value
  obj.store = {
    storeName: ruleForm.value.storeName
  }
  userCreateStoreInstance.setUserCreateStore(obj)
  // 请求消息更新
  userCreateStoreInstance.receiveRejection = false
  // 发送
  const res = await sendCreateStoreRequestService(ruleForm.value)
  if (res.code === 1) {
    ElMessage.success(res.msg)
  }
}
// 得到路由
const router = useRouter()
// 提交
const submitForm = async () => {
  // 验证在提交之前表单
  if (active.value === 0) {
    await ruleFormRef.value.validate()
    // 检查格式
    const res = await checkApply(ruleForm.value)
    if (res.code === 1) {
      // 向后走
      active.value++
    }
  }
}

// 重置
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) {
    return
  }

  ruleFormRef.resetFields()
}
// 回车登录
const keyDown = (e) => {
  // 如果按键是回车
  if (e.keyCode === 13) {
    // 提交
    submitForm()
  }
}
// TODO 切换标签页 如何保留提交认证的进度
const handleChange = (name) => {

}

const handleLeave = (activeName, oldActiveName) => {
  return true
}

// 子组件回调
const chooseAddress = (val) => {
  ruleForm.value.address.provinceCode = val[0]
  ruleForm.value.address.provinceName = codeToText[val[0]]
  ruleForm.value.address.cityCode = val[1]
  ruleForm.value.address.cityName = codeToText[val[1]]
  ruleForm.value.address.districtCode = val[2]
  ruleForm.value.address.districtName = codeToText[val[2]]
}
const isApproved = async () => {
  const res = await checkApplyApprove(userStoreInstance.user.username)
  const apply = res.data
  // 如果返回结果不为空,说明发送过申请并且没有被拒绝或者没有发送过申请 即还在待审核或者已通过或者没有发送过
  if (apply !== null) {
    // 如果还在待审核状态
    if (apply.status === applyConstant.applyStatus.UNDER_REVIEW.value) {
      active.value = 3
      ElMessage({
        message: '管理员还在审核中哦,请耐心等待',
        type: 'warning'
      })
    } else if (apply.status === applyConstant.applyStatus.APPROVED.value) {
      // 如果已经通过
      active.value = 4
      ElMessage.success('审核通过')
      // 得到保存的表单信息
      const obj = userCreateStoreInstance.userCreateStore
      createStore(obj)
    }
    // 如果没发送过申请，什么都不做
  } else {
    // 如果是第一次接收拒绝消息
    if (!userCreateStoreInstance.receiveRejection) {
    // 如果审核不通过
      ElMessage.error('审核被拒绝')
      // 一旦审核被拒绝，就修改存储在缓存中的表单
      userCreateStoreInstance.removeUserCreateStore()
      userCreateStoreInstance.receiveRejection = true
    }
  }
}
// 开店
const createStore = async (store) => {
  const res = await userCreateStoreService(store)
  if (res.code === 1) {
    ElMessage.success(res.msg)
    router.push('/')
  }
}
onMounted(() => {
  // 绑定监听事件
  window.addEventListener('keydown', keyDown)
  userStoreInstance.getUser()
  // 查询该用户的状态，如果用户的状态为商家
  if (userStoreInstance.user.status === userConstant.userStatus.BUSINESSMAN.value) {
    // 说明申请成功
    active.value = 4
    ElMessage({
      message: '申请成功',
      type: 'success',
      onClose: () => router.push('/')
    })
    return
  }

  isApproved()
})

onUnmounted(() => {
  // 销毁事件
  window.removeEventListener('keydown', keyDown, false)
})

const active = ref(0)
const activeName = ref('first')
</script>

<template>
  <!-- <NavigationComponents></NavigationComponents> -->
  <div class="header">
    <LogoComponent></LogoComponent>
  </div>
  <div class="user-compony">
    <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-change="handleChange" :before-leave="handleLeave">
      <el-tab-pane label="个人认证" name="first">
        <div class="steps-wrapper">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="第一步" description="填写店铺信息" />
            <el-step title="第二步" description="支付宝认证（仅模拟）" />
            <el-step title="第三步" description="实人扫脸（仅模拟）" />
            <el-step title="第四步" description="等待管理员确认" />
          </el-steps>
        </div>
        <div class="main">
          <!-- 填写店铺信息 -->
          <div id="login-form" v-show="active === 0">
            <div id="title" style="text-align: center;">
              <h1>开店</h1>
            </div>
            <div id="login-form-item">
              <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="ruleForm.username" type="text" autocomplete="off" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="ruleForm.password" type="password" autocomplete="off" placeholder="请输入密码"
                    show-password />
                </el-form-item>
                <el-form-item label="店名" prop="storeName">
                  <el-input v-model="ruleForm.storeName" type="text" autocomplete="off" placeholder="请输入您的店名" />
                </el-form-item>
                <el-form-item label="店的地址" prop="address">
                  <SelectAddress @chooseAddress="chooseAddress"></SelectAddress>
                </el-form-item>
                <el-form-item label="详细地址" prop="address.detail">
                  <el-input type="textarea" autosize style="width: 264px;" resize="none" row="4"
                    v-model="ruleForm.address.detail" placeholder="请输入商店的详细地址" maxlength="200"></el-input>
                </el-form-item>
                <el-form-item>
                  <div class="button-group">
                    <el-button type="primary" @click="submitForm()" @keydown.enter="keyDown">确认</el-button>
                    <el-button @click="resetForm(ruleFormRef)" type="warning">重置</el-button>
                    <el-button @click="() => router.push('/register')" type="primary">没有账号？去注册</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- 支付宝认证（仅模拟）不实现 -->
          <div class="analog-alipay" v-show="active === 1">
            <div class="common-layout" style="background-color: white; width: 500px; margin: auto; border-radius: 5px;">
              <el-container>
                <el-header style="position: relative;"><svg t="1710464045090" class="icon" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2919" width="40" height="40">
                    <path
                      d="M860.16 0C950.272 0 1024 73.889684 1024 164.163368v531.509895s-32.768-4.122947-180.224-53.355789c-40.96-14.362947-96.256-34.896842-157.696-57.478737 36.864-63.595789 65.536-137.485474 86.016-215.444211h-202.752v-71.841684h247.808V256.512h-247.808V135.437474h-100.352c-18.432 0-18.432 18.458947-18.432 18.458947v104.663579H200.704v41.040842h249.856v69.793684H243.712v41.013895H645.12c-14.336 51.307789-34.816 98.519579-57.344 141.608421-129.024-43.115789-268.288-77.985684-356.352-55.403789-55.296 14.362947-92.16 38.992842-112.64 63.595789-96.256 116.978526-26.624 295.504842 176.128 295.504842 120.832 0 237.568-67.718737 327.68-178.526316C757.76 742.858105 1024 853.692632 1024 853.692632v6.144C1024 950.110316 950.272 1024 860.16 1024H163.84C73.728 1024 0 950.137263 0 859.836632V164.163368C0 73.889684 73.728 0 163.84 0h696.32zM268.126316 553.121684c93.049263-10.374737 180.062316 26.974316 283.270737 78.874948-74.886737 95.501474-165.941895 155.701895-256.970106 155.701894-157.830737 0-204.368842-126.652632-125.466947-197.200842 26.300632-22.851368 72.838737-35.301053 99.166316-37.376z"
                      fill="#00A0EA" p-id="2920"></path>
                  </svg><span style="margin-left: 10px; position: absolute; top: 5px;">支付宝认证</span><svg
                    t="1710464340262" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="3935" width="30" height="30"
                    style="position: absolute; margin-left: 110px;">
                    <path
                      d="M477.3888 988.398933a106.530133 106.530133 0 0 0 69.2224 0c152.7808-52.394667 207.9744-95.197867 207.9744-95.197866 158.8224-108.305067 160.221867-250.504533 160.221867-250.504534V193.911467c0-22.016-17.92-40.925867-39.936-41.710934-112.64-3.9936-278.766933-86.801067-339.5584-119.1936a49.493333 49.493333 0 0 0-46.728534 0c-60.757333 32.290133-226.781867 115.2-339.592533 119.1936A42.0864 42.0864 0 0 0 109.090133 193.911467v448.785066s1.399467 142.199467 160.221867 250.504534c0.1024 0 55.296 42.8032 208.0768 95.197866z"
                      fill="#F24827" p-id="3936"></path>
                    <path
                      d="M483.089067 907.093333a89.429333 89.429333 0 0 0 57.821866 0c127.5904-43.690667 173.704533-79.496533 173.704534-79.496533 132.573867-90.385067 133.802667-209.2032 133.802666-209.2032V248.593067c0-18.397867-15.018667-34.0992-33.314133-34.816-94.1056-3.2768-232.789333-72.465067-283.511467-99.464534a41.437867 41.437867 0 0 0-38.980266 0c-50.722133 26.965333-189.44 96.187733-283.511467 99.498667-18.295467 0.580267-33.314133 16.384-33.314133 34.816v369.7664s1.2288 118.784 133.802666 209.237333c-0.2048 0 45.909333 35.771733 173.499734 79.4624z"
                      fill="#FF8D4C" p-id="3937"></path>
                    <path
                      d="M512 109.397333c-6.690133 0-13.4144 1.604267-19.490133 4.9152-50.722133 26.965333-189.44 96.187733-283.511467 99.498667-18.295467 0.580267-33.314133 16.384-33.314133 34.816v369.7664s1.2288 118.784 133.802666 209.237333c0 0 46.114133 35.771733 173.738667 79.4624 9.284267 3.208533 19.080533 4.778667 28.8768 4.778667V109.431467H512z"
                      fill="#FAC570" opacity=".501" p-id="3938"></path>
                    <path
                      d="M848.384 563.5072v54.8864s-1.194667 118.784-133.802667 209.237333c0 0-22.084267 17.169067-77.994666 42.154667l47.445333 63.419733c55.159467-27.409067 104.174933-59.016533 140.458667-99.089066 59.733333-67.242667 84.104533-126.805333 89.8048-182.510934l-65.877334-88.098133z"
                      fill="#DC3514" p-id="3939"></path>
                    <path
                      d="M848.384 563.5072l-309.9648-290.2016L512 538.0096l0.1024 212.6848 124.484267 118.9888c55.9104-25.088 78.0288-42.1888 78.0288-42.1888 132.573867-90.282667 133.802667-209.1008 133.802666-209.1008V563.541333z"
                      fill="#F34E27" opacity=".557" p-id="3940"></path>
                    <path
                      d="M566.545067 561.220267V327.918933a54.613333 54.613333 0 0 0-109.1584 0v233.301334a54.613333 54.613333 0 0 0 109.1584 0z m-54.4768 189.474133a54.613333 54.613333 0 1 0-0.1024-109.192533 54.613333 54.613333 0 0 0 0.1024 109.226666z"
                      fill="#FFFFFF" p-id="3941"></path>
                  </svg></el-header>
                <el-main>
                  <div class="tip">
                    <span>您登录的账号已有绑定但未认证的支付宝账号，建议通过登录支付宝，完成认证</span>
                  </div>
                  <div class="button-group">
                    <el-button type="primary" @click="() => active++" @keydown.enter="keyDown">确认</el-button>
                    <el-button type="primary" @click="() => active--" @keydown.enter="keyDown">上一步</el-button>
                  </div>
                </el-main>
              </el-container>
            </div>
          </div>
          <!-- 实人扫脸（模拟）不实现 -->
          <div class="scan-face" v-show="active === 2">
            <div class="common-layout" style="background-color: white; width: 500px; margin: auto; border-radius: 5px;">
              <el-container>

                <el-main>

                  <div class="button-group">
                    <el-button type="primary" @click="sendApply" @keydown.enter="keyDown">确认</el-button>
                    <el-button type="primary" @click="active--" @keydown.enter="keyDown">上一步</el-button>
                  </div>
                </el-main>
              </el-container>
            </div>
          </div>

          <div class="waiting-apply" v-show="active === 3" style="text-align: center;">
            <span>等待管理员审批中</span>
            <div class="button-group">
                    <el-button type="primary" @click="active--" @keydown.enter="keyDown">上一步</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="企业认证" name="second">
        <div class="steps-wrapper">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="第一步" description="填写店铺信息" />
            <el-step title="第二步" description="Some description" />
            <el-step title="第三步" description="Some description" />
            <el-step title="第四步" description="Some description" />
          </el-steps>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
  <!--   <div class="main">
    <div id="login-form">
      <div id="title" style="text-align: center;">
        <h1>开店</h1>
      </div>
      <div id="login-form-item">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
          class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username" type="text" autocomplete="off" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password" autocomplete="off" placeholder="请输入密码"
              show-password />
          </el-form-item>
          <el-form-item label="店名" prop="store.storeName">
            <el-input v-model="ruleForm.store.storeName" type="text" autocomplete="off" placeholder="请输入您的店名" />
          </el-form-item>
          <el-form-item label="店的地址">
            <SelectAddress @chooseAddress="chooseAddress"></SelectAddress>
          </el-form-item>
          <el-form-item label="详细地址" prop="address.detail">
            <el-input type="textarea" autosize style="width: 264px;" resize="none" row="4"
              v-model="ruleForm.address.detail" placeholder="请输入商店的详细地址" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="button-group">
              <el-button type="primary" @click="submitForm()" @keydown.enter="keyDown">开店</el-button>
              <el-button @click="resetForm(ruleFormRef)" type="warning">重置</el-button>
              <el-button @click="() => router.push('/register')" type="primary">没有账号？去注册</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
 -->
  <FooterComponent></FooterComponent>
</template>

<style scoped lang="less">
#login-form {
  background-color: #E6E8EB;
  width: 35%;
  margin: auto;
  height: 75%;
}

#login-form-item {
  width: 90%;
  margin: 1% auto;
}

.main {
  background-color: #c6e2ff;
  height: 500px;
  padding: 5px;
}

.button-group {
  display: inline-block;
}

.el-input {
  width: 70%;
}

.verify_code {
  display: inline-block;
  margin-left: 20px;
}

</style>
