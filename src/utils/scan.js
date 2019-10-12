// QRCODE reader Copyright 2011 Lazar Laszlo
// https://www.webqr.com

// 订单成功
// {"errorCode":200,"msg":"创建订单成功","values":{"carno":"60409252","pwd":"1412","orderno":3146829,"notice":"","refreshTime":20,"isFirstOrder":0,"price":"2.00","currency":"S$","showButtonTime":60,"lock":{"type":10,"info":{"mac":"DCA77BFE9D43","token":"0123456789012345"},"datetime":1519907643860,"newpwds":""}}}

// 结束接口
// endAndPay

// 请求参数
// token:96fcf740-0d47-11e8-98e9-f33c8177a956
// lat:1.2924539853
// lng:103.7830163249
// source:2
// orderno:104331530
// languageCode:en
// countryCode:SG
// source-version:2200
// appVersion:2.9.6
// ccc:65

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

/*  function dragenter (e) {
    e.stopPropagation()
    e.preventDefault()
  }

  function dragover (e) {
    e.stopPropagation()
    e.preventDefault()
  }
  function drop (e) {
    e.stopPropagation()
    e.preventDefault()

    var dt = e.dataTransfer
    var files = dt.files
    if (files.length > 0) {
      handleFiles(files)
    } else if (dt.getData('URL')) {
      qrcode.decode(dt.getData('URL'))
    }
  }

  function handleFiles (f) {
    for (var i = 0; i < f.length; i++) {
      var reader = new FileReader()
      reader.onload = (function (theFile) {
        return function (e) {
          gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
          qrcode.decode(e.target.result)
        }
      })(f[i])
      reader.readAsDataURL(f[i])
    }
  }
*/
function initCanvas (w, h) {
  console.log('绘制出canvas的宽高    clearRect， webqr  ----   78', w, h)
  gCanvas = document.getElementById('qr-canvas')
  if (!gCanvas) {
    // alert('gCanvas参数不存在')
  }
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
  //  获取车牌号
  var number = htmlEntities(a).split('/')
  var newCarno = number[number.length - 1]
  var baseShadow = document.getElementsByClassName('base_shadow')[0]
  var scanlist = document.getElementsByClassName('scanlist')[0]
  baseShadow.style.display = 'block'
  // document.getElementById('result').innerHTML = html

  // https://ofo.com/oneplate/60409252

  // 单车二维码信息
  // if (a.includes('ofo.so/plate/')) {
  // var arr = a.split('ofo.so/plate/')
  // var bikeNo = arr[arr.length - 1]
  // console.log(bikeNo, 'bikeNo')
  // if (!bikeNo) {
  //   alert('车牌号错误')
  // }
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
    url: 'https://ofoapi-qa.ofo.com/carno', // 测试
    // url: '//one.ofo.com/carno',
    data: postData,
    success: function (result) {
      baseShadow.style.display = 'none'
      // 跳转解锁页
      if (result.errorCode == 200) {
        // 存时间 为了以后下次计算时间铺垫
        console.log('存时间 为了以后下次计算时间铺垫, webqr --- 161  订单成功')
        // localStorage.setItem('firstTime', result.values.lock.datetime)
        sessionStorage.setItem('orderno', result.values.orderno)
        location.href = '/#/endAndPay'
        sessionStorage.setItem('suc', JSON.stringify(result))
      } else if (result.errorCode == 30005) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/cycling'
        }, 1000)
        // console.log('error', result.msg)
      } else if (result.errorCode == 40078) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/end'
        }, 1000)
      } else if (result.errorCode == 40003) {
        // 未结单
        // console.log('未结单', result.msg)
        sessionStorage.setItem('orderno', result.values.orderno)
        sessionStorage.setItem('lastTime', result.values.lock.datetime)
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/cycling'
        }, 1000)
      } else if (result.errorCode == 30009) {
        console.log('webqr --- 30009 ---> 跳转home页  进入非法区域 178', result.msg)
        // 车辆停靠在非法区域
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
        }, 1000)
        scanlist.innerHTML = result.msg
        location.href = '/#/home'
      } else if (result.errorCode == 30004) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
        }, 1000)
        console.log('30004 ---> 跳转home页  没又此辆车  请换辆车试试', result.msg)
        scanlist.innerHTML = result.msg
        location.href = '/#/home'
      } else if (result.errorCode == 50000) {
        scanlist.style.display = 'block'
        setTimeout(function () {
          scanlist.style.display = 'none'
          location.href = '/#/home'
        }, 2000)
        console.log('50000 ---> 跳转end页  进入非法区域', result.msg)
        scanlist.innerHTML = result.msg
      } else {
        console.log('接单不成功')
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

function success (stream) {
  // alert('success - webkit---' + webkit)
  // video.srcObject = stream
  // video.play()
  alert(stream.getVideoTracks() + '220')
  alert(stream.getVideoTracks()[0].label + '236')
  var videoTracks = stream.getVideoTracks()
  console.log(videoTracks)
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL

  if (webkit) {
    alert('success-webkit' + 'z240')
    video.src = window.webkitURL.createObjectURL(stream)
    // video.srcObject = stream  // ios safari  黑屏不显示内容
    video.play()
  } else if (moz) {
    alert('success-moz' + '244')
    video.mozSrcObject = stream
    video.play()
  } else if (ios) {
    alert('success-ios' + '248')
    video.srcObject = stream
    video.play()
  } else {
    alert('success-else' + '252')
    video.srcObject = stream
    video.play()
  }

  gUM = true
  setTimeout(captureToCanvas, 500)
}

function error (error) {
  gUM = false
  return gUM
}

function setwebcam () {
  var options = true
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    try {
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        devices.forEach(function (device) {
          if (device.kind === 'videoinput') {
            if (device.label.toLowerCase().search('back') > -1) {
              alert('后摄像头' + '274')
              options = { 'facingMode': { exact: 'environment' } }
            } else {
              alert('没有back' + '277')
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
  video = document.getElementById('v')

  n.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

  alert('开启摄像头---' + n.getUserMedia)

  if (n.getUserMedia) {
    alert('getUserMedia - webkit' + '306---> ' + n.mediaDevices.getUserMedia)
    webkit = true
    n.getUserMedia({ video: options, audio: false }, success, error)
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
