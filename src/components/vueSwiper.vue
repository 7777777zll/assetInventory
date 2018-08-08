<template>
  <div class="swiper_wrap check_Detail">
    <div class="head_has_reback">
      资产详情
      <div class="reback" @click="reback">
        <img src="../assets/reback.png">
        <span class="reback_text">返回</span>
      </div>
    </div>
    <div class="detail_search"><span class="search_icon" @click="findByassetNum"></span> <input type="text" placeholder="请输入资产编号或位置" class="search_ipt" v-model="paramsNum.term" @keyup.13="findByassetNum"> <span class="scan_icon" @click="ewm_code"></span></div>
    <p class="empty-show" v-show="listnoData">亲,暂无相关数据哦~</p>
    <swiper :options="swiperOption" ref="mySwiper" v-show="mainShow">
      <swiper-slide v-for="(slide,index) in swiperSlides" :key="index">
        <checkDetail :slideId="slide"></checkDetail> 
      </swiper-slide>
    </swiper>
  </div>
</template>
  
<script>
  import { Inventory } from '../config/api'
  import checkDetail from '../components/checkDetail.vue'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'  
  // swiper options example:
  export default {
    name: 'carrousel',
    data() {
      return {
        mainShow:true,
        listnoData:false,
        paramsNum:{
          term:'',
          taskId:'',
        },
        backTaskId:'',
        taskIdFlag:'',
        // 需要查询的资产总数
        slideSum:5,
        plusCount:0,
        swiperSlides:[],
        count:0,
        unslide:false,
        firstNum:false,
        swiperOption: {
          notNextTick: true,   
          slidesPerView: 'auto',   
          spaceBetween: 30,  
          loop : false,
          observer: true,//修改swiper自己或子元素时，自动初始化swiper
          observeParents: true,//修改swiper的父元素时，自动初始化swiper
          on: {
            slideNextTransitionStart:()=>{
              if(!this.unslide){
                var nowActive=this.swiper.activeIndex
                var active=this.global.activeSwiper
                if(this.slideSum-2-this.count>0){
                  if(this.swiperSlides.indexOf(this.global.slideParames[active+nowActive])==-1&&!this.firstNum){
                    this.swiperSlides.push(this.global.slideParames[active+nowActive])
                    this.count=this.count+1
                    console.log(this.swiperSlides)
                  }
                  // 第一个数据左滑
                  else if(this.swiperSlides.indexOf(this.global.slideParames[active+nowActive+1])==-1&&this.firstNum){
                    this.swiperSlides.push(this.global.slideParames[active+nowActive+1])
                    this.count=this.count+1
                    console.log(this.swiperSlides)
                  }
                }
              }
            },
            slidePrevTransitionStart:()=>{
              if(!this.unslide){
                var nowActive=this.swiper.activeIndex
                var active=this.global.activeSwiper
                if(active-this.plusCount>1){
                    this.swiperSlides.unshift(this.global.slideParames[active-2-this.plusCount]) 
                    console.log(this.swiperSlides)
                    console.log(this.global.slideParames[active-2-this.plusCount])
                    this.plusCount=this.plusCount+1  
                }
              }
            },
          }, 
        },
      }
    },
    components:{checkDetail,  swiper,  swiperSlide  },
    computed: {
      swiper:function() {
        return this.$refs.mySwiper.swiper
      },
    },
    mounted() {
      this.taskIdFlag=this.$route.params.status
      this.backTaskId=this.$route.params.taskId
      this.paramsNum.taskId=this.$route.params.taskId
      // console.log(this.global.slideParames.length)
      let activeItem= this.global.activeSwiper
      this.count=activeItem
      this.slideSum=this.global.slideParames.length
      if(activeItem>0&&activeItem!=this.slideSum-1){
        this.firstNum=false
        this.swiperSlides.push(this.global.slideParames[activeItem-1])
        this.swiperSlides.push(this.global.slideParames[activeItem])
        this.swiperSlides.push(this.global.slideParames[activeItem+1])
        this.swiper.slideTo(1, 1000, false)
      }
      else if(activeItem==0&&activeItem!=this.slideSum-1&&this.global.slideParames.length>1){
        this.firstNum=true
        this.swiperSlides.push(this.global.slideParames[activeItem])
        this.swiperSlides.push(this.global.slideParames[activeItem+1])
        this.swiper.slideTo(0, 1000, false)
      }
      else if(this.global.slideParames.length>1){
        this.firstNum=false
        this.swiperSlides.push(this.global.slideParames[activeItem-1])
        this.swiperSlides.push(this.global.slideParames[activeItem])
        this.swiper.slideTo(1, 1000, false)
      }
      if(this.global.slideParames.length==1){
        this.firstNum=true
        this.swiperSlides.push(this.global.slideParames[activeItem])
      }
       //监听扫描二维码
      var $this=this
      window.barcodeNotify=function(msg){
        console.log('条码信息'+msg) 
        $this.paramsNum.term=msg
        $this.findByassetNum()
        window.rfid.stopBarcode();
      }
    },
    methods: {
      findAll: function(parames){
        this.swiperSlides.length=0
        this.slideSum=parames.length
        this.unslide=true
        for(var i=0;i<this.slideSum;i++){
          this.swiperSlides.push(parames[i])
        }
        console.log(this.swiperSlides)
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
                  if(item.status==$this.global.activeStatus){
                    detailByArr.push(item.id)
                  }
              })
              if(detailByArr.length==0){
                this.listnoData=true
                this.mainShow=false
              }
              else{
                console.log(detailByArr)
                this.findAll(detailByArr)
              }
            }
          }
        })
      },
      ewm_code:function(){
        // 开启条形码二维码扫描
        window.rfid.startBarcode();
      },
      reback: function(){
        this.$router.push({path:'/checkList/'+ this.backTaskId+'/'+this.taskIdFlag})
      },
    },
  }
</script>
<style lang='scss'>
  .swiper_wrap{
    height: 100%;
    .swiper-container{
      height:100%;
      overflow-y: auto;
      .swiper-slide{
        overflow-y: auto;
      } 
    }
  }
  .loading{
    position:fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
</style>