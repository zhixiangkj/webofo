// 扫码
import qrcode from './qr_packed.js'
var $ = require('jquery')
var gCtx = null
var gCanvas = null
var gUM = false
var webkit = false
var moz = false
var ios = false
var video = null

function initCanvas (w, h) {
  console.log('绘制出canvas的宽高    clearRect， webqr  ----   78', w, h)
  gCanvas = document.getElementById('qr-canvas')

  gCanvas.style.width = 100 + 'vw'
  gCanvas.style.height = 100 + 'vh'
  gCanvas.width = w
  gCanvas.height = h
  gCtx = gCanvas.getContext('2d')
  gCtx.clearRect(0, 0, w, h)
}

// // 画图/video   canvas 画出vedio内容
console.log('画图/video   canvas 画出vedio内容, ----  webqr   canvas --- > vedio   91')
function captureToCanvas () {
  if (gUM) {
    try {
      gCtx.drawImage(v, 0, 0)
      try {
        qrcode.decode()
      } catch (e) {
        // console.log(e)
        setTimeout(captureToCanvas, 500)
      }
    } catch (e) {
      // console.log(e)
      setTimeout(captureToCanvas, 500)
    }
  }
}

function htmlEntities (str) {
  // console.log(str)
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
function load () {
  // 创建绘图环境
  if (isCanvasSupported() && window.File && window.FileReader) {
    var width = document.documentElement.clientHeight
    var height = document.documentElement.clientWidth
    initCanvas(width, height)
    qrcode.callback = read
    document.getElementById('mainbody').style.display = 'block'
    setwebcam()
  } else {
    document.getElementById('mainbody').style.display = 'block'
  }
}
//  获取车牌号
function read (a) {
  console.log(a)
  //  获取车牌号
  var number = htmlEntities(a).split('/')
  var newCarno = number[number.length - 1]
  var baseShadow = document.getElementsByClassName('base_shadow')[0]
  var scanlist = document.getElementsByClassName('scanlist')[0]
  baseShadow.style.display = 'block'

  // https://ofo.com/oneplate/60409252

  // 请求单车密码
  var postData = {
    token: localStorage.getItem('token'),
    lat: localStorage.getItem('latitude'),
    lng: localStorage.getItem('longitude'),
    source: 3,
    'source-version': 100,
    channel: 10000,
    carno: newCarno
  }
  $.ajax({
    method: 'POST',
    // url: 'https://ofoapi-qa.ofo.com/carno', // 测试
    url: '//one.ofo.com/carno',
    data: postData,
    success: function (result) {
      baseShadow.style.display = 'none'
      // 跳转解锁页
      if (result.errorCode == 200) {
        // 存时间 为了以后下次计算时间铺垫
        console.log('存时间 为了以后下次计算时间铺垫, webqr --- 161  订单成功')
        // localStorage.setItem('firstTime', result.values.lock.datetime)
        localStorage.setItem('orderno', result.values.orderno)
        // alert('200')
        console.log(200)
        console.log('//kayak.ofo.com/#/endAndPay')
        location.href = '/#/endAndPay'
        sessionStorage.setItem('suc', JSON.stringify(result))
      } else if (result.errorCode == 30005) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/cycling'
        }, 2500)
        scanlist.innerHTML = result.msg
        // console.log('error', result.msg)
      } else if (result.errorCode == 40078) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/end'
        }, 2500)
        scanlist.innerHTML = result.msg
      } else if (result.errorCode == 40003) {
        // 未结单
        // console.log('未结单', result.msg)
        sessionStorage.setItem('orderno', result.values.orderno)
        sessionStorage.setItem('lastTime', result.values.lock.datetime)
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/cycling'
        }, 2500)
        scanlist.innerHTML = result.msg
      } else if (result.errorCode == 30009) {
        console.log('webqr --- 30009 ---> 跳转home页  进入非法区域 178', result.msg)
        // 车辆停靠在非法区域
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/'
        }, 2500)
        scanlist.innerHTML = result.msg
      } else if (result.errorCode == 30004) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/'
        }, 2500)
        console.log('30004 ---> 跳转home页  没又此辆车  请换辆车试试', result.msg)
        scanlist.innerHTML = result.msg
      } else if (result.errorCode == 50000) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          // location.href = '/#/'
        }, 2500)
        console.log('50000 ---> 跳转end页  进入非法区域', result.msg)
        scanlist.innerHTML = result.msg
      } else if (result.errorCode == 50001) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          // location.href = '/#/'
        }, 2500)
        console.log('50001 ---> 服务器相应', result.msg)
        scanlist.innerHTML = result.msg
      } else {
        console.log('结单不成功')
        console.log(result.msg)
        // alert('结单')
        // scanlist.style.display = 'block'
        // setTimeout(function () {
        //   scanlist.style.display = 'none'
        //   // location.href = '/#/'
        // }, 2500)
        // scanlist.innerHTML = result.msg
      }
    },
    error: function (error) {
      console.log(error)
    }
  })
}

// 绘制画图环境
function isCanvasSupported () {
  var elem = document.createElement('canvas')
  return !!(elem.getContext && elem.getContext('2d'))
}

function setwebcam () {
  var options = true
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    try {
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach(function (device) {
          if (device.kind === 'videoinput') {
            if (device.label.toLowerCase().search('back') > -1) {
              // alert('back')
              options = { 'facingMode': { exact: 'environment' } }
            } else {
              // alert('device.deviceId' + device.deviceId)
              options = { 'deviceId': { 'exact': device.deviceId }, 'facingMode': 'environment' }
            }
          }
          // console.log(
          //   device.kind + ': ' + device.label + ' id = ' + device.deviceId
          // )
        })
        setwebcam2(options)
      })
    } catch (e) {
      // console.log(e)
    }
  } else {
    // console.log('no navigator.mediaDevices.enumerateDevices')
    setwebcam2(options)
  }
}

