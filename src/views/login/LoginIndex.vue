<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { userLoginService } from '@/api/user.js'
import { userStore } from '@/store/index.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
// import NavigationComponents from '../components/NavigationComponents.vue'
import FooterComponent from '../components/FooterComponent.vue'
import LogoComponent from '../components/LogoComponent.vue'
// 表单对象
const imgUrl = ref('http://localhost:8080/user/verify?time=' + new Date())
const ruleForm = ref({
  username: '',
  password: '',
  verifyCode: ''
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
  ]
})
// 创建库
const userStoreInstance = userStore()
// 得到路由
const router = useRouter()
// 提交
const submitForm = async () => {
  // 验证在提交之前表单
  await ruleFormRef.value.validate()
  // 登录
  const res = await userLoginService(ruleForm.value)
  // 设置token
  userStoreInstance.setToken(res.data.token)
  ElMessage.success('登录成功')
  // 跳到首页
  router.push('/')
}
// 重置
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) {
    return
  }

  ruleFormRef.resetFields()
}
// 刷新验证码
const resetImg = () => {
  imgUrl.value = 'http://localhost:8080/user/verify?time=' + new Date()
}
// 回车登录
const keyDown = (e) => {
  // 如果按键是回车
  if (e.keyCode === 13) {
    // 提交
    submitForm()
  }
}

onMounted(() => {
  // 绑定监听事件
  window.addEventListener('keydown', keyDown)
})

onUnmounted(() => {
  // 销毁事件
  window.removeEventListener('keydown', keyDown, false)
})
</script>

<template>
  <!-- <NavigationComponents></NavigationComponents> -->
  <div class="header">
      <LogoComponent></LogoComponent>
  </div>
  <div class="main">
    <div id="login-form">
      <div id="title" style="text-align: center;">
        <h1>登录</h1>
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
          <el-form-item label="验证码" prop="verifyCode">
            <el-input style="width: 140px" v-model="ruleForm.verifyCode" type="text" autocomplete="off"
              placeholder="请输入验证码"></el-input>
            <div class="verify_code">
              <img :src="imgUrl" @click="resetImg">
            </div>
          </el-form-item>
            <div class="button-group">
              <el-button type="primary" @click="submitForm()" @keydown.enter="keyDown">登录</el-button>
              <el-button @click="resetForm(ruleFormRef)" type="warning">重置</el-button>
              <el-button @click="() => router.push('/register')" type="primary">没有账号？去注册</el-button>
              <el-button @click="() => router.push('/forgetPassword')" type="primary">忘记密码？</el-button>
            </div>
        </el-form>
      </div>
    </div>
  </div>

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
  margin-left: 6%;
}

.el-input {
  width: 70%;
}

.verify_code {
  display: inline-block;
  margin-left: 20px;
}
</style>
