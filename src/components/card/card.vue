<template>
  <div class="card-box">
    <header-main title="个人设置"></header-main>
    <div class="card">
      <vue-core-image-upload
        crop="local"
        @imagechanged="imagechanged"
        @imageuploading="imageuploading"
        @errorhandle="errorhandle"
        :max-file-size="3145728"
        :max-width="100"
        :max-height="100"
        extensions="png,jpg,gif"
        inputAccept
        :isXhr="false"
      >
        <div class="avatar">
          <img :src="information.avatar" alt />
        </div>
      </vue-core-image-upload>
      <div style="padding:40px 40px 0px">
        <van-field
          clearable
          :border="true"
          label="昵称"
          label-width="60px"
          v-model="information.nickname"
          placeholder="请输入用户名"
        />
        <div class="border"></div>
        <van-field
          label="手机"
          :border="true"
          readonly
          :value="information.phone"
          label-width="60px"
          right-icon="question"
          @click-icon="$toast('手机号不可更改')"
        />
        <van-field
          label="性别"
          :border="true"
          label-width="60px"
          v-model="information.gender"
          readonly
          @click="showSexActionsheet = true"
        />
        <van-field
          label="生日"
          :border="true"
          label-width="60px"
          v-model="information.birthday"
          readonly
          @click="showBirPopup = true"
          placeholder="请选择"
        />
        <div class="border"></div>
        <van-field
          label="简介:"
          label-width="60px"
          v-model="information.bio"
          clearable
          type="textarea"
          placeholder="快来介绍自己吧！"
          rows="3"
          :border="true"
          autosize
        />

        <div class="border"></div>
        <!-- 性别部分 actionsheet -->
        <van-action-sheet
          v-model="showSexActionsheet"
          :actions="sexActions"
          @select="sexSelect"
          style="margin-bottom:50px"
        />
        <!-- 生日部分 picker 结合 popup使用 -->
        <van-popup v-model="showBirPopup" position="bottom" :overlay="true">
          <van-datetime-picker
            v-model="currentDate"
            type="date"
            :visible-item-count="3"
            @confirm="birPickerConfirm"
            @cancel="showBirPopup = false"
            :min-date="minDate"
            :max-date="maxDate"
            style="margin-bottom:50px"
          />
        </van-popup>
      </div>
      <a class="sumit-btn" @click.prevent="handleModifyClick" href="javascript:;">确认修改</a>
    </div>
  </div>
</template>
<script>
import HeaderMain from "@/base/header/header";
import { dateFilter } from "@/assets/js/filters";
import VueCoreImageUpload from "vue-core-image-upload";
import { GET_MY_INFORMATION, POST_MY_INFORMATION } from "@/api";
import {
  handleResponse,
  getLocalStorage,
  calRealLength
} from "@/assets/js/common";
import { Toast } from "vant";

export default {
  data() {
    return {
      minDate: new Date(1960, 0, 1),
      maxDate: new Date(2035, 12, 31),
      information: {},
      folder: "avatar",
      avatar: [],
      showSexActionsheet: false,
      sexActions: [
        {
          name: "男"
        },
        {
          name: "女"
        }
      ],
      showBirPopup: false,
      currentDate: new Date()
    };
  },
  created() {
    this.token = getLocalStorage("token", "string");
    this._getInformation();
  },
  components: {
    HeaderMain,
    VueCoreImageUpload
  },
  methods: {
    // 生日 picker 组件点击确认按钮事件
    birPickerConfirm(time) {
      this.information.birthday = dateFilter(time, "YY-MM-DD");
      this.showBirPopup = false;
    },
    // 性别 弹出层 选中后事件
    sexSelect(item) {
      this.information.gender = item.name;
      this.showSexActionsheet = false;
    },
    // input框改变选择图片时候触发
    imagechanged(base64) {
      this.information.avatar = base64
      this.avatar.push(this.information.avatar)
    },
    // 上传过程中
    imageuploading() {
      console.log('loading');
    },
    // 上传错误
    errorhandle(err) {
      console.log(err);
      if (err.indexOf('TYPE') >= 0) {
        return Toast('上传图片的类型仅支持png、jpg、jpeg')
      }
      if (err.indexOf('TOO LARGER') >= 0) {
        return Toast('上传图片大小不能超过 3MB')
      }

    },
    // 获取个人信息
    _getInformation() {
      GET_MY_INFORMATION(this.token).then(res => {
        handleResponse(res, () => {
          this.information = res.data;
        });
      });
    },
    // 修改个人信息
    _modifyInformation() {
      POST_MY_INFORMATION(
        this.information.user_id,
        JSON.stringify(this.avatar),
        this.information.nickname,
        this.information.gender,
        this.information.birthday,
        this.information.bio,
        this.folder
      ).then(res => {
        handleResponse(res, () => {
          // 修改成功 重新请求一次新的数据
          this._getInformation();
          Toast.success('修改成功');
        });
      });
    },
    // 修改按钮点击事件
    handleModifyClick() {
      if (!this.information.nickname) {
        return Toast("请输入昵称");
      }

      let pattern = new RegExp(
        "[`~^*()|{}\\[\\].<>/~#￥……*（）——|{}【】 ‘；：”“']"
      );
      if (pattern.test(this.information.nickname)) {
        return Toast("存在特殊字符");
      }

      let reallength = calRealLength(this.information.nickname);
      if (reallength < 4 || reallength > 12) {
        return Toast("昵称长度必须在4-12个字符之间");
      }

      this._modifyInformation();
    }
  }
};
</script>
<style lang="less" scoped>
.card-box {
  width: 100%;
  height: 100%;
  .card {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 50px;
    z-index: 1000;
    .avatar {
      height: 80px;
      text-align: center;
      margin-bottom: 10px;
      img {
        width: 90px;
        height: 90px;
        border-radius: 100%;
      }
    }
  }
  .sumit-btn {
    display: block;
    width: 80%;
    height: 45px;
    border-radius: 15px;
    line-height: 45px;
    font-size: 18px;
    color: #fff;
    text-align: center;
    margin: 10px auto 0;
    background: linear-gradient(to bottom, #90cdce, #5ab4b5);
  }
}
</style>
<style>
.van-cell {
  background-color: transparent;
  font-size: 16px;
  padding: 15px 25px 15px;
}
.van-field .van-cell__title {
  color: black;
}
.van-field__control {
  color: #959494;
}
</style>



