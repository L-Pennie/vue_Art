<template>
  <div class="search_result">
    <header-main path="browse" @back="$router.push(`/browse`)" title="搜索结果" class="header"></header-main>
    <div
      class="list-box"
      v-if="search_workList.length"
      style="margin-top:42px; margin-left: 0.3rem;"
    >
      <Scroller
        :extra_height="extra_height"
        :handleToScroll="handleToScroll"
        :handleToTouchEnd="handleToTouchEnd"
        @get_maxScrollY="get_maxScrollY"
      >
        <div class="container-water-fall">
          <div class="pullDown" v-if="pullDownMsg!==''">
            <img src="@/images/load1.gif" alt />
            <span>{{pullDownMsg}}</span>
          </div>
          <waterfall
            :col="col"
            :data="search_workList"
            :width="itemWidth"
            :gutterWidth="gutterWidth"
          >
            <template>
              <div
                class="cell-item"
                v-for="(item,index) in search_workList"
                :key="index.work_id"
                @click="handleQuesClick(item.work_id)"
              >
                <img
                  v-if="item.hasOwnProperty('img_arr') && item.img_arr.length>0"
                  :src="item.img_arr[0]"
                  alt="加载错误"
                />
                <div class="item-body">
                  <div class="item-desc" v-html="item.title"></div>
                  <div class="item-footer">
                    <div
                      v-if="item.from.avatar"
                      class="avatar"
                      :style="{backgroundImage : `url(${item.from.avatar})` }"
                    ></div>
                    <div class="name_kind">
                      <div class="name">{{item.from.nickname}}</div>
                      <div class="kind">
                        <div>{{item.from.bio}}</div>
                        <div style="font-size:0.32rem;color: #999999;margin-right:5px">
                          <i class="iconfont icon-kanguo" style="font-size:0.32rem;color: #999999"></i>
                          <span>{{item.watch_num}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </waterfall>
        </div>
      </Scroller>
    </div>
    <div v-show="show" style="text-align:center;margin-top:100px;">暂无数据</div>
  </div>
</template>

<script>
import Scroller from '@/base/scroller/scroller'
import HeaderMain from "@/base/header/header";
import { GET_WORK_QUESTION } from "@/api";
import { GET_SEARCH_WORK } from '@/api'
import { Dialog } from "vant";
import { handleResponse, getLocalStorage } from "@/assets/js/common";
import config from '@/assets/js/config'
export default {

  components: {
    Scroller,
    HeaderMain,
  },
  data() {
    return {
      hidshow: true,
      value: '',
      active: 0,
      col: 2,
      workList: [],
      search_workList: [],
      showPopup: false,
      currIndex: 0,
      page: 1,
      finished: false,
      isLoading: false,
      extra_height: -1.3,
      pullDownMsg: '',
      maxScrollY: null,
      show: false
    }
  },
  created() {
    this.token = getLocalStorage("token", "string");
    this._reqSearch(this.$route.query.content)
  },
  mounted() {

  },
  computed: {
    itemWidth() {
      return (170 * (document.documentElement.clientWidth / 375))
    },
    gutterWidth() {
      return (11 * (document.documentElement.clientWidth / 375))
    }
  },
  methods: {
    handlePopupBack() {
      this.value = this.label = ''
      this.showPopup_search = false;
    },

    handleQuesClick(id) {
      this.$router.push(`/ask/details?id=${id}`)
    },

    _reqSearch(title) {
      GET_SEARCH_WORK(title).then(res => {
        handleResponse(res, () => {
          this.search_workList = res.data.searchList
          if (!this.search_workList.length) this.show = true
          this.search_workList.forEach(item => {
            item.title = item.title.replace(new RegExp(title, 'g'), "<span class='key_words'>" + title + "</span>");
          })
        })
      })
    },

    // 处理点击导航
    handleNavClick(index, title) {
      this.currIndex = index
      this.page = 1
      this._reqQuestion()
    },
    onchange(index) {
      this.list = this[`list${index + 1}`];
    },

    handleSearchClick() {
      this.$router.push(`/search`)
    },
    // 点击问题标题
    handleQuesClick(id) {
      this.$router.push(`/work/details?id=${id}`)
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
      GET_WORK_QUESTION(this.page, this.currIndex).then(res => {
        handleResponse(res, () => {
          if (!res.data.length) {
            this.workList = []
            return
          }
          // 判断是否还有数据
          if (res.data.length < config.limit) {
            this.finished = true
          }
          this.workList = res.data
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
          GET_WORK_QUESTION(this.page, this.currIndex).then(res => {
            handleResponse(res, () => {
              if (!res.data.length) {
                this.workList = []
                return
              }
              if (res.data.length >= config.limit) {
                this.finished = false
              } else {
                this.finished = true
              }
              this.workList = res.data
              this.$toast.success('刷新成功');
            })
          })
          this.pullDownMsg = ""
        }, 1000)
      } else if (pos.y < (this.maxScrollY - 60)) {
        //下拉加载
        this.page++
        this.$toast.loading('正在加载');
        GET_WORK_QUESTION(this.page, this.currIndex).then(res => {
          handleResponse(res, () => {
            setTimeout(() => {
              this.workList = this.workList.concat(res.data)
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
}
</script>

<style lang="less" scoped>
.search_result {
  margin-bottom: 1.33rem;
  width: 100%;
  height: 100%;
  .header {
    position: fixed;
    top: 0px;
  }
}

//瀑布流布局
.container-water-fall {
  margin-top: 5px;
  box-sizing: border-box;
  background-color: #fafafa;
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
          font-size: 0.33rem;
          width: 3.3rem;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          .name {
            color: black;
          }
          .kind {
            display: flex;
            justify-content: space-between;
            font-size: 0.3rem;
            color: #999;
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
</style>
<style  scoped>
>>> .key_words {
  color: #ec4b4b;
}
</style>>