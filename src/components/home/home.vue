<template>
  <div class="home">
    <ul class="tab-tilte">
      <li @click="cur=0" :class="{active:cur==0}">关注</li>
      <li @click="cur=1" :class="{active:cur==1}">问答</li>
      <li @click="cur=2" :class="{active:cur==2}">附近</li>
    </ul>
    <div class="tab-content">
      <div v-show="cur==0">
        <focus-container></focus-container>
      </div>
      <div v-show="cur==1">
        <ask-container></ask-container>
      </div>
      <div v-show="cur==2">
        <nearby-container></nearby-container>
      </div>
    </div>
  </div>
</template>

<script>
import { handleResponse } from '@/assets/js/common'
import FocusContainer from '../focus/focus'
import NearbyContainer from '../nearby/nearby'
import AskContainer from '../ask/ask'
export default {
  data() {
    return {
      cur: 1,//默认选中第一个tab
    }

  },
  created() {

  },
  mounted() {

  },
  methods: {

  },
  components: {
    FocusContainer,
    NearbyContainer,
    AskContainer
  },

}
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  font-size: 16px;
  background-color: #fff;
}

ul li {
  display: block;
  //list-style: none;
}
.tab-tilte {
  width: 100%;
  height: 1.24rem;
  line-height: 1.24rem;
  display: flex;
  color: #939393;
  justify-content: center;
}
.tab-tilte li {
  padding: 0px 10px;
  height: 1rem;
  text-align: center;
  cursor: pointer;
  background-color: #fff;
}
/* 点击对应的标题添加对应的背景颜色 */
.tab-tilte .active {
  border-bottom: 2.5px solid #57bbbd;
  color: #333333;
  font-weight: 700;
  font-size: 18px;
}
.tab-content {
  width: 100%;
  border-top: 1px solid #ebeeee;
}
</style>