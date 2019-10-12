<template>
    <div class="home-page">
        <div class="home-map" id="home-map"></div>
        <div class="logo"></div>
        <div class="home-unlock unlock-border">
            <div class="unlock-btn">
                <img src="../../static/img/home-slices/sacncopy2@2x.png" @click='unlockBtn()' alt="">
                <div class="unlock">UNLOCK</div>
                <div class="location" @click="location()"><img src="../../static/img/home-slices/location@2x.png" alt=""></div>
                <div class="query" @click="guide"><img src="../../static/img/home-slices/query@2x.png" alt=""></div>
            </div>
        </div>
         <div class="dialog" v-if="show">
           <div class="dailog-img">
               <div  v-for="value in guideData" :key="value.id" class="dialog-top">
                    <div v-if="value.id == index? true : false" class="dialog-list">
                        <div class="dialog-list-img">
                            <img :src="value.imgSrc">
                        </div>
                        <div class="guide-list">
                            <h3>{{value.title}}</h3>
                            <p class="">{{value.content}}<a href="https://onecommon.ofo.com/helloworld/policy/index.html" v-if="value.id == 0" style="text-decoration: underline;color:#0206cd;">user policy</a></p>
                            <button @click="next">{{value.clickBtn}}</button>
                        </div>
                    </div>
               </div>
           </div>
        </div>
        <div class="locationMsg" v-if="locationMsg">{{locationValue}}</div>
    </div>
</template>
<script>

    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'AW-807835785');

    import geoFindMe from '../common/js/getLat.js'
    // geoFindMe();
    import $ from 'jquery';
    import fingerprintjs2 from 'fingerprintjs2'
    var map, marker;
    // window.google = null;
