<template>
  <div class="root-wrap">
    <div class="search">
      <van-popup class="popup" v-model="showPopup" position="right" :overlay="false">
        <header-main></header-main>
        <!-- 搜索框 -->
        <div class="search-inp">
          <i class="iconfont icon-sousuo"></i>
          <van-field :border="false" v-model="title" clearable class="inp" placeholder="请输入关键字" />
          <a href="javascript:;" @click.prevent="handleSearch">搜索</a>
        </div>
        <!-- 热门搜索 -->
        <div class="hot-box">
          <div class="title">热门搜索</div>
          <ul class="list">
            <li
              @click="handleHotLabelClick(item)"
              v-for="(item, index) in hotList"
              :key="index"
            >{{ item }}</li>
          </ul>
        </div>
      </van-popup>
      <div class="popup">
        <header-main path="search" @back="showPopup=true" title="搜索结果" class="searchResult"></header-main>
        <div class="list-box" v-if="questionList.length">
          <div class="ask">
            <div class="list-box">
              <ul>
                <li v-for="item in questionList" :key="item.question_id">
                  <!-- 标题部分 -->
                  <div class="title1">
                    <div class="icon">
                      <span v-show="item.extra_state === 2">顶</span>
                      <span v-show="item.extra_state === 1">精</span>
                    </div>
                    <span @click="handleQuesClick(item.question_id)" v-html="item.title"></span>
                  </div>
                  <div class="content">
                    <!-- 数据部分 -->
                    <div class="data">
                      <div class="left">
                        <img :src="item.from.avatar" alt="头像" />
                        <span>{{ item.from.nickname }}</span>
                        <span>|</span>
                        <span>{{ item.create_time.slice(5,16) }}</span>
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
          </div>
        </div>
        <div v-else style="text-align:center;margin-top:100px;">暂无数据</div>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderMain from "@/base/header/header";
import { Toast } from 'vant';
import { GET_SEARCH } from '@/api'
import { handleResponse } from '@/assets/js/common'

export default {
  data() {
    return {
      title: "",
      showPopup: true,
      questionList: [],
      hotList: ['彩铅', '水粉', '初学水彩颜料', '自学素描', '上色', '临摹', '步骤图', '零基础干货教程'],
      label: ''
    };
  },
  components: {
    HeaderMain,
  },
  methods: {
    handlePopupBack() {
      this.title = this.label = ''
      this.showPopup = false;
    },
    handleSearch() {
      if (!this.title) {
        return Toast('请输入要搜索的关键词')
      }
      this._reqSearch(this.title)
      this.$toast.loading("加载中")
      setTimeout(() => {
        this.showPopup = false
      }, 2000)


    },
    handleQuesClick(id) {
      this.$router.push(`/ask/details?id=${id}`)
    },
    handleHotLabelClick(title) {
      this._reqSearch(title)
      this.label = title
      this.$toast.loading("加载中")
      setTimeout(() => {
        this.showPopup = false
      }, 2000)

    },
    _reqSearch(title) {
      GET_SEARCH(title).then(res => {
        handleResponse(res, () => {
          this.questionList = res.data.searchList
          this.questionList.forEach(item => {
            item.title = item.title.replace(new RegExp(title, 'g'), "<span class='key_words'>" + title + "</span>");
          })
        })
      })
    }
  }
};
</script>
<style lang="less" scoped>
.root-wrap {
  background-color: #fff;
  .search {
    .search-inp {
      margin: 45px auto;
      padding: 7px 0px 7px 15px;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      width: 90%;
      height: 45px;
      line-height: 45px;
      background: #fff;
      border-radius: 6px;
      font-size: 20px;
      .inp {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        padding-left: 1rem;
        color: red;
      }
      i {
        font-size: 18px;
        color: #383839;
      }
      .van-cell {
        font-size: 16px;
        padding-left: 20px;
      }
      a {
        display: block;
        padding: 0px 10px;
        font-size: 16px;
        background-color: #fff;
        color: #383839;
      }
    }
    .hot-box {
      margin: 0 20px;
      font-size: 18px;
      margin-top: 30px;
      .list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        li {
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: rgba(90, 183, 177, 0.8);
          font-size: 14px;
          color: white;
        }
      }
    }
    .popup {
      width: 100%;
      height: 100%;
      .searchResult {
        position: fixed;
        top: 0px;
      }
      .ask {
        margin-top: 45px;
        margin-bottom: 50px;
        background-color: #f6f6f6;
        .loadmore-box {
          overflow: hidden;
          background-color: #f2f1f1;
        }
        .list-box {
          ul {
            li {
              background-color: #fff;
              margin-bottom: 10px;
              padding: 10px 20px;
              box-shadow: 0 0.6px 0.6px -1px black;
              .title1 {
                font-weight: bold;
                margin-bottom: 10px;
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
    }
  }
}
</style>
<style  scoped>
>>> .key_words {
  color: #ec4b4b;
}
</style>>

</style>
