<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">每餐美食</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <!--手机号登陆-->
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!rightPhone"
                      class="get_verification"
                      :class="{right_phone:rightPhone}"
                      @click.prevent="getCode"
              >{{computeTime>0?`已发送(${computeTime}s)`:'获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册每餐美食帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <!--密码登陆-->
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密码" v-model="pwd" v-if="showPassword">
                <input type="password" maxlength="8" placeholder="密码" v-model="pwd" v-if="!showPassword">
                <div class="switch_button " :class="showPassword?'on':'off'" @click="showPassword=!showPassword">
                  <div class="switch_circle" :class="{right:showPassword}"></div>
                  <span class="switch_text">{{showPassword?'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:7321/captcha" alt="captcha"
                     @click="getCaptcha" ref="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip :alertText="alertText" v-show="showAlert" @closeTip="closeTip"/>
  </section>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip'
  import {reqSendCode,reqSmsLogin,reqPwdLogin} from '../../api'


    export default {
        data(){
          return {
            loginWay:true,  //true手机号登陆，false密码登陆
            phone:' ',
            computeTime:0,
            pwd:'',
            showPassword:false,
            code:'',
            name:'',
            captcha:'',
            alertText:'',
            showAlert:false
          }
        },
        computed:{
          rightPhone(){
            return /^1\d{10}$/.test(this.phone)
          }
        },
        methods:{
          async getCode(){
            if(this.computeTime===0){
              clearInterval(this.intervalId)
              this.computeTime=60
              this.intervalId = setInterval(()=>{
                this.computeTime--
              },1000)
            }

            //ajax请求
            const result = await reqSendCode(this.phone)
            if(result.code===1){
              ifshowAlert('验证码获取失败')
              if(this.computeTime){
                this.computeTime=0
                clearInterval(this.intervalId)
              }
            }

          },

          closeTip(){
            this.showAlert=false
            this.alertText=''
          },
          getCaptcha(){
            this.$refs.captcha.src="http://localhost:7321/captcha?time="+Date.now()
          },
          ifshowAlert(alertText) {
            this.showAlert = true
            this.alertText = alertText
          },

          async login(){
            let result
            if(this.loginWay){
              if(!this.rightPhone) {
                this.ifshowAlert('手机号不正确')
                return
              } else if(!/^\d{6}$/.test(this.code)) {
                this.ifshowAlert('验证必须是6位数字')
                return
              }
              result = await reqSmsLogin(this.phone,this.code)
            }else{
              const {name,pwd,captcha} = this
              if(!name) {
                this.ifshowAlert('用户名必须指定')
                return
              } else if(!pwd) {
                this.ifshowAlert('密码必须指定')
                return
              } else if(!captcha) {
                this.ifshowAlert('验证码必须指定')
                return
              }
              result = await reqPwdLogin({name,pwd,captcha})
            }

            if(result.code===0){
              //存user信息
              this.userInfo = result.data
              this.$store.dispatch('recordUserInfo',this.userInfo)
              this.$router.replace('/profile')
            }else{
              //更新失败信息，显示弹框
              if(this.loginWay){
                this.getCaptcha()
              }
              this.ifshowAlert(result.msg)
            }
          }

        },
        components:{
          AlertTip
        }
      }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #1c7aff
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #1c7aff
              font-weight 700
              border-bottom 2px solid #1c7aff
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #1c7aff
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color:black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #1c7aff
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)

            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #1c7aff
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #1c7af7
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
