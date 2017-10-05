<template>
  <div>
    <div style="overflow: hidden; margin-bottom: 15px">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">通知列表</div>
      <div style="margin: 7px 0 0 15px; float: left">
        <i_Button type="primary" @click="batchDelete" :disabled="selection.length > 0 ? false : true" :loading="deleteLoading" shape="circle" size="small">批量删除</i_Button>
        <i_Button type="primary" shape="circle" size="small" @click="$router.push({name: 'noticeAdd'})">添加通知</i_Button>
      </div>
    </div>

    <i_Table :stripe="true" size="large" :loading="loading" @on-selection-change="handleSelection"
             :data="noticeList" :columns="noticeColumns" style="font-size: 20px">
    </i_Table>
    <div style="text-align: center; margin-top: 20px" v-if="!loading">
      <Page :total="total" show-total show-elevator size="small" @on-change="handlePageChange"
            :current="current" :page-size="15"></Page>
    </div>
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
        loading: true,
        noticeList: [],
        total: null,
        current: 1,
        selection: [],
        deleteLoading: false
      }
    },
    created () {
      this.fetchData(1)
    },
    components: {
      i_Table: Table,
      Page,
      i_Button: Button,
      Icon
    },
    computed: {
      noticeColumns () {
        let columns = [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '通知名称',
            key: 'noticeName',
            align: 'left',
            ellipsis: true
          },
          {
            title: '时间',
            key: 'noticeTime',
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
                  on: {
                    click: () => {
                      this.showData(params.row.noticeId)
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
                h(Poptip, {
                  props: {
                    confirm: true,
                    title: '确定要删除吗？',
                    placement: 'top-end',
                    transfer: true
                  },
                  on: {
                    ok: () => { // 修改poptip.vue的源码，将on-ok事件改为ok，否则无法触发确认事件
                      this.remove(params.row.noticeId)
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
      fetchData (val) {
        this.loading = true
        let that = this
        this.axios.get(this.url + 'notice/getNotice', {params: {pageNum: val}}).then(response => {
          let data = response.data.noticeList
          that.noticeList = data.data
          that.total = data.total
          that.loading = false
        }).catch(error => {
          console.log(error)
        })
      },
      handlePageChange (val) {
        this.current = val
        this.fetchData(val)
      },
      showData (val) {
        this.$router.push({name: 'noticeEdit', params: {noticeId: val}})
      },
      remove (val) {
        this.deleteLoading = true
        let that = this
        this.axios.get(this.url + 'notice/deleteNotice', {params: {noticeId: val}}).then(response => {
          if (response.data.msg === '删除成功') {
            that.loading = true
            that.deleteLoading = false
            that.fetchData(that.current)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      handleSelection (selection) {
        this.selection = selection
      },
      batchDelete () {
        let formdata = new FormData()
        let selection = this.selection
        selection.forEach(function (value, index, array) {
          formdata.append('noticeId[]', value.noticeId)
        })
        this.axios.post(this.url + 'notice/deleteNotice', formdata).then(response => {
          if (response.data.msg === '删除成功') {
            this.loading = true
            this.fetchData(this.current)
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
