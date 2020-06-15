<template>
  <div class="root-wrap">
    <div class="ask-btn">
      <a href="javascript:;" @click.prevent="handlePublishClick"></a>
    </div>
    <div class="ask-search">
      <a href="javascript:;" @click.prevent="handleSearchClick"></a>
    </div>
    <Scroller
      :extra_height="-1.3"
      :handleToScroll="handleToScroll"
      :handleToTouchEnd="handleToTouchEnd"
      @get_maxScrollY="get_maxScrollY"
    >
      <div class="ask">
        <!-- 上拉加载区域 -->
        <!-- 数据 -->
        <div class="pullDown" v-if="pullDownMsg!==''">
          <img src="@/images/load1.gif" alt />
          <span>{{pullDownMsg}}</span>
        </div>
        <div class="list-box">
          <ul>
            <li v-for="item in questionList" :key="item.question_id">
              <!-- 标题部分 -->
              <div class="title">
                <div class="icon">
                  <span v-show="item.extra_state === 2">顶</span>
                  <span v-show="item.extra_state === 1">精</span>
                </div>
                <span @click="handleQuesClick(item.question_id)">{{ item.title }}</span>
              </div>
              <div class="content">
                <!-- 数据部分 -->
                <div class="data">
                  <div class="left">
                    <img :src="item.from.avatar" alt="头像" />
                    <span>{{ item.from.nickname }}</span>
                    <span>|</span>
                    <span>{{ item.create_time.slice(2,10) }}</span>
                  </div>
                  <!-- 内容 -->
                  <div class="description">{{item.description}}</div>
                  <div class="right">
                    <span>{{ item.watch_num }}点击</span>
                    <span>·</span>
                    <span>{{ item.answer_num }}评论</span>
                  </div>
                </div>
                <!-- 图片部分 -->
                <div v-if="item.hasOwnProperty('img_arr') && item.img_arr.length>0">
                  <van-image
                    width="95px"
                    height="73px"
                    radius="8px"
                    fit="cover"
                    :src="item.img_arr[0]"
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!-- 上拉加载区域  结束-->
      </div>
    </Scroller>
  </div>
</template>
<script>
import Scroller from '@/base/scroller/scroller'
import { GET_ASK_QUESTION } from "@/api";
import { Dialog } from "vant";
import { handleResponse, getLocalStorage } from "@/assets/js/common";
import config from '@/assets/js/config'

export default {
  data() {
    return {
      showPopup: false,
      categoryList: [],
      questionList: [],
      currIndex: 0,
      page: 1,
      loading: false,
      finished: false,
      isLoading: false,
      pullDownMsg: '',
      maxScrollY: null,

    };
  },
  created() {
    this.token = getLocalStorage("token", "string");
    this._reqQuestion()
  },
  mounted() {
  },
  components: {
    Scroller
  },
  computed: {

  },
  methods: {
    handleSearchClick() {
      this.$router.push(`/search`)
    },
    // 点击问题标题
    handleQuesClick(id) {
      this.$router.push(`/ask/details?id=${id}`)
    },
    // 处理发表问题
    handlePublishClick() {
      if (this.token) {
        this.$router.push("/ask/publish");
      } else {
        Dialog.confirm({
          title: "温馨提示",
          message: "登录后才能发表问题哦",
          confirmButtonText: "去登陆"
        })
          .then(() => {
            this.$router.push("/login");
          })
          .catch(() => {
            console.log("已关闭");
          });
      }
    },
    _reqQuestion() {
      GET_ASK_QUESTION(this.page, this.currIndex).then(res => {
        handleResponse(res, () => {
          if (!res.data.length) {
            this.questionList = []
            return
          }
          // 判断是否还有数据
          if (res.data.length < config.limit) {
            this.finished = true
          }
          this.questionList = res.data
        })
      })
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
          GET_ASK_QUESTION(this.page, this.currIndex).then(res => {
            handleResponse(res, () => {
              if (!res.data.length) {
                this.questionList = []
                return
              }
              if (res.data.length >= config.limit) {
                this.finished = false
              } else {
                this.finished = true
              }
              this.questionList = res.data
              this.$toast.success('刷新成功');
            })
          })
          this.pullDownMsg = ""
        }, 1000)
      } else if (pos.y < (this.maxScrollY - 60)) {
        //下拉加载
        this.page++
        this.$toast.loading('正在加载');
        GET_ASK_QUESTION(this.page, this.currIndex).then(res => {
          handleResponse(res, () => {
            setTimeout(() => {
              this.questionList = this.questionList.concat(res.data)
              this.$toast.success('加载成功');
              if (res.data.length < config.limit) {
                this.finished = true
              }
            }, 1000)
          })
        })
      }
    }
  }
};
</script>
<style lang="less" scoped>
.root-wrap {
  position: relative;
}
.ask-btn {
  position: fixed;
  bottom: 55px;
  right: 10px;
  z-index: 111;
  display: flex;
  align-items: center;
  a {
    background: url("~@/images/ask.png") center center no-repeat;
    background-size: 40px 40px;
    display: block;
    width: 50px;
    height: 50px;
    text-align: center;
  }
}
.ask-search {
  position: fixed;
  bottom: 105px;
  right: 10px;
  z-index: 111;
  display: flex;
  align-items: center;
  a {
    background: url("~@/images/search.png") center center no-repeat;
    background-size: 40px 40px;
    display: block;
    width: 50px;
    height: 50px;
    text-align: center;
  }
}
.ask {
  background-color: #f6f6f6;
  .loadmore-box {
    overflow: hidden;
    background-color: #f2f1f1;
  }
  .pullDown {
    padding: 15px 20px;
    color: #ababab;
    text-align: center;
    background-color: #f7f8fa;
    img {
      width: 25px;
      height: 25px;
    }
    span {
      position: relative;
      top: -5px;
    }
  }
  .list-box {
    ul {
      li {
        background-color: white;
        margin-bottom: 10px;
        padding: 10px 20px;
        box-shadow: 0 0.6px 0.6px -1px black;
        .title {
          font-weight: bold;
          margin-bottom: 10px;
          .icon {
            margin-right: 0.8rem;
            flex-shrink: 0;
            span {
              font-size: 0.8rem;
              padding: 1px 2px;
            }
            span:first-child {
              color: #ff8d64;
              border: 1px solid #ff8d64;
            }
            span:last-child {
              color: #4ac49d;
              border: 1px solid #4ac49d;
            }
          }
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            font-size: 18px;
            font-weight: 900;
            color: #1a1a1a;
          }
        }
        .content {
          display: flex;
          justify-content: space-between;
          .data {
            font-size: 16px;
            color: #646464;
            .left {
              display: flex;
              align-items: center;
              img {
                width: 25px;
                height: 25px;
                border-radius: 100%;
              }
              span {
                font-weight: 700;
                margin-left: 6px;
              }
            }
            .right {
              display: flex;
              align-items: center;
              color: #999999;
              font-size: 14px;
              font-weight: 400;

              .reply {
                position: relative;
                top: -1px;
              }
            }
            .description {
              margin: 2px auto;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              font-weight: 400;
              font-size: 15px;
              line-height: 23px;
              color: #444444;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.van-dialog__header {
  color: red;
}
</style>
