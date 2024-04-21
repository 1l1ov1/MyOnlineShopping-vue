// 用户相关常量
// 用户身份
const USER_STATUS = {
  SUPER_ADMINISTRATOR: {
    value: 0,
    label: '超级管理员'
  },
  MANAGER: {
    value: 1,
    label: '管理员'
  },
  COMMON_USER: {
    value: 2,
    label: '普通用户'
  },
  BUSINESSMAN: {
    value: 3,
    label: '商家'
  }
}

// 在线状态
const ONLINE_STATUS = {
  IS_ONLINE: {
    value: 1,
    label: '在线'
  },
  IS_OFFLINE: {
    value: 0,
    label: '不在线'
  }
}

// 账号状态
const ACCOUNT_STATUS = {
  ENABLE: {
    value: 1,
    label: '正常'
  },
  DISABLE: {
    value: 0,
    label: '禁用'
  }
}

class UserConstants {
  constructor () {
    this.userStatus = USER_STATUS
    this.onlineStatus = ONLINE_STATUS
    this.accountStatus = ACCOUNT_STATUS
  }

  /**
   * 根据提供的值查找USER_STATUS中的对应状态。如果找不到匹配项，返回null。
   * @param {number} value - 要查找的用户状态值。
   * @returns {string|null} - 匹配的用户状态对象的名字或null。
   */
  getUserStatusLabel (value) {
    // 确保USER_STATUS是对象且不为空，增加代码健壮性
    if (!this.userStatus || typeof this.userStatus !== 'object' || Object.keys(this.userStatus).length === 0) {
      throw new Error('USER_STATUS is not a valid object.')
    }

    // 使用Object.values进行查找，提高查找效率
    const matchingStatus = Object.values(this.userStatus).find(status => status.value === value)

    // 如果找到匹配项，返回之；否则返回null
    return matchingStatus?.label ?? null
  }

  /**
   * 根据提供的值查找ACCOUNT_STATUS中的对应状态。如果找不到匹配项，返回null。
   * @param {number} value - 要查找的账号状态值。
   * @returns {string|null} - 匹配的账号状态对象的名字或null。
   */
  getAccountStatusLabel (value) {
    // 确保ACCOUNT_STATUS是对象且不为空，增加代码健壮性
    if (!this.accountStatus || typeof this.accountStatus !== 'object' || Object.keys(this.accountStatus).length === 0) {
      throw new Error('ACCOUNT_STATUS is not a valid object.')
    }

    // 使用Object.values进行查找，提高查找效率
    const matchingStatus = Object.values(this.accountStatus).find(status => status.value === value)

    // 如果找到匹配项，返回之；否则返回null
    return matchingStatus?.label ?? null
  }

  /**
   * 根据提供的值查找ONLINE_STATUS中的对应状态。如果找不到匹配项，返回null。
   * @param {number} value - 要查找的在线状态值。
   * @returns {string|null} - 匹配的在线状态对象的名字或null。
   */
  getOnlineStatusLabel (value) {
    // 确保ONLINE_STATUS是对象且不为空，增加代码健壮性
    if (!this.onlineStatus || typeof this.onlineStatus !== 'object' || Object.keys(this.onlineStatus).length === 0) {
      throw new Error('ONLINE_STATUS is not a valid object.')
    }

    // 使用Object.values进行查找，提高查找效率
    const matchingStatus = Object.values(this.onlineStatus).find(status => status.value === value)

    // 如果找到匹配项，返回之；否则返回null
    return matchingStatus?.label ?? null
  }
}

// 创建一个UserConstants实例供全局使用
const userConstant = new UserConstants()

// 订单相关常量
const ORDERS_STATUS = {
  ALL_ORDERS: {
    value: 0,
    label: '全部订单'
  },
  UNSHIPPED_ORDER: {
    value: 1,
    label: '未发货'
  },
  SHIPPED_ORDER: {
    value: 2,
    label: '已发货'
  },
  REFUNDED_ORDER: {
    value: 3,
    label: '退款'
  },
  USER_RECEIVE_PRODUCT: {
    value: 4,
    label: '用户已收货'
  },
  SUCCESSFUL_ORDER: {
    value: 5,
    label: '交易成功'
  }
}
class OrdersConstants {
  constructor () {
    this.ordersStatus = ORDERS_STATUS
  }

