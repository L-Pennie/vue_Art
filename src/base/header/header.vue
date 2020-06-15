<template>
  <header class="header">
    <div class="back" v-show="showBack" @click="back(path)">
      <i class="iconfont icon-zuo-"></i>
      <i v-if="isShare" class="iconfont icon-fenxiang"></i>
    </div>
    <div class="title">{{title}}</div>

    <div class="right">
      <slot name="right"></slot>
    </div>
    <div class="border"></div>
  </header>
</template>
<script>
export default {
  props: {
    showBack: {
      type: String,
      default: 'ture'
    },
    path: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    isShare: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    back(path) {
      path ? this.$emit('back', path) : this.$router.back()
      console.log(this.$router)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  background-color: #fff;
  z-index: 111;
  text-align: center;
  width: 100%;
  height: 45px;
  font-size: 18px;
  line-height: 45px;
  color: #646464;
  .back {
    text-align: center;
    i:nth-child(1) {
      float: left;
      font-size: 24px;
    }
    i:nth-child(2) {
      float: right;
      font-size: 26px;
      margin-right: 10px;
    }
  }
  .title {
    display: inline-block;
    text-align: center;
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .right {
    position: absolute;
    top: 0;
    right: 0;
    line-height: 35px;
    height: 35px;
  }
}
</style>

