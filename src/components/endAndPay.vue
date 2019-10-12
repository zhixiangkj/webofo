<template>
    <div class="riding-page">
        <div class="riding-instr">
            <span class="riding-left"></span>
            <h2>Safety Policy</h2>
            <p>For your safety and the safety of others, please be reminded to ride safely and in accordance with applicable cycling and traffic laws and regulations.</p>
        </div>
        <div class='riding-map' id="riding-map"></div>
        <div class="logo"></div>
        <div class="riding-pwdBase">
            <div class="pwdBase-title">Code for Bike No.<span class="carno">{{carno}}</span><!-- 车牌号 --></div>
            <div class="pwdBase-number">
                <span v-for="(value, index) in password" v-bind:key='index'>{{value}}</span>
            </div>
            <button class="close" @click="closeList()">TRIP COMPLETED</button>
        </div>
        <div v-if="load" class="base-shadow">
            <img src="../../static/img/riding/load.gif">
        </div>
        <div v-if="endpay" class="endpaylist">{{unfinishedmsg}}</div>
    </div>
</template>

<script>

import $ from 'jquery';
export default {
  name: "EndAndPay",
  data () {
      return {
        latitude: null,
        longitude: null,
        suc: null,
        password: null,
        clearTime: '',
        carno: null,
        load: false,
        endpay: false,
        unfinishedmsg: ''
      }
  },
  created: function () {
      

      var _this = this;
      if (!localStorage.getItem('token') && !localStorage.getItem('latitude') && !localStorage.getItem('longitude')) {
          this.$router.push({path: '/'});
      } else {
        /*var postData = {
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
                    console.log(result.values.lock.datetime)
                    var oldOrderNo = localStorage.getItem('orderno');
                    localStorage.setItem('orderTimeLen', (result.values.orderTimeLen + 55))
                    localStorage.setItem('orderno', result.values.orderno)
                    // localStorage.setItem('freeTimesLeft', result.values.payInfo.freeTimesLeft)
                    //      判断有没有时间， 
                    console.log('判断lastTime对时间对错，则是否进行一分钟等待时间')
                    if (oldOrderNo == localStorage.getItem('orderno')) {
                        console.log('判断lastTime对时间对错，则是否进行一分钟等待时间 ------》  不等待')
                        _this.$router.push({path: '/cycling'})
                    } else {
                        console.log('正在计时，开始算时间 ---》 需要等带一分钟')
                        //  正常骑车  计时
                        _this.clearTime = setTimeout(function(){
                            console.log('正在计时，开始算时间 1分钟过去了')
                            // localStorage.setItem('orderTimeLen', (result.values.orderTimeLen + 60))
                            _this.$router.push({path: '/cycling'})
                        }, 60000)
                        console.log('正在骑行', 'sessionStorage.getItem(orderno) ---->', sessionStorage.getItem('orderno'),'localStorage.getItem(orderno) --->', localStorage.getItem('orderno'),  '骑行时间');
                    }
                    
                } else if (result.errorCode == 200) {
                    _this.unfinishedmsg = 'You have a unfinished trip'
                    // _this.unfinishedmsg = result.msg
                    _this.endpay = true
                    setTimeout(function() {
                        _this.$router.push({path: '/'})
                    }, 1000)
                    console.log('不存在信息，跳转  会有弹框提示 ', result.msg, 'endandpay --- 66' )
                } else {
                    console.log('信息不确定，为了检查出现异常bug', result)
                }
            },
            error: function (error) {
                console.log(error)
            }
        })*/
      }
    //   if (!sessionStorage.getItem('suc')) {
    //       this.$router.push({path: '/'})
    //   }
      _this.clearTime = setTimeout(function(){
        console.log('正在计时，开始算时间 1分钟过去了')
        localStorage.setItem('orderTimeLen', 60)
        clearInterval(_this.clearTime)
        _this.$router.push({path: '/cycling'})
      }, 60000)
      console.log(sessionStorage.getItem('suc'))
      if (localStorage.getItem('latitude') && localStorage.getItem('longitude') && sessionStorage.getItem('suc')) {
        //   this.latitude = localStorage.getItem('latitude');
        //   this.longitude = localStorage.getItem('longitude');
          this.suc = JSON.parse(sessionStorage.getItem('suc'));
          this.password = this.suc.values.pwd.split('');
          this.carno = this.suc.values.carno;
          console.log(this.carno);
      }
  },
  mounted: function () {
    var _this = this;
    //  获取骑行中的map
    initMap();
    function initMap() {
        // Create the map.
        var map = new google.maps.Map(document.getElementById('riding-map'), {
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
          gtag('event', 'TripFinishClicks', {
            'event_label': '/endAndPay',
            'event_category': 'event'
          });
          var _this = this;
          _this.load = true;
        //   alert(localStorage.getItem('orderno'))
          var postData = {
              token: localStorage.getItem('token'),
              lat: localStorage.getItem('latitude'),
              lng: localStorage.getItem('longitude'),
              orderno: localStorage.getItem('orderno'),
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
                _this.load = false;
                console.log('结束骑行');
                if (result.errorCode == 200) {
                    // alert(localStorage.getItem('orderno'))
                    console.log('endandpay ---- 144 coed:200 ---> end', result)
                    clearTimeout(_this.clearTime)
                    localStorage.setItem('freeTimesLeft', result.values.payInfo.freeTimesLeft)
                    _this.$router.push({path: '/end'})
                } else if (result.errorCode == 40006) {
                    _this.$router.push({path: '/end'})
                    console.log('endandpay ---- 150 coed:40006 ---> end', result)
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
    /* page页 */
    .riding-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    /* Safety Policy */
    .riding-instr {
        width: 100%;
        height: 2.24rem;
        background:rgba(255,255,255,1);
        box-shadow: 0rem 0.02rem .46rem 0rem rgba(0,0,0,0.1);
        border-radius: 0rem 0rem 0.32rem 0.32rem; 
    }
    .riding-instr > h2 {
        width: 6.42rem;
        height:0.4rem; 
        font-size:0.34rem;
        color:rgba(32,32,32,1);
        line-height:0.4rem;
        margin: 0rem 0.76rem 0rem 0.32rem;
    }
    .riding-instr > p {
        width:6.86rem;
        height:1.44rem; 
        font-size:0.3rem;
        color:rgba(32,32,32,1);
        line-height:0.36rem;
        margin: .2rem 0.32rem 0.24rem 0.32rem;
    }
    .riding-left {
        display: inline-block;
        width: 0.08rem;
        height: 0.24rem;
        background:rgba(255,227,0,1);
        border-radius: 0rem 0.06rem 0.06rem 0rem;
        position: absolute;
        left: 0rem;
        top: 0.07rem;
    }
    /* map */
    .riding-map {
        flex: 1;
    }
    .logo {
        position: absolute;
        left: 0.24rem;
        top: 2.5rem;
        width: 1.04rem;
        height: 0.52rem;
        background: url('../../static/img/riding/Group2@2x.png') no-repeat;
        background-size:  100%;
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
    /* password base */
    .riding-pwdBase {
        width: 7.5rem;
        height: 5.4rem;
        text-align: center;
        background:rgba(255,255,255,1);
        box-shadow: 0rem -1px 23rem 0rem rgba(0,0,0,0.1);
        border-radius: 0.32rem 0.32rem 0rem 0rem;
    }
    .riding-pwdBase .close {
        width: 3.14rem;
        height: 1.0rem;
        border: 1px solid #D2D2D2;
        background: #ffffff;
        border-radius: 0.24rem;
        margin: 1.18rem 0rem 0.36rem 0rem;
    }
    .pwdBase-title {
        width: 5.2rem;
        height: 0.46rem; 
        font-size: 0.38rem;
        font-weight: bold;
        color:rgba(32,32,32,1);
        line-height: 0.46rem;
        margin: 0.46rem 1.44rem 0.44rem 1.2rem;
        text-align: initial;
    }
    /* .carno {
        color: red;
    } */
    .pwdBase-number {
        width:6.46rem;
        height:1.42rem;
        margin: auto;
    }
    .pwdBase-number > span {
        display: inline-block;
        width: 1.4rem;
        height: 1.4rem;
        background:rgba(255,227,0,1);
        font-size: 1.12rem;
        font-weight: bold;
        color:rgba(32,32,32,1);
        line-height: 1.42rem;
        margin: 0 0.1rem;
        border-radius: 0.24rem;
    }
    .pwdBase-number > span:first-child{
        margin-left: 0;
    }
    .pwdBase-number > span:last-child {
        margin-right: 0; 
    }
    .endpaylist {
        width: 50%;
        text-align: center;
        padding: 0.2rem 0.4rem;
        color: #ffffff;
        background: rgba(0,0,0,0.5);
        border-radius: 0.2rem;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0)
    }
</style>
