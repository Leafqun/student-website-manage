<template>
  <div>
    <div style="overflow: hidden; margin-bottom: 15px">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">留言列表</div>
      <div style="margin: 7px 0 0 15px; float: left">
        <iButton type="primary" @click="batchDelete" :disabled="selection.length > 0 ? false : true" :loading="deleteLoading" shape="circle" size="small">批量删除</iButton>
      </div>
    </div>
    <iTable :stripe="true" size="large" :loading="loading" @on-selection-change="handleSelection"
             :data="messageList" :columns="messageColumns" style="font-size: 20px">
    </iTable>
    <div style="text-align: center; margin-top: 20px" v-if="!loading">
      <Page :total="total" show-total show-elevator size="small" @on-change="handlePageChange"
            :current="current" :page-size="15"></Page>
    </div>
    <Modal v-model="messageModal" width="800px">
      <p slot="header" style="color:#f60;text-align:center">
        <span>留言内容</span>
      </p>
      <div style="font-size: 16px" v-if="!messageLoading">
        <p v-html="message.content"></p>
      </div>
      <div slot="footer" style="overflow: hidden" v-if="!messageLoading">
        <p style="float: right;margin-left:10px;">{{message.stuName}}</p>
        <p style="float: right;margin-left:10px;">{{message.email}}</p>
        <p style="float: right">{{message.mTime}}</p>
      </div>
      <Spin size="large" fix  v-if="messageLoading"></Spin>
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
  import Spin from 'iview/src/components/spin'
  export default {
    data () {
      return {
        messageList: [],
        total: 1,
        loading: true,
        current: 1,
        selection: [],
        deleteLoading: false,
        message: {
          messageId: null,
          stuName: '',
          email: '',
          content: '',
          mTime: null
        },
        messageModal: false,
        messageLoading: true
      }
    },
    created () {
      this.getMessageList(1)
    },
    components: {
      iTable: Table,
      Page,
      iButton: Button,
      Icon,
      Modal,
      Spin
    },
    computed: {
      messageColumns () {
        let columns = [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '学生姓名',
            key: 'stuName',
            align: 'left',
            ellipsis: true
          },
          {
            title: 'email',
            key: 'email'
          },
          {
            title: '时间',
            key: 'mTime',
            sortable: true
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
                  style: {
                    marginTop: '3px'
                  },
                  on: {
                    click: () => {
                      this.showMessage(params.row.messageId)
                    }
                  }
                }, [
                  h(Icon, {
                    props: {
                      type: 'ios-search-strong',
                      size: '20'
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
                      this.delete(params.row.messageId)
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
      getMessageList (val) {
        this.loading = true
        const that = this
        this.axios.get(this.url + 'message/getMessageList', {params: {pageNum: val}}).then(response => {
          let data = response.data.messageList
          that.messageList = data.data
          that.total = data.total
          that.loading = false
        }).catch(error => {
          console.log(error)
        })
      },
      handlePageChange (val) {
        this.current = val
        this.getMessageList(val)
      },
      handleSelection (selection) {
        this.selection = selection
      },
      showMessage (value) {
        let that = this
        this.messageModal = true
        this.messageLoading = true
        this.axios.get(this.url + 'message/getMessage', {params: {messageId: value}}).then(function (response) {
          that.message = response.data.message
          that.messageLoading = false
        }).catch(function (error) {
          console.log(error)
        })
      },
      delete (value) {
        let that = this
        this.axios.get(this.url + 'message/deleteMessage', {params: {messageId: value}}).then(response => {
          if (response.data.msg === 'success') {
            that.getMessageList(that.current)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      batchDelete () {
        let that = this
        let selection = this.selection
        let formData = new FormData()
        selection.forEach((value, index, array) => {
          formData.append('messageId[]', value.messageId)
        })
        this.deleteLoading = true
        this.axios.post(this.url + 'message/deleteMessage', formData).then(response => {
          if (response.data.msg === 'success') {
            that.deleteLoading = false
            that.getMessageList(that.current)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped>

</style>
