<template>
  <div class="register">
    <login-style
      top="60px"
      title="注册中心"
      :btnData="btnData"
      :showNickname="true"
      :show_cipher="false"
      :isShow="false"
      @submitClick="submitClick"
    >
      <div>
        <van-field v-model="password_1" placeholder="设置密码" name="liebiao" type="password">
          <i slot="left-icon" class="iconfont icon-shezhi"></i>
        </van-field>
        <van-field v-model="password_2" placeholder="确认密码" type="password">
          <i slot="left-icon" class="iconfont icon-mima"></i>
        </van-field>
      </div>
    </login-style>
  </div>
</template>
<script>
import loginStyle from '@/base/loginStyle/loginStyle'
import { POST_REGISTER } from '@/api'
import { handleResponse, setLocalStorage } from '@/assets/js/common'
import { Toast } from 'vant';

export default {
  name: "register",
  data() {
    return {
      btnData: {
        redText: '注册',
        blueText: '去登录',
        blueLink: '/login'
      },
      password_1: '',
      password_2: '',

    }
  },
  methods: {
    submitClick(data) {
      if (!this.password_1) {
        return Toast('请设置密码')
      }
      if (!this.password_2) {
        return Toast('请确认密码')
      }
      if ((this.password_1.length < 6 || this.password_1.length > 12) || (this.password_2.length < 6 || this.password_2.length > 12)) {
        return Toast('请输入6-12位密码')
      }
      if (this.password_1 !== this.password_2) {
        return Toast('两次密码不一致')
      }
      // 短信验证
      POST_REGISTER(data.nickname, data.phone, this.password_1, data.cipher).then(res => {
        handleResponse(res, () => {
          setLocalStorage('token', res.token, 'string')
          this.$router.push('/my')
        })
      })
    }
  },
  components: {
    loginStyle
  }
};
</script>
<style lang="less" scoped>
.register {
  height: 100%;
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
      font-size: 18px;
    }
    input::-moz-placeholder {
      font-size: 14px;
    }
    input:-ms-input-placeholder {
      font-size: 16px;
      color: #fff;
    }
  }
}
</style>

