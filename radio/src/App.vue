<template>
  <nav>
  <v-layout class="overflow-visible" style="height: 56px;">
    <v-bottom-navigation
      v-model="value"
      :bg-color="color"
      mode="shift"
    >
     

      <v-btn>
        <v-icon>mdi-music-note</v-icon>

        <span>Music</span>
      </v-btn>
       <v-btn>
        <v-icon>mdi-television-play</v-icon>

        <span>Video</span>
      </v-btn>

    </v-bottom-navigation>
  </v-layout>

  </nav>
  <router-view/>
</template>

<script>
export default {
    data: () => ({ value: 0 }),

    computed: {
      color () {
        switch (this.value) {
          case 0: return 'teal'
          case 1: return 'brown'
          case 2: return 'blue-grey'
          case 3: return 'blue-grey'
          default: return 'blue-grey'
        }
      },
    },
    name: 'HomeView',
  }


</script>

<style>
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
