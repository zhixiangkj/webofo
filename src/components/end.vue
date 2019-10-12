<template>
    <div class="trip-cost">
        <div class="trip-head">
            <a href="javascript:;"  @click="returnhome()"><img src='/static/img/riding/icons_back@2x.png'></a>
            <span>Detail</span>
        </div>
        <div class="trip-logo"></div>
        <div class="trip-content">
            <h3>This trip costs $0.00</h3>
            <div class="trip-price">
                <span class="price-span">Price: $0.00</span>
                <span>Coupon discount: -$0.00</span>
            </div>
        </div>
        <div class="margin-base"></div>
        <div class="trip-times">
            <p class="freetime">Free riding times : {{count}}</p>
        </div>
        <div class="margin-base"></div>
        <div class="trip-share" @click="downlink()">Download our App</div>
        <div class="trip-bottom"></div>
    </div>
</template>

<script>

// Global  site  tag  (gtag.js)  -  Google  AdWords:  807835785
// window.dataLayer  =  window.dataLayer  ||  [];
// function  gtag(){dataLayer.push(arguments);}
// gtag('js',  new  Date());

// gtag('config',  'AW-807835785');

export default {
    name: "End",
    data () {
        return {
            count: localStorage.getItem('freeTimesLeft') || 0,
            content: null
        }
    },
    mounted () {
        // if (!localStorage.getItem('freeTimesLeft')) {
        //     this.$router.push({path: '/'})
        // }
        // this.$message('sadsf')
        if (this.count == 0) {
            console.log('一没有免费骑行')
        } else {
            this.count = localStorage.getItem('freeTimesLeft')
        }
    },
    methods: {
        downlink () {
            gtag('event', 'DownloadClicks', {
                'event_label': '/end',
                'event_category': 'event'
            });
            // Event  snippet  for  ofo-pwa-Finish-Rides-tracking  conversion  page
            // gtag('event',  'conversion',  {
            //     'send_to':  'AW-807835785/U_8NCNOsv4ABEImxmoED',
            //     'transaction_id':  ''
            // });
            
            // 最新链接，自动区分设备
            window.location.assign('https://go.onelink.me/8Ka9?pid=Distribution&c=Mkt_Global_Distribution_PWA_180507')
            
            //   判断用户使用的设备终端
            // var uaContains = function (key) {
            //     return navigator.userAgent.toLowerCase().indexOf(key.toLowerCase()) >= 0;
            // };
            // var ANDROID = ['Linux', 'Android'].every(uaContains); // can't just try "Android" as it might catch Windows Phone

            // var IOS = ['(iPhone;', '(iPod touch;', '(iPad;', '(iPod;'].some(uaContains); // can't just try "iPhone" as it might catch Windows Phone  
            
            // if(ANDROID){
            //     window.location.assign('https://play.google.com/store/apps/details?id=so.ofo.abroad');
            // }
            // if(IOS){
            //     window.location.assign('https://itunes.apple.com/app/id1190831637');  
            // }
            
        },
        returnhome () {
            this.$router.push({path: '/'});
        }
    }
}
</script>

<style scoped>
    .trip-cost {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
    }
    .trip-head, .trip-content, .trip-times {
        padding: 0.3rem 0.48rem;
    }
    .trip-times > .freetime {
        margin: 0.1rem 0;
        font-size: 0.35rem;
    }
    .trip-times > .remind {
        color: rgb(255, 8, 0);
    }
    /* head */
    .trip-head {
        position: relative;
        text-align: center;
    }
    .trip-head > a > img {
        width: 0.4rem;
        height: 0.4rem;
        vertical-align: middle;
        position: absolute;
        top: 0.3rem;
        left: 0.48rem;
    }
    .trip-head > span{
        width: 1.0rem;
        height: 0.44rem; 
        font-size: 0.34rem;
        color:rgba(32,32,32,1);
        line-height: 0.44rem;
    }
    .trip-logo {
        width: 100%;
        height: 5.1rem;
        background: url('../../static/img/riding/pic01@2x.png') 100% no-repeat;
        background-size: 100%;
    }
    .trip-content h3 {
        font-size: 0.48rem;
        margin-top: 0.16rem;
    }
    .trip-price {
        margin: 0.24rem 0;
        font-weight: 100;
    }
    .trip-price > span {
        font-weight: normal;
    }
    .trip-ques {
        color: #202020;
    }
    .price-span {
        width: 1.56rem;
        height: 0.32rem;
        position: relative;
    }
    .price-span:after {
        position: absolute;
        right: -0.24rem;
        top: 0;
        content: "|";
    }
    .trip-content span:last-child {
        width: 3.81rem;
        height: 0.32rem;
        margin-left: 0.24rem;
    }
    .margin-base {
        width: 100%;
        height: 0.24rem;
        background: #F5F5F5;
    }
    .trip-share {
        width: 5.54rem;
        height: 1.08rem; 
        line-height: 1.08rem; 
        font-size: 0.34rem;
        color:rgba(32,32,32,1);
        background:rgba(255,227,0,1);
        border-radius: 0.24rem;
        margin: 0.34rem 0.98rem;
        text-align: center;
    }
    /* 按钮 */
    .downapp, .returnhome {
        width: 45%;
        background:rgba(255,227,0,1);
        /* display: inline-block; */
    }
    /* .app {
        position: absolute;
        right: 0.48rem;
        text-decoration:underline;  
    } */
    .trip-bottom {
        width: 100%;
        height: 1.48rem;
        background: url('../../static/img/riding/pic02@2x.png') 100% no-repeat;
        background-size: 100%;
    }
</style>
