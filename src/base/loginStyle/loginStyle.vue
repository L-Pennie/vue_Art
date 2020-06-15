<template>
  <div class="login-style" :style="`padding-top:${top}`">
    <div class="back" @click="goHome">
      <i class="iconfont icon-guanbi"></i>
    </div>
    <div class="title">
      <h1>{{ title }}</h1>
      <p v-show="desc">{{ desc }}</p>
    </div>
    <div class="inp-box">
      <van-field
        v-if="showNickname"
        v-model="user_msg.nickname"
        left-icon="contact"
        placeholder="昵称"
      />

      <van-cell-group>
        <van-field
          v-model="user_msg.phone"
          placeholder="手机号码"
          type="digit"
          left-icon="phone-o"
          style="font-size：30px"
        />

        <slot></slot>
        <div v-if="toShow">
          <van-field
            v-model="user_msg.password"
            placeholder="密码"
            left-icon="closed-eye"
            type="password"
          >
            <i slot="left-icon" class="iconfont icon-mima"></i>
          </van-field>

          <span
            v-if="toShowCipher"
            class="change_btn"
            left-icon="closed-eye"
            type="password"
            @click="show"
          >短信验证</span>
        </div>
        <div v-if="!toShow">
          <van-field
            v-model="user_msg.cipher"
            center
            clearable
            placeholder="请输入短信验证码"
            type="digit"
            left-icon="closed-eye"
          >
            <i slot="left-icon" class="iconfont icon-iconfontyanzhengma"></i>
            <template #button>
              <van-button
                size="small"
                type="primary"
                @click="send_cipher"
                v-if="showbtn"
                color="#5ab4b5"
              >发送验证码</van-button>
              <button class="toShow" v-if="showbtn===false">{{code_ts}}</button>
            </template>
          </van-field>
          <span class="change_btn" v-show="showPassword" @click="show">密码登录</span>
        </div>
      </van-cell-group>
      <!-- <span class="register">注册</span> -->
      <router-link :to="btnData.blueLink" class="register">{{ btnData.blueText }}</router-link>
    </div>

    <div class="btn">
      <a href="javascript:;" @click="handleSubmit" class="login">{{ btnData.redText }}</a>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
import { calRealLength } from '@/assets/js/common'
import { SEND_CIPHER } from '@/api'
import { handleResponse } from "@/assets/js/common";
export default {
  data() {
    return {
      showbtn: true, // 展示获取验证码或倒计时按钮判断
      code_ts: '获取验证码', //倒计时提示文字
      sec: 60,// 倒计时秒数
      toShowCipher: false,
      toShow: false,
      user_msg: {
        nickname: '',
        phone: '',
        password: '',
        cipher: '',
        login_type: true,
      }

    }
  },
  props: {
    showNickname: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    top: {
      type: String,
      default: '0px'
    },
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    show_cipher: {
      type: Boolean,
      default: true
    },
    btnData: {
      type: Object,
      default: {}
    },
    isShow: {
      type: Boolean,
      default: true
    },
  },
  created() {
    this.toShow = this.isShow
    this.toShowCipher = this.show_cipher
  },
  methods: {
    handleSubmit() {
      if (this.showNickname) {
        if (!this.user_msg.nickname) {
          return Toast('请输入昵称')
        }

        let pattern = new RegExp("[`~^*()|{}\\[\\].<>/~#￥……*（）——|{}【】‘；：”“']")
        if (pattern.test(this.user_msg.nickname)) {
          return Toast('存在特殊字符')
        }

        let reallength = calRealLength(this.user_msg.nickname)
        if (reallength < 4 || reallength > 7) {
          return Toast('昵称长度必须在4-7个字符之间')
        }
      }

      if (!this.user_msg.phone) {
        return Toast('请输入手机号码')
      }
      if (!/^1[0-9]{10}$/.test(this.user_msg.phone)) {
        return Toast('请输入正确的手机号码')
      }
      this.$emit('submitClick', this.user_msg)
    },
    goHome() {
      this.$router.push({
        path: '/home'
      })
    },
    show() {
      this.toShow = !this.toShow
      this.toShowCipher = !this.toShowCipher
      if (this.toShow == false) {
        this.showbtn = true
      } else {
        this.showbtn = ''
      }
      this.user_msg.login_type = this.toShow
    },
    send_cipher() {
      var timer = setInterval(() => {
        this.sec = this.sec - 1
        this.code_ts = this.sec + 'S后重试'
        this.showbtn = false
        if (this.sec === 0) {
          clearInterval(timer)
          this.sec = 60
          this.code_ts = this.sec + 'S后重试'
          this.showbtn = true
        }
      }, 1000)
      SEND_CIPHER(this.user_msg.phone).then(res => {
        handleResponse(res, () => {
          console.log("发送成功")
        })
      })
    },
  }
};
</script>
<style lang="less" scoped>
.change_btn {
  color: blue;
  font-size: 16px;
  float: left;
  margin-left: 5px;
  margin-top: 10px;
}
.register {
  color: blue;
  font-size: 16px;
  float: right;
  margin-right: 5px;
  margin-top: 10px;
}
.login-style {
  padding: 0px 20px;
  background-color: #ffffff;
  color: #59b1b4;
  .back {
    position: absolute;
    top: 12px;
    left: 12px;
    i {
      font-size: 20px;
    }
  }
  .title {
    text-align: center;
    margin-bottom: 30px;
    h1 {
      font-size: 30px;
      font-weight: 600;
    }
    p {
      padding-top: 10px;
    }
  }
  .inp-box {
    margin-bottom: 20px;
    input {
      border: 1px solid rgba(9, 9, 9, 0.2);
      outline: none;
      background: transparent;
      width: 100%;
      height: 34px;
      border-radius: 20px;
      padding-left: 20px;
      margin-bottom: 14px;
      color: red;
    }
    input::-webkit-input-placeholder {
      /* WebKit browsers */
      font-size: 18px;
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      font-size: 14px;
    }
    input:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      font-size: 16px;
      color: #fff;
    }

  }
  .btn {
    a {
      margin-top: 90px;
      display: inline-block;
      width: 100%;
      padding: 10px 0px;
      text-align: center;
      font-size: 20px;
      color: #fff;
      background: linear-gradient(to bottom, #90cdce, #5ab4b5);
    }
    .sign {
      background: linear-gradient(to bottom, #90cdce, #5ab4b5);
    }
  }
}
</style>
