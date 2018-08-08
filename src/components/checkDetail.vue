<template>
 <div class="check_Detail">
    <div class="head_has_reback"  v-if="manualProfit||global.evmResult==1">
      资产详情
      <div class="reback" @click="reback">
        <img src="../assets/reback.png">
        <span class="reback_text">返回</span>
      </div>
    </div>
    <div class="detail_wrap" v-show="mainShow">
      <div class="detail_wrap_cnt" v-if="!manualProfit&&newShow.source!='manual_add'">
        <p class="title">资产详情</p>
        <ul class="detail_wrap_cnt_list_wrap">
          <li class="detail_wrap_cnt_list_cell">
            <label class="name">资产名称: </label>
            <span class="text">{{hasDif?showDetail.assetNew:showDetail.assetName}}</span>
          </li>
           <li class="detail_wrap_cnt_list_cell">
            <label class="name">资产编号: </label>
            <span class="text">{{hasDif?showDetail.assetNumberNew:showDetail.assetNumber}}</span>
          </li>
           <li class="detail_wrap_cnt_list_cell">
            <label class="name">位置: </label>
            <span class="text">{{hasDif?(showDetail.locationNew==null?'--':showDetail.locationNew.location):(showDetail.location==null||showDetail.location=='')?'--':showDetail.location.location}}</span>
          </li>
           <li class="detail_wrap_cnt_list_cell">
            <label class="name">科室: </label>
            <span class="text">{{hasDif?(showDetail.departmentNew==null?'--':showDetail.departmentNew.departmentName):(showDetail.department==null||showDetail.department=='')?'--':showDetail.department.departmentName}}</span>
          </li>
           <li class="detail_wrap_cnt_list_cell">
            <label class="name">数量: </label>
            <span class="text">{{hasDif?showDetail.quanitityNew:showDetail.quantity}}</span>
          </li>
        </ul>
      </div>
      <div class="detail_wrap_cnt_result_edit">
        <p class="title">{{manualProfit?'资产详情':'盘点结果'}}</p>
        <div class="edit_cnt">
          <div class="edit_block">资产名称:</div>
          <input type="text" placeholder="请输入资产的商品名" class="edit_info" v-model="insetDif.inventoryAssetDifference.assetNew"/>
        </div>
       <div class="edit_cnt" v-if="manualProfit">
          <div class="edit_block">资产编号:</div>
          <input type="text" placeholder="请输入资产编码" class="edit_info" v-model="insetDif.inventoryAssetDifference.assetNumberNew"/>
        </div>
        <div class="edit_cnt">
         <div class="edit_block" tabindex="1" @click="showDrop" @blur="hideDrop">
          <span>位置:</span>
          <span class="drop_icon"></span>
          <div class="checkStatus_select" v-show="buttonIsshow&&addChoosed">
            <ul class="option_list">
              <li class="option_cell" v-for="(item,index) in dropList" v-on:click.stop="setSelectVal(item)">
                <span data="1" class="option_text">{{item.location}}</span> 
              </li>
            </ul>
          </div>
         </div>
         <input type="text" class="edit_info" placeholder="请选择资产位置" readonly v-model="dropaddSelected"/>
       </div>
        <div class="edit_cnt">
         <div class="edit_block" tabindex="1" @click="showDepDrop" @blur="hideDepDrop">
          <span>科室:</span>
          <span class="drop_icon"></span>
          <div class="checkStatus_select" v-show="buttonIsshow&&depChoosed">
            <ul class="option_list">
              <li class="option_cell" v-for="(item,index) in departmentList" v-on:click.stop="departmetSetSelectVal(item)">
                <span data="1" class="option_text">{{item.departmentName}}</span> 
              </li>
            </ul>
          </div>
         </div>
         <input type="text" class="edit_info" placeholder="请选择资产所在科室" readonly v-model="dropDepSelected"/>
        </div>
        <div class="edit_cnt">
          <div class="edit_block">数量:</div>
          <!-- <input type="text" placeholder="请输入资产数量" class="edit_info" v-model="insetDif.inventoryAssetDifference.quanitityNew"/> -->
          <input type="text" readonly class="edit_info" value="1" />
        </div>
        <div class="edit_cnt" v-if="manualProfit">
          <div class="edit_block">盘盈日期:</div>
          <div>
            <div @click="open('picker4')">
              <input type="text" class="edit_info"  v-model='insetProfit.inventoryList.addDate' disabled="true" placeholder="选择日期" >
            </div>
            <mt-datetime-picker 
              ref="picker4"
              type="date"
              v-model="value_real_profit"
              year-format="{value} 年"
              month-format="{value} 月"
              date-format="{value} 日"
              @confirm="handleChange('picker4')"
              @cancel="cancleDate('picker4')"
             >
            </mt-datetime-picker>
          </div>
        </div>
         <div class="edit_cnt" v-if="!manualProfit">
          <div class="edit_block">{{nowStatus=='inventory profit'||nowStatus=='Inventory Profit'?'盘盈日期:':'盘点日期:'}}</div>
          <div>
            <div @click="open('picker3')">
              <input type="text" class="edit_info"  v-model='insetDif.inventoryAssetDifference.addDate' disabled="true" placeholder="选择日期" >
            </div>
            <mt-datetime-picker 
              ref="picker3"
              type="date"
              v-model="value_real"
              year-format="{value} 年"
              month-format="{value} 月"
              date-format="{value} 日"
              @confirm="handleChange3('picker3')"
              @cancel="cancleDate3('picker3')"
             >
            </mt-datetime-picker>
          </div>
        </div>
        <div class="edit_cnt">
          <div class="edit_block">{{nowStatus=='inventory profit'||nowStatus=='Inventory Profit'||manualProfit?'盘盈说明:':'盘点说明:'}}</div>
          <input type="text" placeholder="请输入盘点说明内容" class="edit_info" v-model="insetDif.inventoryAssetDifference.note"/>
        </div>
      </div>
      <div class="updata_pic">
        <div class="pic_wrap">
          <p class="title">上传图片 <span class="red">( 注意 : 最多上传5张 )</span></p>
          <div class="images_wrap">
            <div class="upImg_wrap">
              <div class="album-img-list">
                <ul>
                  <li class="imgs_cell">
                    <div class="album-bg-img">
                      <label for="img-upload" class="btn_img_label"></label>
                      <uploadPic  @upup="change" :img-arr.sync="imgList"></uploadPic> 
                    </div>
                  </li>
                  <li v-for="(img,index) in imgList" class="imgs_cell">
                    <div class="album-bg-img">
                      <img  :src='img.src' class="defult_img"> 
                      <span class="delete_img" @click="delPicFunc(img,index,$event)">-</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="submit">
            <button @click="submit" v-if="buttonIsshow&&!manualProfit&&nowStatus!='to be inventoried'&&nowStatus!='To be Inventoried'">保存</button>
            <button @click="submit" v-if="buttonIsshow&&!manualProfit&&(nowStatus=='to be inventoried'||nowStatus=='To be Inventoried')">提交</button>
            <button @click="submit" v-if="buttonIsshow&&manualProfit">新增</button>
          </div>
        </div>
      </div>
      <alertTip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alertTip>
    </div>
  </div>
