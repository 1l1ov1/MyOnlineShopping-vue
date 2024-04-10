<script setup>
import FooterComponent from '../components/FooterComponent.vue'
import LogoComponent from '../components/LogoComponent.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { userStore } from '@/store/index.js'
import { userForgetPassService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { passwordConstant } from '@/constant/constants'
const userStoreInstance = userStore()
const isLogin = ref(false)
isLogin.value = userStoreInstance.user?.username ?? false
const ruleForm = ref({
  username: userStoreInstance.user.username,
  oldPwd: userStoreInstance.user.password,
  newPwd: '',
  rePwd: '',
  type: passwordConstant.passwordType.FORGET.value
})
// 自定义规则
const checkOldSame = (rule, value, cb) => {
  if (value === ruleForm.value.oldPwd) {
    cb(new Error('原密码和新密码不能一样!'))
  } else {
    cb()
  }
}

const checkNewSame = (rule, value, cb) => {
  if (value !== ruleForm.value.newPwd) {
    cb(new Error('新密码和确认再次输入的新密码不一样!'))
  } else {
    cb()
  }
}
const rules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      max: 11,
      min: 5,
      message: '用户名必须是5-11位的字母或数字',
      pattern: /^[a-zA-Z0-9]{5,11}$/
    }],
  // 新密码
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkOldSame, trigger: 'blur' }
  ],
  // 确认新密码
  rePwd: [
    { required: true, message: '请再次确认新密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码长度必须是6-15位的非空字符串',
      trigger: 'blur'
    },
    { validator: checkNewSame, trigger: 'blur' }
  ]
}

// 表单对象的引用
const ruleFormRef = ref()
// 得到路由
const router = useRouter()
const onSubmit = async () => {
  const valid = await ruleFormRef.value.validate()
  if (valid) {
    await userForgetPassService(ruleForm.value)
    ElMessage({ type: 'success', message: '更换密码成功' })
    userStoreInstance.setToken('')
    userStoreInstance.setUser({})
    router.push('/login')
  }
}

// 回车登录
const keyDown = (e) => {
  // 如果按键是回车
  if (e.keyCode === 13) {
    // 提交
    // submitForm()
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
    <div class="header">
        <LogoComponent></LogoComponent>
    </div>
    <div class="main">
    <div id="login-form">
      <div id="title" style="text-align: center;">
        <h1>忘记密码</h1>
      </div>
      <div id="login-form-item">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
          class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input :disabled="isLogin" v-model="ruleForm.username" type="text" autocomplete="off" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPwd">
            <el-input v-model="ruleForm.newPwd" type="password" autocomplete="off" placeholder="请输入密码"
              show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="rePwd">
            <el-input v-model="ruleForm.rePwd" type="password" autocomplete="off" placeholder="请输入密码"
              show-password />
          </el-form-item>
            <div class="button-group">
              <el-button type="primary" @click="onSubmit()" @keydown.enter="keyDown">修改</el-button>
              <el-button @click="resetForm(ruleFormRef)" type="warning">重置</el-button>
              <el-button @click="() => router.push('/register')" type="primary">没有账号？去注册</el-button>
              <el-button @click="() => router.push('/login')" type="primary">有账号？去登录</el-button>
            </div>
        </el-form>
      </div>
    </div>
  </div>
    <FooterComponent></FooterComponent>
</template>

<style lang='less' scoped>
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
  margin-left: 4%;
}

.el-input {
  width: 70%;
}

// .verify_code {
//   display: inline-block;
//   margin-left: 20px;
// }
</style>