  /**
   * 根据提供的值查找ORDERS_STATUS中的对应状态。如果找不到匹配项，返回null。
   * @param {number} value - 要查找的订单状态值。
   * @returns {string|null} - 匹配的订单状态对象的名字或null。
   */
  getOrdersStatusLabel (value) {
    // 确保STORE_STATUS是对象且不为空，增加代码健壮性
    if (!this.ordersStatus || typeof this.ordersStatus !== 'object' || Object.keys(this.ordersStatus).length === 0) {
      throw new Error('STORE_STATUS is not a valid object.')
    }

    // 使用Object.values进行查找，提高查找效率
    const matchingStatus = Object.values(this.ordersStatus).find(status => status.value === value)

    // 如果找到匹配项，返回之；否则返回null
    return matchingStatus?.label ?? null
  }
}
// 创建一个OrdersConstants实例供全局使用
const ordersConstant = new OrdersConstants()
// 店铺相关常量
// 店铺状态
const STORE_STATUS = {
  OPEN: {
    value: 1,
    label: '开店'
  },
  CLOSE: {
    value: 0,
    label: '关店'
  }
}

class StoreConstants {
  constructor () {
    this.storeStatus = STORE_STATUS
  }

  /**
   * 根据提供的值查找STORE_STATUS中的对应状态。如果找不到匹配项，返回null。
   * @param {number} value - 要查找的店铺状态值。
   * @returns {string|null} - 匹配的店铺状态对象的名字或null。
   */
  getStoreStatusLabel (value) {
    // 确保STORE_STATUS是对象且不为空，增加代码健壮性
    if (!this.storeStatus || typeof this.storeStatus !== 'object' || Object.keys(this.storeStatus).length === 0) {
      throw new Error('STORE_STATUS is not a valid object.')
    }

    // 使用Object.values进行查找，提高查找效率
    const matchingStatus = Object.values(this.storeStatus).find(status => status.value === value)

    // 如果找到匹配项，返回之；否则返回null
    return matchingStatus?.label ?? null
  }

  /**
     * 取反, 由于商店的状态只有0 和 1，所以直接取反即可
     * @param {Number} value - 要查找的店铺状态值。
     * @returns {string} - 反转后的店铺状态对象的标签。
     */
  getReversStoreStatusLabel (value) {
    // 确保STORE_STATUS是对象且不为空，增加代码健壮性
    if (!this.storeStatus || typeof this.storeStatus !== 'object' || Object.keys(this.storeStatus).length === 0) {
      throw new Error('STORE_STATUS is not a valid object.')
    }

    // 反转该值并在STORE_STATUS中找到相应的标签
    const reversedValue = 1 - value
    const matchingStatus = Object.values(this.storeStatus).find(status => status.value === reversedValue)

    // 返回匹配的标签，如果找不到则抛出错误
    if (matchingStatus) {
      return matchingStatus.label
    } else {
      throw new Error(`Invalid store status value: ${value}`)
    }
  }
}

// 创建一个StoreConstants实例供全局使用
const storeConstant = new StoreConstants()

// 商品相关常量
// 商品状态
const GOODS_STATUS = {
  SHELVES: {
    label: '上架',
    value: 1
  },
  TAKE_OFF_THE_SHELVES: {
    label: '下架',
    value: 0
  }
}
// 商品折扣
const GOODS_DISCOUNT = {
  FREE: {
    label: '免费',
    value: 0.00
  },
  ONE_FOLD: {
    label: '1折',
    value: 0.10
  },
  ONE_POINT_FIVE_FOLD: {
    label: '1.5折',
    value: 0.15
  },
  TWO_FOLD: {
    label: '2折',
    value: 0.20
  },
  TWO_POINT_FIVE_FOLD: {
    label: '2.5折',
    value: 0.25
  },
  THREE_FOLD: {
    label: '3折',
    value: 0.30
  },
  THREE_POINT_FIVE_FOLD: {
    label: '3.5折',
    value: 0.35
  },
  FOUR_FOLD: {
    label: '4折',
    value: 0.40
  },
  FOUR_POINT_FIVE_FOLD: {
    label: '4.5折',
    value: 0.45
  },
  FIVE_FOLD: {
    label: '5折',
    value: 0.50
  },
  FIVE_POINT_FIVE_FOLD: {
    label: '5.5折',
    value: 0.55
  },
  SIX_FOLD: {
    label: '6折',
    value: 0.60
  },
  SIX_POINT_FIVE_FOLD: {
    label: '6.5折',
    value: 0.65
  },
  SEVEN_FOLD: {
    label: '7折',
    value: 0.70
  },
  SEVEN_POINT_FIVE_FOLD: {
    label: '7.5折',
    value: 0.75
  },
  EIGHT_FOLD: {
    label: '8折',
    value: 0.80
  },
  EIGHT_POINT_FIVE_FOLD: {
    label: '8.5折',
    value: 0.85
  },
  NINE_FOLD: {
    label: '9折',
    value: 0.90
  },
  NINE_POINT_FIVE_FOLD: {
    label: '9.5折',
    value: 0.95
  },
  PRICE_FOLD: {
    label: '原价',
    value: 1.00
  }
}
class GoodsConstants {
  constructor () {
    this.goodsStatus = GOODS_STATUS
    this.goodsDiscount = GOODS_DISCOUNT
  }

