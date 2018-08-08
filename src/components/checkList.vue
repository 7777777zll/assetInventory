
<template>
  <div class="check_list">
    <div class="head_has_reback">
      <div class="reback" @click="reback">
        <img src="../assets/reback.png">
        <span class="reback_text">返回</span>
      </div>
      <div class="head_right">
        <span class="search_icon" @click="findInventory"></span>
        <input type="text" class="search_ipt" v-model="params.term" placeholder="请输入资产编号或位置" @keyup.13="findInventory">
        <span class="scan_icon" @click="ewm_code"></span>
      </div>
    </div>
    <div class="check_list_wrap">
       <div class="check_status_switch_wrap">
          <ul class="check_status_switch">
            <li class="check_status_switch_cell" :class="{'itemChoosed':itemChoosedFun(index)}"  v-for="(item,index) in checkStatus" @click="ItemStatusChoose(item,index)">{{item}}</li>
          </ul>
        </div>
      <div class="choose_order">
        <div class="check_list_serach_term_icon"></div>
        <div tabindex="1" @click="sortOrder" @blur="hideDrop" >
          <input class="check_list_serach_ipt"  v-model="dropSelected" readonly unselectable="on" onfocus="this.blur()">
        </div>
        <transition name="fade">
          <div class="checkStatus_select" v-show="checkStatusIsShow">
            <div class="selectArrow"></div>
            <ul class="option_list">
              <li class="option_cell" v-for="(item,index) in dropList" v-on:click.stop="setSelectVal(item)"
              >
                <span class="option_icon option_icon_address" v-if="item === 1"></span>
                <span class="option_icon option_icon_number" v-if="item === 2"></span>
                <span class="option_text" v-if="item === 1" data='1'>位置</span>
                <span class="option_text" v-if="item === 2" data='2'>资产编号</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <div class="mescroll inventory_list_wrap" id="mescroll" v-on:click.stop="hideDelete">
        <div id="dataList" class="data-list"> 
      <p class="empty-show" v-show="listnoData">亲,暂无相关数据哦~</p>
      <div class="check_list_serach_result" v-for="(item,index) in pdlist" @touchstart="showDeleteButton(item,index)" @touchend="clearLoop">
          <div class="check_list_serach_result_wrap" @click="viewDetail(item,index)">
            <div class="out_cnt">
              <div class="check_list_serach_result_img">
                <img :src='item.assetPhoto'  @error="imgError(item)" v-show="item.assetPhoto">
                <img src="../assets/default_img.png" v-show="!item.assetPhoto">
              </div>
              <div class="check_list_serach_result_info">
                <div class="check_list_serach_result_info_cell">
                  <label class="name">资产名称: </label>
                  <span class="text">{{item.assetName==null? '--':item.assetName}}</span>
                </div>
                 <div class="check_list_serach_result_info_cell">
                  <label class="name">资产编码: </label>
                  <span class="text">{{item.assetNumber==null? '--':item.assetNumber}}</span>
                </div>
                 <div class="check_list_serach_result_info_cell">
                  <label class="name">位置: </label>
                  <span class="text">{{(item.location==null||item.location=='')? '--':item.location.location}}</span>
                </div>
              </div>
              <div class="asset_status">{{item.status}}</div>
              <div class="hidden_btn" v-show="params.status=='to be inventoried'">
                <i @click="statusChange(item,index,$event,1)">账实相符</i>
                <i @click="statusChange(item,index,$event,2)" class="loss">盘亏</i>
              </div>
              </div>

              <transition name="router-fade">
                <div class="long_click" v-show='deleteFlag==index'>
                  <span class="bg" v-on:click.stop="hideDelete"></span>
                  <span class="del" v-on:click.stop="delFunc(item.content,item,index)">删除</span>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="plus_btn" @click="assetsPlusFunc" v-show="!completedFlag">
      <img src="../assets/plus.png">
    </div>
    <div class="pda_btn" v-show="!completedFlag" @click="pdaScan">PDA</div>
    <div class="foot_cnt">
     <div class="foot_cell progress">
        <div class="percentage" id="percentage">60%</div>
        <div class="progress_wrap" id="progress_wrap">
          <div class="checked" id="checked"></div>
        </div>
      </div>
      <div class="foot_cell">
        <label class="name">未盘: </label>
        <span class="data">{{uncheck}}</span>
      </div>
      <div class="foot_cell" style="width:35%">
        <label class="name">已盘: </label>
        <span class="data">{{checked}}</span>
      </div>
      <br>
       <div class="foot_cell wid25">
        <label class="name">账实相符: </label>
        <span class="data">{{balance}}</span>
      </div>
       <div class="foot_cell">
        <label class="name">盘盈: </label>
        <span class="data">{{profit}}</span>
      </div>
       <div class="foot_cell">
        <label class="name">盘亏: </label>
        <span class="data">{{loss}}</span>
      </div>
       <div class="foot_cell wid21">
        <label class="name">有差异: </label>
        <span class="data">{{diff}}</span>
      </div>
    </div>
    <confirmTip v-if="showAlert" @closeTip="deleteConfirm" @hideConfirmTip="hideConfirmTip" :alertText="alertText"></confirmTip>
  </div>
