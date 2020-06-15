<template>
  <footer class="footer">
    <div
      v-for="(item, index) in footData"
      :class="{ active: current === index }"
      :key="item.path"
      @click="gopage(item.path,index)"
    >
      <i :class="['iconfont', item.iconClass]"></i>
      <span>{{ item.name }}</span>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      footData:
        [
          { path: '/home', iconClass: 'icon-shouye', name: '首页' },
          { path: '/browse', iconClass: 'icon-icon', name: '发现' },
          { path: '/publish', iconClass: 'icon-tianjia', name: '发布' },
          { path: '/shop', iconClass: 'icon-shangchang', name: '集市' },
          { path: '/my', iconClass: 'icon-wode', name: '我的' },
        ],
      current: 0
    }
  },
  methods: {
    gopage(path, index) {
      this.current = index
      this.$router.push(path)
    }
  },
  computed: {
    isActive() {
      return 'active'
    }
  }
}
</script>

<style lang="less" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1.33rem;
  background: #fff;
  display: flex;
  font-size: 10px;
  color: #a9acab;
  > div {
    width: 25%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &.active {
      color: black;
    }
    i {
      font-size: 20px;
      margin: 0px auto 2px;
    }
  }
  div:nth-child(3) {
    background-image: linear-gradient(-45deg, #70bebf, #55b8ba);
    background-clip: text;
    color: transparent;
    i {
      font-size: 45px;
      margin-top: 4px;
    }
    span {
      display: none;
    }
  }
}
</style>


