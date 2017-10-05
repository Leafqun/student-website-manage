<template>
  <div>
    <div style="overflow: hidden; margin-bottom: 15px">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">课程文件列表</div>
      <div style="margin: 7px 0 0 15px; float: left">
        <iButton type="primary" @click="batchDelete" :disabled="selection.length > 0 ? false : true"
                 :loading="deleteLoading" shape="circle" size="small">批量删除
        </iButton>
        <iButton type="primary" shape="circle" size="small" @click="uploadModal = true">上传课程文件</iButton>
      </div>
      <div style="float: right; margin:5px 0 0 0">
        <router-link to="/manage/course"><i class="iconfont icon-back" aria-hidden="true"></i></router-link>
      </div>
    </div>

    <iTable :stripe="true" size="large" :loading="loading" @on-selection-change="handleSelection"
            :data="courseFileList" :columns="courseFileColumns" style="font-size: 20px">
    </iTable>
    <Modal v-model="uploadModal" width="800px" @on-cancel="refresh">
      <p slot="header" style="color:#f60;text-align:center">
        <span>下载资料上传</span>
      </p>
      <div style="font-size: 16px">
        <dropzone id="myVueDropzone" :url="url+'course/insertCourseFile'" :maxFileSizeInMB="20" :maxNumberOfFiles="10">
          <!-- Optional parameters if any! -->
          <input type="hidden" name="ctype" v-model="choose">
          <input type="hidden" name="courseId" v-model="$route.params.courseId">
        </dropzone>
      </div>
      <div slot="footer" style="overflow: hidden">
        <RadioGroup v-model="choose">
          <Radio label="1">
            <Icon type="social-apple"></Icon>
            <span>文件</span>
          </Radio>
          <Radio label="2">
            <Icon type="social-android"></Icon>
            <span>视频</span>
          </Radio>
        </RadioGroup>
      </div>
    </Modal>
  </div>
</template>

<script>
  import Table from 'iview/src/components/table'
  import Page from 'iview/src/components/page'
  import Button from 'iview/src/components/button'
  import Icon from 'iview/src/components/icon'
  import Poptip from 'iview/src/components/poptip'
  import Modal from 'iview/src/components/modal'
  import Upload from 'iview/src/components/upload'
  import Radio from 'iview/src/components/radio'
  import Notice from 'iview/src/components/notice'
  import Dropzone from 'vue2-dropzone'
  export default {
    data () {
      return {
        loading: true,
        courseFileList: [],
        selection: [],
        deleteLoading: false,
        uploadModal: false,
        choose: 1
      }
    },
    created () {
      this.getCourseFileList()
    },
    components: {
      iTable: Table,
      Page,
      iButton: Button,
      Icon,
      Modal,
      Upload,
      Radio,
      RadioGroup: Radio.Group,
      Notice,
      Dropzone
    },
    computed: {
      courseFileColumns () {
        let columns = [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '课程文件',
            key: 'cfileName',
            align: 'left',
            ellipsis: true
          },
          {
            title: '文件类型(1文件,2视频)',
            key: 'ctype',
            filters: [
              {
                label: '课程资源',
                value: '1'
              },
              {
                label: '课程视频',
                value: '2'
              }
            ],
            filterMethod (value, row) {
              return row.ctype === parseInt(value)
            },
            align: 'center'
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h(Poptip, {
                  props: {
                    confirm: true,
                    title: '确定要删除吗？',
                    placement: 'top-end',
                    transfer: true
                  },
                  on: {
                    ok: () => { // 修改poptip.vue的源码，将on-ok事件改为ok，否则无法触发确认事件
                      this.delete(params.row.cfileId)
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
      getCourseFileList () {
        this.loading = true
        let that = this
        this.axios.get(this.url + 'course/getAllCourseFile', {params: {courseId: this.$route.params.courseId}}).then(response => {
          that.courseFileList = response.data.courseFileList
          that.loading = false
        }).catch(error => {
          console.log(error)
        })
      },
      delete (val) {
        let that = this
        this.axios.get(this.url + 'course/deleteCourseFile', {params: {cfileId: val}}).then(response => {
          if (response.data.msg === 'success') {
            that.getCourseFileList()
          }
        }).catch(error => {
          console.log(error)
        })
      },
      handleSelection (selection) {
        this.selection = selection
      },
      batchDelete () {
        let that = this
        this.deleteLoading = true
        let formdata = new FormData()
        let selection = this.selection
        selection.forEach(function (value, index, array) {
          formdata.append('cfileId[]', value.cfileId)
        })
        this.axios.post(this.url + 'course/deleteCourseFile', formdata).then(response => {
          if (response.data.msg === 'success') {
            that.deleteLoading = false
            that.getCourseFileList()
          }
        }).catch(error => {
          console.log(error)
        })
      },
      refresh () {
        this.getCourseFileList()
      }
    }
  }
</script>

<style scoped>

</style>
