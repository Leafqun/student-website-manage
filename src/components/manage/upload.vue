<template>
  <div>
    <a class="link" @click.native="test">1111</a>
    <a class="link" @click.native="test">2222</a>
    <a class="link" @click.native="test">333</a>

    <button @test='shout'>点击我触发a的单击事件</button>"upload"/>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        file: ''
      }
    },
    methods: {
      test: function () {
        console.log(1)
        this.$emit('test')// 把a标签的点击事件分发
      },
      shout: function () {
        console.log('我触发了它')
      }
    }
  }
</script>

<style scoped>

</style>
