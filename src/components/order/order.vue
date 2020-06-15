<template>
  <div style="height:50px;background-color: #f4f8fb">
    <header-main title="确认订单" path="shop" @back="$router.push(`shop`)" class="header"></header-main>
    <div class="address" @click="$router.push(`address`)">
      <div class="content">
        <span class="logo">
          <i class="iconfont icon-dingwei"></i>
        </span>
        <div class="detail">
          <span>{{userAddress.name}}</span>
          <span>{{userAddress.tel}}</span>
          <span v-show="userAddress.isDefault">默认</span>
          <span>{{userAddress.address}}</span>
        </div>
        <span class="logo2">
          <i class="iconfont icon-gengduo"></i>
        </span>
      </div>
    </div>
    <div class="cart" v-if="goodslist.length!=0">
      <ul>
        <li v-for="(item,index) in goodslist" :key="index.goods_id">
          <div class="list">
            <!-- 图片 -->
            <img :src="item.imgUrl" />
            <!-- 内容 -->
            <div class="content">
              <span>{{item.title}}</span>
              <span>{{getGoodsDesc[item.goods_id]}}</span>
            </div>
            <!-- 价格、数量 -->
            <div class="numbox">
              <span>￥{{getGoodsPrice[item.goods_id]/100}}</span>
              <span>x{{getGoodsCount[item.goods_id]}}</span>
            </div>
          </div>
        </li>
      </ul>
      <!-- 支付 -->
      <div class="toPay">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell title="支付宝" clickable @click="radio = '1'">
              <template #icon="props">
                <img class="img-icon" :src="require('@/images/alipay.png')" />
              </template>
              <van-radio name="1" style="float:right" />
            </van-cell>

            <van-cell title="微信" clickable @click="radio = '2'">
              <template #icon="props">
                <img class="img-icon" :src="require('@/images/wechat.png')" />
              </template>
              <van-radio name="2" style="float:right" />
            </van-cell>

            <van-cell title="花呗" clickable @click="radio = '3'">
              <template #icon="props">
                <img class="img-icon" :src="require('@/images/huabei.png')" />
              </template>
              <van-radio name="3" style="float:right" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </div>
    <div class="goods_empty" v-else>
      <img
        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591818057918&di=b4f5d712928cbfc80293df7ceeba7add&imgtype=0&src=http%3A%2F%2Fnuan.storeok.cn%2Fassets%2Fmobile%2Fimg%2Fnoshopping.png"
      />
      <div>暂无订单</div>
      <a href="#" @click.prevent=" $router.push(`/shop`)">
        回去逛逛
        <i class="iconfont icon-shouzhi"></i>
      </a>
    </div>

    <van-submit-bar :price="(getGoodsCountAndAmount.amount)" button-text="提交订单" @submit="onSubmit"></van-submit-bar>
  </div>
</template>

<script>
import numbox from '@/base/goods_numberBox/goods_numberBox'
import { GET_CART_LIST } from "@/api";
import config from '@/assets/js/config';
import HeaderMain from "@/base/header/header";
import { Toast, Dialog } from "vant";
import { handleResponse, getLocalStorage } from "@/assets/js/common";
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data() {
    return {
      goodslist: [], // 购物车中所有商品的数据
      checked: this.isAllSelected,
      deleteList: [],
      radio: '1',
    }
  },
  created() {
    this.getGoodsList();
  },
  computed: {
    ...mapState(['car', 'address', 'tempAddress']),
    ...mapGetters(['isAllSelected', 'getGoodsCountAndAmount', 'SelectedList', 'getGoodsSelected', 'getGoodsDesc', 'getGoodsPrice', 'getGoodsCount', 'delivery_address']),
    userAddress() {
      var o
      if (this.tempAddress !== null) {
        o = this.tempAddress
        this.isDefault = this.tempAddress.isDefault
        return o
      } else {
        o = this.delivery_address
        return o
      }
    }

  },
  components: {
    HeaderMain,
    numbox,
  },
  methods: {
    ...mapMutations(['removeFormCar', 'updateGoodsSelected', 'AllGoodsSelected']),
    onSubmit() {
      Toast.success('提交成功');
      this.$router.push(`/shop`)
    },

    getGoodsList() {
      GET_CART_LIST(JSON.stringify(this.SelectedList)).then(res => {
        handleResponse(res, () => {
          this.goodslist = res.data
        })
      })
    },
    remove() {
      Dialog.confirm({
        title: '提示',
        message: '确认将宝贝删除？',
      })
        .then(() => {
          this.SelectedList.forEach(item => {
            this.removeFormCar(item);
          })
          this.getGoodsList()
          this.$toast("删除成功")
        })
        .catch(() => {

        });
    },
    selectedChanged(goods_id, val) {
      this.updateGoodsSelected({ goods_id, selected: val });
      if (this.isAllSelected) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    updateAllSelected() {
      this.AllGoodsSelected(this.checked);
    }
  },
}
</script>

<style lang="less" scope>
.header {
  position: fixed;
  top: 0;
  z-index: 10000;
}
.goods_empty {
  text-align: center;
  background-color: #fff;
  font-size: 18px;
  img {
    margin-top: 45px;
    width: 100%;
  }
  a {
    color: #7f7f7f;
    text-decoration: underline;
  }
  i {
    font-size: 25px;
    color: #a3a2a1;
  }
}
.address {
  margin-top: 45px;
  background-color: #f4f8fb;
  padding: 10px;
  .content {
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    padding: 10px;
    border-radius: 20px;
    .logo {
      display: flex;
      flex-direction: column;
      justify-content: center;
      i {
        font-size: 35px;
        color: #ff510a;
      }
    }
    .logo2 {
      display: flex;
      flex-direction: column;
      justify-content: center;
      i {
        font-size: 20px;
        color: #908e8e;
      }
    }
    .detail {
      margin: 0px 10px;
      span:nth-child(1) {
        font-size: 16px;
      }
      span:nth-child(2) {
        margin-left: 10px;
        color: #908e8e;
        font-size: 12px;
      }
      span:nth-child(3) {
        margin-left: 10px;
        color: #fff;
        background-color: red;
        padding: 3px;
        border-radius: 10px;
        font-size: 10px;
      }
      span:nth-child(4) {
        display: block;
        margin-top: 5px;
        font-size: 12px;
      }
    }
  }
}
.cart {
  background-color: #f4f8fb;
  padding: 10px;
  margin-top: 0px;
  margin-bottom: 50px;
  ul {
    background-color: #fff;
    border-radius: 20px;
    li {
      .list {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 0px;
        font-size: 14px;
        img {
          display: block;
          width: 100px;
          height: 100px;
        }
        .content {
          width: 180px;
          span {
            text-align: left;
            margin: 6px;
          }
          span:nth-child(1) {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          span:nth-child(2) {
            background-color: #f5f5f5;
            font-size: 13px;
            color: #989898;
          }
          span:nth-child(3) {
            // background-color: #dcdcdc;
            font-size: 13px;
            line-height: 13px;
            color: #ff2840;
            border: 1px solid #ff2840;
            border-radius: 5px;
          }
        }
        .numbox {
          text-align: right;
          span {
            display: block;
            font-size: 16px;
          }
          span:nth-child(2) {
            font-size: 13px;
            color: #a39e9b;
          }
        }
      }
    }
  }
  .toPay {
    margin-top: 10px;
    .img-icon {
      margin-right: 10px;
      width: 30px;
      height: 30px;
    }
  }
}
</style>
