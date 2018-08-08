 <template>
    <div class="alet_container">
	    <section class="tip_text_container">
            <p class="tip_text">{{alertText}}</p>
            <div class="cancle" @click="hideConfirmTip">取消</div>
            <div class="confrim" @click="closeTip">确认</div>
        </section>
    </div>
</template>

<script>
    export default {
    	data(){
            return{
                positionY: 0,
                timer: null,
            }
        },
        mounted(){
      
        },
        props: ['alertText'],
        methods: {
            closeTip(){
                this.$emit('closeTip')
            },
            hideConfirmTip(){
                this.$emit('hideConfirmTip')
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/base/mixin';
    .alet_container{
        background:rgba(0,0,0,0.5);
    	position: fixed;
    	top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 200;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tip_text_container{
        // position: absolute;
        // top: 50%;
        // left: 50%;
        // transform:translate(-50%,-50%);
        width: 80%;
        background-color: rgba(255,255,255,1);
        border: 1px;
        padding-top: 10px;
        border: 1px;
        border-radius: 4px;
        .tip_text{
            @include sc(14px, #333);
            line-height: 24px;
            text-align: center;
            margin-top: 8px;
            padding: 0 0 0 15px;
            text-align: left;
        }
        .confrim{
            @include sc(14px, #fff);
            font-weight: bold;
            margin: 10px 15px 10px 0;
            background-color: #4cd964;
            padding:7px 17px;
            text-align: center;
            border-radius:4px;
            float:right;
        }
        .cancle{
            @include sc(14px, #333);
            font-weight: bold;
            margin: 10px 15px 10px 0;
            background-color: #fff;
            padding: 7px 17px;
            text-align: center;
            border-radius: 4px;
            float: right;
            border: solid 1px #ccc;
        }
    }
    
</style>
