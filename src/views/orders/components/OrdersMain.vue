<script setup>
import { watch, ref, onMounted } from 'vue'
import router from '@/router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { applyRefundService, ordersReminder } from '@/api/user'
// import { Delete } from '@element-plus/icons-vue'
import { ordersConstant } from '@/constant/constants'
import { userStore } from '@/store'
const userStoreInstance = userStore()

const props = defineProps({
  ordersList: Array
})
const selectCheck = ref([])
const ordersCheckBox = ref([])
watch(
  () => props.ordersList,
  (newValue) => {
    // 初始化
    init(newValue)
  }
)
const init = (newValue) => {
  selectCheck.value = []
  for (let i = 0; i < newValue.length; i++) {
    ordersCheckBox.value[i] = false
  }
}
// 申请退款
const applyRefund = (id) => {
  console.log(id)
  ElMessageBox.confirm(
    '确定要申请退款吗？',
    '申请退款',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      const res = await applyRefundService(id)
      if (res.code === 1) {
        emit('updateOrdersList')
        ElMessage({
          type: 'success',
          message: '申请退款成功'
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'error',
        message: '申请退款失败'
      })
    })
}
// 用户催单
const reminder = ref({
  clickedTimer: {},
  isClicked: {}
})
const handleReminder = async (ordersId, storeId, ordersNumber) => {
  // 设置时间
  reminder.value.clickedTimer[ordersId] = new Date().getTime()
  // 设置禁止
  reminder.value.isClicked[ordersId] = true
  userStoreInstance.setReminder(reminder.value)
  const res = await ordersReminder(storeId, ordersNumber)
  if (res.code === 1) {
    ElMessage.success(res.msg)
  }
}

const emit = defineEmits(['updateOrdersList'])

/**
 * 检查并更新所有已点击计时器的状态。
 * 根据点击时间与当前时间的差距，确定计时器是否仍然处于被点击状态。
 */
const findClickReminder = (r) => {
  // 遍历所有已点击的计时器，更新它们的当前状态
  Object.entries(r.clickedTimer).forEach(([orderId, clickedTime]) => {
    // 如果点击时间超过24小时，则将计时器状态设为未点击；否则保持点击状态
    if (new Date().getTime() - clickedTime > 1000 * 60 * 60 * 24) {
      reminder.value.isClicked[orderId] = false
    } else {
      reminder.value.isClicked[orderId] = true
    }
  })
}
onMounted(() => {
  // 查询用户的订单催单
  findClickReminder(userStoreInstance.reminder)
})
</script>

