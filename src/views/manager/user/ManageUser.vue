<script setup>
import pageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { getUserListService, managerStartOrStopService, managerBatchDeleteUsersService } from '@/api/manager'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import UserAddOrEdit from './components/UserAddOrEdit'
import { userConstant } from '@/constant/constants'
// 根据data返回的每一行的数据判断,再修改这一行的样式
// 如果改行是被禁用状态，就修改样式
const tableRowStyle = (data) => {
  if (data.row.accountStatus === 0) {
    return {
      background: '#fdf6ec'
    }
  }
}
// 用户列表
const userList = ref([])
// 总条数
const total = ref(0)
// 定义请求参数对象
const params = ref({
  page: 1, // 当前页
  pageSize: 10, // 当前生效页的每页条数
  id: undefined, // 编号
  username: '', // 账号
  avatar: '',
  status: undefined, // 用户身份
  accountStatus: undefined, // 账号状态
  isOnline: undefined,
  address: {}, // 地址
  addressList: [], // 地址
  sort: 1 // 排序规则
})

const updateRef = ref({})
// 请求加载
const loading = ref(false)
// 分页查询
const getUserList = async () => {
  // 开始加载，启动加载动画
  loading.value = true
  // 开始发送分页请求
  const res = await getUserListService(params.value)
  userList.value = res.data.data
  total.value = res.data.total
  getDefaultAddress()
  // 由于分页查询会将所有的地址信息都展示出来，但是我们只显示默认地址
  // 在获得userList后，给每一行添加序号
  userList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })

  loading.value = false
}
getUserList()
// 搜索
const onSearch = () => {
  // 重置页
  params.value.page = 1
  getUserList()
}
// 重置
const onReset = () => {
  params.value.pagenum = 1
  params.value.username = ''
  params.value.status = ''
  params.value.accountStatus = ''
  params.value.isOnline = ''
  getUserList()
}
// 被选中的数据
const selectedData = ref([])

// 给选择项绑定事件，当发生变化的时候就会触发该事件
const handleSelectionChange = (selected) => {
  selectedData.value = selected
}
// 切换当前展示的页数 page-size 改变时触发
const onSizeChange = (val) => {
  params.value.pageSize = val
  getUserList()
}
// 切换页面 current-page 改变时触发
const onCurrentChange = (val) => {
  params.value.page = val
  getUserList()
}
const changeAccountStatus = (row) => {
  updateRef.value = row
  const msg = row.accountStatus === 0 ? '启用' : '禁用'
  ElMessageBox.confirm(
    '确认是否修改编号' + row.id + '：' + row.username + '的账号状态为' + msg,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    updateRef.value.accountStatus = updateRef.value.accountStatus === 0 ? 1 : 0
    // 确认的函数
    await managerStartOrStopService(updateRef.value)
    getUserList()
  })
    .catch(() => {
      // 失败的函数
    })
}
// 单独删除
const onDeleteUser = async (row) => {
  ElMessageBox.confirm(
    '确认是否要删除数据？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    // 确认的函数
    await managerBatchDeleteUsersService(row.id)
    ElMessage.success('删除成功')
    getUserList()
  })
    .catch(() => {
      // 失败的函数
    })
}
// 批量删除
const patchDeleteUsers = async () => {
  // 如果没有选中一条数据
  if (selectedData.value.length === 0) {
    ElMessage({
      showClose: true,
      message: '请选中至少一条数据',
      grouping: true,
      type: 'warning'
    })
    return
  }

  ElMessageBox.confirm(
    '确认是否要删除这' + selectedData.value.length + '条数据吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      grouping: true,
      type: 'warning'
    }
  ).then(async () => {
    // 确认的函数
    // 从被选中的对象中得到id 形成ids数组
    const ids = selectedData.value.map(item => item.id).join(',')
    await managerBatchDeleteUsersService(ids)
    getUserList()
    ElMessage({
      showClose: true,
      message: '删除成功',
      grouping: true,
      type: 'success'
    })
  })
    .catch(() => {
      // 失败的函数
      ElMessage({
        showClose: true,
        message: '删除失败',
        grouping: true,
        type: 'error'
      })
    })
}

