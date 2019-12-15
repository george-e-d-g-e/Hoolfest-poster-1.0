<template>
  <div id="app">
    <page/>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view /> -->
  </div>
</template>

<script>

import Page from '@/components/Page.vue'

export default {
  name: 'app',
  components: {
    Page
  }
}

</script>

<style lang="scss">

  @import url('https://fonts.googleapis.com/css?family=Chakra+Petch:400,700&display=swap');

  #app {
    font-family: 'Chakra Petch', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  body{
    margin: 0px;
    position: fixed;
    background: black;
  }

</style>
