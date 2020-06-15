<template>
  <div class="detail">
    <header-main :title="skuData.goods_info.title" class="header" />
    <div class="content">
      <!-- 轮播图 -->
      <div class="imgShow">
        <div class="swiper">
          <van-swipe @change="onChange" :initial-swipe="current" touchable>
            <van-swipe-item
              v-for="(item,index) in skuData.img_show"
              :key="index"
              @click=" show = !show"
            >
              <van-image width="100%" height="11rem" fit="cover" :src="item" />
            </van-swipe-item>
          </van-swipe>
          <div class="custom-indicator">{{ current + 1 }}/{{imgShow_length}}</div>
          <!-- 图片预览 -->
          <van-image-preview
            v-model="show"
            :images="skuData.img_show"
            :startPosition="current"
            @change="onChange"
            :closeable="true"
            maxZoom="5"
          >
            <template v-slot:current>第{{ index }}页</template>
          </van-image-preview>
        </div>

        <div class="main-title">
          <div class="top">
            <div class="price">
              <span>￥{{skuData.sku.price}}</span>
            </div>
            <span>已售{{skuData.sold}}</span>
          </div>
          <span class="title">{{skuData.goods_info.title}}</span>
        </div>
        <div class="main-choose">
          <div class="attr_choose">
            <van-field
              label="选择"
              value="选择参数"
              readonly
              label-width="60px"
              right-icon="arrow"
              @click-right-icon="show_sku = true"
            />
            <van-field
              label="参数"
              value="品牌 型号..."
              readonly
              label-width="60px"
              right-icon="arrow"
              @click-right-icon="show_info=true"
            />
          </div>
        </div>
        <div class="main-choose">
          <div class="attr_choose">
            <van-field label="配送" :value="skuData.delivery" readonly label-width="60px" />
            <van-field label="保障" value="假一赔四 退货运费险 极速退款 " readonly label-width="60px" />
          </div>
        </div>
        <!-- 参数/规格 -->
        <van-popup v-model="show_info" position="bottom" closeable>
          <div class="main-choose">
            <div
              class="info"
              v-for="(item,index) in skuData.goods_info.info "
              :key="index"
              v-if="index%2 ==0"
            >
              <table>
                <tr>
                  <td class="title">{{skuData.goods_info.info[index]}}</td>
                  <td>{{skuData.goods_info.info[index+1]}}</td>
                </tr>
              </table>
            </div>
            <a href="javascript;;" class="submit-btn" @click.prevent="show_info=false">确定</a>
          </div>
        </van-popup>
        <!-- 选择参数 -->
        <div class="sku-container">
          <van-sku
            v-model="show_sku"
            :sku="skuData.sku"
            :goods="skuData.goods_info"
            :goods-id="skuData.goods_id"
            :hide-stock="skuData.sku.hide_stock"
            :quota="skuData.quota"
            :quota-used="skuData.quota_used"
            :initial-sku="skuData.initialSku"
            reset-stepper-on-hide
            reset-selected-sku-on-hide
            disable-stepper-input
            :close-on-click-overlay="closeOnClickOverlay"
            :custom-sku-validator="customSkuValidator"
            @buy-clicked="onBuyClicked"
            @add-cart="onAddCartClicked"
          />
        </div>

        <!-- 图片详情 -->
        <div v-for="(item,index) in skuData.img_detail" :key="index" class="goods_img">
          <img :src="item" />
        </div>
      </div>
    </div>

    <!-- 导航 -->
    <van-goods-action>
      <van-goods-action-icon icon="chat-o" text="客服" color="#07c160" />
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        :badge="getAllCount"
        @click="$router.push(`/shop_cart`)"
      />
      <van-goods-action-button type="warning" text="加入购物车" @click="show_sku = true" />
      <van-goods-action-button type="danger" text="立即购买" @click="show_sku = true" />
    </van-goods-action>
  </div>
</template>

