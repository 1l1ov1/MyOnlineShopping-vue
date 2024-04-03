<script setup>
defineProps({
  btnIsDisable: Boolean,
  goodsTotalPrice: Number,
  length: Number
})

const emit = defineEmits(['submitResult'])
// 通知要提交了
const submitResult = () => {
  emit('submitResult', true)
}
</script>

<template>
    <div id="J_FilterBar" class="cart-filter-bar">
        <span id="J_CartSwitch" class="switch-cart">购物车 {{ length === 0 ? '' : '(全部' + length + ')' }}</span>
        <div class="cart-sum">
            <span class="pay-text">已选商品（不含运费）</span>
            <strong class="price">
                <em id="J_SmallTotal">
                    <span class="total-symbol">&nbsp;</span>
                    {{ goodsTotalPrice.toFixed(2) }}
                </em>
            </strong>
            <a @click="submitResult" id="J_SmallSubmit"
                :class="{ 'submit-btn': true, 'submit-btn-disabled': btnIsDisable }">结&nbsp;算</a>
        </div>
    </div>
</template>

<style lang='less' scoped>
.cart-filter-bar {
    overflow: hidden;
    font-size: 12px;
    position: relative;
    height: 72px;
    padding: 0 18px;
    border-bottom: 1px solid #e6e6e6;
}

.switch-cart {
    overflow: hidden;
    color: #000;
    font-size: 18px;
    font-weight: 600;
    height: 72px;
    line-height: 72px;
}

.cart-filter-bar .cart-sum {
    position: absolute;
    right: 18px;
    top: 0;
    height: 72px;
    line-height: 72px;
    font-size: 14px;
}

.cart-sum .pay-text {
    position: relative;
    top: -2px;
}

.cart-sum .price {
    font-family: Arial, Verdana;
    font-weight: 400;
    margin-right: 12px;
    font-size: 22px;
    color: #FF5000;
}

.cart-sum .price em {
    font-family: Verdana, Arial;
    padding-left: 2px;
    font-weight: 500;
}

.total-symbol {
    font-size: 12px;
    font-weight: 400;
}

.cart-sum .submit-btn {
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
    text-align: center;
    cursor: pointer;
    text-decoration: none;
    position: relative;
    top: -2px;
    font-size: 16px;
}

.cart-sum .combine-not-supported,
.cart-sum .submit-btn-disabled,
.cart-sum .cart-sum .submit-btn-disabled:hover {
    background: #aaa;
    color: #fff;
    cursor: not-allowed;
}
</style>
