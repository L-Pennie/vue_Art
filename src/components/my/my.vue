<template>
  <div class="root-wrap">
    <div class="my">
        <!-- 身份卡 -->
        <div class="card-box">
          <div class="top">
            <img :src="myIndexData.avatar == '' ? myIndexData.avatar='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589983940221&di=25b5fec7084996a2593f9a131ee7a24c&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2Fc5440470619c6048395d6ebeff4212025414266a29a0-dIo4KG_fw658': myIndexData.avatar" />
            <div class="name">
              <span>{{myIndexData.nickname}}</span>
              <span>简介：{{myIndexData.bio == '' ? myIndexData.bio='暂无简介': myIndexData.bio }}</span>
            </div>
          </div>
          <div class="bottom">
            <div>
              <span>0</span>
              <span>关注</span>
            </div>
            <div>
              <span>0</span>
              <span>粉丝</span>
            </div>
            <div>
              <span>0</span>
              <span>点赞</span>
            </div>
          </div>
        </div>
        <div>
          <van-cell-group>
            <van-cell
              style="font-size:16px"
              v-for="item in cellList"
              :key="item.title"
              :title="item.title"
              is-link
              arrow-direction
              :icon="item.icon"
              size="large"
              en
              :to="item.to"
            />
          </van-cell-group>
        </div>
        <!-- 退出登录 -->
        <a class="exit" href="javascript:;" @click.prevent="handleExitLogin">退出登录</a>
    </div>
    <!-- footer -->
    <app-footer :current="3"></app-footer>
    <!-- popup -->
    <div v-if="showPopupAndMask" class="login-popup">
      <h3>您还没有登录，马上登录体验更多功能吧</h3>
      <router-link to="/login">立即登录</router-link>
      <router-link to="/register">免费注册</router-link>
    </div>
    <!-- 遮罩 -->
    <div v-if="showPopupAndMask" class="mask"></div>
  </div>
</template>
<script>
import AppFooter from "@/base/footer/footer";
import { myCellData } from "@/assets/js/data";
import {
  getLocalStorage,
  setLocalStorage,
  handleResponse
} from "@/assets/js/common";
import { GET_EXIT, GET_MY_INDEX } from "@/api";
import { Dialog } from "vant";

export default {
  data() {
    return {
      cellList: myCellData,
      loginPopup: true,
      showPopupAndMask: true,
      myIndexData: {}
    };
  },
  created() {
    this._checkToken();
    this.token ? this._reqMyIndexData() : "";
  },
  components: {
    AppFooter,
  },
  methods: {
    // 退出登录
    handleExitLogin() {
      // 确认弹框
      Dialog.confirm({
        title: "温馨提示",
        message: "真的要离开吗？",
        confirmButtonText: "是的"
      })
        .then(() => {
          GET_EXIT(this.token).then(res => {
            handleResponse(res, () => {
              // 清除 token
              setLocalStorage("token", "", "string");
              // 跳转到登录页面
              this.$router.push("/login");
            });
          });
        })
        .catch(() => {
          console.log("已关闭");
        });
    },
    _reqMyIndexData() {
      GET_MY_INDEX(this.token).then(res => {
        handleResponse(res, () => {
          this.myIndexData = res.data.user;
        });
      });
    },
    _checkToken() {
      this.token = getLocalStorage("token", "string");
      this.token ? (this.showPopupAndMask = false) : "";
    }
  }
};
</script>
<style lang="less" scoped>
.root-wrap {
  width: 100%;
  height: 100%;
}
.van-icon__image {
  width: 1.5em;
  height: 1.5em;
}
.login-popup {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 50px;
  height: 200px;
  background: linear-gradient(to bottom, #90cdce, #5ab4b5);
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h3 {
    font-size: 18px;
  }
  a {
    line-height: 30px;
    font-size: 16px;
    width: 80%;
    background-color: #e2b96f;
    text-align: center;
    border-radius: 2px;
    margin-top: 10px;
  }
  a:last-child {
    background-color: #63b9ff;
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  background: rgba(143, 154, 154, 0.5);
}
.my {
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
  .card-box {
    padding: 0px 25px 15px;
    border-radius: 20px;
    .top {
      overflow: hidden;
      margin-bottom: 10px;
      img {
        float: left;
        margin-top: 10px;
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .name {
        float: left;
        margin: 10px 10px;
        display: flex;
        flex-direction: column;
        span {
          margin-bottom: 5px;
          font-size: 24px;
        }
        span:last-child {
          width: 230px;
          font-size: 14px;
          color: #9f9f9f;
        }
      }
    }
    .bottom {
      display: flex;
      justify-content: space-around;
      div {
        display: flex;
        flex-direction: column;
        text-align: center;
      }
      span {
        display: block;
        font-size: 18px;
        padding-bottom: 5px;
      }
      span:last-child {
        font-size: 14px;
      }
    }
  }
  .exit {
    display: block;
    width: 80%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    margin: 70px auto;
    border-radius: 15px;
    color: white;
    font-size: 18px;
    background: linear-gradient(to bottom, #90cdce, #5ab4b5);
  }
}
</style>
<style>
.van-dialog__header {
  color: red;
}
</style>