<template>
  <div class="index-mod__order-container___1ur4- js-order-container" v-for="(item, index) in  ordersList "
    :key="item.id">
    <div class="bought-wrapper-mod__trade-order___2lrzV bought-wrapper-mod__closed___3pIh6">
      <table class="bought-table-mod__table___AnaXt bought-wrapper-mod__table___3xFFM">
        <colgroup>
          <col class="bought-table-mod__col1___3U5RK">
          <col class="bought-table-mod__col2___224Oh">
          <col class="bought-table-mod__col3___J0oe0">
          <col class="bought-table-mod__col4___XvKTC">
          <col class="bought-table-mod__col5___2kktP">
          <col class="bought-table-mod__col6___1KqCQ">
          <col class="bought-table-mod__col7___PpB_p">
        </colgroup>
        <tbody class="bought-wrapper-mod__head___2vnqo">
          <tr>
            <td class="bought-wrapper-mod__head-info-cell___29cDO" style="text-align: left;"><label
                class="bought-wrapper-mod__checkbox-label___3Va60">
                <span class="bought-wrapper-mod__checkbox___11anQ">
                  <el-checkbox v-model="ordersCheckBox[index]" class="checkbox"></el-checkbox>&nbsp;&nbsp;
                </span>
                <span class="bought-wrapper-mod__create-time___yNWVS">{{ item.createTime
                  }}</span></label><span><span>订单号</span><span>:
                </span><span>{{ item.ordersNumber }}</span></span>
            </td>
            <td colspan="2" class="bought-wrapper-mod__seller-container___3dAK3"><span
                class="seller-mod__container___zFAFV"><img
                  :src="(item.store.logo !== null && item.store.logo !== undefined) ? require('@/assets/uploadStore/' + item.store.logo) : require('@/assets/试用商户.png')"
                  class="seller-mod__icon___2F6_V" /><a href="javascript:void(0)"
                  @click="() => router.push('/storeDetail/' + item.store.id)" class="seller-mod__name___2IlQm"
                  :title="item.store.storeName">{{ item.store.storeName
                  }}</a></span>
            </td>
            <td><span></span>
            </td>
            <td colspan="3" class="bought-wrapper-mod__thead-operations-container___2LwDA">
              <span></span>
              <a href="###" class="bought-wrapper-mod__th-operation___yRtHm always-visible" title="删除订单"
                action="a7" data="[object Object]" id="delOrder"><i
                  style="height:17px;width:1px;padding-left:17px;overflow:hidden;vertical-align:middle;font-size:0px;display:inline-block;visibility:visible;background:url(//img.alicdn.com/tps/i1/TB1heyGFVXXXXXpXXXXR3Ey7pXX-550-260.png) no-repeat -239px -176px;"></i></a>
            </td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td class="sol-mod__no-br___36X3g">
              <div
                class="ml-mod__container___2DOxT production-mod__production___123Ax suborder-mod__production___3WebF">
                <div class="ml-mod__media___2sZrj" style="width:80px;">
                  <a href="javascript:void(0)" @click="() => router.push('/goodsDetail/' + item.goods.id)"
                    class="production-mod__pic___G8alD" ><img :src="(item.goods.coverPic !== null && item.goods.coverPic !== undefined && item.goods.coverPic !== '') ?
    require('@/assets/uploadGoods/' + item.goods.coverPic) : require('@/assets/默认商品图.png')"><span>
                    </span></a>
                </div>
                <div style="margin-left:90px;">
                  <p><a href="javascript:void(0)" @click="() => router.push('/goodsDetail/' + item.goods.id)"
                      >
                      <span>
                      </span><span style="line-height:16px;">{{ item.goods.goodsName }}</span><span>
                      </span></a><span></span><span></span>
                  </p>
                  <p><!-- <span
                      class="production-mod__sku-item___395gE"><span>内存容量</span><span>：</span><span>15天全天循环录像</span></span><span
                      class="production-mod__sku-item___395gE"><span>颜色分类</span><span>：</span><span>【超清全彩版+停电录像+免打孔安装】全彩夜视+语音对讲</span></span><span
                      class="production-mod__sku-item___395gE"><span>清晰度</span><span>：</span><span>1080p</span></span>
                  -->
                  </p>
                  <p>
                  </p>
                </div>
              </div>
            </td>
            <td class="sol-mod__no-br___36X3g price-td">
              <div class="price-mod__price___3_8Zs">
                <p><del class="price-mod__del___3kcDc" v-if="item.goods.discount !== 1"><span>￥</span><span>{{ item.goods.price.toFixed(2) }}</span></del>
                </p>
                <p><span>￥</span><span>{{ (item.goods.price * item.goods.discount).toFixed(2) }}</span>
                </p>
              </div>
            </td>
            <td class="sol-mod__no-br___36X3g" style="width: 5%;">
              <div>
                <p>{{ item.number }}</p>
              </div>
            </td>
            <td>
              <div>
                <p style="margin-bottom:3px;"><span class="text-mod__link___1rXmw text-mod__hover___1TDrR"
                    action="a3">申请售后</span>
                </p>
                <p style="margin-bottom:3px;"><a href="javascript:void(0)"
                    class="text-mod__link___1rXmw text-mod__hover___1TDrR" >运费险已出单</a>
                </p>
              </div>
            </td>
            <td class="">
              <div>
                <div class="price-mod__price___3_8Zs">
                  <p><strong><span>￥</span><span>{{ item.totalPrice }}</span></strong>
                  </p>
                </div>
                <p style="color:#6c6c6c;font-family:verdana;">
                  <span>(含运费：</span><span>￥0.00</span><span></span><span></span><span>)</span>
                </p>
                <div style="font-family:verdana;">
                  <div></div>
                </div>
                <p><a href="javascript:void(0)" :title="item.pay === 0 ? '钱包支付' : item.pay === 1 ? '微信支付' : '支付宝支付'"
                    style="margin-right:5px;" ><img class="pay-img" :src="item.pay === 0 ? require('@/assets/钱包支付.png') :
    item.pay === 1 ? require('@/assets/微信支付.png') : require('@/assets/支付宝支付.png')">
                  </a>
                </p>
              </div>
            </td>
            <td class="">
              <div>
                <p style="margin-bottom:3px;"><span class="text-mod__link___1rXmw">{{ ordersConstant.getOrdersStatusLabel(item.status) }}</span>
                </p>
                <p style="margin-bottom:3px; margin-top: 20px;"><span class="text-mod__link___1rXmw"  :title="催单"><el-link
                  href="javascript:void(0)" style="font-size: 1.1em;" :disabled="reminder.isClicked[item.id]"
                  @click="handleReminder(item.id, item.store.id,item.ordersNumber)">催 单</el-link></span>
                </p>
                <div>
                  <!-- <p style="margin-bottom:3px;"><a
                      href="//trade.tmall.com/detail/orderDetail.htm?bizOrderId=3782604890081475064"
                      class="text-mod__link___1rXmw text-mod__hover___1TDrR"  id="viewDetail">订单详情</a>
                  </p>
                  <p style="margin-bottom:3px;"><a
                      href="https://market.m.taobao.com/app/dinamic/pc-trade-logistics/home.html?orderId=3782604890081475064&amp;entrance=pc&amp;oldUrl=%2F%2Fwuliu.taobao.com%2Fuser%2Forder_detail_new.htm%3Ftrade_id%3D3782604890081475064%26seller_id%3D2204200573111"
                      class="text-mod__link___1rXmw text-mod__hover___1TDrR"  id="viewLogistic">查看物流</a>
                  </p> -->
                </div>
              </div>
            </td>
            <td class="">
              <div>
                <p style="margin-bottom:3px;"><a href="javascript:void(0)"
                    class="text-mod__link___1rXmw text-mod__hover___1TDrR" >追加评论</a>
                </p>
                <p style="margin-bottom:3px;"><a href="javascript:void(0)"
                    class="text-mod__link___1rXmw text-mod__hover___1TDrR"  action="b4"
                    id="applyInvoice">申请开票</a>
                </p>
                <!-- 如果是待发货订单，就允许申请退款或已签收订单7天内允许申请退款 -->
                <p style="margin-bottom:3px;" v-if="item.status === 1 || (item.status === 4
                && Date.now() - item.createTime < 7 * 24 * 60 * 60 * 1000)">
                  <a href="javascript:void(0)" @click="applyRefund(item.id)"
                    class="text-mod__link___1rXmw text-mod__hover___1TDrR"  action="b4"
                    id="applyRefund">申请退款</a>
                </p>
                <p style="margin-bottom:3px;" v-if="item.status === 5">
                  <a href="javascript:void(0)"
                    class="text-mod__link___1rXmw text-mod__hover___1TDrR"  action="b4"
                    id="applyRefund">交易完成</a>
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td class="sol-mod__no-br___36X3g">
              <div
                class="ml-mod__container___2DOxT production-mod__production___123Ax suborder-mod__production___3WebF">
                <div class="ml-mod__media___2sZrj" style="width:0;"></div>
                <div style="margin-left:0;">
                  <p><!-- <a href="//prod-baoxian.taobao.com/item/query.htm?bizOrderId=3782604890081475064"
                      ><span>
                      </span><span style="line-height:16px;">保险服务</span><span>
                      </span></a> --><span></span><span></span><span></span>
                  </p>
                </div>
              </div>
            </td>
            <td class="sol-mod__no-br___36X3g">
              <div class="price-mod__price___3_8Zs">
                <p><!-- <span>￥</span><span>0.00</span> -->
                </p>
              </div>
            </td>
            <td class="sol-mod__no-br___36X3g">
              <div></div>
            </td>
            <td>
              <div></div>
            </td>
            <td class="sol-mod__no-bt___1H7Cb"></td>
            <td class="sol-mod__no-bt___1H7Cb"></td>
            <td class="sol-mod__no-bt___1H7Cb"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang='less' scoped>
@import '@/assets/style/OrderMain.css'; // 导入外部样式</style>
