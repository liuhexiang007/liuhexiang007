<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view v-if="isRouterAlive" :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  methods: {
    // 通过声明reload方法，控制router-view的显示或隐藏，从而控制页面的再次加载
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
