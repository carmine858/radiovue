<template>
  <v-container>
    <h1>Online Radio</h1>
  </v-container>

  <template>
  <v-row>
    <v-col
      v-for="n in 9"
      :key="n"
      class="d-flex child-flex"
      cols="4"
    >
      
        <template v-slot:placeholder>
          <v-row
            align="center"
            class="fill-height ma-0"
            justify="center"
          >
            <v-progress-circular
              color="grey-lighten-5"
              indeterminate
            ></v-progress-circular>
          </v-row>
        </template>
      
    </v-col>
  </v-row>
</template>

</template>

<script>


export default {
  name: 'HomeView',
  data() {
    return {
      radios: [],

    }
  },
  methods: {
    getRadios() {
      fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=100&countrycode=IT&hidebroken=true&order=clickcount&reverse=true')
        .then(response => response.json())
        .then(data => {
          this.radios = data;
          console.log(data);
        });

    },
  },
  created() {
    this.getRadios();
  },
}
</script>
