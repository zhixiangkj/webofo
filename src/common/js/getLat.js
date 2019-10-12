// 调用获取地址位置
export default function geoFindMe () {
  if (!navigator.geolocation) {
    console.log('您的浏览器不支持地理位置')
    return false
  }
  var options = { enableHighAccuracy: true, maximumAge: 0 }
  navigator.geolocation.getCurrentPosition(success, error, options)

  function success (position) {
    localStorage.setItem('latitude', position.coords.latitude)
    localStorage.setItem('longitude', position.coords.longitude)
    var latitude = position.coords.latitude
    var longitude = position.coords.longitude
    // 把经纬度存到本地缓存中
    // alert('longitude' + longitude + 'latitude:' + latitude)
    console.log('longitude---' + longitude + '---latitude:' + latitude)
    return true
  }
  function error () {
    console.log('无法获取您的位置')
    return false
  }
}
