<script setup>
import { ref, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
const props = defineProps({
  length: Number,
  goodsTotalPrice: Number,
  btnIsDisable: Boolean,
  selectNumber: Number,
  myCheckAll: Boolean
})
watch(
  () => props.myCheckAll,
  (newValue) => {
    checkAll.value = newValue
  }
)
const checkAll = ref(false)

const handleCheckAllChange = (value) => {
  emit('checkAll', checkAll.value)
}
// 批量删除
const batchDeleteCart = () => {
  if (props.selectNumber > 0) {
    ElMessageBox.confirm(
      '您确定要删除这些宝贝吗？(ó﹏ò｡)',
      '删除宝贝',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'tip'
      }
    ).then(() => {
      emit('batchDeleteCart', true)
    })
      .catch(() => {

      })
  } else {
    ElMessageBox.alert('请选择宝贝', '提示信息', {
      showConfirmButton: false,
      type: 'info'
    })
  }
}

// 批量添加收藏夹
const addFavorite = () => {
  if (props.selectNumber > 0) {
    // 发出通知
    emit('saveFavorite', true)
  } else {
    ElMessageBox.alert('请选择宝贝', '提示信息', {
      showConfirmButton: false,
      type: 'info'
    })
  }
}
// 结算按钮
const submit = () => {
  emit('footerSubmit', true)
}
const emit = defineEmits(['checkAll', 'batchDeleteCart', 'footerSubmit', 'saveFavorite'])
</script>

<template>
    <div id="J_FloatBarHolder" class="float-bar-holder">
        <div id="J_FloatBar" class="float-bar clearfix default" style="position: static;">
            <div id="J_SelectedItems" class="group-wrapper group-popup hidden" style="display: none;">
                <div id="J_SelectedItemsList" class="group-content"></div><span class="arrow"></span>
            </div>
            <div class="float-bar-wrapper">
                <div id="J_SelectAll2" class="select-all J_SelectAll">
                    <div class="cart-checkbox cart-checkbox-checked">
                        <el-checkbox class="checkAll" label="全选" v-model="checkAll"
                            @change="handleCheckAllChange"></el-checkbox>
                    </div>&nbsp;全选
                </div>
                <div class="operations"><a href="javascript:void(0)" @click="batchDeleteCart" hidefocus="true" class="J_DeleteSelected">删除</a>
                    <a href="javascript:void(0)"
                        hidefocus="true" class="J_BatchFav" @click="addFavorite">移入收藏夹</a></div>
                <div class="float-bar-right">
                    <div id="J_ShowSelectedItems" class="amount-sum"><span class="txt">已选商品</span><em
                            id="J_SelectedItemsCount">{{ selectNumber }}</em><span class="txt">件</span>
                        <div class="arrow-box" data-spm-anchor-id="a1z0d.6639537/tb.0.i0.28277484NS0Qpg"><span
                                class="selected-items-arrow"></span><span class="arrow"
                                data-spm-anchor-id="a1z0d.6639537/tb.0.i1.28277484NS0Qpg"></span></div>
                    </div>
                    <div id="J_CheckCOD" class="check-cod" style="display: none;"><span class="icon-cod"></span><span
                            class="s-checkbox J_CheckCOD"></span>货到付款</div>
                    <div class="pipe"></div>
                    <div class="price-sum"><span class="txt">合计（不含运费）：</span><strong class="price"><em
                                id="J_Total"><span class="total-symbol">&nbsp;</span>{{ goodsTotalPrice.toFixed(2) }}</em></strong></div>
                    <div class="btn-area"><a id="J_Go" href="javascript:void(0)" @click="submit"
                        :class="{ 'submit-btn': true, 'submit-btn-disabled': btnIsDisable }"
                            aria-label="请注意如果没有选择宝贝，将无法结算" ><span>结&nbsp;算</span><b></b></a></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang='less' scoped>
.float-bar-holder {
    position: relative;
    height: 72px;
    background-color: #fff;
    border-top: 1px solid #e6e6e6;
}

.float-bar {
    width: 1190px;
    margin: 0 auto;
}

.group-wrapper {
    position: absolute;
    bottom: 68px;
    width: 100%;
    z-index: 10001;
    background-color: #fff;
    _position: relative;
    _bottom: 0;
}

.group-content {
    border: 1px solid #f40;
    background: #fff;
}

