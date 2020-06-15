<template>
  <div class="shopDeal">
    <div @click="reduceGoods">-</div>
    <div>{{countChanged}}</div>
    <div @click="addGoods">+</div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      selectedNum: 1,
    }
  },
  mounted() {
    if (this.initcount) {
      this.selectedNum = this.initcount
    }
  },
  computed: {
    countChanged() {
      this.$emit("getcount", parseInt(this.selectedNum));
      return this.selectedNum
    }
  },
  methods: {
    // 3.减少商品数量
    reduceGoods() {
      if (this.goods) {
        if (this.selectedNum > 1) {
          this.selectedNum = parseInt(this.selectedNum) - 1
          this.updateShopCar()
        }
        return
      } else {
        if (this.selectedNum > 1) {
          this.selectedNum = parseInt(this.selectedNum) - 1
        }
        return
      }

    },
    // 4.增加商品数量 保证传递数据和 mutations 一致
    addGoods() {
      if (this.goods) {
        if (this.selectedNum == this.max) return
        this.selectedNum = parseInt(this.selectedNum) + 1
        this.updateShopCar()
      } else {
        if (this.selectedNum == this.max) return
        this.selectedNum = parseInt(this.selectedNum) + 1
      }

    },
    updateShopCar() {
      var goodsinfo = {
        goods_id: this.goods.goods_id,
        selectedNum: this.selectedNum,
      };
      this.$store.commit("updateGoodsInfo", goodsinfo);
    }
  },
  props: {
    max: {
      type: Number,
    },
    initcount: {
      type: Number,
    },
    goods: {
      type: Object,
    }
  },

};
</script>

<style lang="less" scoped>
.shopDeal {
  border: 1px solid #f5f5f5;
  div {
    float: left;
    display: block;
    width: 0.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
    font-weight: bold;
    font-size: 18px;
    color: #7f7f7f;
    text-align: center;
    // background-color: #f5f5f5;
    // border-radius: 100%;
  }
  div:nth-child(2) {
    float: left;
    width: 0.8rem;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: 14px;
    text-align: center;
    border: 0;
    border-left: 1px solid #f5f5f5;
    border-right: 1px solid #f5f5f5;
    background-color: transparent;
  }
}
</style>