</template>

<script>
import { Inventory,Task } from '../config/api'
import confirmTip from '../components/confirmTip' 
import MeScroll from 'mescroll.js'
export default {
  data() {
    return {
      mescroll: null,
      isEvm:false,
      listnoData:false,
      noData:true,
      checkedFlag:0,
      expansion : null, 
      checkStatus:["未盘点","账实相符","有差异","盘盈","盘亏","已盘点"],
      dropSelected:'请选择排序方式',
      checkStatusIsShow:false,
      dropList:[1,2],
      loop:'',
      isDeleting:false,
      pdlist:[],
      ewmCode:'',
      deleteFlag:-1,
      params:{
        taskId:'',
        term:'',
        sort:'',
        page:0,
        status:'to be inventoried'
      },
      paramsTask:{
        id:''
      },
      findParams:{
        taskId:'',
        search:'',
      },
      deleteParames:{
        id:'',
      },
      changeStatus:{
        status:'',
        id:''
      },
      checkFlag:[],
      showAlert: false,
      alertText: null,
      deleteCellId:'',
      rfidParames:{
        taskId:'',
        assetNumbers:'',
      },
      //状态
      uncheck:0,
      checked:0,
      balance:0,
      profit:0,
      loss:0,
      diff:0,
      intervalidEpc:null,
      intervalidEwm:null,
      completedFlag:false,
      paramsNum:{
        term:'',
        taskId:'',
      },
      statusParames:{
        inventoryAssetDifference:null,
        photo:[],
        inventoryTaskId:'',
        inventoryList:{
          id:'',
          addDate:'',
          assetId:'',
          addNote:"",
          assetName: "",
          assetNumber:"",
          listId:'',
          pdaCode:'',
          department:{
              id:'',
              departmentName:'',
              departmentNumber:'',
              company:'',
          },
          location:{
            id:'',
            location:'',
            locationNumber:'',
            company:'',
          },
          quantity:1,
          source:"",
          status:"",
        }
      },
    }
  },
  mounted: function () {
    this.global.slideParames.length=0
    this.params.taskId=this.$route.params.id
    this.paramsTask.id=this.$route.params.id
    this.findParams.taskId=this.$route.params.id
    this.rfidParames.taskId=this.$route.params.id
    this.paramsNum.taskId=this.$route.params.id
    this.statusParames.inventoryTaskId=this.$route.params.id
    this.taskIdFlag=this.$route.params.taskId
    this.global.evmResult=0
    if(this.global.inventoryTab!=0){
      this.checkedFlag=this.global.inventoryTab
      if(this.checkedFlag==0){
         this.params.status='to be inventoried'
      }
      else if(this.checkedFlag==1){
         this.params.status='consistent '
      }
      else if(this.checkedFlag==2){
         this.params.status='difference '
      }
      else if(this.checkedFlag==3){
         this.params.status='inventory profit'
        this.deleteFlag=-1
      }
      else if(this.checkedFlag==4){
         this.params.status='inventory loss'
      }
      else if(this.checkedFlag==5){
        this.deleteFlag=-1
         this.params.status='inventoried'
      }
    }
    if(this.taskIdFlag=='completed'){
      this.completedFlag=!this.completedFlag
    }
    // 如果是想禁用长按弹出菜单 
    window.addEventListener('contextmenu', function(e){  
      e.preventDefault();  
    }); 
    //监听扫描二维码
    var $this=this
    window.barcodeNotify=function(msg){
      console.log('条码信息'+msg) 
      $this.isEvm=!$this.isEvm
      $this.params.term=msg
      $this.paramsNum.term=msg
      if($this.params.term!=''&&$this.params.term!=null){
        window.rfid.stopBarcode();
        $this.global.evmResult=1
        $this.findByassetNum()
      }
      // $this.intervalidEwm=setTimeout(function(){
        window.rfid.stopBarcode();
      // },1000)
    }
  //监听扫描rfid
    window.onNewLabel=function(msg){
      // window.rfid.resetEpcPoll()
      $this.rfidParames.assetNumbers=msg
      Inventory.findForRfid({params: $this.rfidParames}).then(res => {
        if(res.length>0){
            if(res[0].status=='to be inventoried'||res[0].status=='To be Inventoried'){
              res[0].status='未盘点'
            }
            else if(res[0].status=='consistent'||res[0].status=='Consistent'){
              res[0].status='账实相符'
            }
            else if(res[0].status=='difference'||res[0].status=='Difference'){
              res[0].status='有差异'
            }
            else if(res[0].status=='inventory profit'||res[0].status=='Inventory Profit'){
              res[0].status='盘盈'
            }
            else if(res[0].status=='inventory loss'||res[0].status=='Inventory Loss'){
              res[0].status='盘亏'
            }
            $this.pdlist.push(res[0])
            $this.global.slideParames.push(res[0].id)
        }
        if($this.pdlist.length>0){
          $this.listnoData=false
        }
        else{
          $this.listnoData=true
        }
      })
    }
    this.inventoryList();
    this.taskDetail()
  },
  updated: function(){
    if(this.params.status=='to be inventoried'){
      this.slideFunc()
    }
  },
  components: {
    confirmTip
  },
  methods: {
    // 获得资产列表
    inventoryList:function(){
      this.pdlist.length=0
      this.global.slideParames.length=0
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
              },
          down: {
            use:false
          }
        })
        document.getElementById("dataList").style.display="block";
    },
    //上拉加载的回调 page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数
    upCallback:function(page){
      var pageIndex = page.num-1;
      this.checkFlag.length=0
      //联网加载数据
      var self = this;
      this.getListDataFromNet(pageIndex, page.size, function(curPageData,totalSize) { 
        //如果是第一页需手动制空列表
        if(pageIndex == 0) self.pdlist = [];  
        curPageData.forEach((item,index) =>{
          if(item.assetPhoto!=null&&item.assetPhoto!=''){
            var arr=item.assetPhoto.split(",")
            item.assetPhoto=arr[0]
          }
          if(item.status=='to be inventoried'||item.status=='To be Inventoried'){
            item.status='未盘点'
          }
          else if(item.status=='consistent'||item.status=='Consistent'){
            item.status='账实相符'
          }
          else if(item.status=='difference'||item.status=='Difference'){
            item.status='有差异'
          }
          else if(item.status=='inventory profit'||item.status=='Inventory Profit'){
            item.status='盘盈'
          }
          else if(item.status=='inventory loss'||item.status=='Inventory Loss'){
            item.status='盘亏'
          }
          self.pdlist = self.pdlist.concat(item); 
        })
      if( self.pdlist.length>0){
        curPageData.forEach((item,index) =>{
          self.global.slideParames.push(item.id)
        })
      }
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
      Inventory.inventoryList({params: this.params})
        .then((response) => {
          var data=response.content;
          var total=response.totalElements;
            successCallback&&successCallback(data,total);//成功回调  
            }, (response) => {
            console.log('fail')
          })   
    },
    //二维码根据编码查询
    findByassetNum: function() {
      Inventory.findInventoryList({params: this.paramsNum}).then(res => {
        if(res.length==0){
          this.pdlist.length=0
          this.listnoData=true
          var pat=document.getElementsByClassName('empty-tip')   
          pat[0].style.display='none'
        }
        else{
          this.$router.push({path:'/checkDetail/'+this.params.taskId+'/'+this.params.term+'/'+this.taskIdFlag})
        }
      })
    },
    //模糊搜索
    findInventory: function () {
      this.inventoryList();
    },
    // 改变tab颜色
    itemChoosedFun: function (index) {
      if(this.checkedFlag==index){
        return true;
      }
      return false;
    },
    //tab切换
    ItemStatusChoose: function (item,index) {
      this.listnoData=false
      this.global.slideParames.length=0
      this.checkStatusIsShow=false
      this.checkedFlag=index
      this.params.term=''
      if(index==0){
        this.params.status='to be inventoried'
      }
      else if(index==1){
        this.params.status='consistent '
      }
      else if(index==2){
        this.params.status='difference '
      }
      else if(index==3){
        this.params.status='inventory profit'
        this.deleteFlag=-1
      }
      else if(index==4){
        this.params.status='inventory loss'
      }
      else if(index==5){
        this.deleteFlag=-1
        this.params.status='inventoried'
      }
      this.inventoryList();
    },
    reback: function (item,index) {
      this.$router.push({path:'/taskDetail/'+this.params.taskId})
    },
    sortOrder: function (item,index) {
        this.checkStatusIsShow = !this.checkStatusIsShow
    },
    hideDrop: function (item,index) {
      if(this.checkStatusIsShow){
        this.checkStatusIsShow=false
      }
    },
    setSelectVal: function (item,index) {
        if(item==1) {
          this.dropSelected= '位置';
          this.params.sort="location"
          this.inventoryList();
        }
        else if(item==2) {
          this.params.sort="assetNumber"
          this.dropSelected= '资产编号';
          this.inventoryList();
        }
        this.checkStatusIsShow = false
    },
    //滑动显示按钮
    slideFunc: function () {
      var $this=this;                           //将$this保存 区分以下触发事件的this
      var container = document.querySelectorAll('.out_cnt');
      for(var i = 0; i < container.length; i++){                          //为每个特定DOM元素绑定touchstart touchmove时间监听 判断滑动方向
        var x,  X;
          container[i].addEventListener('touchstart', function(event) {   //记录初始触控点横坐标
            x = event.changedTouches[0].pageX;
          });
          container[i].addEventListener('touchmove', function(event){
              X = event.changedTouches[0].pageX;                          //记录当前触控点横坐标
              if($this.expansion){                                       //判断是否展开，如果展开则收起
                $this.expansion.className = "out_cnt";
                // $this.expansion.style.transform='translateX(4rem)'
              }     
              if(X - x > 10){                                             //右滑
                  this.className = "out_cnt";                                    //右滑收起
                }
              if(x - X > 10){                                             //左滑
                  this.className = "swipeleft";  
                  // this.children[0].style.width=document.body.clientWidth+'px'                         //左滑展开
                  $this.expansion = this;
                }
              });
        }
    },
    // 账实相符盘亏
    statusChange:function(item,idx,e,code){
      e.stopPropagation();//阻止事件冒泡即可                                        
      if(code==1){
        this.statusParames.inventoryList.status='consistent'
      }
      else{
       this.statusParames.inventoryList.status='inventory loss'
      }
      // if(item.assetPhoto!=null&&item.assetPhoto!=''){
      //   this.statusParames.photo.push(item.assetPhoto)
      // }
      this.statusParames.inventoryList.addDate=item.addDate
      this.statusParames.inventoryList.addNote=item.addNote
      this.statusParames.inventoryList.assetName=item.assetName
      this.statusParames.inventoryList.assetNumber=item.assetNumber
      this.statusParames.inventoryList.department=item.department
      this.statusParames.inventoryList.location=item.location
      this.statusParames.inventoryList.quantity=item.quantity
      this.statusParames.inventoryList.source=item.source
      this.statusParames.inventoryList.listId=item.listId
      this.statusParames.inventoryList.id=item.id
      this.statusParames.inventoryList.assetId=item.assetId
      this.statusParames.inventoryList.pdaCode=item.pdaCode
      Inventory.updateList({params: this.statusParames}).then(res => {
        console.log(res)
        this.inventoryList();
        this.taskDetail()
      })
      var container = document.querySelector('.swipeleft');           //将展开的DOM归位 除掉样式类
      container.className="check_list_serach_result_wrap";
      this.expansion=null;
    },
    taskDetail: function(){
      Task.TaskDetail({params: this.paramsTask}).then(res => {
        //赋值状态数量
        this.uncheck=res.wait
        this.balance=res.right
        this.diff=res.difference
        this.profit=res.profit
        this.loss=res.loss
        this.checked=res.part
         // 百分比
        var totalNum=this.uncheck+ this.checked
        var sumH=document.getElementById("progress_wrap").offsetWidth
        if(this.checked==0){
          document.getElementById("checked").style.width='0px'
          var per='0%'
          document.getElementById("percentage").innerHTML=per
        }
        else if(this.uncheck==0){
          document.getElementById("checked").style.width=sumH-10+'px'
          var per='100%'
          document.getElementById("percentage").innerHTML=per
        }
        else{
          document.getElementById("checked").style.width=sumH*( this.checked/totalNum)-10+'px'
          if(sumH*( this.checked/totalNum)<10){
            document.getElementById("checked").style.width=sumH*( this.checked/totalNum)+'px'
          }
          var per=this.checked/totalNum*100
          per=per.toFixed(0)+'%'
          document.getElementById("percentage").innerHTML=per
        }
      })
    },
    // 删除弹出框
    delFunc:function(name,item,idx){
      this.showAlert=true
      this.alertText='确认删除该数据?'
      this.deleteParames.id=item.id
      console.log(this.deleteParames.id)
      // this.noData=false
      // this.pdlist.splice(idx,1);                                        //删除List这条数据
    },
    hideDelete:function(){
      this.deleteFlag=-1
    },
    // 删除确认
    deleteConfirm: function () {
      Inventory.deleteInventory({params: this.deleteParames}).then(res => {
        this.inventoryList();
        this.taskDetail();
        this.deleteFlag=-1
        // this.isDeleting = !this.isDeleting;
        this.expansion=null;
        this.showAlert = false
      })
    },
    hideConfirmTip: function () {
      this.showAlert=false
      this.deleteFlag=-1
    },
    showDeleteButton:function(item,index) {
      var _this=this
      clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
      if(item.status=='盘盈'){
        this.Loop=setTimeout(function(){
          // _this.isDeleting = !_this.isDeleting;
            _this.deleteFlag=index
        },1000);
      }
    },
    clearLoop:function() {
      clearInterval(this.Loop);
    },
    // 图片404返回默认图片
    imgError:function(item) {
       item.assetPhoto = require('../assets/default_img.png');
    },
    viewDetail:function(item,index) {
      this.global.inventoryTab=this.checkedFlag
      this.global.activeSwiper=index
      this.global.activeStatus=item.status
      this.$router.push({path:'/vueSwiper/'+this.params.taskId+'/'+item.id+'/'+this.taskIdFlag})
      // window.rfid.stopScan();
    },
    //盘盈添加资产
    assetsPlusFunc: function () {
      this.$router.push({path:'/checkDetail/'+this.params.taskId+'/'+'y'+'/'+this.taskIdFlag})
    },
    ewm_code:function(){
      // 开启条形码二维码扫描
      window.rfid.startBarcode();
    },
    pdaScan:function(){
      //开启rfid扫描
      this.global.slideParames=[]
      this.pdlist=[]
      var pat=document.getElementsByClassName('empty-tip')   
      var nodate=document.getElementsByClassName('upwarp-nodata')   
      if(pat.length!=0){
        pat[0].style.display='none'
      }
      if(nodate.length!=0){
        nodate[0].style.display='none'
      }
      window.rfid.startScan();
    },
  }
}
</script>
