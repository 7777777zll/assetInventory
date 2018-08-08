<template>
  <div>
    <div class="tash_Detail" v-show="mainCnt">
      <div class="head_has_reback" @click="reback">
        任务详情
        <div class="reback">
          <img src="../assets/reback.png">
          <span class="reback_text">返回</span>
        </div>
      </div>
      <div class="detail_wrap">
        <p class="title">{{showData.name}}</p>
        <div class="data_show">
          <span class="num">已盘: <span class="blue">{{showData.part}}</span></span>
          <span class="num">未盘: <span class="red">{{showData.wait}}</span></span>
        </div>
        <div class="progress">
          <div class="percentage" id="percentage"></div>
          <div class="progress_wrap" id="progress_wrap">
            <div class="checked" id="checked"></div>
            <div class="unChecked"></div>
          </div>
        </div>
        <div class="task_list">
          <div class="task_list_cell">
            <div class="cell_show">
              <img src="../assets/number.png" class="cell_icon"></span>
              <span class="task_List_cell_data">任务编号: {{showData.taskId==null? '--':showData.taskId}}</span>
            </div>
            <div class="cell_show">
              <img src="../assets/time.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点时间: {{showData.inventoryDateFrom}} - {{showData.inventoryDateTo}}</span>
            </div>
            <div class="cell_show">
              <img src="../assets/class.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点类别: {{showData.category==null? '--':showData.category}}</span>
            </div>
            <div class="cell_show">
              <img src="../assets/department.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点科室: {{showData.department==null? '--':showData.department.departmentName}}</span>
            </div>
            <div class="cell_show">
              <img src="../assets/address.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点地点: {{showData.location==null? '--':showData.location.location}}</span>
            </div>
            <div class="cell_show">
              <img src="../assets/sumNumber.png" class="cell_icon"></span>
              <span class="task_List_cell_data">盘点总数: {{showData.total}}</span>
            </div>
          </div>
        </div>
        <p class="title taskDes">任务说明</p>
        <div class="desc_text">
           {{showData.description==null? '--':showData.description}}
        </div>
      </div>
      <div class="foot_btn">
        <div class="search_list" @click="searchListFunc">
          <img src="../assets/search_list.png" class="foot_btn_img">
          <span class="foot_btn_text">查看清单</span>
        </div>
      <!--   <div class="search_list" @click="startCheckFunc" v-show="showData.status!='completed'">
          <img src="../assets/check_start.png" class="foot_btn_img">
          <span class="foot_btn_text">{{isStart}}</span>
        </div> -->
        <div class="search_list" @click="submitTaskFunc" v-show="showData.status!='completed'">
          <img src="../assets/submit.png" class="foot_btn_img">
          <span class="foot_btn_text">提交任务</span>
        </div>
      </div>
    </div>
   <transition name="fade">
        <div class="mask_modal confirmBox" v-show="infoWarning">
          <div class="modal_cnt">
            <div class="icon_close" @click="infoWarning=!infoWarning"></div>
            <div class="ask_cnt">{{warningText}}</div>
            <div class="btn_group">
              <div class="btn_confirm_small" @click="infoWarning=!infoWarning">确定</div>
            </div>
          </div>
        </div>
    </transition>
    <div class="submitConfirmPage" v-show="checkSuccess">
      <div class="submitConfirmPage_cnt">
        <img src="../assets/submit_success.png">
        <p class="info_one">提交任务将转为后台执行，请稍后查看提交!</p>
        <p class="info_two">页面3秒后跳转!</p>
        <!-- <div class="login_btn_confirm" @click="refresh">刷新</div> -->
      </div>
    </div>
    <alertTip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alertTip>
  </div>
</template>

