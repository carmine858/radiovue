<template>
  <v-container>
    <div class="text-h1">ONLINE RADIO</div>

    <v-container v-if="radios.length > 0">
      <v-row>
        <v-col v-for="(radio, index) in radios" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card class="mx-auto" max-width="350" color="#FFEADD" elevation="7">
            <v-avatar class="ma-3" rounded="0" size="125">
              <v-img :src="getRadioImage(radio)" height="125" width="auto"></v-img>
            </v-avatar>
            <div class="d-flex flex-column justify-space-between">
              <div>
                <v-card-title class="text-h5">{{ radio.name }}</v-card-title>
                <v-card-subtitle>{{ radio.country }}</v-card-subtitle>
                <!-- Aggiungi altre informazioni della stazione radio se necessario -->
              </div>
              <v-card-actions>
                <v-btn :icon="radio.isPlaying ? 'mdi-stop' : 'mdi-play'" @click="togglePlay(index)"></v-btn>
                <v-btn :icon="radio.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" @click="toggleFavorite(index)"></v-btn>
              </v-card-actions>
            </div>
          </v-card>
          <audio ref="audioPlayer" :src="radio.url"></audio>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else>
      <p>Caricamento...</p>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      radios: [],
      defaultImage: 'https://www.veryicon.com/download/png/miscellaneous/color-icon-circle/music-279?s=256',
      currentPlayingIndex: null,
    }
  },
  methods: {
    getRadios() {
      fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=100&countrycode=IT&hidebroken=true&order=clickcount&reverse=true')
        .then(response => response.json())
        .then(data => {
          this.radios = data.map(radio => ({
            ...radio,
            isPlaying: false,
            isFavorite: false,
          }));
        });
    },
    getRadioImage(radio) {
      return radio.favicon ? radio.favicon : this.defaultImage;
    },
    togglePlay(index) {
      if (this.currentPlayingIndex !== null && this.currentPlayingIndex !== index) {
        this.stopRadio(this.currentPlayingIndex);
      }
      if (this.radios[index].isPlaying) {
        this.stopRadio(index);
      } else {
        this.startRadio(index);
      }
    },
    startRadio(index) {
      const audioPlayer = this.$refs.audioPlayer[index];
      audioPlayer.play();
      this.radios[index].isPlaying = true;
      this.currentPlayingIndex = index;
    },
    stopRadio(index) {
      const audioPlayer = this.$refs.audioPlayer[index];
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      this.radios[index].isPlaying = false;
      this.currentPlayingIndex = null;
    },
    toggleFavorite(index) {
      this.radios[index].isFavorite = !this.radios[index].isFavorite;
    },
  },
  created() {
    this.getRadios();
  },
}
</script>




