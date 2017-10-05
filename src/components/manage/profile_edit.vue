<template>
  <div>
    <div style="overflow: hidden; margin-bottom: 10px;">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">
        <span>专业简介</span>
      </div>
    </div>
    <div v-if="isLoading" style="position: relative;">
      <Spin size="large" fix style="margin-top: 50px"></Spin>
    </div>
    <div v-else>
      <form id="form3" method="post" action="javascript:void(0)">
        <input v-model="profile.profileId" name="profileId" type="hidden">
        <div class="form-group">
          <label for="goals">专业建设目标：</label>
          <vue-html5-editor :content="profile.goals" :height="300" @change="updateData"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="profile.goals" type="hidden" name="goals" id="goals"></input>
        </div>
        <div class="form-group">
          <label for="program">专业训练项目：</label>
          <vue-html5-editor :content="profile.program" :height="300" @change="updateData2"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="profile.program" type="hidden" name="program" id="program"></input>
        </div>
        <div class="form-group">
          <label for="courses">专业主干课程：</label>
          <vue-html5-editor :content="profile.courses" :height="300" @change="updateData3"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="profile.courses" type="hidden" name="courses" id="courses"></input>
        </div>
        <div class="form-group">
          <label for="principle">专业负责人：</label>
          <vue-html5-editor :content="profile.principle" :height="300" @change="updateData4"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="profile.principle" type="hidden" name="principle" id="principle"></input>
        </div>
        <div style="position: relative; text-align: center">
          <iButton type="success" style="margin:0 auto" @click="submit" :loading="loading">提交</iButton>
        </div>
      </Form>
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
        profile: {
          profileId: null,
          goals: '',
          program: '',
          courses: '',
          principle: ''
        },
        isLoading: false,
        loading: false
      }
    },
    created () {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    components: {
      iButton: Button,
      Message,
      Spin
    },
    methods: {
      fetchData () {
        this.isLoading = true
        let _self = this
        this.axios.get(this.url + 'profile/getProfile', {params: {profileId: 1}}).then(response => {
          _self.profile = response.data.profile
          _self.isLoading = false
        }).catch(error => {
          console.log(error)
        })
      },
      updateData (val) {
        this.profile.goals = val
      },
      updateData2 (val) {
        this.profile.program = val
      },
      updateData3 (val) {
        this.profile.courses = val
      },
      updateData4 (val) {
        this.profile.principle = val
      },
      submit () {
        Message.config({
          top: 100
        })
        let formdata = new FormData(document.getElementById('form3'))
        if (this.profile.profileId === null) {
          this.$Message.error('error')
          return false
        }
        this.loading = true
        let that = this
        this.axios.post(this.url + 'profile/updateProfile', formdata).then(response => {
          if (response.data.msg === 'success') {
            Message.success('更改成功')
            that.loading = false
            that.fetchData()
          }
        }).catch(error => {
          Message.error(error)
        })
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
