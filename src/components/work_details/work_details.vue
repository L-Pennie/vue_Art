<template>
  <div class="details">
    <!-- 弹出框 -->
    <div class="dialog">
      <van-dialog
        v-model="showAnswerDialog"
        show-cancel-button
        closeOnClickOverlay
        @cancel="handleAnswerAndReplyCancel"
        @confirm="handleAnswerAndReplyConfirm"
      >
        <div class="iconfont icon-xie"></div>
        <van-field type="textarea" rows="2" v-model="content" placeholder="请输入..." />
      </van-dialog>
    </div>
    <!-- 修改问题Popup弹出层 -->
    <div class="modify_ques">
      <van-popup class="popup" v-model="showPopup" position="right" :overlay="false">
        <div class="publish" v-if="type === 'question'">
          <header-main>
            <a
              href="javascript;;"
              slot="right"
              class="submit-btn_modify"
              @click.prevent="handleSubmitModify"
            >修改</a>
          </header-main>
          <div class="choose_menu">
            <van-cell-group class="menu">
              <van-field clearable v-model="popTitle" :border="false" placeholder="请输入作品标题" />
            </van-cell-group>
          </div>
          <vue-html5-editor :content="popContent" auto-height @change="updateData"></vue-html5-editor>
          <div class="publish_img">
            <van-uploader v-model="fileList" multiple :max-count="9" preview-size="101px" />
          </div>
        </div>
        <div v-else>
          <van-field
            :placeholder="popupLable"
            clearable
            type="textarea"
            v-model="popContent"
            rows="3"
            :border="false"
            autosize
          />
           <a href="javascript:;" @click="handleSubmitModify" class="submit-btn">提交修改</a>
        </div>
      </van-popup>
    </div>
    <!-- 评论区Popup弹出层 -->
    <div class="comment">
      <van-popup v-model="showComment" position="bottom" closeable :style="{ height: '70%' }">
        <!-- 评论区 -->
        <div v-if="normalAnser.length>0">
          <h2>最新评论</h2>
          <!-- 最佳答案部分 -->
          <div v-if="bestAnswer.state" class="best-answer">
            <div class="infor">
              <img :src="bestAnswer.from[0].avatar" alt />
              <div class="info_content">
                <span>
                  {{ bestAnswer.from[0].nickname }}
                  <i class="iconfont icon-zhiding1"></i>
                </span>
                <span>{{ bestAnswer.content }}</span>
                <span>{{ bestAnswer.answer_time }}</span>
              </div>
            </div>
          </div>
          <div class="border"></div>
          <!-- 其它答案部分 -->
          <div class="other-answer" v-for="(item, index) in normalAnser" :key="index">
            <div class="infor">
              <img :src="item.from[0].avatar" alt />
              <div class="info_content">
                <span>
                  {{ item.from[0].nickname }}
                  <!-- 置顶/修改+回复 -->
                  <div @click="comment_set(index)" class="more">
                    <i class="iconfont icon-more"></i>

                    <div v-if="show_modify_adopt &&current_reply === index">
                      <div class="top"></div>
                      <div
                        v-if="details.nowUserId === item.user_id"
                        @click="handleModifyAnswer('answer', item.answer_id, item.content, index)"
                      >
                        <i class="iconfont icon-xiugai1"></i>
                        <span>修改</span>
                      </div>
                      <div
                        v-if="details.nowUserId === details.user_id && !bestAnswer.state"
                        @click="handleAdoptClick(index, item)"
                      >
                        <i class="iconfont icon-zhiding"></i>
                        <span>置顶</span>
                      </div>
                      <div @click="handleReplyClick(item.answer_id)">
                        <i class="iconfont icon-pinglun3"></i>
                        <span>回复</span>
                      </div>
                    </div>
                  </div>
                  <!-- 置顶/修改+回复 -->
                </span>
                <span>{{ item.content }}</span>
                <span>{{ item.answer_time.slice(5,10) }}</span>
              </div>
            </div>
            <div v-if="item.replys.length">
              <div class="reply" v-for="(reply, index) in item.replys" :key="index">
                <img :src="reply.avatar" alt />
                <div class="reply_content">
                  <span>{{ reply.nickname }}</span>
                  <span>{{reply.reply_content}}</span>
                  <span>{{ reply.reply_time}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no_comment">暂无评论</div>
      </van-popup>
    </div>
    <!-- 问题部分 -->
    <header-main  path="browse" @back="$router.push(`/browse`)" :isShare="true"></header-main>
    <div class="ques-data">
      <span>{{ details.title }}</span>
      <!-- 轮播图 -->
      <div v-if="images.length>0" class="swiper">
        <van-swipe @change="onChange" :initial-swipe="current" touchable>
          <van-swipe-item
            v-for="(item,index) in details.img_arr"
            :key="index"
            @click=" show = !show"
          >
            <van-image width="9.06rem" height="7rem" fit="cover" :src="item.url" />
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">{{ current + 1 }}/{{imgArr_length}}</div>
          </template>
        </van-swipe>
        <!-- 图片预览 -->
        <van-image-preview
          v-model="show"
          :images="images"
          :startPosition="current"
          @change="onChange"
          :closeable="true"
          maxZoom="5"
        >
          <template v-slot:current>第{{ index }}页</template>
        </van-image-preview>
      </div>
      <div class="bor"></div>
      <div class="data">
        <div class="left">
          <img :src="details.from.avatar" />
          <div class="msg">
            <span>{{ details.from.nickname }}</span>
            <span>{{ details.create_time }}</span>
          </div>
        </div>
      </div>
      <div v-html="details.description"></div>
    </div>
    <!-- 底部导航 -->
    <div class="footer">
      <div class="submit-btn1">
        <a
          v-if="details.nowUserId === details.user_id"
          href="javascript:;"
          @click.prevent="handleModifyQues('question', details.title, details.description)"
        >修改</a>
        <a v-else href="javascript:;" @click.prevent="handleAnswerClick">留言</a>
        <i class="iconfont icon-23"></i>
      </div>
      <div class="right_btn">
        <div class="_icon" @click="star=!star">
          <i v-if="star" class="iconfont icon-collection-b"></i>
          <i v-else class="iconfont icon-collection"></i>
          <span>收藏</span>
        </div>
        <div class="_icon" @click="showComment=!showComment">
          <i class="iconfont icon-pinglun"></i>
          <span>评论</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderMain from "@/base/header/header";
import { Toast, Dialog } from "vant";
import { handleResponse } from "@/assets/js/common";
import {
  GET_WORK_DETAIL,
  POST_WORK_ANSWER,
  POST_WORK_MODIFYQUES,
  POST_WORK_MODIFYANSWER,
  GET_WORK_ADOPT,
  POST_WORK_REPLY,
  POST_WORK_WATCHNUM
} from "@/api";

export default {
  data() {
    return {
      fileList: [],
      showAnswerDialog: false,
      showPopup: false,
      content: "",
      current: 0,
      details: {
        from: {},
      },
      bestAnswer: {},
      normalAnser: [],
      type: "",
      popTitle: "",
      popContent: "",
      //图片预览
      imgArr_length: 0,
      show: false,
      images: [],
      star: false,
      showComment: false,
      show_modify_adopt: false,
      current_reply: 0,
    };
  },
  components: {
    HeaderMain,
  },
  created() {
    this.work_id = this.$route.query.id;
    this._reqDetail();
    this._reqWatchNum();
  },
  mounted() {
  },
  computed: {
    popupLable() {
      if (this.type === "answer") {
        return "写回答...";
      }
      if (this.type === "question") {
        return "对问题补充说明";
      }
    }
  },
  methods: {
    updateData(e = '') {
      this.popContent = e;
    },
    comment_set(index) {
      this.show_modify_adopt = !this.show_modify_adopt
      this.current_reply = index

    },
    onChange(index) {
      this.current = index
    },
    _getImg_arr() {
      if (this.details.img_arr != null) {
        this.fileList = this.details.img_arr
      }
    },
    _checkToken() {
      let token = localStorage.getItem("token");
      if (!token) {
        Dialog.confirm({
          title: "温馨提示",
          message: "登录后才能回答问题哦",
          confirmButtonText: "去登陆"
        })
          .then(() => {
            this.$router.push("/login");
          })
          .catch(() => {
            console.log("已关闭");
          });
        return false
      }
      return true
    },
    handleAnswerAndReplyCancel() {
      this.content = ''
    },
    handleSubmitModify() {
      if (this.type === "question") {
        this._reqModifyQues();
      }
      if (this.type === "answer") {
        if (!this.popContent) return Toast("请输入答案");
        this._reqModifyAnswer();
      }
      this._reqDetail()
      this.show_modify_adopt = false
    },
    handleAdoptClick(index, item) {
      this.show_modify_adopt = false
      Dialog.confirm({
        title: "温馨提示",
        message: "确认将该答案置顶吗？"
      })
        .then(() => {
          this.answer_id = item.answer_id;
          this.index = index;
          this.item = item;
          this._reqAdopy();
        })
        .catch(() => {
          Toast("已取消");
        });
    },
    handlePopupBack() {
      this.showPopup = false;
    },
    // 修改问题和答案
    handleModifyQues(type, title, description) {
      this.type = type;
      this.popTitle = title;
      this.popContent = description;
      this.showPopup = true;
      this._getImg_arr();
    },
    // 修改答案
    handleModifyAnswer(type, answer_id, content, index) {
      this.type = type;
      this.answer_id = answer_id;
      this.popContent = content;
      this.itemIndex = index;
      this.showPopup = true;
    },
    // 我来回答 按钮
    handleAnswerClick() {
      let flag = this._checkToken()
      if (!flag) {
        return
      }
      this.showAnswerDialog = true;
      this.isReply = false
    },
    handleAnswerAndReplyConfirm() {
      this.show_modify_adopt = false
      if (!this.content) {
        this.showAnswerDialog = true;
        return Toast("请输入内容");
      }
      if (this.isReply) {
        this._reqReply();
      } else {
        this._reqAnswer();
      }
    },
    // 回复问题
    handleReplyClick(id) {
      this.show_modify_adopt = false
      let flag = this._checkToken()
      if (!flag) {
        return
      }
      this.answer_id = id;
      this.showAnswerDialog = true;
      this.isReply = true;
    },
    _reqDetail() {
      GET_WORK_DETAIL(this.work_id).then(res => {
        handleResponse(res, () => {
          this.details = res.data;
          this.normalAnser = [];
          if (res.data.answer.length) {
            res.data.answer.forEach(item => {
              if (item.state === 1) {
                this.bestAnswer = item;
              }
              if (item.state === 0) {
                this.normalAnser.unshift(item);
              }
              item.replys.forEach(item => {
                item.reply_time = item.reply_time.slice(5, 10)
              })
            });
          }
          this.images = this.details.img_arr.map(item => {
            return item.url
          })
          this.imgArr_length = this.images.length
        });
      });
    },
    _reqAnswer() {
      POST_WORK_ANSWER(this.work_id, this.content).then(res => {
        handleResponse(res, () => {
          this._reqDetail();
          Toast.success("回答成功");
          this.content = "";
        });
      });
    },

    _reqModifyQues() {
      var img_arr = []
      if (typeof (this.fileList) != "undefined") {
        this.fileList.forEach(function (item) {
          if (item.url) {
            img_arr.push(item.url)
          } else {
            img_arr.push(item.content)
          }
        })
      }
      var folder = "test"

      POST_WORK_MODIFYQUES(
        this.work_id,
        this.popTitle,
        this.popContent,
        JSON.stringify(img_arr),
        folder
      ).then(res => {
        handleResponse(res, () => {
          this._reqDetail()
          this.showPopup = false;
          Toast.success("修改成功");
        });
      });
    },
    _reqModifyAnswer() {
      POST_WORK_MODIFYANSWER(this.answer_id, this.popContent).then(res => {
        handleResponse(res, () => {
          this.normalAnser[this.itemIndex].content = this.popContent;
          this.showPopup = false;
          Toast.success("修改成功");
        });
      });
    },
    _reqAdopy() {
      GET_WORK_ADOPT(this.answer_id, this.work_id).then(res => {
        handleResponse(res, () => {
          this._reqDetail();
          Toast.success("修改成功");
        });
      });
    },
    _reqReply() {
      POST_WORK_REPLY(this.answer_id, this.content).then(res => {
        handleResponse(res, () => {
          this._reqDetail();
          Toast.success("回复成功");
          this.content = "";
        });
      });
    },
    // 查看数量 +1 接口
    _reqWatchNum() {
      POST_WORK_WATCHNUM(this.work_id);
    }
  }
};
</script>
<style lang="less" scoped>
.details {
  overflow: hidden;
  font-size: 0.45rem;
  background-color: #ffffff;
  margin-bottom: 59px;

  .dialog {
    div {
      font-size: 45px;
      text-align: center;
      padding: 5px;
    }
    .van-field {
      font-size: 18px;
    }
  }
  .submit-btn {
    display: block;
    width: 80%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    margin: 30px auto;
    border-radius: 15px;
    color: white;
    font-size: 18px;
    background: linear-gradient(to bottom, #90cdce, #5ab4b5);
  }
  .modify_ques {
    .popup {
      width: 100%;
      height: 100%;
      .publish {
        margin-bottom: 50px;
        .choose_menu {
          padding: 15px 10px 1px;
          background-color: #f9f9f9;
          .menu {
            margin-top: 45px;
          }
        }
        .submit-btn_modify {
          display: block;
          width: 60px;
          text-align: center;
          margin: 5px;
          border-radius: 15px;
          color: white;
          font-size: 16px;
          background: linear-gradient(to bottom, #90cdce, #5ab4b5);
        }
        .van-cell {
          font-size: 18px;
        }
        .van-cell-group {
          margin-bottom: 20px;
        }
        .publish_img {
          margin-top: 10px;
          margin-left: 0.7rem;
          .van-image {
            width: 2.69rem;
            height: 2.69rem;
          }
        }
      }
    }
  }
  .adopt_modify {
    display: flex;
    justify-content: center;
    background-color: #63a1a3;
    div {
      display: flex;
      flex-direction: column;
      i {
        font-size: 20px;
      }
    }
  }
  .comment {
    h2 {
      padding: 0px 17px;
    }
    .best-answer {
      padding: 0px 17px;
      margin-bottom: 10px;
      border-bottom: 1px solid #eceaea;
      background-color: #f7f5f5;
      .infor {
        padding: 10px 0px;
        img {
          float: left;
          width: 30px;
          height: 30px;
          border-radius: 100%;
        }
      }
      span:nth-child(1) {
        font-size: 16px;
        font-weight: 700;
        i {
          font-size: 18px;
          color: #f62d2d;
        }
      }
      span:nth-child(2) {
        margin-top: 5px;
        font-size: 14px;
        line-height: 26px;
        color: #3d3d3d;
      }
      span:nth-child(3) {
        font-size: 14px;
        color: #9d9d9d;
        margin-top: 10px;
      }
      .info_content {
        margin-left: 40px;
        display: flex;
        flex-direction: column;
      }
    }
    .other-answer {
      padding: 0px 17px;
      margin-top: 7px;
      border-bottom: 1px solid #eceaea;
      .infor {
        padding: 10px 0px;
        span:nth-child(1) {
          font-size: 16px;
          font-weight: 700;
          .more {
            position: absolute;
            right: 17px;
            margin-top: -20px;
            text-align: right;
            overflow: hidden;
            font-weight: 400;
            background-color: #fff;
            .top {
              width: 0px;
              height: 0px;
              border-width: 0 10px 10px;
              border-style: solid;
              border-color: transparent transparent rgba(90, 183, 177, 0.2);
              margin-top: -12px;
              float: right;
            }
            > div {
              margin-top: 10px;
              padding: 2px 5px;
              border-radius: 5px;
              background-color: rgba(90, 183, 177, 0.2);
              i {
                font-size: 18px;
                margin-right: 5px;
              }
            }
          }
        }
        span:nth-child(2) {
          margin-top: 5px;
          font-size: 14px;
          line-height: 26px;
          color: #3d3d3d;
        }
        span:nth-child(3) {
          font-size: 14px;
          color: #9d9d9d;
          margin-top: 10px;
        }
        img {
          float: left;
          width: 30px;
          height: 30px;
          border-radius: 100%;
        }
        .info_content {
          margin-left: 40px;
          display: flex;
          flex-direction: column;
        }

      }
      .reply {
        margin-left: 40px;
        font-size: 12px;
        padding: 10px 0px;
        span:nth-child(1) {
          margin-left: 7px;
          font-size: 15px;
          font-weight: 700;
        }
        span:nth-child(2) {
          margin-top: 5px;
          font-size: 14px;
          line-height: 23px;
          color: #3d3d3d;
        }
        span:nth-child(3) {
          font-size: 13px;
          color: #9d9d9d;
          margin-top: 7px;
        }
        img {
          float: left;
          margin-top: 15px;
          width: 25px;
          height: 25px;
          border-radius: 100%;
        }
        .reply_content {
          padding-top: 15px;
          border-top: 1px solid #eceaea;
          display: flex;
          flex-direction: column;
        }
      }
    }
    .no_comment {
      text-align: center;
      margin-top: 50%;
      width: 100%;
      font-size: 24px;
      color: #969696;
    }
  }

  .ques-data {
    margin-top: 45px;
    padding: 0px 17px;
    > span {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
    .swiper {
      margin-bottom: 10px;
      width: 100%;
      .custom-indicator {
        text-align: center;
        padding: 2px 5px;
        font-size: 16px;
      }
    }
    .bor {
      margin-left: -300px;
      height: 8px;
      width: 2222px;
      background-color: #f6f6f6;
    }
    .data {
      font-size: 0.8rem;
      margin-top: 10px;
      .left {
        display: flex;
        img {
          width: 42px;
          height: 42px;
          border-radius: 100%;
          margin-right: 15px;
        }
        .msg {
          display: flex;
          flex-direction: column;
          span:nth-child(1) {
            margin-bottom: 3px;
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
          }
          span:nth-child(2) {
            font-size: 14px;
            color: #646464;
          }
        }
      }
    }
    p {
      line-height: 30px;
      font-size: 17px;
    }
    .border {
      margin-bottom: 0.8rem;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    z-index: 222;
    background-color: #fff;
    height: 50px;
    width: 100%;
    border-top: 0.1px solid #f4f3f3;
    .submit-btn1 {
      float: left;
      margin: 7.5px 10px;
      width: 35%;
      height: 35px;
      line-height: 35px;
      text-align: center;
      border-radius: 30px;
      letter-spacing: 3px;
      background-color: rgba(90, 183, 177, 0.2);
      a {
        font-size: 16px;
        color: #58bbbd;
      }
      i {
        color: #696868;
        font-size: 18px;
      }
    }
    .right_btn {
      float: right;
      display: flex;
      justify-content: flex-end;
      width: 30%;
      color: #969696;
      font-weight: 600;
      margin-right: 10px;
      height: 40px;
      padding: 5px 0px;
      ._icon {
        display: flex;
        flex-direction: column;
        padding: 2px 5px;
        margin-left: 12px;
        span {
          font-size: 10px;
        }
        i {
          font-size: 22px;
        }
        .icon-collection-b {
          color: red;
        }
      }
    }
  }
}
</style>



