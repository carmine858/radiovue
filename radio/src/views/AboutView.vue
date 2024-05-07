<template>
  <v-container>
    <div class="text-h1">Preferiti</div><br> <br>

    <v-container v-if="favoriteRadios.length > 0">
      <v-row>
        <v-col v-for="(radio, index) in favoriteRadios" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card class="mx-auto" max-width="350" elevation="7">
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
                <v-btn :icon="'mdi-heart'" @click="toggleFavorite(index)"></v-btn>
              </v-card-actions>
            </div>
          </v-card>
          <audio :ref="'audioPlayer-' + index" :src="radio.url"></audio>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else>
      <p>Nessuna stazione radio preferita.</p>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: 'FavoritesView',
  data() {
    return {
      favoriteRadios: [],
      currentPlayingIndex: null,
    }
  },
  methods: {
    getRadioImage(radio) {
      return radio.favicon ? radio.favicon : this.defaultImage;
    },
    togglePlay(index) {
      const audioPlayer = this.$refs['audioPlayer-' + index][0];
  if (audioPlayer.paused) {
    // Verifica se c'è un'altra radio in riproduzione
    if (this.currentPlayingIndex !== null && this.currentPlayingIndex !== index) {
      this.stopRadio(this.currentPlayingIndex);
    }
    // Avvia la riproduzione dell'elemento audio
    audioPlayer.play();
    this.favoriteRadios[index].isPlaying = true;
    this.currentPlayingIndex = index;
  } else {
    // Interrompi la riproduzione dell'elemento audio
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    this.favoriteRadios[index].isPlaying = false;
    this.currentPlayingIndex = null;
  }
    },
    toggleFavorite(index) {
      const radio = this.favoriteRadios[index];
      radio.isFavorite = false;
      this.favoriteRadios.splice(index, 1);
      localStorage.setItem('favoriteRadios', JSON.stringify(this.favoriteRadios));
    },
    loadFavoriteRadios() {
      const favoriteRadios = JSON.parse(localStorage.getItem('favoriteRadios')) || [];
      this.favoriteRadios = favoriteRadios;
    },
    stopRadio(index) {
      const audioPlayer = this.$refs['audioPlayer-' + index][0];
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      this.favoriteRadios[index].isPlaying = false;
    },
  },
  created() {
    this.loadFavoriteRadios();
  },
}
</script>

<style>
/* Stili CSS se necessario */
</style>



