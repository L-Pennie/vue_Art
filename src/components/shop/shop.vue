<template>
  <div class="root">
    <div class="front">
      <!-- 搜索框 -->
      <div class="search">
        <van-search
          v-model="title"
          show-action
          shape="round"
          background="#fff"
          placeholder="请输入搜索关键词"
          @search="onSearch"
        >
          <template #action>
            <div @click="onSearch" class="more">
              <i class="iconfont icon-gengduo1"></i>
              <span>分类</span>
            </div>
          </template>
        </van-search>
      </div>
      <!-- 轮播图 -->
      <van-swipe class="my-swipe1" :autoplay="3000" indicator-color="white" lazy-render>
        <van-swipe-item v-for="(item,index) in lunboList" :key="index">
          <img :src="item" />
        </van-swipe-item>
      </van-swipe>
      <!-- 菜单 -->
      <ul class="menu">
        <li v-for="(item,index) in menuList " :key="index">
          <div>
            <img :src="item.icon" />
            <span>{{item.name}}</span>
          </div>
        </li>
      </ul>
      <!-- 轮播图 -->
      <van-swipe class="my-swipe2" :autoplay="3000" indicator-color="white" lazy-render>
        <van-swipe-item>
          <img src="../../images/lbt.jpg" />
        </van-swipe-item>
      </van-swipe>
      <!-- 畅销榜 -->
      <div class="hot">
        <div class="top">
          <div class="text">
            <span>畅销榜</span>
            <span>所有人，买它</span>
          </div>
          <img
            src="https://img.alicdn.com/bao/uploaded/i3/2945715915/O1CN01jzcYdP1tZ7KiLLQhA_!!2945715915.jpg"
          />
          <div class="text">
            <span>每日上新</span>
            <span>新鲜更有趣</span>
          </div>
          <img
            src="https://img.alicdn.com/bao/uploaded/i4/3296834656/O1CN01OoWxNn1kGUdOAGPml_!!3296834656.jpg"
          />
        </div>
        <div class="bottom">
          <div class="time">
            <span>限时秒杀</span>
            <van-count-down :time="time">
              <template v-slot="timeData">
                <span class="block">{{ timeData.hours }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.minutes }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.seconds }}</span>
              </template>
            </van-count-down>
            <span>
              更多商品
              <i class="iconfont icon-gengduo"></i>
            </span>
          </div>
          <div class="goods">
            <div v-for="(item,index) in seckillList" :key="index">
              <img :src="item.img" />
              <span class="price">￥{{item.sell_price}}</span>
              <span>￥{{item.market_price}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 分类 -->
    </div>
    <div class="waterfall">
      <div class="classify" id="bar">
        <ul :class="BarFixed == true ? 'isFixed' :''">
          <li
            class="bar"
            v-for="(item,index) in sellList"
            :key="index"
            @click="gopage(index,item.cate_id)"
          >
            <span :class="{ active: current === index }">{{item.title}}</span>
            <span v-if="!BarFixed" :class="{ active: current === index }">{{item.desc}}</span>
          </li>
        </ul>
      </div>
      <div class="container-water-fall">
        <waterfall :col="col" :data="goodslist" :width="itemWidth" :gutterWidth="gutterWidth">
          <template>
            <div
              class="cell-item"
              v-for="(item,index) in goodslist"
              :key="index"
              @click="goDetail(item.goods_id)"
            >
              <img
                v-if="item.hasOwnProperty('img_show') && item.img_show.length>0"
                :src="item.goods_info.picture"
                alt="加载错误"
              />
              <div class="item-body">
                <div class="item-desc">{{item.goods_info.title}}</div>
                <div class="item-footer"></div>
              </div>
            </div>
          </template>
        </waterfall>
      </div>
    </div>
    <!-- 购物车按钮 -->
    <div class="ask-btn">
      <span v-if="$store.getters.getAllCount">
        <van-tag round type="danger">{{ $store.getters.getAllCount}}</van-tag>
      </span>
      <a href="javascript:;" @click.prevent="handleClick"></a>
    </div>
  </div>
</template>

<script>
import { GET_GOODS_LIST } from "@/api";
import config from '@/assets/js/config'
import numbox from '@/base/goods_numberBox/goods_numberBox'
import { handleResponse, getLocalStorage } from "@/assets/js/common";
import { menu1, lunbotu, seckill, sell } from "@/assets/js/data";
export default {
  data() {
    return {
      menuList: menu1,
      lunboList: lunbotu,
      seckillList: seckill,
      sellList: sell,
      goodslist: [],
      currIndex: 0,
      page: 1,
      title: "",
      time: 240 * 60 * 60 * 1000,
      current: 0,
      col: 2,
      BarFixed: false,
    };
  },
  created() {
    this.getGoodsList();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    itemWidth() {
      return (170 * (document.documentElement.clientWidth / 375))
    },
    gutterWidth() {
      return (11 * (document.documentElement.clientWidth / 375))
    }
  },
  components: {
    numbox,
  },
  methods: {
    handleScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      var offsetTop = document.querySelector('#bar').offsetTop
      if (scrollTop > offsetTop) {
        this.BarFixed = true
      } else {
        this.BarFixed = false
      }
    },
    get_maxScrollY(maxScrollY) {
      this.maxScrollY = maxScrollY
    },
    handleToScroll(pos) {
      // 滑动过程中事件
      if (pos.y > 60) {
        this.pullDownMsg = "正在加载..."
      }
    },
    handleToTouchEnd(pos) {
      if (pos.y > 60) {
        // 上拉刷新
        setTimeout(() => {
          this.page = 1
          GET_GOODS_LIST(this.page, this.currIndex).then(res => {
            handleResponse(res, () => {
              if (!res.data.length) {
                this.goodslist = []
                return
              }
              if (res.data.length >= config.limit) {
                this.finished = false
              } else {
                this.finished = true
              }
              this.goodslist = res.data
              this.$toast.success('刷新成功');
            })
          })
          this.pullDownMsg = ""
        }, 1000)
      } else if (pos.y < (this.maxScrollY - 60)) {
        //下拉加载
        this.page++
        this.$toast.loading('正在加载');
        GET_GOODS_LIST(this.page, this.currIndex).then(res => {
          handleResponse(res, () => {
            setTimeout(() => {
              this.goodslist = this.goodslist.concat(res.data)
              this.$toast.success('加载成功');
              if (res.data.length < config.limit) {
                this.finished = true
              }
            }, 1000)
          })
        })
      }
    },
    onSearch() {

    },
    gopage(index, cate_id) {
      this.page = 1;
      this.current = index
      this.currIndex = cate_id
      this.getGoodsList()
    },
    goDetail(goods_id) {
      this.$router.push(`/goods_detail?goods_id=${goods_id}`);
    },
    getGoodsList() {
      GET_GOODS_LIST(this.page, this.currIndex).then(res => {
        handleResponse(res, () => {
          if (!res.data.length) {
            this.goodslist = []
            return
          }
          // 判断是否还有数据
          if (res.data.length < config.limit) {
            this.finished = true
          }
          this.goodslist = res.data
        })
      })
    },
    handleClick() {
      this.$router.push(`/shop_cart`)
    }
  }
}
</script>
<style lang="less">
.root {
  margin-bottom: 50px;
  .front {
    padding: 16px;
    background-color: #fafafa;
    .menu {
      margin: 0px 15px 20px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      div {
        display: flex;
        flex-direction: column;
        margin: 10px 0px;
        border-radius: 100%;
        text-align: center;
        width: 55px;
        height: 55px;
        img {
          display: block;
          padding: 10px;
          width: 35px;
          height: 35px;
        }
        span {
          font-size: 12px;
          color: #7f7f7f;
        }
      }
    }
    .hot {
      margin-top: 15px;
      width: 100%;
      .top {
        display: flex;
        justify-content: space-around;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom: 1px solid #f3f3f3;
        background-color: #fff;
        padding: 10px 0px 5px;
        .text {
          display: flex;
          flex-direction: column;
          margin-top: 5px;
          span:first-child {
            font-size: 14px;
            margin-bottom: 5px;
          }
          span:last-child {
            font-size: 12px;
            color: #999999;
          }
        }
        img {
          width: 60px;
          height: 60px;
        }
      }
      .bottom {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        background-color: #fff;
        .time {
          padding: 10px;
          font-size: 14px;
          line-height: 22px;
          span:first-child {
            float: left;
          }
          span:last-child {
            float: right;
            color: #999999;
          }
          .van-count-down {
            float: left;
            margin-left: 8px;
            .colon {
              float: left;
              margin: 0 4px;
              color: #ff5467;
            }
            .block {
              float: left;
              width: 18px;
              color: #fff;
              font-size: 12px;
              text-align: center;
              background-color: #ff5467;
            }
          }
        }
        .goods {
          display: flex;
          justify-content: space-around;
          div {
            margin-bottom: 10px;
            img {
              display: block;
              width: 80px;
              height: 90px;
              border-radius: 5px;
            }
            .price {
              font-size: 14px;
              color: #f4596b;
            }
            span:last-child {
              margin-left: 5px;
              font-size: 12px;
              text-decoration: line-through;
              color: #999;
            }
          }
        }
      }
    }

    .my-swipe1 .van-swipe-item {
      height: 2.5rem;
      width: 100%;
      border-radius: 8px;
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;
      background-color: #39a9ed;
      img {
        height: 2.5rem;
        width: 100%;
        border-radius: 8px;
      }
    }
    .my-swipe2 .van-swipe-item {
      height: 2.2rem;
      width: 100%;
      border-radius: 8px;
      color: #fff;
      font-size: 20px;
      line-height: 150px;
      text-align: center;
      background-color: #39a9ed;
      img {
        height: 2.2rem;
        width: 100%;
        border-radius: 8px;
      }
    }
    .more {
      display: flex;
      flex-direction: column;
      text-align: center;
      line-height: 17px;
      color: #666666;
      i {
        padding-top: 5px;
        font-size: 18px;
      }
    }

    .goods {
      margin-top: 30px;
      li {
        margin-top: 15px;
        font-size: 18px;
        background-color: pink;
      }
    }
  }
  .waterfall {
    background-color: #fff;
    .classify {
      .isFixed {
        position: fixed;
        top: 0;
        padding: 12px 0px;
        z-index: 999;
        background-color: #fff;
      }
      ul {
        padding: 5px 0px;
        text-align: center;
        width: 100%;
        .bar {
          float: left;
          display: flex;
          flex-direction: column;
          width: 33%;
          span:last-child {
            color: #a7a7a7;
            font-size: 10px;
          }
          span:first-child {
            color: #242424;
            font-size: 16px;
            margin-bottom: 2px;
          }
          .active {
            color: #fe586c !important;
          }
        }
        li:nth-child(2) {
          border-left: 1px solid #e8e8e8;
          border-right: 1px solid #e8e8e8;
        }
      }
    }
    .container-water-fall {
      margin-top: 45px;
      margin-left: 0.3rem;
      box-sizing: border-box;
      .pullDown {
        padding: 15px 20px;
        color: #ababab;
        text-align: center;
        font-size: 18px;
        img {
          width: 25px;
          height: 25px;
        }
        span {
          position: relative;
          top: -5px;
        }
      }
      h4 {
        padding-top: 56px;
        padding-bottom: 28px;
        font-family: PingFangSC-Medium;
        font-size: 36px;
        color: #000000;
        letter-spacing: 1px;
        text-align: justify;
      }
      button {
        background-color: #ff0;
        color: #24292e;
        border: 1px solid rgba(27, 31, 35, 0.2);
        border-radius: 0.25rem;
        width: 100px;
        line-height: 26px;
        font-size: 13px;
        margin: 4px 0;
        margin-right: 4px;
        cursor: pointer;
        outline: none;
        &.blue-light {
          background: #27fbc2;
        }
      }

      button:hover {
        background-image: linear-gradient(-180deg, #fafbfc, #ccc 90%);
      }

      .cell-item {
        padding-bottom: 4px;
        margin-bottom: 8px;
        overflow: hidden;
        box-sizing: border-box;
        width: 100%;
        background: #fff;

        img {
          display: block;
          width: 100%;
          height: auto;
        }

        .item-body {
          //padding: 12px;
          .item-desc {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            padding: 10px 10px 0px 10px;
            margin-bottom: 10px;
            font-family: SimHei;
            font-size: 0.346rem;
            color: #333333;
            line-height: 20px;
            font-weight: 400;
          }

          .item-footer {
            position: relative;
            width: 100%;
            .avatar {
              float: left;
              border-radius: 50%;
              margin-left: 10px;
              width: 0.78rem;
              height: 0.78rem;
              background-repeat: no-repeat;
              background-size: contain;
            }
            .name_kind {
              float: left;
              margin-left: 0.133rem;
              font-size: 0.3rem;
              width: 3.3rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              .name {
                color: #999999;
              }
              .kind {
                color: black;
              }
            }
            .right {
              display: inline;
              margin-left: 1.56rem;
              color: #999999;
              i {
                font-size: 0.4rem;
                .iconfont icon-chakan {
                  padding-top: 3px;
                }
              }
              span {
                align-items: center;
                margin-left: 0.16rem;
                font-size: 0.28rem;
              }
            }
          }
        }
      }
    }
  }
  .ask-btn {
    position: fixed;
    bottom: 55px;
    right: 10px;
    z-index: 111;
    display: flex;
    align-items: center;
    span {
      position: absolute;
      top: 2px;
      right: 0;
    }
    a {
      background: url("~@/images/car.png") center center no-repeat;
      background-size: 40px 40px;
      display: block;
      width: 50px;
      height: 50px;
      text-align: center;
    }
  }
}
</style>