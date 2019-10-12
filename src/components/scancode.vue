<template>
  <div class="hello">
    <div class="scan-head">
      <img src="../../static/img/riding/icons_back@2x.png" @click="back()">
      <span>Scanning</span>
    </div>
    <div class="bike">
      <img src="../../static/img/riding/GroupCopy@2x.png" class="bikeone"/>
      <img src="../../static/img/riding/GroupCopy@2x.png" class="biketwo"/>
    </div>
    <div id="mainbody">
      <div id="outdiv">
        <video id="v" autoplay="autoplay" ref="videoRef" playsinline></video>
      </div>
    </div>
    <div id="container">
        <svg style="position: absolute;" class="svg">
        <defs>
          <mask id="mask3">
            <rect x="0" y="0" width="100%" height="100%" style="stroke:2px yellow; fill: #ccc"></rect>
              <rect :x="viewWidth" :y="viewHeight" :width='width' :height='height'></rect>
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" style="stroke: none; fill: rgba(0, 0, 0, 0.8); mask: url(#mask3)"></rect>
        </svg>
    </div>
    <div class="rects" ref="rect" style="position:absolute; zIndex=10">
      <div class="scan-line">
        <img src="../../static/img/riding/扫描光线copy5@2x.png">
      </div>
    </div>

    <canvas id="qr-canvas" width="375" height="667"></canvas>
    <div class="base_shadow" id="base_shadow">
        <img src="../../static/img/riding/load.gif">
    </div>
    <div class="scanlist" ref="scanlist"></div>
  </div>
</template>

<script>
// Global  site  tag  (gtag.js)  -  Google  AdWords:  807835785
// window.dataLayer  =  window.dataLayer  ||  [];
// function  gtag(){dataLayer.push(arguments);}
// gtag('js',  new  Date());

// gtag('config',  'AW-807835785');

import '@/utils/llqrcode.js'
import qrcode from '@/utils/qr_packed.js'
import $ from 'jquery'
import { load } from '@/utils/webqr.js'
export default {
  name: "Scancode",
  data() {
    return {
      viewHeight : (document.documentElement.clientHeight - 200) / 2,
      viewWidth : (document.documentElement.clientWidth - 200) / 2,
      width: '4rem',
      height: '4rem',
    };
  },
  mounted () {
    gtag('config', gtagId, {
      'page_title' : 'ScanningPagePV',
      'page_path': '/Scancode'
    });
    var _this = this;
    if (localStorage.getItem('freeTimesLeft') == 0) {
      this.$refs.scanlist.innerHTML = 'Please download our app for free riding times'
      setTimeout( function() {
        _this.$router.push({path: '/'})
      }, 2500)
    }
    if (!localStorage.getItem('token') && !localStorage.getItem('latitude') && !localStorage.getItem('longitude')) {
      this.$router.push({path: '/'})
    }
    this.$refs.rect.style.left = this.viewWidth + 'px';
    this.$refs.rect.style.top = this.viewHeight + 'px';
    //  调用摄像头 start
    console.log('调用摄像头 start scancode --- 73 load')
    load();

  },
  methods: {
    back: function () {
      this.$router.push({path: '/'})
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.hello {
    width: 100%;
    height: 100%;
    position: relative;
    bottom: 0;
    left: 0;
}


/*  svg */

#container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

#container > svg {
  width: 100%;
  height: 100%;
}
.rects {
  width: 4rem;
  height: 4rem;
  border: 1px solid yellow;
  box-sizing: border-box;
}
/* svg */


/* base-shadow */
.base_shadow {
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
    display: none;
}
.base_shadow > img {
    width: 2rem;
    height: auto!important;
    vertical-align: middle;
}
.scan-head {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  background: #ffffff;
  font-size: 0.42rem;
}
.scan-head > img{
  width: 0.46rem;
  height: 0.46rem;
  position: absolute;
  left: 0.48rem;
  top: 0.25rem;
}
.bike {
  width: 2.38rem;
  height: 1.46rem;
  background: url('../../static/img/riding/bike@2x.png') no-repeat;
  background-size: 100%;
  position: absolute;
  left: 2.56rem;
  top: 1.4rem;
  z-index: 2;
}
.bike > img {
  position: absolute;
  width: 0.6rem;
  height: 0.6rem;
}
.bike > .bikeone {
  right: -0.14rem;
  top: 0.32rem;
}
.bike > .biketwo {
  right: 0.45rem;
  top: 0.32rem;
}
img {
    border: 0;
    width: 4rem;
    height: 4rem;
}

#cas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}

#out {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  position: absolute;
  top: 0%;
  left: 0;
}

#mainbody {
    width: 100%;
    height: 100%;
}

.dialog {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(241, 238, 236, 0.1);
}

/* base-shadow */
.base_shadow {
  width: 2rem;
  height: 2rem;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 10;
  transform: translate3d(-50%, -50%, 0);
  line-height: 2rem;
  text-align: center;
}
.base_shadow > img {
  width: 2rem;
  vertical-align: middle;
}
.scan-line {
  width: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}
.scan-line > img {
  width: 100%;
  height: 0.2rem;
  position: absolute;
  top: 0;
  left: 0;
}

#footer {
    background: white;
}

#v {
    width: 7.5rem;
    height: 13.34rem;
}

#qr-canvas {
    display: none;
}

#qrfile {
    width: 245px;
    height: 200px;
}

#mp1 {
    text-align: center;
    font-size: 0.7rem;
}

#imghelp {
    font: 18px arial, sans-serif;
    border-radius: 20px;
}

.selector {
    padding: 0;
    cursor: pointer;
}

#outdiv {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

#result {
    width: 55%;
    background: #fff;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    display: none;
}
ul {
    margin-bottom: 0;
}

li {
    display: inline;
    font-weight: bold;
}

li a {
    text-decoration: none;
    color: black;
}

#footer a {
    color: black;
}

.tsel {
  width: 100%;
  height: 100%;
  padding: 0;
  background: rgba(255, 255, 255, .4);
}
.tsel > tr, .tr > td{
  width: 100%;
  height: 100%;
}
.scanlist {
  padding: 0.2rem 0.15rem;
  background: rgba(0, 0, 0, .7);
  color: rgba(255, 255, 255, 1);
  border-radius: 0.2rem;
  display: none;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 80%;
  z-index: 70;
}
/* keyform */

.scan-line {
  animation: loop 3s ease-in infinite;
}


@keyframes loop {
  form {
    top: 0;
  }
  to {
    top: 95%;
  }
}
</style>
