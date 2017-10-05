<template>
  <div class="layout">
    <Row type="flex">
      <transition name="fade">
        <i_Col :span="spanLeft" class="layout-menu-left" :style="{minHeight: clientHeight + 'px'}" v-if="isShow">
          <i_Menu theme="dark" width="auto" :active-name="active" class="text" @on-select="handleSelect">
            <div class="layout-logo-left"></div>
            <i_MenuItem name="notice">
              <Icon type="ios-navigate"></Icon>
              <span>通知管理</span>
            </i_MenuItem>
            <i_MenuItem name="message">
              <Icon type="ios-keypad"></Icon>
              <span>留言管理</span>
            </i_MenuItem>
            <i_MenuItem name="download">
              <Icon type="ios-download"></Icon>
              <span>下载文件管理</span>
            </i_MenuItem>
            <i_MenuItem name="course">
              <Icon type="erlenmeyer-flask"></Icon>
              <span>课程管理</span>
            </i_MenuItem>
            <i_MenuItem name="profile">
              <Icon type="android-clipboard"></Icon>
              <span>专业简介</span>
            </i_MenuItem>
            <i_MenuItem name="faculty">
              <Icon type="person-stalker"></Icon>
              <span>专业教师简介</span>
            </i_MenuItem>
            <i_MenuItem name="management">
              <Icon type="calculator"></Icon>
              <span>管理制度</span>
            </i_MenuItem>
          </i_Menu>
        </i_Col>
      </transition>
      <i_Col :span="spanRight" :style="{minHeight: clientHeight + 'px'}">
        <div class="layout-header">
          <i_Button type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </i_Button>
          <div style="float: right; margin-top: 10px; margin-right: 10px;">
            <Tooltip content="注销" placement="bottom" :delay="1200">
              <i_Button type="text" @click="logout">
                <Icon type="log-out" size="28"></Icon>
              </i_Button>
            </Tooltip>
          </div>
        </div>
        <div class="layout-breadcrumb">

        </div>
        <div class="layout-content">
          <div class="layout-content-main">
            <div style="margin:10px 20px 30px 20px">
              <router-view></router-view>
            </div>
          </div>
        </div>
        <div class="layout-copy">
          2011-2016 &copy; TalkingData
        </div>
      </i_Col>
    </Row>
  </div>
</template>

<script>
  import {Row, Col} from 'iview/src/components/grid'
  import Menu from 'iview/src/components/menu'
  import Icon from 'iview/src/components/icon'
  import Button from 'iview/src/components/button'
  import Tooltip from 'iview/src/components/tooltip'
  import Modal from 'iview/src/components/modal'

  export default {
    data () {
      return {
        spanLeft: 4,
        spanRight: 20,
        isShow: true,
        clientHeight: document.documentElement.clientHeight
      }
    },
    components: {
      Row,
      i_Col: Col,
      i_Menu: Menu,
      i_MenuItem: Menu.Item,
      Icon,
      i_Button: Button,
      Tooltip,
      Modal
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
      active () {
        let path = this.$route.path
        let temp = path.substring(path.indexOf('/') + 1)
        return temp.substring(0, temp.indexOf('/') + 1)
      }
    },
    methods: {
      toggleClick () {
        this.isShow = !this.isShow
        if (this.isShow) {
          this.spanLeft = 4
          this.spanRight = 20
        } else {
          this.spanRight = 24
        }
      },
      logout () {
        Modal.confirm({
          title: '',
          content: '<p>确定要注销吗？</p>',
          onOk: () => {
            this.$store.dispatch('logout')
            window.sessionStorage.setItem('isLogin', 'logout')
            this.$router.push({path: '/login'})
          }
        })
      },
      handleSelect (name) {
        this.$router.push({name: name})
      }
    }
  }
</script>

<style scoped>
  .layout {
    background: #f5f7f9;
    position: relative;
  }

  .layout-breadcrumb {
    padding: 10px 20px 0;
  }

  .layout-content {
    min-height: 200px;
    margin: 20px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  .layout-menu-left {
    background: #464c5b;
  }

  .layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap
  }

  .fade-enter-active {
    transition: width .5s
  }

  .fade-leave-active {
    transition: width .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */
  {
    width: 0
  }
</style>
