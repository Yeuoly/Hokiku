<template>
  <v-app>
    <Header></Header>
    <Sider></Sider>
    <Body></Body>
  </v-app>
</template>

<script>
import Header from './layout/Header.vue'
import Sider from './layout/Sider.vue'
import Body from './layout/Body.vue'

export default {
  name: 'App',

  components: {
    Header,
    Sider,
    Body
  },

  data: () => ({
    //
  }),
};
</script>
