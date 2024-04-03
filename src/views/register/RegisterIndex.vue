<script setup>
import { ref } from 'vue'
import { userRegisterService } from '@/api/user.js'
// import NavigationComponents from '../components/NavigationComponents.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import LogoComponent from '../components/LogoComponent.vue'
// 表单对象
const ruleForm = ref({
  username: '',
  password: '',
  repassword: ''
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
  repassword: [
    {
      required: true,
      trigger: 'blur',
      max: 15,
      min: 6,
      message: '密码必须是6-15位的非空字符',
      pattern: /^\S{6,15}$/
    }, {
      validator: (rule, value, callback) => {
        // 判断value是否和当前form中收集的一致
        if (value !== ruleForm.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback() // 就算校验成功也需要callback
        }
      }
    }
  ]
})
// 得到路由
const router = useRouter()
// 提交
const submitForm = async () => {
  // 验证在提交之前表单
  await ruleFormRef.value.validate()
  // 登录
  await userRegisterService(ruleForm.value)
  ElMessage.success('注册成功')
  // 跳到首页
  router.push('/login')
}
// 重置
const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) {
    return
  }

  ruleFormRef.resetFields()
}
</script>

<template>
  <!-- <NavigationComponents></NavigationComponents> -->
  <div class="header">
      <LogoComponent></LogoComponent>
  </div>
  <div class="main">
    <div id="login-form">
      <div id="title" style="text-align: center;">
        <h1>注册</h1>
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
          <el-form-item label="确认密码" prop="repassword">
            <el-input v-model="ruleForm.repassword" type="password" autocomplete="off" placeholder="请输入密码"
              show-password />
          </el-form-item>
          <el-form-item>
            <div class="button-group">
              <el-button type="primary" @click="submitForm()">注册</el-button>
              <el-button @click="resetForm(ruleFormRef)" type="warning">重置</el-button>
              <el-button @click="() => router.push('/login')" type="primary">有账号？去登录</el-button>
            </div>
          </el-form-item>
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

.el-input {
  width: 70%;
}

.button-group {
  display: inline-block;
}

.main {
  background-color: #c6e2ff;
  height: 500px;
  padding: 5px;
}
</style>