export default {
  name: 'home',
  data () {
      return {
          lat: null,
          lng: null,
          map: null,
          marker: null,
          flag: false,
          index: 0,
          show: false,
          locationMsg: false,
          locationValue: null,
          markerLocal: {
              lat: '',
              lng: ''
          },
          guideData: [
              {
                  id: 0,
                  imgSrc:"../../static/img/riding/1@2x.png",
                  title: '1.How to find a bike',
                  content: 'You can find in App or on the street',
                  clickBtn: 'Next'
              },
              {
                  id: 1,
                  imgSrc:"../../static/img/riding/2@2x.png",
                  title: '2.How to unlock',
                  content: 'Scan the QR code on bike or lock to unlock.',
                  clickBtn: 'Next'
              },
              {
                  id: 2,
                  imgSrc:"../../static/img/riding/3@2x.png",
                  title: '3.How to return',
                  content: 'Push the lever of the lock to end the trip, and park anywhere you want.',
                  clickBtn: 'Next'
              }
          ]
      }
  },
  created () {
    console.log(navigator.language)
    // console.log(window.gtagId, gtagId)
    //
    // http://kayak.ofo.com/?geo=cn&channel_id=&channel_name=ali&sub_param1=&sub_param2
  },
  mounted () {
      gtag('config', gtagId, {
        'page_title' : 'HomePagePV',
        'page_path': '/home'
      });
      var _this = this;
      // //测试
    // localStorage.setItem('latitude', 32.7825469)
    // localStorage.setItem('longitude', -96.8255683)
    // 定位
    function getLocation () {
        if (navigator.geolocation) {
            var options = { enableHighAccuracy: true, maximumAge: 0 }
            // alert('正在获取你的定位')
            navigator.geolocation.getCurrentPosition(success, error, options)

            function success (position) {
                // alert('正在获取你的定位')
                localStorage.setItem('latitude', position.coords.latitude)
                localStorage.setItem('longitude', position.coords.longitude)
                getLat ()

                var latitude = position.coords.latitude
                var longitude = position.coords.longitude

                initMap (latitude, longitude)
                // 把经纬度存到本地缓存中
                console.log('longitude---' + longitude + '---latitude:' + latitude)
                return true
            }
            function error () {
                console.log('无法获取您的位置')
                _this.locationMsg = true
                switch(error.code){
                    case error.TIMEOUT:
                    _this.locationValue = "Connection timeout. Please refresh the page and try again";break;
                    case error.PERMISSION_DENIED:
                    _this.locationValue = "You have denied the location sharing service, the query has been cancelled";break;
                    case error.POSITION_UNAVAILABLE:
                    _this.locationValue = "Sorry, location service is currently unavailable";break;
                    default: _this.locationValue = "Sorry, please accept your browser's permission request";
                }
                setTimeout(function() {
                    _this.locationMsg = false
                }, 2500)
                return false
            }
        }
    }
     var _this = this;
     if (localStorage.getItem('latitude') && localStorage.getItem('longitude')) {
         getLocation ()
    } else {
        getLocation ()
        console.log('不存在你的位置信息')
    }



    function getLat () {
            // 获取设备的唯一表示
        if (!localStorage.getItem('token')) {
            new fingerprintjs2().get(function(results, components) {
                var getToken = {
                    idfa: results,
                    source: 3,
                    lat: localStorage.getItem('latitude'),
                    lng: localStorage.getItem('longitude'),
                    channel: 10000,
                    'source-version': 100
                }

                $.ajax({
                    method: 'POST',
                    // url: 'https://ofoapi-qa.ofo.com/api/noSignUp/getToken',
                    url: '//one.ofo.com/api/noSignUp/getToken',
                    data: getToken,
                    success: function (result) {
                        // console.log('已成功获取token', results, result, 'result')
                        // errorCode : 200
                        if (result.errorCode == 200) {
                            // 存取token
                            // 存取剩余次数
                            // 检测有没有未完成的订单
                            // 获取附近车辆
                          console.log(result)
                            localStorage.setItem('token', result.values.token)
                            localStorage.setItem('freeTimesLeft', result.values.freeTimesLeft)
                            Unfinished ()
                            getNearCar ()
                        } else if (result.errorCode == 40001) {
                            _this.$router.push({path: '/'})
                            console.log(result.msg + '定位失败')
                        }
                    },
                    error: function (error) {
                        console.log(error, 'error')
                    }
                })
            })
        } else {
            Unfinished ();
            getNearCar ();
        }
    }

    // 订单查询
    function Unfinished () {
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

                if (result.errorCode == 200) {
                    console.log('不存在信息，进行下一单解锁')
                    return
                } else if (result.errorCode == 40003) {
                    //  先存储一下 未接单的单号  在接单的时候就获取单号
                    console.log('先存储一下 未接单的单号  在接单的时候就获取单号    调用结单 ----    home unfinished 163')
                    localStorage.setItem('orderno', result.values.orderno)
                    localStorage.setItem('orderTimeLen', result.values.orderTimeLen)
                    console.log('正在骑行', localStorage.getItem('orderno'),  '骑行时间');
                    _this.$router.push({path: '/cycling'})
                } else if (result.errorCode == 10003) {
                    localStorage.setItem('token', '');
                    getLat ()
                    _this.locationMsg = !_this.locationMsg
                    _this.locationValue = result.msg
                    setTimeout(function() {
                        _this.locationMsg = !_this.locationMsg
                    }, 2500)
                    console.log('未之对错误，对错误， code --- 》 ', result.errorCode)
                }
            },
            error: function (error) {
                console.log(error)
            }
        })
        if (!localStorage.getItem('orderno')) {return}
    }
    // 获取附近车辆
    function getNearCar () {
        //  获取结单消息   200 没有未完成订单
        // 附近车辆
        var postData = {
            token: localStorage.getItem('token'),
            lat: localStorage.getItem('latitude'),
            lng: localStorage.getItem('longitude'),
            source: 3,
            'source-version': 100,
            channel: 10000,
        }
        $.ajax({
            method: 'POST',
            url: '//one.ofo.com/nearbyofoCar',
            // url: 'https://ofoapi-qa.ofo.com/nearbyofoCar',
            data: postData,
            success: function (result) {

                if (result.errorCode == 200) {

                    var beaches = result.values.cars;

                    // console.log(beaches, 'cars')

                    if (beaches.length) {
                        setMaps(beaches)
                    } else {
                        _this.locationMsg = true
                        _this.locationValue = 'Sorry, we cannot find any bikes around you at the moment.';
                        console.log('Sorry, we cannot find any bikes around you at the moment.')
                    }
                    setTimeout(function() {
                        _this.locationMsg = false
                    }, 2500)
                } else if (result.errorCode == 10003) {
                    console.log(result.msg)
                }
            },
            error: function (error) {
                console.log(error, 'error')
            }
        })
    }
    // 为了保证Google map的正常运行
    // setTimeout(function() {
    setMaps()
    function initMap (lat, lng) {

        map = new google.maps.Map(document.getElementById('home-map'), {
            mapTypeControl: false,
            scaleControl: true,
            panControl: true,
            streetViewControl: true,
            fullscreenControl: false,
            zoom: 16,
            center: {lat:parseFloat(lat), lng: parseFloat(lng)}
        });
        _this.map = map;
        marker = new google.maps.Marker({
            position: {lat:parseFloat(lat), lng: parseFloat(lng)},
            icon: {
                url: '../../static/img/home-slices/nail@2x.png',
                scaledSize: new google.maps.Size(25, 45)
            },
            zIndex: 50,
            map: _this.map
        });
    }
        // 绘制地图
    function setMaps (beaches) {
        // debugger
        // console.log(beaches)
        if (google) {
            init();
        }
        function init () {
            // alert('init')

            // 提出到initMap

            // map = new google.maps.Map(document.getElementById('home-map'), {
            //     mapTypeControl: false,
            //     scaleControl: true,
            //     panControl: true,
            //     streetViewControl: true,
            //     fullscreenControl: false,
            //     zoom: 15,
            //     center: {lat:parseFloat(localStorage.getItem('latitude')), lng: parseFloat(localStorage.getItem('longitude'))}
            // });
            // _this.map = map;
            var geocoder = new google.maps.Geocoder;
            // var infowindow = new google.maps.InfoWindow;
            geocodeLatLng(geocoder);

            setWorker(_this.map)
        }
        // console.log(beaches, 'beaches')
        //  传入参数  定义的变量

        //  通过经纬度获取当地位置
        function geocodeLatLng(geocoder) {
            var latlng = {lat: parseFloat(localStorage.getItem('latitude')), lng: parseFloat(localStorage.getItem('longitude'))};
            geocoder.geocode({'location': latlng}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                    // _this.map.setZoom(15);

                    // 提出到 initMap中
                    // var marker = new google.maps.
                      //Marker({
                    //     position: latlng,
                    //     icon: {
                    //         url: '../../static/img/home-slices/nail@2x.png',
                    //         scaledSize: new google.maps.Size(25, 45)
                    //     },
                    //     map: _this.map
                    // });
                    // console.log(results[0].formatted_address, 'results[0].formatted_address')
                    var infowindow = new google.maps.InfoWindow({
                      content: results[0].formatted_address,
                      disableAutoPan: true, // 阻止地图滑动
                    });
                    infowindow.open(_this.map, marker);
                    } else {
                    // window.alert('No results found');
                    }
                } else {
                    // window.alert('Geocoder failed due to: ' + status);
                }
            })
        }
        // 附近车辆经纬度
        function setWorker(map) {
            _this.marker = marker;
            // alert(beaches, 'beaches')
            if (beaches) {
                // console.log('beaches 280' + beaches)
                // 更新位置
                google.maps.event.addListener(marker,'click',function() {
                    map.setZoom(20);
                    map.setCenter(marker.getPosition());
                });
            } else {
                console.log('无参数')
            }
        }
    }
  },
  methods: {
      unlockBtn () {
        gtag('event', 'UnlockClicks', {
          'event_label': '/home',
          'event_category': 'event'
        });
        var _this = this;
        if (localStorage.getItem("freeTimesLeft") == '0') {
            this.locationMsg = !this.locationMsg
            this.locationValue = 'Please download our app for free riding times';
            setTimeout(function() {
                _this.locationMsg = !_this.locationMsg
                _this.$router.push({path: '/end'})
            }, 2500)
        } else {
            this.$router.push({path: '/scancode'})
        }
      },
      location () {
        geoFindMe()
        this.map.setCenter({lat: parseFloat(localStorage.getItem('latitude')), lng: parseFloat(localStorage.getItem('longitude'))})
      },
      guide () {
          gtag('event', 'TutorialClicks', {
            'event_label': '/home',
            'event_category': 'event'
          });
          this.show = true;
      },
      next () {
          ++this.index;
          if (this.index > 2) {
              this.show = false;
              this.index = 0;
          }
      }
  }
}
</script>
<style scoped>
    .home-page {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .home-map {
        flex: 1;
    }
    /* logo */
    .logo {
        position: absolute;
        left: 0.24rem;
        top: 0.2rem;
        width: 1.04rem;
        height: 0.52rem;
        background: url('../../static/img/riding/Group2@2x.png') no-repeat;
        background-size:  100%;
    }
    .home-unlock {
        width:7.5rem;
        height:2.36rem;
        background:rgb(255, 255, 255);
        border-top-left-radius:0.32rem;
        border-top-right-radius:0.32rem;
    }

    .unlock-red {
        width:2.12rem;
        height:1.12rem;
        background:rgba(239,85,126,1);
        border-radius:2rem;
        position: absolute;
        right: -0.15rem;
        top: 0.1rem;
        transform: rotate(135deg);
    }
    .unlock-btn {
        position: relative;
    }
    .unlock-btn > img {
        width: .78rem;
        height: .64rem;
        display: block;
        margin: 0.52rem 3.36rem 0.24rem 3.36rem ;
    }
    .unlock {
        text-align: center;
        font-size: 0.46rem;
        color:rgba(32,32,32,1);
        line-height:0.56rem;
        font-weight: bold;
        font-family: sans-serif;
    }
    /* 刷新定位 */

    /* 用户指南 */
    .location, .query {
        width: 0.46rem;
        height: 0.46rem;
        position: absolute;
    }
    .location > img, .query > img {
        width: 100%;
        height: 100%;
    }
    .location {
        left: 0.62rem;
        bottom: 0.8rem;
    }
    .query {
        right: 0.62rem;
        bottom: 0.8rem;
    }

    /* 去除Google ，map 的标注 */
    .gm-style > .gmnoprint > .gm-svpc {
        display: none!important;
        position: absolute!important;
        right: 0!important;
    }

    /* dailog */
    .dialog {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: rgba(0,0,0,0.6)
    }
    .dailog-img {
        width: 6.22rem;
        height: 9.76rem;
        background: #fff;
        border-radius: 0.24rem;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
    }
    .dailog-img > .dialog-top {
        float:left;
    }
    .dailog-img  .dialog-list-img {
        width: 6.22rem;
        height: 5.4rem;
    }
    .dailog-img img {
        width: 100%;
        height: 100%;
        display: block;
    }
    /* 用户指南 */
    .guide-list {
        padding: 0.28rem 0.36rem 0.24rem;
    }
    .guide-list > h3 {
        width: 5.5rem;
        height: 0.56rem;
        font-size: 0.46rem;
        color:rgba(32,32,32,1);
        line-height: 0.7rem;
    }
    .guide-list > p {
        width: 5.5rem;
        height: 0.8rem;
        font-size: 0.34rem;
        color:rgba(32,32,32,1);
        line-height: 0.5rem;
        margin: 0.3rem 0;
    }
    .guide-list > button {
        outline: none;
        width: 5.5rem;
        height: 1.08rem;
        font-size: 0.34rem;
        line-height: 0.4rem;
        color:rgba(32,32,32,1);
        border: none;
        background: rgba(255,227,0,1);
        border-radius: 0.24rem;
        margin-top: 0.6rem;
    }
    /* locationMsg */
    .locationMsg{
        width: 60%;
        text-align: center;
        padding: 0.2rem;
        border-radius: 0.2rem;
        color: #ffffff;
        background: rgba(0,0,0,0.6);
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
    }

    /* user policy */
    .guide-list a {
        display: block;
    }
</style>
