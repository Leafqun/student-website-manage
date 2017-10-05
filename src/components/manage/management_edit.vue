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
      <form id="form5" method="post" action="javascript:void(0)">
        <input v-model="management.mId" name="mId" type="hidden">
        <div class="form-group">
          <label for="handbooks">学生手册：</label>
          <vue-html5-editor :content="management.handbooks?management.handbooks:''" :height="300" @change="updateData"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="management.handbooks" type="hidden" name="handbooks" id="handbooks"></input>
        </div>
        <div class="form-group">
          <label for="processes">办事流程：</label>
          <vue-html5-editor :content="management.processes?management.processes:''" :height="300" @change="updateData2"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="management.processes" type="hidden" name="processes" id="processes"></input>
        </div>
        <div class="form-group">
          <label for="requirements">毕业要求：</label>
          <vue-html5-editor :content="management.requirements?management.requirements:''" :height="300"
                            @change="updateData3" :auto-height="false"></vue-html5-editor>
          <input v-model="management.requirements" type="hidden" name="requirements" id="requirements"></input>
        </div>
        <div class="form-group">
          <label for="gpc">绩点计算：</label>
          <vue-html5-editor :content="management.gpc?management.gpc:''" :height="300" @change="updateData4"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="management.gpc" type="hidden" name="gpc" id="gpc"></input>
        </div>
        <div class="form-group">
          <label for="tips">学籍类申请温馨提醒：</label>
          <vue-html5-editor :content="management.tips?management.tips:''" :height="300" @change="updateData5"
                            :auto-height="false"></vue-html5-editor>
          <input v-model="management.tips" type="hidden" name="tips" id="tips"></input>
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
        management: {
          mId: null,
          handbooks: '',
          processes: '',
          requirements: '',
          gpc: '',
          tips: ''
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
        this.axios.get(this.url + 'management/getManagement', {params: {mId: 1}}).then(response => {
          _self.management = response.data.management
          _self.isLoading = false
        }).catch(error => {
          console.log(error)
        })
      },
      updateData (val) {
        this.management.handbooks = val
      },
      updateData2 (val) {
        this.management.processes = val
      },
      updateData3 (val) {
        this.management.requirements = val
      },
      updateData4 (val) {
        this.management.gpc = val
      },
      updateData5 (val) {
        this.management.tips = val
      },
      submit () {
        Message.config({
          top: 100
        })
        let formdata = new FormData(document.getElementById('form5'))
        if (this.management.mId === null) {
          Message.error('error')
          return false
        }
        this.loading = true
        let that = this
        this.axios.post(this.url + 'management/updateManagement', formdata).then(response => {
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
