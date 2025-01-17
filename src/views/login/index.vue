<template>
  <div class="plm-login">
    <div class="login-container">
      <div class="contain-right">
        <div class="title-container">
          <span class="title">{{ $t( 'login.title' ) }}</span>
          <!--          <span class="title">{{ $t( 'login.suTitle' ) }}</span>-->
          <div v-if="!isForgetPassword" class="login-content">
            <div v-if="!isEmailLogin" class="login-user">
              <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
                <el-form-item prop="username">
                  <el-input
                    ref="username"
                    v-model="loginForm.username"
                    :placeholder="$t( 'login.userPlaceholder' )"
                    name="username"
                    type="text"
                    tabindex="1"
                    style="height:3.125rem"
                    auto-complete="on"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    :placeholder="$t( 'login.passwordPlaceholder' )"
                    name="password"
                    tabindex="2"
                    auto-complete="on"
                    style="height:3.125rem"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </el-form-item>
                <el-button :loading="loading" type="primary" class="el_button" @click.native.prevent="handleLogin">{{ $t( 'login.loginTitle' ) }}</el-button>
                <div style="display: flex;align-items: center;justify-content: flex-end">
                  <!--                  <span style="float: right;margin-top: 20px;margin-bottom: 20px;cursor: pointer" @click="emailLogin">Email login</span>-->
                  <span style="float: right;margin-top: 20px;margin-bottom: 20px;cursor: pointer" @click="forgetPassword">{{ $t('login.forgetPassword') }}</span>
                </div>
              </el-form>
            </div>
            <div v-else class="login-emailCode login-user">
              <el-form ref="loginFormEmail" :model="loginFormEmail" :rules="loginEmailRules" class="login-form" auto-complete="on" label-position="left">
                <el-form-item prop="username">
                  <el-input
                    v-model="loginFormEmail.username"
                    :placeholder="$t('login.userPlaceholder')"
                    name="email"
                    type="text"
                    tabindex="1"
                    style="height:3.125rem"
                    auto-complete="on"
                  />
                </el-form-item>
                <el-form-item prop="emailCode">
                  <div style="display: flex">
                    <el-input
                      v-model="loginFormEmail.emailCode"
                      type="text"
                      :placeholder="$t('login.emailCodePlaceholder')"
                      name="emailCode"
                      tabindex="2"
                      auto-complete="off"
                      style="height:3.125rem;width: 60%"
                    />
                    <!--                    <span v-if="show" style="margin-left: 10px;width: 40%;cursor: pointer" @click="sendEmail">{{ $t('login.getEmailCode') }}</span>-->
                    <!--                    <span v-else style="margin-left: 10px;width: 40%">{{ count }}s{{ $t('login.getEmailCodeMessage') }}</span>-->
                  </div>
                </el-form-item>
                <el-button :loading="loading" type="primary" class="el_button" @click.native.prevent="handleLoginEmail">{{ $t( 'login.loginTitle' ) }}</el-button>
                <div style="display: flex;align-items: center;justify-content: flex-end">
                  <span style="float: right;margin-top: 20px;margin-bottom: 20px;cursor: pointer" @click="isEmailLogin = false">Back password</span>
                </div>
              </el-form>
            </div>
          </div>
          <div v-else class="login-forgetPassword">
            <el-steps style="width: 90%;margin-top: 20px" :active="stepActive" finish-status="success" simple>
              <el-step :title="$t('login.verify')" icon="el-icon-message" />
              <el-step :title="$t('login.changePassword')" icon="el-icon-edit" />
            </el-steps>
            <div v-if="stepActive === 0" class="login-emailCode">
              <el-form ref="loginFormEmail" :model="loginFormEmail" :rules="loginEmailRules" class="login-form" auto-complete="on" label-position="left">
                <el-form-item prop="username">
                  <el-input
                    ref="username"
                    v-model="loginFormEmail.username"
                    :placeholder="$t( 'login.userPlaceholder' )"
                    name="username"
                    type="text"
                    tabindex="1"
                    style="height:3.125rem"
                    auto-complete="on"
                  />
                </el-form-item>
                <el-form-item prop="emailCode">
                  <div style="display: flex">
                    <el-input
                      ref="emailCode"
                      v-model="loginFormEmail.emailCode"
                      type="text"
                      :placeholder="$t( 'login.emailCodePlaceholder' )"
                      name="emailCode"
                      tabindex="2"
                      auto-complete="off"
                      style="height:3.125rem;width: 60%"
                      @keyup.enter.native="handleNext"
                    />
                    <span v-if="show" style="margin-left: 10px;width: 40%;cursor: pointer" @click="sendEmail">{{ $t('login.getEmailCode') }}</span>
                    <span v-else style="margin-left: 10px;width: 40%">{{ count }}s{{ $t('login.getEmailCodeMessage') }}</span>
                  </div>
                </el-form-item>
                <el-button :loading="loadingEmail" type="primary" class="el_button" @click.native.prevent="handleNext">{{ $t('login.next') }}</el-button>
                <span style="float: right;margin-top: 20px;margin-bottom: 20px;cursor: pointer" @click="forgetPassword">{{ $t('login.backLogin') }}</span>
              </el-form>
            </div>
            <div v-else class="login-emailCode">
              <el-form ref="loginFormPassword" :model="loginFormPassword" :rules="loginPasswordRules" class="login-form" auto-complete="on" label-position="left">
                <el-form-item prop="password">
                  <el-input
                    v-model="loginFormPassword.password"
                    :placeholder="$t('resetPasswordDialog.newPassword')"
                    show-password
                    style="height:3.125rem"
                    autocomplete="off"
                  />
                </el-form-item>
                <el-form-item prop="checkPassword">
                  <el-input
                    v-model="loginFormPassword.checkPassword"
                    :placeholder="$t('resetPasswordDialog.markSure')"
                    show-password
                    autocomplete="off"
                    maxlength="16"
                    show-word-limit
                  />
                </el-form-item>
                <el-button :loading="loadingPassword" type="primary" class="el_button" @click.native.prevent="handleChangePassword">{{ $t('login.changePassword') }}</el-button>
                <span style="float: right;margin-top: 20px;margin-bottom: 20px;cursor: pointer" @click="forgetPassword">{{ $t('login.backLogin') }}</span>
              </el-form>
            </div>
          </div>
        </div>
        <h3 style="position: absolute;width: 100%;text-align: center;bottom: 0;color: rgb(141, 141, 141)">{{ $t('login.contactMessage') }}</h3>
      </div>
    </div>
    <reset-password-dialog ref="resetPasswordDialog" />
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import { Base64 } from 'js-base64'