.group-wrapper .arrow {
    position: absolute;
    background: url(//img.alicdn.com/tps/TB1R58eKpXXXXcmXFXXXXXXXXXX-13-7.png) no-repeat;
    bottom: -13px;
    right: 46px;
    margin-left: -4px;
    width: 13px;
    height: 14px;
}

.arrow {
    width: 0;
    height: 0;
    display: block;
    font-size: 0;
    line-height: 0;
}

.float-bar-wrapper {
    height: 72px;
    overflow: hidden;
    margin: 0 24px;
}

.float-bar .select-all {
    float: left;
    width: 62px;
    height: 72px;
    line-height: 72px;
    padding-left: 5px;
    font-size: 13px;
}

.float-bar .select-all .cart-checkbox {
    font-size: 13px;
}

.select-all .cart-checkbox {
    vertical-align: middle;
    margin-top: -2px;
}
.cart-checkbox {
  position: relative;
  display: inline-block;
  width: 15px;
  height: 15px;
  overflow: hidden;
}
.checkAll {
  top: -27px;
}
.float-bar .select-all .cart-checkbox {
    font-size: 13px;
}

.select-all .cart-checkbox {
    vertical-align: middle;
    margin-top: -2px;
}

.cart-checkbox {
    position: relative;
    display: inline-block;
    width: 15px;
    height: 15px;
    overflow: hidden;
}

.float-bar .operations {
    float: left;
    line-height: 72px;
    height: 72px;
    font-size: 13px;
}

.float-bar .operations a {
    margin-left: 25px;
    float: left;
}

a {
    color: #3c3c3c;
    text-decoration: none;
}

.float-bar-right {
    float: right;
    position: absolute;
    right: 18px;
    top: 15px;
    z-index: 4;
    padding-left: 20px;
}
.float-bar .amount-sum {
    cursor: pointer;
}

.float-bar .amount-sum,
.float-bar .price-sum {
    height: 48px;
    color: #3c3c3c;
}

.float-bar .price-sum strong, .float-bar .amount-sum em, .float-bar .price-sum .txt, .float-bar .amount-sum .txt {
    float: left;
}

.float-bar .txt {
    line-height: 48px;
    font-size: 13px;
    color: #000;
}

.float-bar .amount-sum em {
    line-height: 50px;
    padding: 0 5px;
    font-size: 20px;
}

.float-bar .amount-sum em,
.float-bar .price-sum .price em {
    color: #f40;
    font-weight: 700;
    font-size: 18px;
    font-family: tohoma, arial;
}

.float-bar .amount-sum .arrow-box {
    float: left;
}

.selected-items-arrow {
    top: 0;
    display: none;
}

.selected-items-arrow {
    position: absolute;
    z-index: 10002;
    margin-left: -1px;
    background-position: -95px -75px;
    width: 14px;
    height: 7px;
}

.float-bar-holder .float-bar .amount-sum .arrow {
    background-image: url(//gw.alicdn.com/imgextra/i3/O1CN01foF6Zz1MxVEH37Mw6_!!6000000001501-2-tps-37-37.png);
    background-repeat: no-repeat;
    background-position: -21px -21px;
    width: 16px;
    height: 16px;
    margin: 16px 10px 0 6px;
}

.float-bar .amount-sum .arrow {
    display: inline-block;
}

.float-bar .check-cod {
    display: none;
    float: left;
    margin-right: 10px;
    padding-left: 10px;
    line-height: 48px;
    color: #666;
    _margin-top: 17px;
}

.check-cod .icon-cod {
    display: inline-block;
    background-position: -95px -105px;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin: -2px 5px 0 0;
}

.check-cod .s-checkbox {
    margin: -2px 5px 0 0;
}

.s-checkbox {
    display: inline-block;
    width: 15px;
    height: 15px;
    background-position: 0 0;
    vertical-align: middle;
    cursor: pointer;
    text-indent: -9999em;
    overflow: hidden;
}

.float-bar .pipe {
    float: left;
    margin: 0 10px 0 18px;
    width: 1px;
    height: 12px;
}

.float-bar .price-sum {
    margin-right: 7px;
}
.float-bar .amount-sum, .float-bar .price-sum, .float-bar .btn-area {
    float: left;
}
.float-bar .price-sum .price {
    color: #f40;
    font-weight: 400;
    font-size: 18px;
    line-height: 48px;
    font-family: Arial;
    vertical-align: middle;
}

.float-bar .amount-sum,
.float-bar .price-sum {
    height: 48px;
    color: #3c3c3c;
}

.float-bar .price-sum .price em {
    font-weight: 700;
    font-size: 22px;
    padding: 0 3px;
}

.float-bar .total-symbol {
    font-size: 14px;
    font-family: verdana;
}

.float-bar .btn-area {
    float: left;
}
.submit-btn-disabled {
    background: #aaa;
    color: #fff;
    cursor: not-allowed;
}
.float-bar .submit-btn {
    text-align: center;
    font-family: 'Lantinghei SC', 'Microsoft Yahei';
    display: inline-block;
    width: 74px;
    height: 42px;
    line-height: 42px;
    color: #fff;
    background: #FF5000;
    -webkit-border-radius: 21px;
    -moz-border-radius: 21px;
    -ms-border-radius: 21px;
    border-radius: 21px;
    font-size: 16px;
    text-decoration: none;
    cursor: pointer;
}

.float-bar .submit-btn-disabled:link,
.float-bar .submit-btn-disabled:hover {
    cursor: not-allowed;
    text-decoration: none;
    display: inline-block;
    width: 74px;
    height: 42px;
    line-height: 42px;
    color: #fff;
    background: #B0B0B0;
    -webkit-border-radius: 21px;
    -moz-border-radius: 21px;
    -ms-border-radius: 21px;
    border-radius: 21px;
    text-align: center;
}

.float-bar .submit-btn:link {
    color: #fff;
}
</style>
