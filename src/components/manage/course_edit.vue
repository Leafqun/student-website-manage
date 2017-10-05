<template>
  <div>
    <div style="overflow: hidden; margin-bottom: 10px;">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">
        <span v-if="isEdit">课程编辑</span>
        <span v-else>课程添加</span>
      </div>
      <div style="float: right; margin:5px 0 0 0">
        <router-link to="/manage/course"><i class="iconfont icon-back" aria-hidden="true"></i></router-link>
      </div>
    </div>
    <div v-if="isLoading" style="position: relative;">
      <Spin size="large" fix style="margin-top: 50px"></Spin>
    </div>
    <div v-else>
      <form id="form2" method="post">
        <input type="hidden" name="courseId" v-model="course.courseId">
        <div class="form-group">
          <label for="courseName">课程名称:</label>
          <input type="text" class="form-control" id="courseName" name="courseName"
                 v-model="course.courseName">
        </div>
        <div class="form-group">
          <label for="enName">课程英文名称:</label>
          <input type="text" class="form-control" id="enName" name="enName"
                 v-model="course.enName">
        </div>
        <div class="form-group">
          <label>课程大纲:</label>
          <vue-html5-editor :content="course.courseSchedule" :height="500" @change="updateData"></vue-html5-editor>
          <input type="hidden" name="courseSchedule" v-model="course.courseSchedule">
        </div>
        <div class="form-group">
          <label>课程安排:</label>
          <vue-html5-editor :content="course.courseArr" :height="500" @change="updateData2"></vue-html5-editor>
          <input type="hidden" name="courseArr" v-model="course.courseArr">
        </div>
        <div style="position: relative; text-align: center">
          <iButton type="success" style="margin:0 auto" @click="submit" :loading="loading">提交</iButton>
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
        course: {
          courseId: null,
          courseName: '',
          enName: '',
          courseArr: '',
          courseSchedule: ''
        },
        loading: false,
        isLoading: false
      }
    },
    created () {
      this.getCourse()
    },
    components: {
      iButton: Button,
      Message,
      Spin
    },
    computed: {
      isEdit () {
        let reg = new RegExp('^[0-9]*$')
        if (reg.test(this.$route.params.courseId)) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      getCourse () {
        if (this.isEdit) {
          this.isLoading = true
          let that = this
          this.axios.get(this.url + 'course/getCourse', {params: {courseId: this.$route.params.courseId}}).then(response => {
            that.course = response.data.course
            that.isLoading = false
          }).catch(error => {
            console.log(error)
          })
        }
      },
      updateData (value) {
        this.course.courseSchedule = value
      },
      updateData2 (value) {
        this.course.courseArr = value
      },
      submit () {
        let that = this
        let formdata = new FormData(document.getElementById('form2'))
        if (this.course.courseName === '' || this.course.enName === '') {
          Message.error('课程名不能为空')
          return false
        }
        this.loading = true
        this.axios.post(this.url + 'course/submitCourse', formdata).then(response => {
          this.loading = false
          that.$router.push({name: 'course'})
        }).catch(error => {
          console.log(error)
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
