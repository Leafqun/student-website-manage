<template>
  <div>
    <div style="overflow: hidden; margin-bottom: 10px;">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">
        <span>专业教师简介</span>
      </div>
    </div>
    <div v-if="isLoading" style="position: relative;">
      <Spin size="large" fix style="margin-top: 50px"></Spin>
    </div>
    <div v-else>
      <form id="form4" method="post" action="javascript:void(0)">
        <input v-model="faculty.facultyId" name="facultyId" type="hidden">
        <div class="form-group">
          <label for="teachers">专业教师名单：</label>
          <vue-html5-editor :content="faculty.teachers?faculty.teachers:''" :height="300" @change="updateData"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="faculty.teachers" type="hidden" name="teachers" id="teachers"></input>
        </div>
        <div class="form-group">
          <label for="projects">教师科研项目：</label>
          <vue-html5-editor :content="faculty.projects?faculty.projects:''" :height="300" @change="updateData2"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="faculty.projects" type="hidden" name="projects" id="projects"></input>
        </div>
        <div class="form-group">
          <label for="papers">教师研究论文：</label>
          <vue-html5-editor :content="faculty.papers?faculty.papers:''" :height="300" @change="updateData3"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="faculty.papers" type="hidden" name="papers" id="papers"></input>
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
        faculty: {
          facultyId: 1,
          teachers: '',
          projects: '',
          papers: ''
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
        this.axios.get(this.url + 'faculty/getFaculty', {params: {facultyId: 1}}).then(response => {
          _self.faculty = response.data.faculty
          _self.isLoading = false
        }).catch(error => {
          console.log(error)
        })
      },
      updateData (val) {
        this.faculty.teachers = val
      },
      updateData2 (val) {
        this.faculty.projects = val
      },
      updateData3 (val) {
        this.faculty.papers = val
      },
      submit () {
        Message.config({
          top: 100
        })
        let formdata = new FormData(document.getElementById('form4'))
        if (this.faculty.facultyId === null) {
          this.$Message.error('error')
          return false
        }
        this.loading = true
        let that = this
        this.axios.post(this.url + 'faculty/updateFaculty', formdata).then(response => {
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
