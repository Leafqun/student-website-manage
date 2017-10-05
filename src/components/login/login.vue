<template>
  <div class="all" :style="{minHeight: clientHeight + 'px'}">
    <div class="login">
      <div class="login_logo"><img :src="require('./img/logo.png')"/></div>
      <div class="login_border">
        <i_Form ref="form" :model="form" :rules="rule" class="login_form">
          <FormItem prop="userName" style="margin-bottom: 35px;">
            <i_Input type="text" v-model="form.userName" placeholder="Username" :style="isWhatError === 'user' ? borderC : ''">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i_Input>
          </FormItem>
          <FormItem prop="userPwd" style="margin-bottom: 35px;">
            <i_Input type="password" v-model="form.userPwd" placeholder="Password" :style="isWhatError === 'pwd' ? borderC : ''">
              <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </i_Input>
          </FormItem>
          <FormItem>
            <i_Button type="primary" @click.once="handleSubmit('form')" style="width:100%">登录</i_Button>
          </FormItem>
          <div style="text-align: center; color: red">{{error}}</div>
        </i_Form>
      </div>
    </div>
  </div>
</template>

<script>
  import Form from 'iview/src/components/form'
  import Input from 'iview/src/components/input'
  import Button from 'iview/src/components/button'
  import Icon from 'iview/src/components/icon'
  export default {
    data () {
      return {
        clientHeight: document.documentElement.clientHeight,
        form: {
          userName: '',
          userPwd: ''
        },
        rule: {
          userName: [
            { required: true, message: '请填写用户名', trigger: 'submit' }
          ],
          userPwd: [
            { required: true, message: '请填写密码', trigger: 'blur' },
            { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'submit' }
          ]
        },
        error: '',
        isWhatError: ''
      }
    },
    mounted () {
      const that = this
      window.onresize = () => {
        return (() => {
          that.clientHeight = document.documentElement.clientHeight
        })()
      }
    },
    watch: {
      clientHeight (val) {
        if (!this.timer) {
          this.clientHeight = val
          this.timer = true
          let that = this
          setTimeout(function () {
            // that.screenWidth = that.$store.state.canvasWidth
            that.timer = false
          }, 400)
        }
      }
    },
    computed: {
      borderC () {
        return {border: '1px solid #ed3f14', borderRadius: '5px'}
      }
    },
    components: {
      i_Form: Form,
      FormItem: Form.Item,
      i_Input: Input,
      i_Button: Button,
      Icon
    },
    methods: {
      handleSubmit (name) {
        let that = this
        console.log(this.$refs[name])
        this.$refs[name].validate((valid) => {
          if (valid) {
            that.axios.post(this.url + 'login', this.form).then(response => {
              if (response.data.msg === 'success') {
                that.$store.dispatch('login')
                window.sessionStorage.setItem('isLogin', 'login')
                let url = that.$route.query.redirect
                if (url) that.$router.push({path: url})
                else that.$router.push({path: '/manage'})
              } else {
                that.error = response.data.msg
                if (that.error === '用户名不存在') {
                  that.isWhatError = 'user'
                } else {
                  that.isWhatError = 'pwd'
                }
              }
            }).catch(error => {
              console.log(error)
            })
          } else {
            that.isWhatError = ''
            that.error = ''
          }
        })
      }
    }
  }
</script>

<style scoped>
  .all{
    background: url(./img/login_bgx.gif);
  }
  .login{
    max-width: 405px;
    position: relative;
    margin: 0 auto;
    padding-top:10%;
  }
  .login_logo{
    text-align: center;
    height:50px;
    margin-bottom:25px;
  }
  .login_border{ background: url(./img/login_m_bg.png) no-repeat; overflow:hidden; height:400px; }
  .login_form {
    padding:50px 47px 20px 47px ;
  }
</style>