<script>
  import alertTip from '../components/alertTip' 
  import { Task } from '../config/api'
  export default {
    data() {
      return {
        showAlert: false,
        alertText: null,
        infoWarning:false,
        warningText:"",
        checkSuccess:false,
        status:'',
        timer:null,
        mainCnt:true,
        showData:[],
        isStart:'开始盘点',
        params:{
          id:''
        },
        updatePrames:{
          status:'',
          id:'',
        },
        submitTask:{
          submitFlag:2,
          id:'',
        },
        statusFlag:'',
    }
  },
  components:{alertTip},
  mounted: function () {
    this.params.id=this.$route.params.id
    this.updatePrames.id=this.$route.params.id
    this.submitTask.id=this.$route.params.id
    this.taskDetail()
  },
  methods: {
    taskDetail: function(){
      Task.TaskDetail({params: this.params}).then(res => {
        this.showData=res
        this.statusFlag=res.status
        this.updatePrames.id=this.showData.id
        // 保存状态数量
        this.global.waitNum=res.wait
        this.global.rightNum=res.right
        this.global.differenceNum=res.difference
        this.global.profitNum=res.profit
        this.global.lossNum=res.loss
        this.global.partNum=res.part
        if(this.showData.status=='draft'){
           this.updatePrames.status='processing'
        }
        else if(res.status=='processing'){
           this.updatePrames.status='processing'
           this.isStart='继续盘点'
        }
        var self = this;
         //已结束
          if(this.showData.status=='completed'){
            // 百分比
            var sumH=document.getElementById("progress_wrap").offsetWidth
            document.getElementById("checked").style.width=sumH-10+'px'
            var per=1*100+'%'
            document.getElementById("percentage").innerHTML=per
          }
          //未开始
          else if(this.showData.status=='draft'){
            // 百分比
            document.getElementById("checked").style.width=0+'px'
            var per=0*100+'%'
            document.getElementById("percentage").innerHTML=per
          }
          //进行中
          else if(this.showData.status=='processing'){
            if(this.showData.part==0){
              document.getElementById("checked").style.width=0+'px'
              var per=0*100+'%'
              document.getElementById("percentage").innerHTML=per
            }
            else{
              // 百分比
              var sumH=document.getElementById("progress_wrap").offsetWidth
              if(sumH*(this.showData.part/this.showData.total)>10){
                 document.getElementById("checked").style.width=sumH*(this.showData.part/this.showData.total)-10+'px'
              }
              else{
                 document.getElementById("checked").style.width=sumH*(this.showData.part/this.showData.total)+'px'
              }
              var checkedH=document.getElementById("checked").offsetWidth
              var per=this.showData.part/this.showData.total*100
              per=per.toFixed(0)+'%'
              document.getElementById("percentage").innerHTML=per
            }
          }
          var start= this.showData.inventoryDateFrom.split('-');
          var stop= this.showData.inventoryDateTo.split('-');
          this.showData.inventoryDateFrom=start[1]+'月'+start[2]+'日'
          this.showData.inventoryDateTo=stop[1]+'月'+stop[2]+'日'
      })
    },
    reback: function(){
      this.$router.push({path:'/'})
    },
    searchListFunc: function(){
      this.global.inventoryTab=0
      this.$router.push({path:'/checkList/'+ this.params.id+'/'+this.statusFlag})
    },
    startCheckFunc: function(){
      Task.updateTask({params: this.updatePrames}).then(res => {
        this.global.inventoryTab=0
        this.isStart="继续盘点"
        this.$router.push({path:'/checkList/'+ this.params.id+'/'+this.statusFlag})
      })
    },
    // 提交任务
    submitTaskFunc: function(){
      if(this.showData.wait!=0){
        this.showAlert=true
        this.alertText='您还有资产未盘点完成，不能提交结果！'
      }
      else{
        Task.submitTask({params: this.submitTask}).then(res => {
        this.mainCnt=!this.mainCnt
        this.checkSuccess=!this.checkSuccess
        var $this=this
        this.timer=setTimeout(function(){
          $this.$router.push({path:'/'})
        },3000)
        })
      }  
    },
  }
}
</script>