import ResetPasswordDialog from '@/views/login/modules/resetPasswordDialog'
import { } from '@/api/table'
import { getEmailCode, getUserMenuExtInfo } from '@/api/user'
export default {
  name: 'Login',
  components: { ResetPasswordDialog },
  data() {
    const _self = this
    const validateUsername = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error(_self.$t('login.userNameMessage')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 9) {
        callback(new Error(_self.$t('login.passwordMessage')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{9,16}$/
      if (value === '') {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage2')))
      } else if (!reg.test(value)) {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage5')))
      } else {
        if (this.loginFormPassword.checkPassword !== '') {
          this.$refs.loginFormPassword.validateField('checkPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage3')))
      } else if (value !== this.loginFormPassword.password) {
        callback(new Error(_self.$t('resetPasswordDialog.passwordMessage4')))
      } else {
        callback()
      }
    }
    return {
      isEmailLogin: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      registerForm: {
        username: '',
        password: '',
        passwordAgain: '',
        detailsId: ''
      },
      loading: false,
      activeName: 'first',
      passwordType: 'password',
      redirect: 'undefined',
      isForgetPassword: false, // 是否忘记密码页面
      stepActive: 0,
      loadingEmail: false,
      loadingPassword: false,
      loginFormEmail: {
        username: '',
        emailCode: ''
      },
      loginEmailRules: {
        username: [{ required: true, message: this.$t('login.loginUserNameMessage'), trigger: 'blur' }],
        emailCode: [{ required: true, message: this.$t('login.loginEmailCodeMessage'), trigger: 'blur' }]
      },
      loginFormPassword: {
        password: '',
        checkPassword: '',
        uuid: ''
      },
      loginPasswordRules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      show: true,
      count: '',
      timer: null
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    emailLogin() { // 邮箱登录
      this.isEmailLogin = !this.isEmailLogin
      this.$nextTick(() => {
        if (this.$refs.loginFormEmail) {
          this.$refs.loginFormEmail.resetFields()
        }
        if (this.$refs.loginForm) {
          this.$refs.loginForm.resetFields()
        }
      })
    },
    forgetPassword() { // 忘记密码
      this.isForgetPassword = !this.isForgetPassword
      if (this.loginForm.username.length > 0 && this.isForgetPassword) {
        this.loginFormEmail.username = this.loginForm.username
      }
      this.loadingEmail = false
      this.loadingPassword = false
    },
    getCode() { // 获取验证码倒计时
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
    },
    sendEmail() { // 发送邮件
      if (this.loginFormEmail.username.length <= 0) {
        this.$message.error(this.$t('login.loginUserNameMessage'))
        return
      }
      this.getCode()
      getEmailCode({
        email: this.loginFormEmail.username
      }).then(res => {
        if (res.status === 200) {
          console.log(res.data)
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleNext() { // 下一步
      this.$refs.loginFormEmail.validate(valid => {
        if (valid) {
          this.stepActive = 1
          // this.loadingEmail = true
          // const formData = new FormData()
          // formData.append('loginName', this.loginFormEmail.username)
          // formData.append('code', this.loginFormEmail.emailCode)
          // verifyCode(formData).then(res => {
          //   if (res.status === 200) {
          //     this.stepActive = 1
          //     this.loginFormPassword.uuid = res.data
          //   } else {
          //     this.$message.error(res.message)
          //   }
          //   this.loadingEmail = false
          // }).catch(() => {
          //   this.loadingEmail = false
          // })
        }
      })
    },
    handleChangePassword() { // 修改密码
      this.$refs.loginFormPassword.validate(valid => {
        if (valid) {
          // this.loadingPassword = true
          // changePwdByCode({
          //   newPassword: this.$md5(this.loginFormPassword.password),
          //   code: this.loginFormPassword.uuid
          // }).then(res => {
          //   if (res.status === 200) {
          //     this.$message.success(this.$t('login.passwordSuccess'))
          //     this.isForgetPassword = false
          //     this.loginFormEmail.emailCode = ''
          //     this.loadingPassword.password = ''
          //     this.loadingPassword.checkPassword = ''
          //     this.loadingPassword.uuid = ''
          //   } else {
          //     this.$message.error(res.message)
          //   }
          //   this.loadingPassword = false
          // }).catch(() => {
          //   this.loadingPassword = false
          // })
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const loginForm = {
            username: this.loginForm.username,
            password: this.loginForm.password
          }
          this.$store.dispatch('user/login', loginForm).then((path) => {
            getUserMenuExtInfo().then(res => {
              const menuList = res.data
              if (menuList && menuList.length > 0) {
                localStorage.setItem('isRouter_AOP', JSON.stringify(menuList))
                this.$router.push({ path: path })
                // this.isEmailLogin = true
                // this.loginFormEmail.username = loginForm.username
                this.loading = false
              } else {
                this.$message.warning('The menu list is not available. Contact the administrator to assign it!')
              }
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLoginEmail() {
      this.$refs.loginFormEmail.validate(valid => {
        if (valid) {
          this.loading = true
          const loginFormEmail = {
            userName: this.loginFormEmail.username,
            emailCode: this.loginFormEmail.emailCode
          }
          this.$store.dispatch('user/emailLogin', loginFormEmail).then((path) => {
            this.$router.push({ path: path })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.plm-login{
  width: 100%;
  height: 100vh;
  overflow: auto;
}

.login-container {
    height: 100%;
    width: 100%;
   .contain-right {
     width: 100%;
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: center;
     background: url('../../assets/img/loginBg.png') center center no-repeat;
     background-size: 100% 100%;
     .title-container {
       margin-top: -110px;
       width: 80%;
       height: 45%;
       display: flex;
       justify-content: center;
       flex-direction: column;
       align-items: center;
       .title {
         margin-bottom: 20px;
         font-weight: bold;
         font-size: 3.125rem;
         color: black;
         text-align: center;
       }
       .login-content {
         width: 32%;
         border-radius: 10px;
         background-color: white;
         display: flex;
         justify-content: center;
         align-items: center;
         margin-top: 40px;
         .login-user {
           width: 100%;
           height: 100%;
           .login-form {
             position: relative;
             width: 82%;
             max-width: 100%;
             padding: 0px 15px 0;
             margin: 0 auto;
             overflow: hidden;
             margin-top: 46px;
             .el_button{
               width:100%;
               height:35px;
               font-weight:560;
               color: black;
               word-spacing: 30px;
               @media screen and (min-height: 720px)  and (max-width: 1920px ){
                 font-size:1.1rem;
                 height: 5vh;
               }
               @media screen and (min-width: 1600px ){
                 font-size:20px;
                 height: 50px;
               }
             }
           }

           .tips {
             font-size: 14px;
             color: #fff;
             margin-bottom: 10px;

             span {
               &:first-of-type {
                 margin-right: 16px;
               }
             }
           }

           .svg-container {
             padding: 6px 5px 6px 15px;
             color: $dark_gray;
             vertical-align: middle;
             width: 30px;
             display: inline-block;
           }

           .show-pwd {
             position: absolute;
             right: 10px;
             top: 7px;
             font-size: 16px;
             color: $dark_gray;
             cursor: pointer;
             user-select: none;
           }
         }
       }
       .login-forgetPassword {
         width: 32%;
         border-radius: 10px;
         background-color: white;
         display: flex;
         flex-direction: column;
         justify-content: flex-start;
         align-items: center;
         .login-emailCode {
           width: 100%;
           height: 100%;
           margin-top: 20px;
           .login-form {
             position: relative;
             width: 82%;
             max-width: 100%;
             padding: 0px 15px 0;
             margin: 0 auto;
             overflow: hidden;
             .el_button {
               width: 100%;
               height: 35px;
               font-weight: 560;
               color: white;
               word-spacing: 30px;
               @media screen and (min-height: 720px) and (max-width: 1920px) {
                 font-size: 1.1rem;
                 height: 5vh;
               }
               @media screen and (min-width: 1600px) {
                 font-size: 20px;
                 height: 50px;
               }
             }
           }
         }
       }
     }
   }
}
</style>
