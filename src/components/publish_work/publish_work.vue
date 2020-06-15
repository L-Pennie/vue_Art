<template>
  <div class="publish">
    <header-main>
      <a href="javascript;;" slot="right" class="submit-btn" @click.prevent="handleSubmitClick">发布</a>
    </header-main>
    <div class="choose_menu">
      <van-dropdown-menu class="menu" active-color="#57bbbd">
        <van-dropdown-item v-model="category" :options="option1" />
      </van-dropdown-menu>
        
      <van-cell-group>
        <van-field clearable v-model="title" :border="false" placeholder="请输入作品标题" />
      </van-cell-group>
    </div>
    <vue-html5-editor :content="desc" auto-height @change="updateData"></vue-html5-editor>
    <div class="publish_img">
      <van-uploader v-model="fileList" multiple :max-count="9" preview-size="101px" />
    </div>
  </div>
</template>
<script>
import HeaderMain from "@/base/header/header";
import { Toast } from "vant";
import { handleResponse } from "@/assets/js/common";
import { POST_WORK_PUBLISH } from "@/api";
import VueCoreImageUpload from "vue-core-image-upload";

export default {
  data() {
    return {
      fileList: [],
      title: "",
      desc: "",
      option1: [
       { text: '请选择作品类别', value: 0 },
        { text: '彩铅', value: 1 },
        { text: '水粉', value: 2 },
        { text: '素描', value: 3 },
        { text: '水墨', value: 4 },
        { text: '水彩', value: 5 },
        { text: '油画', value: 6 },
        { text: '国画', value: 7 },
        { text: '钢笔画', value: 8 },
        { text: '其他', value: 9 },
      ],
      category: 0,
      title: "",
      desc: "作品描述...",
      show: false,
      actions: [],

    };
  },
  components: {
    HeaderMain,
    VueCoreImageUpload
  },
  created() {
  },
  methods: {
    handleSubmitClick() {
      if (!this.title) return Toast("请输入问题标题");
      if (this.title.length < 4 || this.title.length > 30) {
        return Toast("标题长度在4-30个字符之间");
      }
      var img_arr = this.fileList.map(item => item.content)
      console.log(img_arr)
      var folder = "work"
      POST_WORK_PUBLISH(this.category, JSON.stringify(img_arr), this.title, JSON.stringify(this.desc), folder).then(res => {
        handleResponse(res, () => {
          this.$router.push(`/work/details?id=${res.data.work_id}`)
        });
      });
    },

    updateData(e = '') {
      this.desc = e;
    }
  },


};
</script>
<style lang="less" scoped>
.publish {
  margin-bottom: 50px;
  .choose_menu {
    padding: 10px;
    background-color: #f9f9f9;
    .menu {
      margin-top: 45px;
    }
  }
  .submit-btn {
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
</style>>