</template>

<script>
import { Inventory } from '../config/api'
import alertTip from '../components/alertTip' 
import Exif from 'exif-js'
import uploadPic from '../components/uploadPic.vue'
 export default {
    data() {
      return {
        newShow:[],
        addChoosed:false,
        depChoosed:false,
        mainShow:true,
        listnoData:false,
        dropaddSelected:'',
        dropDepSelected:'',
        dropList:[1,2],
        intervalidEwm:null,
        departmentList:[1,2],
        picValue:'' ,
        imgList:[],
        showAlert: false,
        alertText: null,
        showDetail:[],
        value_real:null,
        value_real_profit:null,
        date:'',//日期暂存
        manualProfit:false,//手动盘盈
        backTaskId:'',
        hasDif:false,
        paramsId:{
          id:'',
        },
        paramsNum:{
          term:'',
          taskId:'',
        },
        paramsTaskId:{
          taskId:'',
        },
        // 手动盘盈
        insetProfit:{
          inventoryTaskId:'',
          inventoryList:{
            id:'',
            assetId:'',
            listId:'',
            pdaCode:'',
            assetName:'',
            assetNumber:'',
            status:'inventory profit',
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
            quantity:'',
            addDate:'',
            addNote:'',
            source:'',
          },
          inventoryAssetDifference:{},
          assetDifferencePhoto:[],
          photo:[],
        },
        //未盘点差异填写
        insetDif:{
          inventoryListId:'',
          departmentNew:{
            id:'',
            departmentName:'',
            departmentNumber:'',
            company:'',
          },
          locationNew:{
            id:'',
            location:'',
            locationNumber:'',
            company:'',
          },
          inventoryAssetDifference:{
            assetNew:'',
            assetNumberNew:'',
            quanitityNew:'',
            note:'',
            addDate:'',
          },
          photo:[],
        },
        rebackImg:[],
        taskIdFlag:'',
        nowStatus:'',
        buttonIsshow:false,
        dptList:{
          id:'',
          departmentName:'',
          departmentNumber:'',
          company:'',
        },
        lolList:{
          id:'',
          location:'',
          locationNumber:'',
          company:'',
        },
    }
  },
    props: ['slideId'],
    watch: {  
      slideId(newValue) {
        this.slideId=newValue
        this.paramsId.id=this.slideId
        this.checkDetail()  
      }  
    },  
    mounted: function () {
      var $this=this
      this.paramsId.id=this.slideId
      this.insetDif.inventoryListId=this.slideId
      this.paramsNum.taskId=this.$route.params.taskId
      this.paramsTaskId.taskId=this.$route.params.taskId
      this.backTaskId=this.$route.params.taskId
      this.insetProfit.inventoryTaskId=this.$route.params.taskId
      this.taskIdFlag=this.$route.params.status
      this.buttonIsshow=this.$route.params.status
      if(this.buttonIsshow=='completed'){
        this.buttonIsshow=false
        //恢复input输入功能
        var pat=document.getElementsByClassName('edit_info')   
          for (var i=0; i< pat.length; i++){
            pat[i].setAttribute("disabled", "disabled")
        }
      }
      else{
        this.buttonIsshow=true
      }
      if(this.$route.params.id=='y'){
        this.insetProfit.inventoryList.source='manual_add'
        this.manualProfit=!this.manualProfit
      }
      else if(this.global.evmResult==1){
        this.paramsNum.term=this.$route.params.id
        this.findByassetNum()
      }
      else{
        this.checkDetail()
      }
      // 查询科室
      this.department()
      // 查询地点
      this.location()
    },
    components:{
      uploadPic,alertTip
    },
    methods: {
      // 下拉框判断是否显示
      showDrop:function(){
        this.addChoosed=!this.addChoosed
      },
      hideDrop: function(){
        if(this.addChoosed){
          this.addChoosed=false
        }
      },
      showDepDrop:function(){
        this.depChoosed=!this.depChoosed
      },
      hideDepDrop: function(){
        if(this.depChoosed){
          this.depChoosed=false
        }
      },
      department: function(){
        Inventory.findDepartment({params: this.paramsTaskId}).then(res => {
          this.departmentList=res
        })
      },
      location: function(){
        Inventory.findLocation({params: this.paramsTaskId}).then(res => {
          this.dropList=res
        })
      },
      reback: function(){
        this.$router.push({path:'/checkList/'+ this.backTaskId+'/'+this.taskIdFlag})
      },
       // 状态选择
      setSelectVal: function(item){
        this.dropaddSelected=item.location;
        this.lolList.id=item.id
        this.lolList.location=item.location
        this.lolList.locationNumber=item.locationNumber
        this.lolList.company=item.company
        // this.insetDif.locationNew.id=item.id
        // this.insetDif.locationNew.location=item.location
        // this.insetDif.locationNew.locationNumber=item.locationNumber
        // this.insetDif.locationNew.company=item.company
        // 账实相符修改时状态为有差异此值不需要修改
        if(this.nowStatus=='inventory profit'||this.nowStatus=='Inventory Profit'||this.manualProfit){
          this.insetProfit.inventoryList.location=item
        }
        this.addChoosed = !this.addChoosed
      },
      departmetSetSelectVal: function(item){
        this.dropDepSelected=item.departmentName;
        this.dptList.id=item.id
        this.dptList.departmentName=item.departmentName
        this.dptList.departmentNumber=item.departmentNumber
        this.dptList.company=item.company
        // this.insetDif.departmentNew.id=item.id
        // this.insetDif.departmentNew.departmentName=item.departmentName
        // this.insetDif.departmentNew.departmentNumber=item.departmentNumber
        // this.insetDif.departmentNew.company=item.company
        // 账实相符修改时状态为有差异此值不需要修改
        if(this.nowStatus=='inventory profit'||this.nowStatus=='Inventory Profit'||this.manualProfit){
          this.insetProfit.inventoryList.department=item
        }
        this.depChoosed = !this.depChoosed
      },
      change: function(msg){
        this.imgList = msg;
      },
      delPicFunc:function(item,idx,e){
        e.stopPropagation();//阻止事件冒泡即可 
        this.imgList.splice(idx,1);    //删除List这条数据 
      },
      checkDetail: function(){
        Inventory.getListById({params: this.paramsId}).then(res => {
            this.global.testArr=res
            this.global.testArr2=res
            this.global.testArr3=res
            var testArr2=this.global.testArr2
            console.log(this.global.testArr3)
            this.newShow=res
            this.nowStatus=res.status
            var difArr=[]
            // 有差异状态
            if(this.nowStatus=='difference'||this.nowStatus=='Difference'){
              var length=res.inventoryAssetDifferences.length
              difArr.push(res.inventoryAssetDifferences[length-1])
              this.hasDif=true
              this.insetProfit.inventoryAssetDifference.id=difArr[0].id
              this.showDetail=res.inventoryAssetDifferences[length-1]
              this.insetDif.inventoryAssetDifference.assetNew=difArr[0].assetNew
              this.insetDif.inventoryAssetDifference.assetNumberNew= difArr[0].assetNumberNew
              if(difArr[0].locationNew!=''&&difArr[0].locationNew!=null){
                this.dropaddSelected= difArr[0].locationNew.location
                this.insetDif.locationNew= difArr[0].locationNew
                this.insetProfit.inventoryList.location=difArr[0].locationNew
              }
              else{
                this.dropaddSelected= ''
                this.insetDif.locationNew.location= ''
                this.insetDif.locationNew.id= ''
                this.insetProfit.inventoryList.location.location=''
              }
              if(difArr[0].departmentNew!=''&&difArr[0].departmentNew!=null){
                this.dropDepSelected= difArr[0].departmentNew.departmentName
                this.insetDif.departmentNew= difArr[0].departmentNew
                this.insetProfit.inventoryList.department=difArr[0].departmentNew
              } 
              else{
                this.dropDepSelected=''
                this.insetDif.departmentNew.departmentName=''
                this.insetDif.departmentNew.id=''
                this.insetProfit.inventoryList.department.departmentName=''
              }
              this.insetDif.inventoryAssetDifference.quanitityNew=difArr[0].quanitityNew
              this.insetDif.inventoryAssetDifference.note=difArr[0].note
              if(difArr[0].addDate==null||difArr[0].addDate==''){
                 this.insetDif.inventoryAssetDifference.addDate=''
              }
              else{
                this.insetDif.inventoryAssetDifference.addDate=difArr[0].addDate
              }
              if(difArr[0].photo!=null&&difArr[0].photo!=''){
                var $this=this
                let imgArr=difArr[0].photo.split(",")
                imgArr.forEach((item,index) =>{
                  let itemCell={"src":item}
                  $this.imgList.push(itemCell);
                })
              }
            }
            else{
              this.hasDif=false
              this.showDetail=res
              this.insetDif.inventoryAssetDifference.assetNew=this.showDetail.assetName
              this.insetDif.inventoryAssetDifference.assetNumberNew= this.showDetail.assetNumber
              // 盘盈
              if(this.showDetail.department!=null&&this.showDetail.department!=''){
                this.dropDepSelected= this.showDetail.department.departmentName
                this.insetDif.departmentNew=this.showDetail.department
                this.insetProfit.inventoryList.department=this.showDetail.department
              }
              else{
                this.dropDepSelected=''
                this.insetDif.departmentNew.departmentName=''
                this.insetDif.departmentNew.id=''
                this.insetProfit.inventoryList.department.departmentName=''
              }
              if(this.showDetail.location!=null&&this.showDetail.location!=''){
                this.dropaddSelected= this.showDetail.location.location
                this.insetDif.locationNew= this.showDetail.location
                this.insetProfit.inventoryList.location=this.showDetail.location
              }
              else{
                this.dropaddSelected= ''
                this.insetDif.locationNew.location= ''
                this.insetDif.locationNew.id= ''
                this.insetProfit.inventoryList.location.location=''
              }
              this.insetDif.inventoryAssetDifference.quanitityNew=this.showDetail.quantity
              this.insetDif.inventoryAssetDifference.note=this.showDetail.addNote
              if(this.showDetail.addDate==null||this.showDetail.addDate==''){
                 this.insetDif.inventoryAssetDifference.addDate=''
              }
              else{
                this.insetDif.inventoryAssetDifference.addDate=this.showDetail.addDate
              }
              if(this.showDetail.assetPhoto!=null&&this.showDetail.assetPhoto!=''){
                var $this=this
                let imgArr=this.showDetail.assetPhoto.split(",")
                imgArr.forEach((item,index) =>{
                  let itemCell={"src":item}
                  $this.imgList.push(itemCell);
                })
              }
            }
            this.insetProfit.inventoryList.assetName=testArr2.assetName
            this.insetProfit.inventoryList.quantity=testArr2.quantity
            this.insetProfit.inventoryList.assetNumber=testArr2.assetNumber
            this.insetProfit.inventoryList.addDate=testArr2.addDate
            this.insetProfit.inventoryList.addNote=testArr2.addNote
            this.insetProfit.inventoryList.source=testArr2.source
            this.insetProfit.inventoryList.id=testArr2.id
            this.insetProfit.inventoryList.assetId=testArr2.assetId
            this.insetProfit.inventoryList.listId=testArr2.listId
            this.insetProfit.inventoryList.pdaCode=testArr2.pdaCode
        },response => {
          console.info('fail')
        })
      },
      findByassetNum: function() {
        Inventory.findInventoryList({params: this.paramsNum}).then(res => {
          this.global.slideParames.length=0
          var $this=this
          if(res.length==0){
            this.listnoData=true
            this.mainShow=false
          }
          else{
            this.listnoData=false
            this.mainShow=true
            // this.showDetail=res
            var detailByArr=[]
            if(res.length>0){
              res.forEach((item,index) =>{
                $this.paramsId.id=item.id
                // $this.global.evmResult=0
                $this.checkDetail()
              })
            }
          }
        })
      },
      //日期
      open: function(picker) {
        if(this.buttonIsshow){
          this.$refs[picker].open();
        }
      },
      // 格式化获取的时间
      formatDate:function(date) {
          const y = date.getFullYear()
          let m = date.getMonth() + 1
          m = m < 10 ? '0' + m : m
          let d = date.getDate()
          d = d < 10 ? ('0' + d) : d
          return y + '-' + m + '-' + d
      },
      //点击确定按钮之后
      handleChange:function(picker) {
        // 输出格式化后的时间
        this.insetProfit.inventoryList.addDate=this.formatDate(this.$refs[picker].value)  
        this.value_real_profit=this.formatDate(this.$refs[picker].value)    
      },
      //点击取消按钮之后
      cancleDate:function(picker){
        this.insetProfit.inventoryList.addDate=this.formatDate(this.$refs[picker].value)
        this.value_real_profit=this.formatDate(this.$refs[picker].value)  
      },
            //点击确定按钮之后
      handleChange3:function(picker) {
        // 输出格式化后的时间
        this.insetDif.inventoryAssetDifference.addDate=this.formatDate(this.$refs[picker].value)
        this.value_real=this.formatDate(this.$refs[picker].value)    
      },
      //点击取消按钮之后
      cancleDate3:function(picker){
        this.insetDif.inventoryAssetDifference.addDate=this.formatDate(this.$refs[picker].value)
        this.value_real=this.formatDate(this.$refs[picker].value)
      },
      submit: function(){
        if(this.dptList.id){
          this.insetDif.departmentNew=this.dptList
        }
        if(this.lolList.id){
          this.insetDif.locationNew=this.lolList
        }
        var $this=this
        let assetNew = this.insetDif.inventoryAssetDifference.assetNew
        let assetNumber = this.insetDif.inventoryAssetDifference.assetNumberNew
        let departmentName = this.insetDif.departmentNew.departmentName
        let location = this.insetDif.locationNew.location
        let quanitityNew = this.insetDif.inventoryAssetDifference.quanitityNew
        let note = this.insetDif.inventoryAssetDifference.note
        let addDate = this.insetDif.inventoryAssetDifference.addDate
        let imgDetailArr
        let imgArr=[]
        let passImg=[]
        if (this.nowStatus=='difference'||this.nowStatus=='Difference') {
          if(this.showDetail.photo!=''&&this.showDetail.photo!=null){
            imgDetailArr=this.showDetail.photo.split(",")
          }
          else{
            imgDetailArr=[]
          }
        }
        else{
          if(this.showDetail.assetPhoto!=''&&this.showDetail.assetPhoto!=null){
            imgDetailArr=this.showDetail.assetPhoto.split(",")
          }
          else{
            imgDetailArr=[]
          }
        }
        if(this.imgList.length>0){
          this.imgList.forEach((item,index) =>{
            let src = item.src
            imgArr.push(src)
            if(src.indexOf('data:image/jpeg;base64,')>-1){
              passImg.push(src)
            }
            else{
              var base64='data:image/jpeg;base64,'+window.btoa(src)
              passImg.push(base64)
            }
          })
          this.insetDif.photo=passImg
          this.insetProfit.assetDifferencePhoto=passImg
          this.insetProfit.photo=passImg
        }
        else{
          imgArr=[]
        }
        if(this.nowStatus!='to be inventoried'&&this.nowStatus!='To be Inventoried'){
          var departmentFlag=false
          var locationFlag=false
          if(this.global.testArr3.department==null||this.global.testArr3.department==''){
            if(departmentName==''){
             departmentFlag=true
            }
            else{
              departmentFlag=false
            }
          }
          else{
            if(departmentName==this.global.testArr3.department.departmentName){
              departmentFlag=true
            }
            else{
              departmentFlag=false
            }
          }
          if(this.global.testArr3.location==null||this.global.testArr3.location==''){
            if(location==''||location==null){
              locationFlag=true
            }
            else{
              locationFlag=false
            }
          }
          else{
            if(location==this.global.testArr3.location.location){
              locationFlag=true
            }
            else{
              locationFlag=false
            }
          }
         if(this.nowStatus=='difference'||this.nowStatus=='Difference'){
            this.insetProfit.inventoryList.status='difference'
          }
          if(this.nowStatus=='inventory profit'||this.nowStatus=='Inventory Profit'){
            this.insetProfit.inventoryList.status='Inventory Profit'
          }   
          if(this.nowStatus=='inventory profit'||this.nowStatus=='Inventory Profit'&&!this.manualProfit){
            this.insetProfit.inventoryList.assetName=assetNew
            this.insetProfit.inventoryList.quantity=quanitityNew
            this.insetProfit.inventoryList.addNote=note
            this.insetProfit.inventoryList.addDate=addDate
            this.insetProfit.inventoryList.assetNumber=assetNumber
          }
          if(this.insetProfit.inventoryList.department.departmentName==''||this.insetProfit.inventoryList.department.departmentName==null){
            this.insetProfit.inventoryList.department=null
          } 
          else if(this.nowStatus!='difference'&&this.nowStatus!='Difference'){              
            this.insetProfit.inventoryList.department.departmentName=departmentName
          }
          if(this.insetProfit.inventoryList.location.location==''||this.insetProfit.inventoryList.location.location==null){
            this.insetProfit.inventoryList.location=null
          }
          else if(this.nowStatus!='difference'&&this.nowStatus!='Difference'){              
            this.insetProfit.inventoryList.location.location=location
          }
          if(!this.manualProfit){
            if(this.nowStatus=='difference'||this.nowStatus=='Difference'){
              var lctFlag=false
              var depFlag=false
              var testArr=this.global.testArr
              this.insetProfit.inventoryList.department=testArr.department
              this.insetProfit.inventoryList.location=testArr.location
              if(this.insetDif.departmentNew.id==''||this.insetDif.departmentNew.id==null){
                this.insetDif.departmentNew=null
              }
              if(this.insetDif.locationNew.id==''||this.insetDif.locationNew.id==null){
                this.insetDif.locationNew=null
              }
              if(this.showDetail.locationNew==null||this.showDetail.locationNew==''){
                this.showDetail.locationNew=''
                if (location==this.showDetail.locationNew) {
                  lctFlag=true
                }
                else{
                  lctFlag=false
                }
              }
              else{
                if (location==this.showDetail.locationNew.location) {
                  lctFlag=true
                }
                else{
                  lctFlag=false
                }
              }
              if(this.showDetail.departmentNew==null||this.showDetail.departmentNew==''){
                this.showDetail.departmentNew=''
                if (departmentName==this.showDetail.departmentNew) {
                  depFlag=true
                }
                else{
                  depFlag=false
                }
              }
              else{
                if (departmentName==this.showDetail.departmentNew.departmentName) {
                  depFlag=true
                }
                else{
                  depFlag=false
                }
              }
              if(assetNew==this.showDetail.assetNew&&depFlag&&lctFlag&&quanitityNew==this.showDetail.quanitityNew&&note==this.showDetail.note&&imgArr.toString()===imgDetailArr.toString()){
                if(this.nowStatus=='consistent'||this.nowStatus=='Consistent'){
                  this.insetProfit.inventoryList.status='consistent'
                }
                if(this.nowStatus=='inventory loss'||this.nowStatus=='Inventory Loss'){
                  this.insetProfit.inventoryList.status='Inventory Loss'
                }  
              }
              this.insetProfit.inventoryAssetDifference.addDate=addDate
              this.insetProfit.inventoryAssetDifference.assetNew=this.insetDif.inventoryAssetDifference.assetNew
              this.insetProfit.inventoryAssetDifference.assetNumberNew=this.insetDif.inventoryAssetDifference.assetNumberNew                  
              if(this.insetDif.locationNew==null||this.insetDif.locationNew==''){
                this.insetProfit.inventoryAssetDifference.locationNew=null
              }
              else{
                this.insetProfit.inventoryAssetDifference.locationNew=this.insetDif.locationNew
              }
              if(this.insetDif.departmentNew==null||this.insetDif.departmentNew==''){
                this.insetProfit.inventoryAssetDifference.departmentNew=null
              }
              else{
                this.insetProfit.inventoryAssetDifference.departmentNew=this.insetDif.departmentNew
              }
              this.insetProfit.inventoryAssetDifference.note=this.insetDif.inventoryAssetDifference.note
              this.insetProfit.inventoryAssetDifference.quanitityNew=this.insetDif.inventoryAssetDifference.quanitityNew
            }
            else{
              if(this.showDetail.addDate==null){
                this.showDetail.addDate=''
              }
              console.log(locationFlag)
              console.log(departmentFlag)
              if(assetNew==this.showDetail.assetName&&departmentFlag&&locationFlag&&quanitityNew==this.showDetail.quantity&&addDate==this.showDetail.addDate&&note==this.showDetail.addNote&&imgArr.toString()===imgDetailArr.toString()){
                if(this.nowStatus=='consistent'||this.nowStatus=='Consistent'){
                  this.insetProfit.inventoryList.status='consistent'
                }
                if(this.nowStatus=='inventory loss'||this.nowStatus=='Inventory Loss'){
                  this.insetProfit.inventoryList.status='Inventory Loss'
                }  
              }
              else{
                var $this=this
                if(this.nowStatus=='consistent'||this.nowStatus=='Consistent'||this.nowStatus=='inventory loss'||this.nowStatus=='Inventory Loss'){
                  this.insetProfit.inventoryList.status='difference'
                  this.insetProfit.inventoryAssetDifference.addDate=addDate
                  this.insetProfit.inventoryAssetDifference.assetNew=this.insetDif.inventoryAssetDifference.assetNew
                  this.insetProfit.inventoryAssetDifference.assetNumberNew=this.insetDif.inventoryAssetDifference.assetNumberNew  
                  if(this.insetDif.locationNew.id==null||this.insetDif.locationNew.id==''){
                    this.insetProfit.inventoryAssetDifference.locationNew=null
                  }
                  else{
                    this.insetProfit.inventoryAssetDifference.locationNew=this.insetDif.locationNew
                  }
                  if(this.insetDif.departmentNew.id==null||this.insetDif.departmentNew.id==''){
                    this.insetProfit.inventoryAssetDifference.departmentNew=null
                  }
                  else{
                    this.insetProfit.inventoryAssetDifference.departmentNew=this.insetDif.departmentNew
                  }
                  this.insetProfit.inventoryAssetDifference.note=this.insetDif.inventoryAssetDifference.note
                  this.insetProfit.inventoryAssetDifference.quanitityNew=this.insetDif.inventoryAssetDifference.quanitityNew
                }
              }
            }
            Inventory.updateList({params: this.insetProfit}).then(res => {
             this.$router.push({path:'/checkList/'+ this.backTaskId+'/'+this.taskIdFlag})
            }) 
          }
          //添加盘盈
          if(this.manualProfit){
            if(assetNew==null||assetNew==''){
              this.showAlert=true
              this.alertText='请输入资产名称!'
            }
            else if(assetNumber==null||assetNumber==''){
              this.showAlert=true
              this.alertText='请输入资产编号!'
            }
            else if(location==null||location==''){
              this.showAlert=true
              this.alertText='请输入资产位置!'
            }
            else if(departmentName==null||departmentName==''){
              this.showAlert=true
              this.alertText='请输入资产科室!'
            }
            // else if(quanitityNew==null||quanitityNew==''){
            //   this.showAlert=true
            //   this.alertText='请输入资产数量!'
            // }
            else if(this.insetProfit.inventoryList.addDate==null||this.insetProfit.inventoryList.addDate==''){
              this.showAlert=true
              this.alertText='请输入资产日期!'
            }
            else if(note==null||note==''){
              this.showAlert=true
              this.alertText='请输入资产说明!'
            }
            else{
              this.insetProfit.inventoryList.assetName=assetNew
              this.insetProfit.inventoryList.quantity=quanitityNew
              this.insetProfit.inventoryList.addNote=note
              this.insetProfit.inventoryList.assetNumber=assetNumber
              Inventory.insertInventory({params: this.insetProfit}).then(res => {
                this.$router.push({path:'/checkList/'+ this.backTaskId+'/'+this.taskIdFlag})
              })
            }
          }  
        }
        else{
          this.newShow.inventoryAssetDifferences.length=0
          this.showDetail=this.newShow
          var testArr=this.global.testArr
          var departmentFlag=false
          var locationFlag=false
          if(this.showDetail.department==null||this.showDetail.department==''){
            if(departmentName==''){
             departmentFlag=true
            }
            else{
              departmentFlag=false
            }
          }
          else{
            if(departmentName==this.showDetail.department.departmentName){
              departmentFlag=true
            }
            else{
              departmentFlag=false
            }
          }
          if(this.showDetail.location==null||this.showDetail.location==''){
            if(location==''||location==null){
              locationFlag=true
            }
            else{
              locationFlag=false
            }
          }
          else{
            if(location==this.showDetail.location.location){
              locationFlag=true
            }
            else{
              locationFlag=false
            }
          }
          if(this.showDetail.addDate==null){
            this.showDetail.addDate=''
          }
          if(assetNew==this.showDetail.assetName&&departmentFlag&&locationFlag&&quanitityNew==this.showDetail.quantity&&addDate==this.showDetail.addDate&&note==this.showDetail.addNote&&imgArr.toString()===imgDetailArr.toString()){
              this.insetProfit.inventoryList.status='consistent'
              if(this.insetProfit.inventoryList.department.departmentName==''||this.insetProfit.inventoryList.department.departmentName==null){
                this.insetProfit.inventoryList.department=null
              }
              if(this.insetProfit.inventoryList.location.location==''||this.insetProfit.inventoryList.location.location==null){
                this.insetProfit.inventoryList.location=null
              }
              this.insetProfit.inventoryAssetDifference=null
              Inventory.updateList({params: this.insetProfit}).then(res => {
                this.$router.push({path:'/checkList/'+ this.backTaskId+'/'+this.taskIdFlag})
              })
          }
          else{
            console.log('diference')
            this.insetProfit.inventoryList.status='difference'
            if(this.insetDif.departmentNew.id==''||this.insetDif.departmentNew.id==null){
                this.insetDif.departmentNew=null
              }
            if(this.insetDif.locationNew.id==''||this.insetDif.locationNew.id==null){
              this.insetDif.locationNew=null
            }
            Inventory.insertDifference({params: this.insetDif}).then(res => {
              this.$router.push({path:'/checkList/'+ this.backTaskId+'/'+this.taskIdFlag})
            })
          }
        }
      },
      ewm_code:function(){
        // 开启条形码二维码扫描
        window.rfid.startBarcode();
      },
   }
 }
</script>
<style>
  .vue-datepicker input[data-v-044dbdc5]{
    border: 0!important;
    border-bottom: solid 1px #eee!important;
    width:100%!important;
  }
</style>