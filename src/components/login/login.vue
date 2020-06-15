<template>
  <div class="register">
    <login-style
      top="80px"
      title="登录中心"
      :btnData="btnData"
      :show_cipher="show_cipher"
      :showPassword="true"
      @submitClick="submitClick"
    ></login-style>
  </div>
</template>
<script>
import loginStyle from '@/base/loginStyle/loginStyle'
import { Toast } from 'vant';
import { POST_LOGIN1 } from '@/api'
import { POST_LOGIN2 } from '@/api'
import { handleResponse, setLocalStorage } from '@/assets/js/common'

export default {
  name: "register",
  data() {
    return {
      show_cipher: true,
      btnData: {
        redText: '登录',
        blueText: '去注册',
        blueLink: '/register'
      }
    }
  },
  methods: {
    submitClick(data) {
      if (data.login_type) {
        //密码登录
        if (!data.password) {
          return Toast('请输入密码')
        }
        if (data.password.length < 6 || data.password.length > 12) {
          return Toast('请输入6-12位密码')
        }
        POST_LOGIN1(data.phone, data.password, data.login_type).then(res => {
          handleResponse(res, () => {
            // 存储 token
            setLocalStorage('token', res.token, 'string')
            // 跳转至我的页面
            this.$router.push('/my')
          })
        })
      } else {
        //验证码
        POST_LOGIN2(data.phone, data.cipher, data.login_type).then(res => {
          handleResponse(res, () => {
            // 存储 token
            setLocalStorage('token', res.token, 'string')
            // 跳转至我的页面
            this.$router.push('/my')
          })
        })
      }
    },
  },
  components: {
    loginStyle
  }
};
</script>
<style lang="less" scoped>
.register {
  position: relative;
  height: 100%;
  background-size: 100%;
}
</style>

