<script setup>
import { queryWithdrawRecordService } from '@/api/withdrawRecord'
import { ref, onMounted, h } from 'vue'
import { userStore } from '@/store'
import { ElMessage } from 'element-plus'
import pageContainer from '@/components/PageContainer'
const userStoreInstance = userStore()
const params = ref({
  id: undefined,
  sellerName: '',
  username: '',
  storeName: '',
  // storeId: userStoreInstance.user.store.id,
  userId: userStoreInstance.user.id,
  sort: 0,
  page: 1,
  pageSize: 10
})
const loading = ref(false)
const withdrawRecordList = ref([])
const total = ref(0)
const queryWithdrawRecord = async () => {
  const res = await queryWithdrawRecordService(params.value)
  withdrawRecordList.value = res.data.data
  console.log(withdrawRecordList.value)
  total.value = res.data.total
  withdrawRecordList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })

  loading.value = false
}
// 被选中的数据
const selectedData = ref([])
const tableRef = ref()
// 给选择项绑定事件，当发生变化的时候就会触发该事件
const handleSelectionChange = (selected) => {
  selectedData.value = selected
}
// 切换当前展示的页数 page-size 改变时触发
const onSizeChange = (val) => {
  params.value.pageSize = val
  queryWithdrawRecord()
}
// 切换页面 current-page 改变时触发
const onCurrentChange = (val) => {
  params.value.page = val
  queryWithdrawRecord()
}
// 搜索
const onSearch = () => {
  // 重置页
  params.value.page = 1
  queryWithdrawRecord()
}
// 重置
const onReset = () => {
  params.value.page = 1
  params.value.username = ''
  params.value.storeName = ''
  queryWithdrawRecord()
  ElMessage({
    message: h('p', { style: 'line-height: 1; font-size: 14px' }, [
      h('span', null, '重置成功')
    ])
  })
}
// 表格排序
// 排序
const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  queryWithdrawRecord()
}

onMounted(() => {
  queryWithdrawRecord()
})
</script>

<template>
  <pageContainer title="订单管理" @click="handleClickOutside">
    <template #extra>
      <!-- <el-button @click="onAddUser" type="primary" ref="dialog">添加用户</el-button> -->
      <el-button @click="batchDeleteOrders()" type="primary">批量删除</el-button>
    </template>
    <!-- 行内表单 -->
    <el-form inline>
      <el-form-item label="用户搜索">
        <el-input v-model="params.username" placeholder="用户账号" />
      </el-form-item>
      <el-form-item label="商店名">
        <el-input v-model="params.storeName" placeholder="请输入商店名" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table v-if="withdrawRecordList.length !== 0" :data="withdrawRecordList" style="width: 100%" v-loading="loading"
      @selection-change="handleSelectionChange" :cell-style="tableRowStyle" @sort-change="sortTable"
      :sort-orders="['ascending', 'descending']" ref="tableRef">
      <el-table-column type="selection" width="40" />
      <!-- <el-table-column sortable="true" label="序号" width="180" type="index" :index="indexMethod" /> -->
      <el-table-column label="序号" prop="serialNumber" sortable="custom" width="90" align="center">
      </el-table-column>
      <el-table-column prop="id" label="ID" width="180" v-if="false" />
      <el-table-column prop="username" label="店家账号" width="100" align="center" />
      <!-- <el-table-column prop="phone" label="买家电话" align="center" width="100"/> -->
      <el-table-column prop="goodsName" label="商品名" align="center"></el-table-column>
      <el-table-column prop="number" label="商品数量" align="center">
        <template #default="{row}">
            {{ row.number }}件
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="支付价格" align="center">
        <template #default="{row}">
            ￥{{ row.totalPrice.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="originMoney" label="您原先的钱" align="center">
        <template #default="{row}">
            ￥{{ row.originMoney.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="withdrawMoney" label="提现金额" align="center">
        <template #default="{row}">
            ￥{{ row.withdrawMoney.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="您现在的钱" align="center">
        <template #default="{row}">
            ￥{{ (row.originMoney + row.withdrawMoney).toFixed(2) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="storeName" label="店名" align="center"></el-table-column> -->
      <el-table-column prop="pay" label="支付方式" align="center">
        <template #default="{row}">
            {{ row.pay === 0 ? '钱包' : row.pay === 1 ? '微信支付' : '支付宝支付' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提现时间" align="center" />
      <!-- <el-table-column label="操作">

        <template #default="{ row }">
          <el-button :icon="Delete" circle plain type="danger" @click="onDeleteOrders(row)"></el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 如果美没有数据，就显示空状态 -->
    <el-empty v-else :img-size="200"></el-empty>
    <!-- 分页区域 -->
    <el-pagination v-model:current-page="params.page" v-model:page-size="params.pageSize"
      :page-sizes="[5, 10, 20, 40, 100]" layout="jumper, total, sizes, prev, pager, next" background :total="total"
      @size-change="onSizeChange" @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />

    <!--       <UserAddOrEdit ref="openDialog" @dialog="onDialog"></UserAddOrEdit> -->
  </pageContainer>
</template>

<style lang="less" scoped></style>
