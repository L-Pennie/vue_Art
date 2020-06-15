<template>
  <div class="forget">
    <header-main></header-main>
    <br />
    <img src="@/images/modify.png" alt />
    <van-cell-group :border="false">
      <van-field label="手机号" v-model="phone" :border="false" clearable placeholder="请输入您的手机号" />
      <div class="border"></div>
      <van-field label="新密码" type="password" clearable v-model="password" placeholder="请输入要更改的密码" />
    </van-cell-group>

    <div class="btn" @click.prevent="handleSubmitClick">确认修改</div>
  </div>
</template>
<script>
import HeaderMain from "@/base/header/header";
import { Toast, Dialog } from "vant";
import { POST_MODIFY_PASSWORD } from "@/api";
import { handleResponse } from "@/assets/js/common";

export default {
  data() {
    return {
      phone: "",
      password: ""
    };
  },
  components: {
    HeaderMain
  },
  methods: {
    handleSubmitClick() {
      if (!this.phone) {
        return Toast("请输入手机号码");
      }
      if (!/^1[0-9]{10}$/.test(this.phone)) {
        return Toast("请输入正确的手机号码");
      }

      if (!this.password) {
        return Toast("请输入密码");
      }
      if (this.password.length < 6 || this.password.length > 12) {
        return Toast("请输入6-12位密码");
      }

      POST_MODIFY_PASSWORD(this.phone, this.password).then(res => {
        handleResponse(res, () => {
          Dialog.alert({
            title: '温馨提示',
            message: '您的密码已修改，需要重新登录！'
          }).then(() => {
            localStorage.setItem('token', '')
            this.$router.push('/login')
          });
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.forget {
  background-color: #fff;
  height: 100%;
  text-align: center;
  img {
    height: 80px;
    width: 80px;
    margin: 100px auto 30px;
  }
  .van-cell {
    background-color: transparent;
    font-size: 16px;
    padding: 15px 60px 15px;
  }
  .van-field .van-cell__title {
    color: black;
  }
  .van-field__control {
    color: #959494;
  }
  .btn {
    display: block;
    width: 80%;
    height: 45px;
    border-radius: 15px;
    line-height: 45px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    margin: 20px auto 0;
    background: linear-gradient(to bottom, #90cdce, #5ab4b5);
  }
}
</style>


