<template>
  <div class="tash_wrap">
    <div class="search_box">
      <div class="search_cnt">
        <span class="search_icon"></span>
        <input type="text" class="search_ipt" placeholder="输入科室名称, 搜索任务" @keyup.13="TaskList" v-model="params.term">
      </div>
      <span class="btn_text" @click="TaskList">搜索</span>
    </div>
    <div class="task_status_wrap">
      <ul class="task_status_switch">
        <li class="task_status_switch_cell" v-for="(item,index) in tabs" :class="{itemChoosed:index == num}" @click="tab(index)">{{item}}</li>
      </ul>
    </div>
    <div class="mescroll" id="mescroll">
      <div id="dataList" class="data-list"> 
        <div class="task_list" v-for='(itemCon,index) in pdlist'>
          <div class="task_list_cell" @click="toDeatil(itemCon)">
            <p class="task_list_cell_title">{{itemCon.name}}</p>
            <div class="cell_show">
              <img src="../assets/time.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点时间: {{itemCon.inventoryDateFrom}} - {{itemCon.inventoryDateTo}}</span>
            </div>
            <div class="cell_show">
              <img src="../assets/class.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点类别: {{itemCon.category==null? '--':itemCon.category}}</span>
            </div>
            <div class="cell_show">
              <img src="../assets/department.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点科室: {{itemCon.department==null? '--':itemCon.department.departmentName}}</span>
            </div>
            <div class="cell_show">
              <img src="../assets/address.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点地点: {{itemCon.location==null? '--':itemCon.location.location}}</span>
            </div>
            <div class="check_result">
              <span class="num">已盘: <span class="blue">{{itemCon.part}}</span></span>
              <span class="num">未盘: <span class="red">{{itemCon.wait}}</span></span>
            </div>
            <div class="task_status_text" v-show="itemCon.status!='draft'">{{itemCon.status=="processing"?'进行中':'已结束'}}</div>
            <div class="task_status_text_red" v-show="itemCon.status=='draft'">未开始</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Task } from '../config/api'
  import MeScroll from 'mescroll.js'
  export default {
    data() {
      return {
        mescroll: null,
        tabs: ["未结束","已结束"],
        num:0,
        tabContents:[1,2],
        status:'nf',
        pdlist: [],
        params:{
          status:'nf',
          page:0,
          sort:'inventoryDateFrom,desc',
          term:'',
        },
    }
  },
   mounted: function () {
    var $this=this
      if(this.global.taskTab!=0){
        this.num=this.global.taskTab
        if(this.num==0){
          this.params.status='nf'
        }
        else{
          this.params.status='fn'
        }
      }
      // 滚动位置监听
      var mescroll =document.getElementsByClassName('mescroll')[0]
      setTimeout(() => {
         mescroll.scrollTop=$this.global.position
      }, 200)
      mescroll.addEventListener('scroll',this.scrollPos,false)

      this.synData();
      this.TaskList();
    },
    methods: {
      synData: function(index) {
        Task.synclists().then((response) => {
          console.log(response)
        })   
        Task.synctask().then((response) => {
          console.log(response)
        }) 
      },
      tab: function(index) {
        this.num = index;
        if(index==0){
          this.params.status='nf'
        }
        else{
          this.params.status='fn'
        }
        this.TaskList();
      },
      toDeatil: function(item){
        this.global.taskTab=this.num
        this.$router.push({path:'/taskDetail/'+item.id})
      },
      scrollPos:function(){
        var mescroll =document.getElementsByClassName('mescroll')[0]
        this.global.position=mescroll.scrollTop
      },
      TaskList:function(){
        this.pdlist.length=0
          if(this.mescroll){
             this.mescroll.destroy();
             this.mescroll.removeEmpty();
          }
          var self = this;
          // 上拉加载
          this.mescroll = new MeScroll("mescroll", { //第一个参数"mescroll"对应上面布局结构div的id
            up: {
                  callback: self.upCallback, //上拉回调
                  empty:{ 
                    warpId:"dataList",
                    //icon : "../res/img/mescroll-empty.png" , 
                    tip : "亲,暂无相关数据哦~" , 
                  }
                }
          })
          document.getElementById("dataList").style.display="block";
      },
      //上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数
      upCallback:function(page){
        var pageIndex = page.num-1;
        //联网加载数据
        var self = this;
        this.getListDataFromNet(pageIndex, page.size, function(curPageData,totalSize) { 
          //如果是第一页需手动制空列表
          if(pageIndex == 0) self.pdlist = []; 
          // 改变日期格式
          curPageData.forEach((item) =>{
            if(item.inventoryDateFrom!=null&&item.inventoryDateFrom!=''){
              var start=item.inventoryDateFrom.split('-');
              item.inventoryDateFrom=start[1]+'月'+start[2]+'日'
            }
            if(item.inventoryDateTo!=null&&item.inventoryDateTo!=''){
               var stop=item.inventoryDateTo.split('-');
               item.inventoryDateTo=stop[1]+'月'+stop[2]+'日'
            }
          })  
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData); 
          for(var i=pageIndex*page.size;i<self.pdlist.length;i++){
            if(i==totalSize) break;
          }
          self.mescroll.endSuccess(curPageData.length);
          //self.mescroll.endBySize(curPageData.length, totalSize); 
        }, function() {
          console.log('联网失败')
          self.mescroll.endErr();
        });
      },
      getListDataFromNet:function(pageNum,pageSize,successCallback,errorCallback) {
        this.params.page=pageNum
        Task.TaskList({params: this.params})
          .then((response) => {
            var data=response.content;
            var total=response.totalElements;
              successCallback&&successCallback(data,total);//成功回调  
              }, (response) => {
              console.log('fail')
            })   
        },
    }
  }
</script>
<style lang='scss'>
@import "../style/mescroll.min.css";
</style>