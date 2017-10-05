<template>
  <div>
    <div style="overflow: hidden; margin-bottom: 15px">
      <div style="font-size: 25px;font-weight: 700;margin-bottom: 5px;float:left">下载文件列表</div>
      <div style="margin: 7px 0 0 15px; float: left">
        <iButton type="primary" @click="batchDelete" :disabled="selection.length > 0 ? false : true" :loading="deleteLoading" shape="circle" size="small">批量删除</iButton>
        <iButton type="primary" shape="circle" size="small" @click="uploadModal = true">文件上传</iButton>
      </div>
    </div>
    <iTable :stripe="true" size="large" :loading="loading" @on-selection-change="handleSelection"
            :data="tablesList" :columns="tablesColumns" style="font-size: 20px">
    </iTable>
    <div style="text-align: center; margin-top: 20px" v-if="!loading">
      <Page :total="total" show-total show-elevator size="small" @on-change="handlePageChange"
            :current="current" :page-size="15"></Page>
    </div>
    <Modal v-model="uploadModal" width="800px" @on-cancel="refresh">
      <p slot="header" style="color:#f60;text-align:center">
        <span>下载资料上传</span>
      </p>
      <div style="font-size: 16px">
        <Upload
          multiple
          :max-size="2000"
          type="drag"
          :action="url + 'tables/insertTables'">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>
      </div>
      <div slot="footer" style="overflow: hidden">

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
  export default {
    data () {
      return {
        tablesList: [],
        total: 1,
        current: 1,
        loading: true,
        deleteLoading: false,
        selection: [],
        url: this.url,
        uploadModal: false
      }
    },
    created () {
      this.getTables(1)
    },
    components: {
      iTable: Table,
      Page,
      iButton: Button,
      Icon,
      Modal,
      Upload
    },
    computed: {
      tablesColumns () {
        let columns = [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '文件名',
            key: 'tableFile',
            align: 'left',
            ellipsis: true
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
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
                      this.delete(params.row.tableId)
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
      getTables (value) {
        let that = this
        this.loading = true
        this.axios.get(this.url + 'tables/getTables', {params: {pageNum: value}}).then(response => {
          that.tablesList = response.data.tablesList.data
          that.total = response.data.tablesList.total
          that.loading = false
        }).catch(error => {
          console.log(error)
        })
      },
      handlePageChange (val) {
        this.current = val
        this.getTables(val)
      },
      handleSelection (selection) {
        this.selection = selection
      },
      delete (value) {
        let that = this
        this.axios.get(this.url + 'tables/deleteTables', {params: {tableId: value}}).then(response => {
          if (response.data.msg === 'success') {
            that.getTables(that.current)
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
          formData.append('tableId[]', value.tableId)
        })
        this.deleteLoading = true
        this.axios.post(this.url + 'tables/deleteTables', formData).then(response => {
          if (response.data.msg === 'success') {
            that.deleteLoading = false
            that.getTables(that.current)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      refresh () {
        this.getTables(1)
      }
    }
  }
</script>

<style scoped>

</style>
