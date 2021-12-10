<template>
  <div id="mains">
    <LoadPage v-show="load"/>
    <Header @loading="ToggleLoading"/>
    <router-view @loading="ToggleLoading"></router-view>
    <Footer />
  </div>
</template>
<script>
import Header from "./components/Header";
import LoadPage from "./components/LoadPage";
import Footer from "./components/Footer"

export default {
  name: "App",
  components: {
    Header,
    LoadPage,
    Footer
  },
  data(){
    return{
      load:false,
    }
  },
  methods:{
    ToggleLoading(){
      this.load = !this.load
    }
  },
  emits:["loading"]
};
</script>
<style>
* {
  margin: 0px;
  padding: 0px;
}
</style>