// 对话框
const openDialog = ref()
// 添加用户
const onAddUser = async () => {
  openDialog.value.open({})
}
// 修改用户
const onEditUser = (row) => {
  openDialog.value.open(row)
}
// 接收子组件的通知后，就调用该方法
const onDialog = () => {
  getUserList()
}
// 表格排序
// 排序
const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  getUserList()
}
// 得到用户默认地址
const getDefaultAddress = () => {
  for (let i = 0; i < userList.value.length; i++) {
    userList.value[i].address = userList.value[i].addressList.filter((address) => address.isDefault === 1)
  }
}
</script>

<template>
  <pageContainer title="用户管理">
    <template #extra>
      <el-button @click="onAddUser" type="primary" ref="dialog">添加用户</el-button>
      <el-button @click="patchDeleteUsers()" type="primary">批量删除</el-button>
    </template>
    <!-- 行内表单 -->
    <el-form inline>
      <el-form-item label="用户搜索">
        <el-input v-model="params.username" placeholder="用户账号" />
      </el-form-item>
      <el-form-item label="用户身份">
        <el-select style="width: 100px" v-model="params.status" placeholder="请选择" clearable>
          <el-option label="管理员" :value="userConstant.userStatus.MANAGER.value" />
          <el-option label="商家" :value="userConstant.userStatus.BUSINESSMAN.value" />
          <el-option label="普通用户" :value="userConstant.userStatus.COMMON_USER.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="账户状态">
        <el-select style="width: 100px" v-model="params.accountStatus" placeholder="请选择" clearable>
          <el-option label="正常" :value="userConstant.accountStatus.ENABLE.value" />
          <el-option label="禁用" :value="userConstant.accountStatus.DISABLE.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="在线状态">
        <el-select style="width: 100px" v-model="params.isOnline" placeholder="请选择" clearable>
          <el-option label="在线" :value="userConstant.onlineStatus.IS_ONLINE.value" />
          <el-option label="不在线" :value="userConstant.onlineStatus.IS_OFFLINE.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table v-if="userList.length !== 0" :data="userList" style="width: 100%" v-loading="loading"
      @selection-change="handleSelectionChange" :cell-style="tableRowStyle"
      @sort-change="sortTable"
      :sort-orders="['ascending', 'descending']"
    >
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column sortable="true" label="序号" width="180" type="index" :index="indexMethod" /> -->
      <el-table-column label="序号" prop="serialNumber" sortable="custom"
        width="100" align="center">
        <!-- <template #default="row">
          {{ (params.page - 1) * params.pageSize + row.$index + 1 }}
        </template> -->
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180" v-if="false" />
      <el-table-column prop="avatar" label="头像" width="180" v-if="false" />
      <el-table-column prop="username" label="用户账号" width="150" align="center" />
      <el-table-column prop="isOnline" label="在线状态" width="90" align="center">

        <template #default="{ row }">
          {{ userConstant.getOnlineStatusLabel(row.isOnline) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="用户身份" width="100" align="center">

        <template #default="{ row }">
          {{ userConstant.getUserStatusLabel(row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" align="center" />
      <el-table-column prop="address" label="收获地址">

        <template #default="{ row }">
          {{ (row.address[0] === null || row.address[0] === undefined) ? '' : row.address[0].provinceName + '/' + row.address[0].cityName + '/' +
        row.address[0].districtName }}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="详细地址">

        <template #default="{ row }">
          {{ (row.address[0] === null || row.address[0] === undefined) ? '' : row.address[0].detail }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="账号创建时间" align="center" />
      <el-table-column prop="accountStatus" label="当前账号状态" width="125" align="center">

        <template #default="{ row }">
          <!-- 如果是管理员或超级管理员，就不能修改管理员或超级管理员的账号状态 -->
          <el-link :underline="false"
          :disabled="row.status === userConstant.userStatus.MANAGER.value
          || row.status === userConstant.userStatus.SUPER_ADMINISTRATOR.value"
          type="primary" @click="changeAccountStatus(row)">{{
      userConstant.getAccountStatusLabel(row.accountStatus) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作">

        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEditUser(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteUser(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 如果美没有数据，就显示空状态 -->
    <el-empty v-else :img-size="200"></el-empty>
    <!-- 分页区域 -->
    <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
      :page-sizes="[5, 10, 20, 40, 100]" layout="jumper, total, sizes, prev, pager, next" background :total="total"
      @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />

    <UserAddOrEdit ref="openDialog" @dialog="onDialog"></UserAddOrEdit>
  </pageContainer>
</template>

<style lang="less" scoped></style>
