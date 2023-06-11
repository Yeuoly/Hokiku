<template>
  <v-app>
    <div style="display: flex; flex-direction: row; flex-flow: row wrap">
      <Sider></Sider>
      <div style="background-color: rgb(238,240,248); width: 100%">
        <Header></Header>
        <Body></Body>
        <Footer></Footer>
      </div>
    </div>
  </v-app>
</template>

<script>
import Header from './layout/Header.vue'
import Sider from './layout/Sider.vue'
import Body from './layout/Body.vue'
import Footer from './layout/Footer.vue'

export default {
  name: 'App',

  components: {
    Header,
    Sider,
    Body,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>

<style>
.v-sheet.v-card:not(.v-sheet--outlined){
  box-shadow: none !important;
}
</style>