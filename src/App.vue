<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

html, body, #app {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}
body {
  font-size: .32rem;
}
/* a {
  color: black;
} */
</style>
