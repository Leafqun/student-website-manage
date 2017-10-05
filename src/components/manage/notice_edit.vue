<template>
  <div style="position: relative">
    <div style="overflow: hidden; margin-bottom: 10px;">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">
        <span v-if="isEdit">通知编辑</span>
        <span v-else>通知添加</span>
      </div>
      <div style="float: right; margin:5px 0 0 0">
        <router-link to="/manage/notice"><i class="iconfont icon-back" aria-hidden="true"></i></router-link>
      </div>
    </div>
    <div v-if="isLoading" style="position: relative;">
      <Spin size="large" fix style="margin-top: 50px"></Spin>
    </div>
    <div v-else>
      <form id="form" method="post" enctype="multipart/form-data">
        <input type="hidden" name="noticeId" v-model="notice.noticeId">
        <input type="hidden" name="file" v-model="notice.file">
        <div class="form-group">
          <label for="noticeName">通知名称:</label>
          <input type="text" class="form-control" id="noticeName" name="noticeName"
                 v-model="notice.noticeName">
        </div>
        <div class="form-group">
          <label>通知内容:</label>
          <vue-html5-editor :content="notice.content" :height="500" @change="updateData"></vue-html5-editor>
          <input type="hidden" name="content" v-model="notice.content">
        </div>
        <div class="form-group">
          <label>
            通知文件:
            <span v-if="notice.file">{{notice.file}}</span>
            <span v-else> 无</span>
          </label>
        </div>
        <div>
          <iButton type="primary" @click="upload">上传文件</iButton>
          <span style="font-size: 15px;font-weight: 500">{{uploadFile}}</span>
          <input id="hiddenFile" type="file" name="cfile" @change="fileChange" style="display: none"/>
        </div>
        <div style="position: relative; text-align: center">
          <iButton type="success" style="margin:0 auto" @click="bt_submit" :loading="loading">提交</iButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import Button from 'iview/src/components/button'
  import Message from 'iview/src/components/message'
  import Spin from 'iview/src/components/spin'
  export default {
    data () {
      return {
        notice: {
          noticeId: null,
          noticeName: '',
          content: '',
          file: null,
          noticeTime: null
        },
        uploadFile: '',
        loading: false,
        isLoading: false
      }
    },
    created () {
      this.fetchData()
    },
    components: {
      iButton: Button,
      Message,
      Spin
    },
    computed: {
      isEdit () {
        let reg = new RegExp('^[0-9]*$')
        if (reg.test(this.$route.params.noticeId)) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      fetchData () {
        if (this.isEdit) {
          this.isLoading = true
          let that = this
          this.axios.get(this.url + 'notice/getNoticeContent', {params: {noticeId: this.$route.params.noticeId}}).then(response => {
            that.notice = response.data.notice
            that.isLoading = false
          }).catch(error => {
            console.log(error)
          })
        }
      },
      bt_submit () {
        this.loading = true
        let that = this
        let formdata1 = new FormData(document.getElementById('form'))
        if (this.notice.noticeName === '' || this.notice.content === '') {
          Message.error('请输入通知名称和内容')
          this.loading = false
          return false
        }
        this.axios.post(this.url + 'notice/submitNotice', formdata1).then(response => {
          if (response.data.msg === '更改成功') {
            that.$router.push({name: 'notice'})
          }
          if (response.data.msg === '添加成功') {
            that.$router.push({name: 'notice'})
          }
          that.loading = false
        }).catch(error => {
          console.log(error)
        })
      },
      updateData (val) {
        this.notice.content = val
      },
      upload () {
        document.getElementById('hiddenFile').click()
      },
      fileChange (e) {
        let filename = e.target.value
        this.uploadFile = filename.substring(filename.lastIndexOf('\\') + 1)
      }
    }
  }
</script>

<style scoped>
  .form-group {
    margin-bottom: 15px;
  }
  label{
    margin-bottom: 5px;
    font-weight: 700;
    font-family: Source Sans Pro,sans-serif;
    font-size: 15px;
    color: #676a6d;
  }
  .form-control{
    width: 100%;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
    border-radius: 2px;
    background-color: #fcfcfc;
    height: 34px;
    padding: 6px 12px;
    border: 1px solid #ccc;
  }
  a:hover {
    color: #d90a81
  }
</style>
