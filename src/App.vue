<template>
  <transition name="router-fade" mode="out-in">
    <router-view
      class="view"
      keep-alive>
    </router-view>
  </transition>
</template>

<script>
  export default {
    data () { 
　　　　return { 
 　　　　　　
 　　　　} 
 　　}, 
    mounted: function () {
      window.onNewLabel=function(msg){
        console.log('rfid信息'+msg)
      }
      window.barcodeNotify=function(msg){
        console.log('条码信息'+msg)
      }
    },
    components: {},
  }
</script>

<style lang="scss">
  @import "./style/style.scss";
</style>