<script>
import { handleResponse } from "@/assets/js/common";
import { GET_GOODS_DETAIL } from "@/api";
import numbox from '@/base/goods_numberBox/goods_numberBox';
import HeaderMain from "@/base/header/header";
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data() {
    return {
      selectedCount: 1,
      current: 0,
      show: false,
      imgShow_length: 0,
      imgDetail_length: 0,
      show_sku: false,
      show_info: false,
      skuData: {},
      showCustom: false,
      showStepper: false,
      showSoldout: false,
      closeOnClickOverlay: true,

      customSkuValidator: () => '请选择规格!',
    }
  },
  computed: {
    ...mapGetters(['getAllCount']),
  },
  created() {
    this.goods_id = this.$route.query.goods_id;
    this._reqDetail();
  },
  components: {
    numbox,
    HeaderMain,
  },
  methods: {
    ...mapMutations(['addToCar']),
    onBuyClicked(data) {
    },

    onAddCartClicked(data) {
      this.$toast("已加入购物车");
      var getChoose = document.querySelectorAll('.van-sku-header-item')[1].innerHTML
      var chooseKind = getChoose.substring(3, getChoose.length)
      var arr_id = []
      for (let k in data.selectedSkuComb) {
        switch (k) {
          case "goods_id":
            arr_id[0] = data.selectedSkuComb[k]
            break;
          case "id":
            arr_id[1] = data.selectedSkuComb[k]
            break;
          case "s1":
            arr_id[2] = data.selectedSkuComb[k]
            break;
          case "s2":
            arr_id[3] = parseInt(data.selectedSkuComb[k])
            break;
        }
      }
      var goodsId = arr_id.join('')
      var goodsinfo = {
        goods_id: goodsId,
        selectedNum: data.selectedNum,
        price: data.selectedSkuComb.price,
        desc: getChoose.substring(3, getChoose.length),
        selected: true,
      };
      this.addToCar(goodsinfo);
    },
    onChange(index) {
      this.current = index
    },
    _reqDetail() {
      GET_GOODS_DETAIL(this.goods_id).then(res => {
        handleResponse(res, () => {
          this.skuData = res.data;
          this.imgShow_length = this.skuData.img_show.length
          this.imgDetail_length = this.skuData.img_detail.length
        });
      });
    },
    getSelectedCount(count) {
      this.selectedCount = count;
    },
  }
}
</script>

<style lang="less" scoped>
.van-goods-action {
  z-index: 999;
}
.detail {
  font-size: 18px;
  background-color: #f5f5f5;
  margin-bottom: 50px;
  .header {
    position: fixed;
    top: 0;
    z-index: 10000;
  }
  .content {
    margin-top: 45px;
    .imgShow {
      margin-top: 45px;
      > span {
        display: block;
        font-size: 20px;
        font-weight: 700;
        color: #1a1a1a;
        margin-bottom: 10px;
      }
      .swiper {
        width: 100%;
        .custom-indicator {
          position: absolute;
          top: 426px;
          right: 5px;
          z-index: 1000;
          text-align: center;
          padding: 8px 10px;
          width: 20px;
          height: 10px;
          line-height: 10px;
          background-color: rgba(0, 0, 0, 0.3);
          color: #fff;
          border-radius: 20px;
          font-size: 14px;
        }
      }
    }
  }
  .main-title {
    padding: 20px 12px;
    margin-bottom: 10px;
    background-color: #fff;
    .top {
      display: flex;
      justify-content: space-between;
      .price {
        span {
          color: #ff5105;
          font-size: 33px;
        }
      }
      span {
        color: #929292;
        font-size: 14px;
        line-height: 14px;
      }
    }
    .title {
      margin: 10px;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 16px;
    }
  }
  .main-choose {
    padding: 0px 12px;
    margin-bottom: 10px;
    background-color: #fff;
    .attr_choose {
      margin: 10px;
      .van-cell {
        padding: 10px 0px;
        color: #9e9e9e;
      }
    }
    .info {
      padding: 5px;
      font-size: 14px;
      border-bottom: 1px solid #f5f5f5;
      color: #4f4e4e;
      td {
        padding: 5px;
      }
      .title {
        color: #929292;
        width: 100px;
      }
    }
    .submit-btn {
      display: block;
      width: 100%;
      height: 45px;
      line-height: 45px;
      text-align: center;
      margin: 5px auto;
      color: white;
      font-size: 18px;
      background: linear-gradient(to right, #ffd01e, #ff8917);
    }
  }
  .goods_img {
    img {
      width: 100%;
      vertical-align: bottom;
    }
  }
}
</style>