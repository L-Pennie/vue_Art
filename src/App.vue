<template>
  <div id="root">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <app-footer></app-footer>
  </div>
</template>
<script>

import AppFooter from "@/base/footer/footer";
export default {
  components: {
    AppFooter
  }
};
</script>

<style lang="less">
* {
  -webkit-overflow-scrolling: touch;
}
// 隐藏vconsole
#__vconsole {
  display: none;
}
#root {
  width: 100%;
  background-color: #fafafa;
}
</style>