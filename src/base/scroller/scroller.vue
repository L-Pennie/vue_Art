<template>
  <div class="scroll-wrapper" ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll'

export default {
  props: {
    handleToScroll: {
      type: Function,
      default: function () { }
    },
    handleToTouchEnd: {
      type: Function,
      default: function () { }
    },
    extra_height: {
      type: Number,
      default: 0
    }
  },

  mounted() {
    this.$refs.wrapper.style.height = (document.documentElement.clientHeight / window.screen.width * 10 - 1.33 - 1.33 - this.extra_height) + "rem"

    this.scroll = new BScroll(this.$refs.wrapper, {
      tap: true,
      probeType: 1,
      click: true,
    });

    this.scroll.on("scroll", (pos) => {
      this.handleToScroll(pos);
    });

    this.scroll.on("touchEnd", (pos) => {
      this.get_maxScrollY()
      this.handleToTouchEnd(pos);

    });

  },
  methods: {
    get_maxScrollY(maxScrollY) {
      this.$emit("get_maxScrollY", this.scroll.maxScrollY)
    },
  },



}
</script>
<style lang="less" scoped>
.scroll-wrapper {
  background-color: #ffffff;
  overflow: hidden;
}
</style>

