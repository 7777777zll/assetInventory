<template>
  <div class="errInfo">
    <img src="../assets/404.png"/>
    <div class="text">
      <p>网络竟然崩溃了</p>
      <p>别紧张,试试看刷新页面~</p>
    </div>
    
    <p class="warning" @click="refresh">Try Again</p>
  </div>
</template>



<script>
  export default {
    data() {
      return {
      }
    },
    methods: {
      refresh: function () {
          window.location.reload();
      }
    }
  }
</script>


<style lang="scss">
  .errInfo{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: #eef3fa;
    height:100%;
  }
  .text{
    padding-top:20px;
    text-align:center;
    font-size:18px;
  }
  .warning{
    padding:2rem 0;
    font-size:20px;
    color: #05a164;
    font-weight: bold;
  }
</style>