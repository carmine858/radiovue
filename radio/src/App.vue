<template>
  <nav class="navbar-background">
   <v-layout class="overflow-visible " style="height: 56px;" active >
     <v-bottom-navigation v-model="value" color="primary" active class="navbar-background">
       <v-btn @click="navigateTo('/')" >
         <v-icon>mdi-radio</v-icon>
         Radio
       </v-btn>
       
       <v-btn @click="navigateTo('/favorites')">
         <v-icon>mdi-heart</v-icon>
         Favorites
       </v-btn>
       
       <v-btn @click="navigateTo('/world')">
         <v-icon>mdi-map-marker</v-icon>
         World
       </v-btn>
     </v-bottom-navigation>
   </v-layout>
   <router-view/>
 </nav>
</template>

<style>
.navbar-background {
 background-color:  #a4c3cd;
}

#app {
 font-family: Avenir, Helvetica, Arial, sans-serif;
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
 text-align: center;
 color: #2c3e50;
}

nav {
 padding: 30px;
}

nav a {
 font-weight: bold;
 color: #2c3e50;
}

nav a.router-link-exact-active {
 color: #42b983;
}
</style>

<script>
export default {
 data() {
   return {
     value: 0
   };
 },
 methods: {
   navigateTo(route) {
     this.$router.push(route);
   }
 }
};
</script>