//  开启摄像头  并 绘制vedio的 大小

console.log('开启摄像头  并 绘制vedio的 大小, ---   webqr 开启摄像头 272')

function setwebcam2 (options) {
  var n = navigator
  document.getElementById('v').style.width = '100vw'
  document.getElementById('v').style.height = '100vh'
  let scanlists = document.getElementsByClassName('scanlist')[0]
  video = document.getElementById('v')
  // n.mediaDevices.getUserMedia({audio: false, video: options}).then(success).catch(error)
  var reg = /(Chrome)/
  var phoneReg = /(Google)/
  // chrome - phone "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
  // ios - pc       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15"
  // chrome - pc    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
  // ios - phone    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1"

  if (!reg.test(navigator.userAgent)) {
    // alert('iosdeviceid --- ' + options.deviceId.exact)
    if (!phoneReg.test(navigator.vendor)) {
      // alert('====' + n.getUserMedia)
      if (n.mediaDevices) {
        n.mediaDevices.getUserMedia({audio: false, video: { 'facingMode': { exact: 'environment' } }}).then(success).catch(error)
      } else {
        scanlists.style.display = 'block'
        setTimeout(function () {
          scanlists.style.display = 'none'
        }, 2500)
        scanlists.innerHTML = 'This browser not support camera feature now, please use Safari instead.'
      }
    // alert('ios')
    } else {
      n.getUserMedia({audio: false, video: options}, success, error)
    }
    // console.log(navigator.vendor)
    // alert(navigator.vendor)
    // console.log(stream.getVideoTracks())
    // n.getUserMedia({audio: false, video: { 'facingMode': { exact: 'environment' } }}, success, error)
  } else {
    // alert('chrome' + options.deviceId.exact)
    n.getUserMedia({audio: false, video: options}, success, error)
  }
  // console.log(MediaStreamTrack.prototype)
  // n.MediaStreamTrack.getSources(function (sourceInfos) {
  //   console.log(sourceInfos)
  // })
  // var ua = navigator.userAgent.toLowerCase()
  // alert(ua + navigator.userAgent)
  // if(ua.indexOf('chrome')>=0) alert('是Chrome浏览器')
  // n.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  // if (n.getUserMedia) {
  //   webkit = true
  // alert('n.getUserMedia' + n.getUserMedia)
  //   console.log('n.getUserMedia' + n.mediaDevices)
  //   console.log(n.mediaDevices)
  //   n.mediaDevices.getUserMedia({audio: false, video: options}).then(success).catch(error)
  //   // n.getUserMedia(options, success, error)
  // } else {
  //   alert('n.else')
  // }

  //  视频回调

  function success (stream) {
    // alert('success - webkit---' + webkit)
    // video.srcObject = stream
    // video.play()
    // // alert(stream.getVideoTracks() + '220')
    // alert(stream.getVideoTracks()[0].label + '236')
    // console.log(stream.getVideoTracks()[0].label + '236')
    // console.log(stream.getTracks())
    // var videoTracks = stream.getVideoTracks()
    // alert(videoTracks[0].id)
    // alert(videoTracks[1])
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL
    stream.oninactive = function () {
      console.log('Stream inactive')
    }
    window.stream = stream
    video.srcObject = stream // ios safari  黑屏不显示内容
    video.play()

    // if (webkit) {

    //   alert('success-webkit' + 'z240')

    //   // video.src = window.webkitURL.createObjectURL(stream)
    //   video.srcObject = stream   // ios safari  黑屏不显示内容
    //   video.play()
    // } else if (moz) {

    //   alert('success-moz' + '244')

    //   video.mozSrcObject = stream
    //   video.play()
    // } else if (ios) {

    //   alert('success-ios' + '248')

    //   video.srcObject = stream
    //   video.play()
    // } else {

    //   alert('success-else' + '252')

    //   video.srcObject = stream
    //   video.play()
    // }

    gUM = true
    setTimeout(captureToCanvas, 500)
  }

  function error (error) {
    alert(error + '--error')
    gUM = false
    return gUM
  }

  /*
  if (n.getUserMedia) {
    alert('getUserMedia - webkit' + '306---> ' + n.mediaDevices.getUserMedia)
    webkit = true
    n.mediaDevices.getUserMedia({ video: options, audio: false }, success, error)
  } else if (n.webkitGetUserMedia) {
    alert('webkitGetUserMedia - webkit' + '310')
    webkit = true
    n.webkitGetUserMedia({ video: options, audio: false }, success, error)
  } else if (n.mozGetUserMedia) {
    alert('mozGetUserMedia - moz' + '314')
    moz = true
    n.mozGetUserMedia({ video: options, audio: false }, success, error)
  } else if (navigator.mediaDevices.getUserMedia) {
    alert('navigator.mediaDevices.getUserMedia({ video: options, audio: false }, success, error)')
    navigator.mediaDevices.getUserMedia({ video: options, audio: false }, success, error)
  } else {
    alert('ios - else' + '321')
    ios = true
    navigator.mediaDevices.getUserMedia({ video: options, audio: false }, success, error)
  }
  */
  setTimeout(captureToCanvas, 100)
}
/* if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
  // window.location.href = '你的手机版地址'
  alert('你的手机版地址')
  } else {
    // window.location.href = '你的电脑版地址'
    alert('你的电脑版地址')
  } */
export {
  load
}
