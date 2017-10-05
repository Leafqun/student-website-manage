<template>
  <div>
    <div style="overflow: hidden; margin-bottom: 15px">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">课程列表</div>
      <div style="margin: 7px 0 0 15px; float: left">
        <iButton type="primary" shape="circle" size="small" @click="$router.push({name: 'courseAdd'})">添加课程</iButton>
      </div>
    </div>
    <iTable :stripe="true" size="large" :loading="loading"
             :data="courseList" :columns="courseColumns" style="font-size: 20px">
    </iTable>
  </div>
</template>

<script>
  import Table from 'iview/src/components/table'
  import Page from 'iview/src/components/page'
  import Button from 'iview/src/components/button'
  import Icon from 'iview/src/components/icon'
  import Poptip from 'iview/src/components/poptip'
  export default {
    data () {
      return {
        courseList: [],
        loading: true
      }
    },
    created () {
      this.getCourseList()
    },
    components: {
      iTable: Table,
      Page,
      iButton: Button,
      Icon
    },
    computed: {
      courseColumns () {
        let columns = [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '课程中文名',
            key: 'courseName',
            align: 'left',
            ellipsis: true
          },
          {
            title: '课程英文名',
            key: 'enName',
            align: 'left',
            ellipsis: true
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(Button, {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.editCourse(params.row.courseId)
                    }
                  }
                }, [
                  h(Icon, {
                    props: {
                      type: 'edit',
                      size: '17'
                    }
                  })
                ]),
                h(Button, {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.editCourseFile(params.row.courseId)
                    }
                  }
                }, [
                  h(Icon, {
                    props: {
                      type: 'ios-folder',
                      size: '17'
                    }
                  })
                ]),
                h(Poptip, {
                  props: {
                    confirm: true,
                    title: '确定要删除吗？',
                    placement: 'top-end',
                    transfer: true
                  },
                  on: {
                    ok: () => { // 修改poptip.vue的源码，将on-ok事件改为ok，否则无法触发确认事件
                      this.delete(params.row.courseId)
                    }
                  }
                }, [
                  h(Button, {
                    props: {
                      type: 'text',
                      size: 'small'
                    }
                  }, [
                    h(Icon, {
                      props: {
                        type: 'trash-a',
                        size: '20'
                      }
                    })
                  ])
                ])
              ])
            }
          }
        ]
        return columns
      }
    },
    methods: {
      getCourseList () {
        this.loading = true
        let that = this
        this.axios.get(this.url + 'course/getCourseList').then(response => {
          that.courseList = response.data.courseList
          that.loading = false
        }).catch(error => {
          console.log(error)
        })
      },
      editCourse (value) {
        this.$router.push({name: 'courseEdit', params: {courseId: value}})
      },
      editCourseFile (value) {
        this.$router.push({name: 'courseFile', params: {courseId: value}})
      },
      delete (value) {
        let that = this
        this.axios.get(this.url + 'course/deleteCourse', {params: {courseId: value}}).then(function (response) {
          if (response.data.msg === 'success') {
            that.getCourseList()
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped>

</style>
