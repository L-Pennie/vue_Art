<template>
  <div>
    <header-main></header-main>
    <div class="publish">
      <van-cell-group>
        <van-field border clearable v-model="title" :border="false" placeholder="请输入问题标题" />
        <van-field
          type="textarea"
          :border="false"
          clearable
          v-model="desc"
          placeholder="请输入问题描述"
          rows="4"
          border
          autosize
          maxlength="450"
          show-word-limit
        />
      </van-cell-group>
      <van-uploader v-model="fileList" multiple :max-count="9" preview-size="101px" />
      <a href="javascript;;" class="submit-btn" @click.prevent="handleSubmitClick">确认发布</a>
    </div>
  </div>
</template>
<script>
import HeaderMain from "@/base/header/header";
import { Toast } from "vant";
import { handleResponse } from "@/assets/js/common";
import { GET_ASK_CATEGORY, POST_ASK_PUBLISH } from "@/api";
import { GET_MY_INFORMATION } from "@/api";
import VueCoreImageUpload from "vue-core-image-upload";
export default {
  data() {
    return {
      fileList: [],
      title: "",
      desc: "",
      title: "",
      desc: "",
    };
  },
  components: {
    HeaderMain,
    VueCoreImageUpload
  },

  methods: {
    handleSubmitClick() {
      if (!this.title) return Toast("请输入问题标题");
      if (this.title.length < 4 || this.title.length > 150) {
        return Toast("问题标题长度在4-150个字符之间");
      }
      if (!this.desc) return Toast("请输入问题描述");
      var img_arr = this.fileList.map(item => item.content)
      var folder = "ques"
      POST_ASK_PUBLISH(JSON.stringify(img_arr), this.title, this.desc, folder).then(res => {
        handleResponse(res, () => {
          this.$router.push(`/ask/details?id=${res.data.question_id}`)
        });
      });
    },
  }
};
</script>
<style lang="less" scoped>
.publish {
  padding: 20px;
  background-color: white;
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
}

.van-cell {
  font-size: 18px;
}
.van-cell-group {
  margin-bottom: 20px;
  margin-top: 41px;
}
</style>>