  /**
 * 根据商品状态值获取对应的状态标签
 * @param {string} value - 商品状态的值
 * @returns {string|null} - 对应的商品状态标签。如果找不到匹配的状态，则返回null。
 */
  getGoodsStatusLabel (value) {
  // 检查goodsStatus是否为有效对象，增强代码健壮性
    if (!this.goodsStatus || typeof this.goodsStatus !== 'object' || Object.keys(this.goodsStatus).length === 0) {
      throw new Error('STORE_STATUS is not a valid object.')
    }

    // 使用Object.values和find方法来查找匹配的状态
    const matchingStatus = Object.values(this.goodsStatus).find(status => status.value === value)

    // 返回匹配到的状态标签，若未匹配到则返回null
    return matchingStatus?.label ?? null
  }

  /**
 * 获取商品状态的反向标签
 * 该方法用于根据给定的商品状态值（value），找到其在STORE_STATUS对象中的反向状态标签。
 *
 * @param {number} value - 商品状态的数值。
 * @returns {string} 返回匹配的反向状态标签。
 * @throws {Error} 如果STORE_STATUS不是一个有效的对象，或者无法找到匹配的反向状态标签，则抛出错误。
 */
  getReversGoodsStatusLabel (value) {
  // 检查GOODS_STATUS的有效性
    if (!this.goodsStatus || typeof this.goodsStatus !== 'object' || Object.keys(this.goodsStatus).length === 0) {
      throw new Error('STORE_STATUS is not a valid object.')
    }

    // 计算反向值并寻找匹配的状态
    const reversedValue = 1 - value
    const matchingStatus = Object.values(this.goodsStatus).find(status => status.value === reversedValue)

    // 处理找到匹配状态和未找到匹配状态的情况
    if (matchingStatus) {
      return matchingStatus.label
    } else {
      throw new Error(`Invalid store status value: ${value}`)
    }
  }
}
const goodsConstant = new GoodsConstants()

const APPLY_STATUS = {
  UNDER_REVIEW: {
    value: 0,
    label: '待审核'
  },
  APPROVED: {
    value: 1,
    label: '已通过'
  },
  REVIEW_REJECTION: {
    value: 2,
    label: '被拒绝'
  }
}
class ApplyConstants {
  constructor () {
    this.applyStatus = APPLY_STATUS
  }

  getApplyStatusLabel (value) {
    // 检查applyStatus是否为有效对象，增强代码健壮性
    if (!this.applyStatus || typeof this.applyStatus !== 'object' || Object.keys(this.applyStatus).length === 0) {
      throw new Error('STORE_STATUS is not a valid object.')
    }

    // 使用Object.values和find方法来查找匹配的状态
    const matchingStatus = Object.values(this.applyStatus).find(status => status.value === value)

    // 返回匹配到的状态标签，若未匹配到则返回null
    return matchingStatus?.label ?? null
  }
}
const applyConstant = new ApplyConstants()

// 修改密码修改常量
const PASSWORD_TYPE = {
  FORGET: {
    value: 1,
    label: '忘记密码'
  },
  UPDATE: {
    value: 2,
    label: '修改密码'
  }
}
class PasswordConstants {
  constructor () {
    this.passwordType = PASSWORD_TYPE
  }
}

const passwordConstant = new PasswordConstants()

// 地址常量
const ADDRESS_STATUS = {
  IS_DEFAULT: {
    value: 1,
    label: '默认地址'
  },
  IS_NOT_DEFAULT: {
    value: 0,
    label: '非默认地址'
  }
}

class AddressConstants {
  constructor () {
    this.addressStatus = ADDRESS_STATUS
  }
}

const addressConstant = new AddressConstants()

