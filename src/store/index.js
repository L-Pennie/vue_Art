import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var car = JSON.parse(localStorage.getItem('car') || '[]')
var address = JSON.parse(localStorage.getItem('address') || '[]')
var defaultAddress = JSON.parse(localStorage.getItem('defaultAddress') || false)
var tempAddress = null
var ids = JSON.parse(localStorage.getItem('ids') || 0)
export default new Vuex.Store({
    state: {
        car,
        address,
        ids,
        defaultAddress,
        tempAddress,
    },
    mutations: {
        //详情页——加入购物车
        addToCar(state, goodsinfo) {
            var flag = false
            state.car.some(item => {
                if (item.goods_id == goodsinfo.goods_id) {
                    item.selectedNum += parseInt(goodsinfo.selectedNum)
                    flag = true
                    return true
                }
            })

            if (!flag) {
                state.car.push(goodsinfo)
            }
            localStorage.setItem('car', JSON.stringify(state.car))
        },
        // 购物车页——修改商品数量
        updateGoodsInfo(state, goodsinfo) {
            state.car.some(item => {
                if (item.goods_id == goodsinfo.goods_id) {
                    item.selectedNum = parseInt(goodsinfo.selectedNum)
                    return true
                }
            })
            localStorage.setItem('car', JSON.stringify(state.car))
        },
        // 购物车页——删除商品
        removeFormCar(state, goods_id) {
            state.car.some((item, i) => {
                if (item.goods_id == goods_id) {
                    state.car.splice(i, 1)
                    return true;
                }
            })
            localStorage.setItem('car', JSON.stringify(state.car))
        },
        // 购物车页——修改商品选中状态
        updateGoodsSelected(state, info) {
            state.car.some(item => {
                if (item.goods_id == info.goods_id) {
                    item.selected = info.selected
                }
            })
            localStorage.setItem('car', JSON.stringify(state.car))
        },
        // 购物车页——全选/不全选
        AllGoodsSelected(state, selected) {
            let newCar = state.car.map(item => {
                item.selected = selected
            })
            localStorage.setItem('car', JSON.stringify(newCar))
        },
        //添加or修改地址
        addAddress(state, addressInfo) {
            var flag = false
            state.address.some(item => {
                // 如果id存在，修改地址信息
                if (item.id == addressInfo.id) {
                    item.name = addressInfo.name;
                    item.tel = addressInfo.tel;
                    item.province = addressInfo.province;
                    item.city = addressInfo.city;
                    item.county = addressInfo.county;
                    item.areaCode = addressInfo.areaCode;
                    item.postalCode = addressInfo.postalCode;
                    item.addressDetail = addressInfo.addressDetail;
                    item.address = addressInfo.province + addressInfo.city + addressInfo.county + addressInfo.addressDetail;
                    item.isDefault = addressInfo.isDefault;
                    flag = true
                        // 如果设置此地址信息为默认
                    if (addressInfo.isDefault == true) {
                        state.address.map((item, i) => {
                            if (item.isDefault == true && item.id != addressInfo.id) {
                                item.isDefault = false
                            }
                            if (item.id == addressInfo.id) {
                                state.address.splice(i, 1);
                                state.address.unshift(item);
                            }
                        })
                        state.defaultAddress = true
                    }
                    return true
                }

            })

            // 如果id不存在，添加地址信息
            if (!flag) {
                state.address.unshift(addressInfo)
                state.ids++
                    // 如果没有设置此地址信息为默认
                    if (addressInfo.isDefault == false) {
                        state.address.some((item, i) => {
                            if (item.isDefault == true) {
                                state.address.splice(i, 1);
                                state.address.unshift(item);
                            }
                        })
                        state.defaultAddress = true
                    }
            }
            localStorage.setItem('address', JSON.stringify(state.address))
        },
        // 删除地址信息
        removeFormAddress(state, id) {
            state.address.some((item, i) => {
                if (item.id == id) {
                    state.address.splice(i, 1)
                    return true;
                }
            })
            localStorage.setItem('address', JSON.stringify(state.address))
        },
        setTempAddress(state, addressinfo) {
            state.tempAddress = addressinfo
        },
    },
    getters: {
        //  购物车商品总数
        getAllCount(state) {
            var c = 0;
            state.car.forEach(item => {
                c += item.selectedNum
            })
            return c
        },
        // 购物车页——每个商品的numbox对应的数量值
        getGoodsCount(state) {
            var o = {}
            state.car.forEach(item => {
                o[item.goods_id] = item.selectedNum
            })
            return o
        },
        // 购物车页——每个商品对应的desc
        getGoodsDesc(state) {
            var o = {}
            state.car.forEach(item => {
                o[item.goods_id] = item.desc
            })
            return o
        },
        // 购物车页——每个商品对应的price
        getGoodsPrice(state) {
            var o = {}
            state.car.forEach(item => {
                o[item.goods_id] = item.price
            })
            return o
        },
        // 购物车页——每个商品对应的选中状态
        getGoodsSelected(state) {
            var o = {}
            state.car.forEach(item => {
                o[item.goods_id] = item.selected
            })
            return o
        },
        // 购物车页——选中的商品
        SelectedList(state) {
            var o = []
            state.car.forEach(item => {
                if (item.selected == true) {
                    o.push(item.goods_id)
                }
            })
            return o
        },
        // 购物车页——计算总价
        getGoodsCountAndAmount(state) {
            var o = {
                selectedNum: 0, // 勾选的数量
                amount: 0, // 勾选的总价
                count_kind: 0 // 勾选的种类
            }
            state.car.forEach(item => {
                if (item.selected) {
                    o.selectedNum += item.selectedNum
                    o.count_kind++
                        o.amount += item.price * item.selectedNum
                }
            })
            return o
        },
        isAllSelected(state) {
            let result = state.car.every(item => {
                return item.selected == true
            })
            return result
            let a
            for (let i = 0; i < state.car.length; i++) {
                if (!state.car[i].selected) {
                    a = false;
                    break
                } else {
                    a = true
                }
            }
            return a
        },
        delivery_address(state) {
            var k
            state.address.some(item => {
                if (item.isDefault == true) {
                    k = item
                }
            })
            return k
        }
    },
    actions: {},
    modules: {}
})