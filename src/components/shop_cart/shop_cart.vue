<template>
  <div>
    <header-main title="购物车" class="header">
      <div slot="right">
        <a href="#" class="del" @click.prevent="remove()" v-if="goodslist.length!=0">删除</a>
      </div>
    </header-main>
    <div class="cart" v-if="goodslist.length!=0">
      <ul>
        <li v-for="(item,index) in goodslist" :key="index.goods_id">
          <div class="list">
            <!-- 复选框 -->
            <van-checkbox
              v-model="getGoodsSelected[item.goods_id]"
              checked-color="#ff5105"
              @click="selectedChanged(item.goods_id, getGoodsSelected[item.goods_id])"
            ></van-checkbox>
            <!-- 图片 -->
            <img :src="item.imgUrl" />
            <!-- 内容 -->
            <div class="content">
              <span>{{item.title}}</span>
              <span>{{getGoodsDesc[item.goods_id]}}</span>
              <span>包邮</span>
              <div class="numbox">
                <span>￥{{getGoodsPrice[item.goods_id]/100}}</span>
                <numbox
                  :initcount="getGoodsCount[item.goods_id]"
                  :max="item.stock_quantity"
                  :goods="item"
                ></numbox>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="goods_empty" v-else>
      <img
        src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591818057918&di=b4f5d712928cbfc80293df7ceeba7add&imgtype=0&src=http%3A%2F%2Fnuan.storeok.cn%2Fassets%2Fmobile%2Fimg%2Fnoshopping.png"
      />
      <div>购物车空空如也</div>
      <a href="#" @click.prevent=" $router.push(`/shop`)">
        回去逛逛
        <i class="iconfont icon-shouzhi"></i>
      </a>
    </div>

    <van-submit-bar
      :price="(getGoodsCountAndAmount.amount)"
      :button-text="btn_msg"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checked" @click="updateAllSelected" checked-color="#ff2840">全选</van-checkbox>
    </van-submit-bar>
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
    }
  },
  created() {
    this.getGoodsList();
  },
  computed: {
    btn_msg() {
      return "结算(" + this.getGoodsCountAndAmount.count_kind + ")"
    },
    ...mapState(['car']),
    ...mapGetters(['isAllSelected', 'getGoodsCountAndAmount', 'SelectedList', 'getGoodsSelected', 'getGoodsDesc', 'getGoodsPrice', 'getGoodsCount'])
  },
  components: {
    HeaderMain,
    numbox,
  },
  methods: {
    ...mapMutations(['removeFormCar', 'updateGoodsSelected','AllGoodsSelected']),
    onSubmit() {
      this.$router.push(`/order`)
    },
    getGoodsList() {
      var idArr = [];
      this.car.forEach(item => idArr.push(item.goods_id));

      if (idArr.length <= 0) {
        this.goodslist = []
        return;
      }
      GET_CART_LIST(JSON.stringify(idArr)).then(res => {
        handleResponse(res, () => {
          this.goodslist = res.data
          //根据id找商品信息
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
.del {
  margin-right: 5px;
  padding: 8px 10px;
  color: #fff;
  background-color: #ff2840;
  border-radius: 10px;
  font-size: 14px;
  line-height: 45px;
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
.cart {
  background-color: #f4f8fb;
  padding: 10px;
  margin-top: 45px;
  margin-bottom: 50px;

  li {
    background-color: #fff;
    margin-bottom: 10px;
    border-radius: 20px;
    .list {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      font-size: 14px;
      img {
        display: block;
        width: 100px;
        height: 100px;
      }
      .content {
        width: 200px;
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
          font-size: 13px;
          line-height: 13px;
          color: #ff2840;
          border: 1px solid #ff2840;
          border-radius: 5px;
        }
        .numbox {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          line-height: 16px;
          span {
            font-size: 16px;
            color: #ff5105;
            font-weight: bold;
          }
        }
      }
    }
  }
}
</style>