// 禁言时间
const FORBIDDEN_WORD_TIME = {
  HALF_HOUR: {
    value: 0.5,
    label: '半小时'
  },
  ONE_HOUR: {
    value: 1.0,
    label: '一小时'
  },
  TWO_HOURS: {
    value: 2.0,
    label: '两小时'
  },
  THREE_HOURS: {
    value: 3.0,
    label: '三小时'
  },
  FOUR_HOURS: {
    value: 4.0,
    label: '四小时'
  },
  FIVE_HOURS: {
    value: 5.0,
    label: '五小时'
  },
  SIX_HOURS: {
    value: 6.0,
    label: '六小时'
  },
  SEVEN_HOURS: {
    value: 7.0,
    label: '七小时'
  },
  EIGHT_HOURS: {
    value: 8.0,
    label: '八小时'
  },
  NINE_HOURS: {
    value: 9.0,
    label: '九小时'
  },
  TEN_HOURS: {
    value: 10.0,
    label: '十小时'
  },
  TWELVE_HOURS: {
    value: 12.0,
    label: '十二小时'
  },
  ONE_DAY: {
    value: 24.0,
    label: '一天'
  },
  THREE_DAYS: {
    value: 72.0,
    label: '三天'
  },
  ONE_WEEK: {
    value: 168.0,
    label: '一周'
  },
  TWO_WEEKS: {
    value: 336.0,
    label: '两周'
  },
  ONE_MONTH: {
    value: 720.0,
    label: '一个月'
  },
  ONE_YEAR: {
    value: 8760.0,
    label: '一年'
  },
  FOREVER: {
    value: -1,
    label: '永久'
  }
}
// 封禁时间
const BAN_TIME = {
  HALF_HOUR: {
    value: 0.5,
    label: '半小时'
  },
  ONE_HOUR: {
    value: 1.0,
    label: '一小时'
  },
  TWO_HOURS: {
    value: 2.0,
    label: '两小时'
  },
  THREE_HOURS: {
    value: 3.0,
    label: '三小时'
  },
  FOUR_HOURS: {
    value: 4.0,
    label: '四小时'
  },
  FIVE_HOURS: {
    value: 5.0,
    label: '五小时'
  },
  SIX_HOURS: {
    value: 6.0,
    label: '六小时'
  },
  SEVEN_HOURS: {
    value: 7.0,
    label: '七小时'
  },
  EIGHT_HOURS: {
    value: 8.0,
    label: '八小时'
  },
  NINE_HOURS: {
    value: 9.0,
    label: '九小时'
  },
  TEN_HOURS: {
    value: 10.0,
    label: '十小时'
  },
  TWELVE_HOURS: {
    value: 12.0,
    label: '十二小时'
  },
  ONE_DAY: {
    value: 24.0,
    label: '一天'
  },
  THREE_DAYS: {
    value: 72.0,
    label: '三天'
  },
  ONE_WEEK: {
    value: 168.0,
    label: '一周'
  },
  TWO_WEEKS: {
    value: 336.0,
    label: '两周'
  },
  ONE_MONTH: {
    value: 720.0,
    label: '一个月'
  },
  ONE_YEAR: {
    value: 8760.0,
    label: '一年'
  },
  FOREVER: {
    value: -1.0,
    label: '永久'
  }
}
class ForbiddenWordOrBanConstants {
  constructor () {
    this.forbiddenWordTime = FORBIDDEN_WORD_TIME
    this.banTime = BAN_TIME
  }

  getForbiddenWordTimeLabel (value) {
    // 检查forbiddenWordTime是否为有效对象，增强代码健壮性
    if (!this.forbiddenWordTime || typeof this.forbiddenWordTime !== 'object' || Object.keys(this.forbiddenWordTime).length === 0) {
      throw new Error('禁言时间不是一个合法参数')
    }

    // 使用Object.values和find方法来查找匹配的状态
    const matchingStatus = Object.values(this.forbiddenWordTime).find(time => time.value === value)
    return matchingStatus?.label ?? null
  }

  getBanTimeLabel (value) {
    // 检查banTime是否为有效对象，增强代码健壮性
    if (!this.banTime || typeof this.banTime !== 'object' || Object.keys(this.banTime).length === 0) {
      throw new Error('封禁时间不是一个合法参数')
    }

    // 使用Object.values和find方法来查找匹配的状态
    const matchingStatus = Object.values(this.banTime).find(time => time.value === value)
    return matchingStatus?.label ?? null
  }
}

const forbiddenWordOrBanConstant = new ForbiddenWordOrBanConstants()

const WEBSOCKET_TYPE = {
  REMIND_ORDER: {
    value: 1,
    label: '提醒订单'
  },
  USER_URGE_ORDER: {
    value: 2,
    label: '用户催单'
  },
  USER_EXIT: {
    value: 3,
    label: '账号被封禁'
  }
}

class WebSocketTypeConstants {
  constructor () {
    this.websocketType = WEBSOCKET_TYPE
  }

  getWebSocketTypeLabel (value) {
    // 检查websocketType是否为有效对象，增强代码健壮性
    if (!this.websocketType || typeof this.websocketType !== 'object' || Object.keys(this.websocketType).length === 0) {
      throw new Error('WEBSOCKET_TYPE is not a valid object.')
    }

    // 使用Object.values和find方法来查找匹配的状态
    const matchingStatus = Object.values(this.websocketType).find(type => type.value === value)
    return matchingStatus?.label ?? null
  }
}

const websocketTypeConstant = new WebSocketTypeConstants()
export {
  userConstant,
  storeConstant,
  ordersConstant,
  goodsConstant,
  applyConstant,
  passwordConstant,
  addressConstant,
  forbiddenWordOrBanConstant,
  websocketTypeConstant
}
