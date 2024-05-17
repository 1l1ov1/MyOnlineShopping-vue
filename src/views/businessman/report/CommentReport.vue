<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted } from 'vue'
import { getReportListService } from '@/api/report'

import { reportStatusConstant } from '@/constant/constants'

import { userStore } from '@/store/'
const userStoreInstance = userStore()
const params = ref({
  page: 1,
  pageSize: 10,
  id: undefined,
  username: '', // 举报人用户名
  reportedUsername: '', // 被举报人用户名
  goodsName: '',
  storeId: userStoreInstance.user.store.id,
  sort: 0
})
// 举报列表
const loading = ref(false)

const reportList = ref([])
const total = ref(0)
const queryReportList = async () => {
  // 开始加载，启动加载动画
  loading.value = true
  const res = await getReportListService(params.value)

  total.value = res.data.total

  reportList.value = groupReportsByComment(res.data.data)

  reportList.value.forEach((item, index) => {
    item.serialNumber = (params.value.page - 1) * params.value.pageSize + index + 1
  })

  loading.value = false
}
// 将举报列表按照评论进行分组
const groupReportsByComment = (reports) => {
  const groupedReports = {}

  reports.forEach(report => {
    const commentId = report.commentId
    if (!groupedReports[commentId]) {
      groupedReports[commentId] = {
        commentId,
        reportCount: 1,
        reportedUserId: report.reportedUserId,
        reportedUsername: report.reportedUsername,
        storeName: report.storeName,
        goodsName: report.goodsName,
        content: report.content,
        commentCreateTime: report.commentCreateTime,
        status: report.status,
        commentStatus: report.commentStatus,
        children: [{
          id: report.id,
          userId: report.userId,
          username: report.username,
          reason: report.reason,
          createTime: report.createTime
        }]
      }
    } else {
      groupedReports[commentId].reportCount++
      groupedReports[commentId].children.push({
        id: report.id,
        userId: report.userId,
        username: report.username,
        reason: report.reason,
        createTime: report.createTime
      })
    }
    // 然后为所有的儿子添加序列
    groupedReports[commentId].children.forEach((child, index) => {
      child.sequence = index + 1
    })
  })
  return Object.values(groupedReports)
}

const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  queryReportList()
}

// 被选中的数据
const fatherSelectedData = ref([])
const handleFatherSelectionChange = (selected) => {
  fatherSelectedData.value = selected.filter(item => item.children !== undefined &&
  item.children.length > 0)
}

const sonSelectedData = ref([])
const handleSonSelectionChange = (selected) => {
  sonSelectedData.value = selected
}
// 切换当前展示的页数 page-size 改变时触发
const onSizeChange = (val) => {
  params.value.pageSize = val
  queryReportList()
}

// 切换页面 current-page 改变时触发
const onCurrentChange = (val) => {
  params.value.page = val
  queryReportList()
}

// 搜索
const onSearch = () => {
  // 重置页
  params.value.page = 1
  queryReportList()
}
// 重置
const onReset = () => {
  params.value.page = 1
  params.value.username = ''
  params.value.reportedUsername = ''
  params.value.goodsName = ''
  queryReportList()
}
onMounted(() => {
  queryReportList()
})
</script>

<template>
  <PageContainer title="评论举报管理">
    <el-form inline>
      <el-form-item>
        <el-input v-model="params.username" placeholder="举报人账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.reportedUsername" placeholder="被举报人账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.goodsName" placeholder="商品名称" />
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-if="reportList.length !== 0" :data="reportList" style="width: 100%" v-loading="loading"
      @selection-change="handleFatherSelectionChange" :cell-style="tableRowStyle" @sort-change="sortTable"
      :sort-orders="['ascending', 'descending']" lazy border :tree-props="{ children: 'children' }"
      @expand-change="expandChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" prop="serialNumber" sortable="custom" width="90" align="center">
      </el-table-column>
      <el-table-column type="expand" label="举报详情" width="90" align="center">
        <template #default="{ row }">
          <el-table  @selection-change="handleSonSelectionChange"
          :data="row.children" :sort-orders="['ascending', 'descending']" border>
          <el-table-column label="" width="180"></el-table-column>
            <el-table-column type="selection" width="55" />
            <el-table-column label="序号" prop="sequence" sortable="custom" width="90" align="center" />
            <el-table-column prop="username" label="举报人" width="180" align="center" />
            <el-table-column prop="reason" label="举报原因" width="180" align="center" />
            <el-table-column prop="createTime" label="举报时间" width="180" align="center" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="reportedUsername" label="被举报人" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.reportedUsername }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评论内容" width="180" align="center" />
      <el-table-column prop="reportCount" label="举报次数" width="100" align="center" />
      <el-table-column prop="storeName" label="商店名称" width="130" align="center" />
      <el-table-column prop="goodsName" label="商品名称" width="120" align="center" />
      <el-table-column prop="commentCreateTime" label="评论时间" width="145" align="center" />
      <el-table-column prop="status" label="状态" width="70" align="center">
        <template #default="{ row }">
          {{ reportStatusConstant.getReportStatusLabel(row.status) }}
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
  </PageContainer>

</template>

<style lang='less' scoped></style>
