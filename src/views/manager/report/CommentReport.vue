<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref, onMounted } from 'vue'
import { getReportListService, deleteReportService } from '@/api/report'
import ForbiddenOrBan from './components/ForbiddenOrBan.vue'
import { reportStatusConstant } from '@/constant/constants'
import { hiddenCommentService, deleteCommentService } from '@/api/comment'
import { ElMessage, ElMessageBox } from 'element-plus'
import AwardUser from './components/AwardUser'
const params = ref({
  page: 1,
  pageSize: 10,
  id: undefined,
  username: '', // 举报人用户名
  reportedUsername: '', // 被举报人用户名
  storeName: '',
  goodsName: '',
  storeId: undefined,
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
        commentId: commentId,
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
          isAward: report.isAward,
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
        isAward: report.isAward,
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

// 将对待被举报多次的用户进行禁言或封禁
const ForbiddenOrBanRef = ref()
const handleReported = (row) => {
  ForbiddenOrBanRef.value.open(row, '举报')
}

const onDialog = () => {
  queryReportList()
}

const sortTable = ({ column, prop, order }) => {
  if (order === 'ascending') {
    params.value.sort = 1
  } else if (order === 'descending') {
    params.value.sort = 0
  }
  queryReportList()
}
// 隐藏评论
const handleHidden = async (row) => {
  const msg = row.commentStatus === 0 ? '隐藏' : '显示'
  const status = row.commentStatus === 0 ? 1 : 0
  ElMessageBox.confirm('是否要' + msg + '该评论？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await hiddenCommentService(row.commentId, status)
    if (res.code === 1) {
      ElMessage.success(res.msg)
      queryReportList()
    }
  }).catch(() => {

  })
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
// 批量删除评论
const batchDeleteComment = () => {
// 如果没有选中一条数据
  if (fatherSelectedData.value.length === 0) {
    ElMessage({
      showClose: true,
      message: '请选中至少一条数据',
      grouping: true,
      type: 'warning'
    })
    return
  }

  ElMessageBox.confirm(
    '确认是否要删除这' + fatherSelectedData.value.length + '条数据吗？',
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
    const ids = fatherSelectedData.value.map(item => item.commentId).join(',')
    await deleteCommentService(ids)
    queryReportList()
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

// 批量删除举报
const batchDeleteReport = () => {
// 如果没有选中一条数据
  if (sonSelectedData.value.length === 0) {
    ElMessage({
      showClose: true,
      message: '请选中至少一条数据',
      grouping: true,
      type: 'warning'
    })
    return
  }

  ElMessageBox.confirm(
    '确认是否要删除这' + sonSelectedData.value.length + '条数据吗？（只能删除同一子表格下的举报）',
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
    const ids = sonSelectedData.value.map(item => item.id).join(',')
    await deleteReportService(ids)
    queryReportList()
    ElMessage({
      showClose: true,
      message: '删除成功',
      grouping: true,
      type: 'success'
    })
  })
    .catch(() => {
    })
}
// 单个删除
const handleDelete = (row) => {
  ElMessageBox.confirm('是否要删除该评论？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deleteCommentService(row.commentId)
    if (res.code === 1) {
      ElMessage.success(res.msg)
      queryReportList()
    }
  }).catch(() => {

  })
}

const handleChildrenDelete = (row) => {
  ElMessageBox.confirm('是否要删除该举报？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deleteReportService(row.id)
    if (res.code === 1) {
      ElMessage.success(res.msg)
      queryReportList()
    }
  }).catch(() => {

  })
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
  params.value.storeName = ''
  params.value.goodsName = ''
  queryReportList()
}

const AwardUserRef = ref()
// 处理奖励
const handleAward = (row) => {
  AwardUserRef.value.open(row)
}

onMounted(() => {
  queryReportList()
})
</script>

<template>
  <PageContainer title="评论举报管理">
    <template #extra>
      <el-button @click="batchDeleteComment()" type="primary">批量删除评论</el-button>
      <el-button @click="batchDeleteReport()" type="primary">批量删除举报</el-button>
    </template>
    <el-form inline>
      <el-form-item>
        <el-input v-model="params.username" placeholder="举报人账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.reportedUsername" placeholder="被举报人账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.storeName" placeholder="商店名称" />
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
            <el-table-column prop="username" label="举报人" width="180" align="center" >
              <template #default="{row}">
                <el-link :underline="false" type="primary" v-if="row.isAward === 0"
                @click="handleAward(row)">{{ row.username }}</el-link>
                <span v-else>{{row.username}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="举报原因" width="180" align="center" />
            <el-table-column prop="createTime" label="举报时间" width="180" align="center" />
            <el-table-column prop="isAward" label="是否奖励" width="90" align="center">
              <template #default="{row}">
                <el-tag v-if="row.isAward === 0" type="danger">未奖励</el-tag>
                <el-tag v-else type="success">已奖励</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template #default="scope">
                <el-button type="text" @click="handleChildrenDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="reportedUsername" label="被举报人" width="120" align="center">
        <template #default="{ row }">
          <el-link @click="handleReported(row)" v-if="row.reportCount >= 1
          && row.status === reportStatusConstant.reportStatus.PENDING.value" type="primary" :underline="false">{{
          row.reportedUsername }}</el-link>
          <span v-else>{{ row.reportedUsername }}</span>
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
      <el-table-column label="操作" width="150" align="center">
        <template #default="{ row }">
          <el-button type="text" @click="handleDelete(row)">删除</el-button>
          <el-button type="text" @click="handleHidden(row)">{{ row.commentStatus === 1 ? '显示' : '隐藏'
            }}</el-button>
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

  <ForbiddenOrBan ref="ForbiddenOrBanRef" @dialog="onDialog"></ForbiddenOrBan>
  <AwardUser ref="AwardUserRef" @dialog="onDialog"></AwardUser>
</template>

<style lang='less' scoped></style>
