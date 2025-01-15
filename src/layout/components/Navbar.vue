<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="webTitle">
      <!--      <img src="../../../public/logo.png" class="user-avatar">-->
      <!--      <img src="../../../public/title.png" style="height: 25px;object-fit: contain;margin-left: 10px">-->
      <span>{{ webTitle }}</span>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img src="../../assets/icon/exit.png" class="user-avatar">
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!--          <el-dropdown-item @click.native="personalCenter">-->
          <!--            <span style="display:block;">个人中心</span>-->
          <!--          </el-dropdown-item>-->
          <!--          <el-dropdown-item @click.native="resetPassword">-->
          <!--            <span style="display:block;">修改密码</span>-->
          <!--          </el-dropdown-item>-->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">{{ $t('navbar.loginOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="time">
      <span>{{ date }}</span>
      <span>{{ time }}</span>
    </div>
    <!--    <div class="changeLanguage">-->
    <!--      <span>{{ $t('navbar.changeLanguage') }}：</span>-->
    <!--      <el-dropdown class="avatar-container" trigger="click">-->
    <!--        <div class="avatar-wrapper">-->
    <!--          <span>{{ $t('language.name') }}</span>-->
    <!--          <i style="color: white" class="el-icon-caret-bottom" />-->
    <!--        </div>-->
    <!--        <el-dropdown-menu slot="dropdown" class="user-dropdown">-->
    <!--          <el-dropdown-item @click.native="languageClick('zh')">-->
    <!--            <span style="display:block;">{{ $t('language.Chinese') }}</span>-->
    <!--          </el-dropdown-item>-->
    <!--          &lt;!&ndash;          <el-dropdown-item @click.native="languageClick('zh-hk')">&ndash;&gt;-->
    <!--          &lt;!&ndash;            <span style="display:block;">{{ $t('language.ChineseHK') }}</span>&ndash;&gt;-->
    <!--          &lt;!&ndash;          </el-dropdown-item>&ndash;&gt;-->
    <!--          <el-dropdown-item @click.native="languageClick('en')">-->
    <!--            <span style="display:block;">{{ $t('language.English') }}</span>-->
    <!--          </el-dropdown-item>-->
    <!--        </el-dropdown-menu>-->
    <!--      </el-dropdown>-->
    <!--    </div>-->
    <div class="batchNo">
      <span>{{ userName }}</span>
      <!--      <el-button type="primary" @click="newApplication">New Application</el-button>-->
    </div>
    <reset-password-dialog ref="resetPasswordDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ResetPasswordDialog from '@/views/login/modules/resetPasswordDialog'
import Cookies from 'js-cookie'
import { getUser } from '@/utils/auth'

export default {
  components: {
    ResetPasswordDialog,
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      webTitle: window._CONFIG.webTitle,
      timer: undefined,
      date: '',
      time: '',
      userName: getUser()
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'batchNoTag'
    ])
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = undefined
  },
  mounted() {
    this.getDate()
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.getDate()
      }, 1000)
    }
  },
  methods: {
    newApplication() {
      this.$router.push({ path: '/newApplication', name: 'NewApplication' })
    },
    getDate: function() {
      const weeks = [
        this.$t('navbar.sunday'),
        this.$t('navbar.monday'),
        this.$t('navbar.tuesday'),
        this.$t('navbar.wednesday'),
        this.$t('navbar.thursday'),
        this.$t('navbar.friday'),
        this.$t('navbar.saturday')
      ]
      const time = new Date()
      const year = time.getFullYear()
      const month = time.getMonth() + 1
      const day = time.getDate()
      const week = weeks[time.getDay()]
      this.getTime(week)
      this.date = year + '/' + month + '/' + day
    },
    getTime: function(week) {
      const time = new Date()
      const hour = time.getHours()
      let minutes = time.getMinutes()
      let seconds = time.getSeconds()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      if (seconds < 10) {
        seconds = '0' + seconds
      }
      this.time = hour + ' : ' + minutes + ' : ' + seconds + ' ' + week
    },
    languageClick(lang) { // 切换语言
      if (lang === 'zh') {
        this.$i18n.locale = 'zh'
        Cookies.set('language', 'zh')
      } else if (lang === 'zh-hk') {
        this.$i18n.locale = 'zh-hk'
        Cookies.set('language', 'zh-hk')
      } else if (lang === 'en') {
        this.$i18n.locale = 'en'
        Cookies.set('language', 'en')
      }
      this.$store.dispatch('language/changeLanguage', lang)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    personalCenter() { // 个人中心点击
      this.$router.push({ path: '/personalCenter', name: 'PersonalCenter' })
    },
    resetPassword() { // 修改密码
      this.$refs.resetPasswordDialog.showDialog()
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: black;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .webTitle {
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 35%;
    height: 50px;
    span {
      margin-left: 10px;
      display: inline-block;
      font-weight: bolder;
      font-size: 16px;
      color: white;
      line-height: 18px;
    }
    //span:nth-child(2) {
    //  font-size: 12px;
    //  line-height: 14px;
    //  color: red;
    //  border: red 1px solid;
    //  border-radius: 2px;
    //  padding: 2px 20px 2px 20px;
    //  margin-top: 2px;
    //}
    @media screen and (min-width: 0px ) and (max-width: 1500px ){
      display: none;
    }
    @media screen and (min-width: 1500px ) and (max-width: 1700px ){
      left: 25%;
    }
    .user-avatar {
      width: 25px;
      height: 25px;
    }
  }
  .changeLanguage {
    height: 100%;
    float: right;
    line-height: 50px;
    span {
      color: white;
      font-size: 14px;
      cursor: pointer;
    }
    .avatar-container {
      margin-right: 20px;
      .avatar-wrapper {
        .el-icon-caret-bottom {
          cursor: pointer;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
  }

  .time, .batchNo {
    float: right;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 50px;
    margin-right: 20px;
    span {
      color: white;
      text-align: left;
    }
    span:nth-child(1) {
      font-size: 20px;
    }
    span:nth-child(2) {
      font-size: 14px;
    }
  }
  .batchNo {
    span {
      font-size: 14px!important;
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          margin-top: 8px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
