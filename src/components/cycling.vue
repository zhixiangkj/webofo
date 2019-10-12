<template>
    <div class="cycling">
        <div class="cycling-head">
            <span class="cycling-headLeft"></span>
            <h2>Push the lever of the lock and end the trip.</h2>
        </div>   
        <div class="cycling-map" id="cycling-map"></div>
        <div class="logo"></div>
        <div class="cycling-list">
            <div class="trip-cost">
                <img src="/static/img/riding/icons_定位 copy 4@2x.png">
                <span>Riding Time</span>
            </div>
            <div class="cycling-time" id="cycling-time">{{newtime}}</div>
            <button class="close" @click="closeList()">TRIP COMPLETED</button>
        </div>
        <div v-if="load" class="base-shadow">
            <img src="../../static/img/riding/load.gif">
        </div>
        <div v-if="unlock" class="list">{{list}}</div>
    </div>
</template>
<script>
    // Global  site  tag  (gtag.js)  -  Google  AdWords:  807835785
    // window.dataLayer  =  window.dataLayer  ||  [];
    // function  gtag(){dataLayer.push(arguments);}
    // gtag('js',  new  Date());
    // gtag('config',  'AW-807835785');

    // Event  snippet  for  ofo-pwa-Password-tracking  conversion  page 
    import $ from 'jquery';
    import fingerprintjs2 from 'fingerprintjs2' 
    export default {
        name: "Cycling",
        data () {
            return {
                suc: null,
                orderno: null,
                // lastTime: Date.now(),
                newtime: '00:00:00',
                // firstTime: null,
                load: false,
                unlock: false,
                list: '',
                clearTimer: null
            }
        },
        created: function () {
            var _this = this;
            // unfinished
            //  未结束订单 
            if (!localStorage.getItem('token') && !localStorage.getItem('latitude') && !localStorage.getItem('longitude')) {
                // _this.list = 'You have no unfinished trip!';
                // _this.unlock = true;
                this.$router.push({path: '/'})
                /*new fingerprintjs2().get(function(results, components) {
                    var getToken = {
                        idfa: results,
                        source: 3,
                        lat: localStorage.getItem('latitude'),
                        lng: localStorage.getItem('longitude'),
                        'source-version': 100,
                        channel: 10000,
                    }
                    $.ajax({
                        method: 'POST',
                        // url: 'https://ofoapi-qa.ofo.com/api/noSignUp/getToken',
                        url: '//one.ofo.com/api/noSignUp/getToken',
                        data: getToken,
                        success: function (result) {
                            console.log('已成功获取token', results, result, 'result')
                            if (result.errorCode == 200) {
                                localStorage.setItem('token', result.values.token)
                                undefinedList ()
                                //  存取剩余次数
                                localStorage.setItem('freeTimesLeft', result.values.freeTimesLeft)
                            } else {
                                console.log(result.msg)
                            }
                        },
                        error: function (error) {
                            console.log(error, 'error')
                        }
                    })
                })*/
            } else {
                undefinedList ();
            }
            // unfinished
            // 未结束订单  
            function undefinedList () {
                var postData = {
                    token: localStorage.getItem('token'),
                    source: 3,
                    'source-version': 100,
                    channel: 10000,
                }
                $.ajax({
                    method: 'POST',
                    // url: 'https://ofoapi-qa.ofo.com/unfinished',
                    url: '//one.ofo.com/unfinished',
                    data: postData,
                    success: function (result) {
                        if (result.errorCode == 40003) {
                            _this.nobycar = true;
                            // sessionStorage.setItem('lastTime', result.values.lock.datetime);
                            console.log(result.values.orderTimeLen)
                            localStorage.setItem('orderTimeLen', result.values.orderTimeLen)
                            // _this.lastTime = result.values.lock.datetime;
                            localStorage.setItem('orderno', result.values.orderno);

                            // console.log('未结单正在骑行中  cycling  ---   56 ---  unfinished ---> lastTime', result.values.lock.datetime)
                            console.log(result.values.lock.datetime)
                            console.log('正在骑行', localStorage.getItem('orderno'),  '骑行时间');
                        } else if (result.errorCode == 200) {
                            clearInterval(_this.clearTimer)
                            _this.list = 'You have no unfinished trip!';
                            _this.unlock = true;
                            setTimeout(function() {
                                _this.$router.push({path: '/'})
                            }, 2000)
                            console.log(result.msg, 'cycling  ---  66   已经结束订单，请回到主页 ---    ')
                        } else if (result.errorCode == 10003) {
                            _this.list = result.msg
                            clearInterval(_this.clearTimer)
                            _this.unlock = true;
                            setTimeout(function() {
                                _this.$router.push({path: '/'})
                            }, 2000)
                            console.log('为之对错误，请查看错误 ---- 》 ', result.errorCode, result )
                        }
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            }
        },
        mounted: function() {
            gtag('config', gtagId, {
                'page_title' : 'RidingPagePV',
                'page_path': '/cycling'
            });
            var _this = this;
            if (sessionStorage.getItem('suc')) {
                this.suc = JSON.parse(sessionStorage.getItem('suc'));
            } else {
                console.log('不存在订单信息, 用户从已经退出浏览器或者清除用户信息，在从其他页面中跳进来')
            }
            //  车牌号 是否存在   时间是否存在  成功的订单是否存在
            if (localStorage.getItem('orderno')) {
                this.orderno = localStorage.getItem('orderno');
            } else {
                console.log('不存在订单信息车牌号')
            }
            if (localStorage.getItem('orderTimeLen')) {
                var orderTimeLen = localStorage.getItem('orderTimeLen')
                console.log(localStorage.getItem('orderTimeLen'), '不存在对时间，先来看看存在对时间是多长', this.lastTime)
                // time
                time_fun(orderTimeLen);
            } else {
                this.newtime = '00:00:00';
                time_fun();
                console.log(localStorage.getItem('orderTimeLen'), '不存在对时间，先来看看存在对时间是多长', this.lastTime)
                console.log('不存在订单信息时间')
                // _this.$router.push({path: '/'})
            }
            // 浏览器是否关闭
            var hidden, visibilityChange; 
            if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document.webkitHidden !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            }
            function handleVisibilityChange () {
                if (document[hidden]) {
                    console.log('一离开')
                } else {
                    console.log(_this.newtime)
                    // _this.newtime = Date.now();
                    console.log('已经入')
                }
            }
            document.addEventListener(visibilityChange, handleVisibilityChange, false);

            // 时间
            function two_char(n) {
                return n >= 10 ? n : "0" + n;
            }
            function time_fun(orderTimeLen) {
                var sec = orderTimeLen || 0;
                console.log(sec)
                _this.clearTimer = setInterval(function () {
                    console.log(sec)
                    sec++;
                    var date = new Date(0, 0)
                    date.setSeconds(sec);
                    var h = date.getHours(), m = date.getMinutes(), s = date.getSeconds();
                    _this.newtime = two_char(h) + ":" + two_char(m) + ":" + two_char(s);
                    localStorage.setItem('orderTimeLen', sec)
                }, 1000);
                
            }
            //  map
            initMap();
            // Create the map.
            function initMap() {
                
                var map = new google.maps.Map(document.getElementById('cycling-map'), {
                    mapTypeControl: false,
                    scaleControl: true,
                    panControl: true,
                    streetViewControl: true,
                    fullscreenControl: false,
                    zoom: 15,
                    center: {lat: parseFloat(localStorage.getItem('latitude')), lng: parseFloat(localStorage.getItem('longitude'))},
                });
                var marker = new google.maps.Marker({
                    position: map.getCenter(),
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 12,
                        fillColor: '#3D78FF',
                        fillOpacity: 1,
                        strokeColor: '#9ab8fa',
                        strokeWeight: 8
                    },
                    draggable: true,
                    map: map
                })
            }
            
        },
        methods: {
            closeList () {
                var _this = this;
                _this.load = true;
                clearInterval(_this.clearTimer)
                if (!(localStorage.getItem('token') && localStorage.getItem('latitude') && localStorage.getItem('longitude') && _this.orderno)) {
                    console.log('没有token/latitude/longitude/orderno， cycling --- 166  ')
                    this.list = ''
                    return
                }
                gtag('event', 'TripFinishClicks', {
                    'event_label': '/cycling',
                    'event_category': 'event'
                });
                // 自动支付_this.suc.values.orderno
                var postData = {
                    token: localStorage.getItem('token'),
                    lat: localStorage.getItem('latitude'),
                    lng: localStorage.getItem('longitude'),
                    orderno: _this.orderno,
                    source: 3,
                    'source-version': 100,
                    channel: 10000,
                }
                $.ajax({
                    method: 'POST',
                    // url: 'https://ofoapi-qa.ofo.com/endAndPay',
                    url: '//one.ofo.com/endAndPay',
                    data: postData,
                    success: function (result) {
                        _this.load = false
                        console.log('结束骑行 cycling --- 200 --- 184 --- 支付订单成功', result, result.msg);
                        if (result.errorCode == 200) {
                            clearInterval(_this.clearTimer)
                            _this.$router.push({name: 'End'})
                            localStorage.setItem('freeTimesLeft', result.values.payInfo.freeTimesLeft)
                        } else if (result.errorCode == 40006) {
                            console.log('结束骑行 cycling ----  40006 --- 184 --- 支付订单成功', result.msg);
                            _this.$router.push({path: '/'})
                        }
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .cycling {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
    }
    /*  */
    
    .cycling-head {
        width: 100%;
        height: 1rem;
        background:rgba(255,255,255,1);
        box-shadow: 0rem 0.02rem .46rem 0rem rgba(0,0,0,0.1);
        border-radius: 0rem 0rem 0.32rem 0.32rem; 
    }
    .cycling-head > h2 {
        width: 6.86rem;
        height:0.6rem; 
        font-size:0.34rem;
        color:rgba(32,32,32,1);
        line-height:0.4rem;
        margin: 0.24rem 0.32rem 0.24rem 0.32rem;
    }
    .cycling-head > .cycling-headLeft {
        display: inline-block;
        width: 0.08rem;
        height: 0.24rem;
        background:rgba(255,227,0,1);
        border-radius: 0rem 0.06rem 0.06rem 0rem;
        position: absolute;
        left: 0rem;
        top: 0.31rem;
    }


    /*  */
    .logo {
        position: absolute;
        left: 0.24rem;
        top: 1.25rem;
        width: 1.04rem;
        height: 0.52rem;
        background: url('../../static/img/riding/Group2@2x.png') no-repeat;
        background-size:  100%;
    }
    .cycling-map {
        flex: 1;
    }
    .cycling-list {
        width:7.5rem;
        height:5rem; 
        background:rgba(255,255,255,1);
        box-shadow: 0rem 0rem 0.46rem 0rem rgba(0,0,0,0.1);
        border-radius: 0.32rem 0.32rem 0rem 0rem;
        /* position: absolute;
        left: 0;
        bottom: 0; */
    }
    .trip-cost {
        margin: 0.46rem 0.52rem 0rem 2.36rem;
    }
    .trip-cost > img {
        width: 0.46rem;
        height: 0.46rem;
        margin: 0.02rem 0rem 0rem 0rem;
        display: inline-block;
    }
    .trip-cost > span {
        width: 2.14rem;
        height: 0.46rem; 
        font-size: 0.38rem;
        font-weight: bold;
        color:rgba(32,32,32,1);
        line-height: 0.46rem;
        margin-left: 0.2rem;
    }
    .cycling-time {
        width: 5rem;
        height: 1.34rem; 
        font-size: 1.2rem;
        color:rgba(210,210,210,1);
        line-height: 1.6rem;
        text-align: center;
        margin: 0.66rem 1.2rem  0rem 1.3rem;
    }
    .cycling-list > .close {
        width: 3.14rem;
        height: 1.06rem;
        background: #ffffff;
        border: 1px solid #ccc;
        border-radius: 0.24rem;
        position: absolute;
        bottom: 0.36rem;
        left: 50%;
        margin-left: -1.57rem;
    }
    /* base-shadow */
    .base-shadow {
        width: 2rem;
        height: 2rem;
        background: #fff;
        border-radius: 6vw;
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 10;
        transform: translate3d(-50%, -50%, 0);
        line-height: 2rem;
        text-align: center;
    }   
    .base-shadow > img {
        width: 2rem;
        vertical-align: middle;
    }
    .list {
        width: 60%;
        color: #ffffff;
        font-size: .3rem;
        background: rgba(0,0,0,0.5);
        padding: 0.1rem 0.2rem;
        border-radius: 0.2rem;
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0)
    }
</style>
