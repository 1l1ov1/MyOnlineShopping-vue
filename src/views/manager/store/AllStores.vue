<script setup>
import pageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { getStoreListService, OpenOrClose, BatchDeleteStoreService } from '@/api/store'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import StoreAddOrEdit from '../../components/StoreAddOrEdit'
import { userStore } from '@/store'
import { storeConstant } from '@/constant/constants'
const userStoreInstance = userStore()
// 根据data返回的每一行的数据判断,再修改这一行的样式
// 如果改行是被禁用状态，就修改样式
const tableRowStyle = (data) => {
  if (data.row.status === storeConstant.storeStatus.CLOSE.value) {
    return {
      background: '#fdf6ec'
    }
  }
}
// 商店列表
const storeList = ref([])
// 总条数
const total = ref(0)
// 定义请求参数对象
const params = ref({
  page: 1, // 当前页
  pageSize: 10, // 当前生效页的每页条数
  id: userStoreInstance.user.store !== null ? userStoreInstance.user.store.id : undefined, // 编号
  username: '', // 账号
  storeName: '',
  status: undefined, // 商店状态
  sort: 0
})

const updateRef = ref({})
// 请求加载
const loading = ref(false)
// 分页查询
const getStoreList = async () => {
  // 开始加载，启动加载动画
  loading.value = true
  // 开始发送分页请求
  const res = await getStoreListService(params.value)
  storeList.value = res.data.data
  total.value = res.data.total
  // 在获得storeList后，给每一行添加序号
  storeList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })

  loading.value = false
}
getStoreList()
// 搜索
const onSearch = () => {
  // 重置页
  params.value.page = 1
  getStoreList()
}
// 重置
const onReset = () => {
  params.value.pagenum = 1
  params.value.storeName = ''
  params.value.status = ''
  params.value.username = ''
  getStoreList()
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
  getStoreList()
}
// 切换页面 current-page 改变时触发
const onCurrentChange = (val) => {
  params.value.page = val
  getStoreList()
}
const changeStoreStatus = (row) => {
  updateRef.value = row
  const msg = storeConstant.getReversStoreStatusLabel(row.status)
  ElMessageBox.confirm(
    '确认是否修改编号' + row.id + '：' + row.storeName + '商店状态为' + msg,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    updateRef.value.status = updateRef.value.status === 0 ? 1 : 0
    // 确认的函数
    await OpenOrClose(updateRef.value)
    getStoreList()
  })
    .catch(() => {
      // 失败的函数
    })
}
// 单独删除
const onDeleteStore = async (row) => {
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
    await BatchDeleteStoreService(row.id)
    getStoreList()
  })
    .catch(() => {
      // 失败的函数
    })
}
// 批量删除
const patchDeleteStore = async () => {
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
    await BatchDeleteStoreService(ids)
    getStoreList()
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
// 添加商店
const onAddStore = async () => {
  openDialog.value.open({})
}
// 修改商店
const onEdiStore = (row) => {
  openDialog.value.open(row)
}
// 接收子组件的通知后，就调用该方法
const onDialog = () => {
  getStoreList()
}
// 表格排序
// 排序
const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  getStoreList()
}
</script>

<template>
  <pageContainer title="商店管理">
    <template #extra>
      <el-button @click="onAddStore" type="primary" ref="dialog">添加商店</el-button>
      <el-button @click="patchDeleteStore()" type="primary">批量删除</el-button>
    </template>
    <!-- 行内表单 -->
    <el-form inline>
      <el-form-item label="商店名称">
        <el-input v-model="params.storeName" placeholder="商店名称" />
      </el-form-item>
      <el-form-item label="用户搜索">
        <el-input v-model="params.username" placeholder="用户账号" />
      </el-form-item>
      <el-form-item label="账户状态">
        <el-select style="width: 100px" v-model="params.status" placeholder="请选择" clearable>
          <el-option label="开店中" :value="storeConstant.storeStatus.OPEN.value" />
          <el-option label="关店中" :value="storeConstant.storeStatus.CLOSE.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table v-if="storeList.length !== 0" :data="storeList" style="width: 100%" v-loading="loading"
      @selection-change="handleSelectionChange" :cell-style="tableRowStyle" @sort-change="sortTable"
      :sort-orders="['ascending', 'descending']">
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column sortable="true" label="序号" width="180" type="index" :index="indexMethod" /> -->
      <el-table-column label="序号" prop="serialNumber" sortable="custom" width="100" align="center">
        <!-- <template #default="row">
          {{ (params.page - 1) * params.pageSize + row.$index + 1 }}
        </template> -->
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180" v-if="false" />
      <el-table-column prop="username" label="用户账号" width="150" align="center" />
      <el-table-column prop="storeName" label="商店名称" width="150" align="center" />
      <el-table-column prop="logo" label="商店Logo">
        <template #default="{row}">
          <el-image :src=" require('@/assets/uploadStore/' + row.logo)"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="200" align="center">
        <template #default="{row}">
            {{ (row.address !== null && row.address !== undefined && row.address !== '') ?
            row.address.provinceName + '/' + row.address.cityName + "/" + row.address.districtName : '' }}
        </template>
      </el-table-column>
      <el-table-column prop="address.detail" label="详细地址" width="200" align="center">
      </el-table-column>
      <!-- <el-table-column prop="status" label="店的状态" width="100" align="center">

        <template #default="{ row }">
          {{ row.status === 0 ? '关店' : '开店'}}
        </template>
      </el-table-column> -->
      <el-table-column prop="createTime" label="店的创建时间" align="center" />
      <el-table-column prop="status" label="当前店状态" width="125" align="center">

        <template #default="{ row }">
          <!-- 如果是管理员，就不能修改管理员的账号状态 -->
          <el-link :underline="false" type="primary" @click="changeStoreStatus(row)">{{
       storeConstant.getStoreStatusLabel(row.status) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作">

        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="onEdiStore(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteStore(row)"></el-button>
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

    <StoreAddOrEdit ref="openDialog" @dialog="onDialog"></StoreAddOrEdit>
  </pageContainer>
</template>

<style lang="less" scoped></style>
