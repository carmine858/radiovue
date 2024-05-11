<template>
  <v-container>
    <div class="text-h1">Preferiti</div><br> <br>

    <v-container v-if="favoriteRadios.length > 0">
      <v-row>
        <v-col v-for="(radio, index) in favoriteRadios" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card class="mx-auto" max-width="350" elevation="7" >
            <v-avatar class="ma-3" rounded="0" size="125">
              <v-img :src="getRadioImage(radio)" height="125" width="auto"></v-img>
            </v-avatar>
            <div class="d-flex flex-column justify-space-between">
              <div>
                <v-card-title class="text-h5">{{ radio.name }}</v-card-title>
                <v-card-subtitle>{{ radio.Country }}</v-card-subtitle>
                <!-- Aggiungi altre informazioni della stazione radio se necessario -->
              </div>
              <v-card-actions>
                <v-btn :icon="radio.isPlaying ? 'mdi-stop' : 'mdi-play'" @click="togglePlayback(radio)"></v-btn>
                <v-btn :icon="radio.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" @click="toggleFavorite(radio)"></v-btn>
              </v-card-actions>
            </div>
          </v-card>
          <!-- Usa il tag audio di HTML5 -->
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
import Hls from 'hls.js';

export default {
  name: 'FavoritesView',
  data() {
    return {
      radios: [],
      favoriteRadios: [], // Array per le radio preferite
      audio: new Audio(), // Elemento audio per la riproduzione
      currentPlayingRadio: null, // Memorizza l'ID della radio attualmente in riproduzione
      hls: null // Instance di HLS.js
    };
  },
  methods: {
    randomColor() {
      const colors = ['#952175', '#00796b', '#1976d2', '#c62828'];
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    },
    getRadios() {
      const storedRadios = JSON.parse(localStorage.getItem('radios')) || [];
      this.radios = storedRadios;
      this.favoriteRadios = storedRadios.filter(radio => radio.isFavorite);
    },
    playAudio(url, radio) {
      if (this.currentPlayingRadio && this.currentPlayingRadio !== radio) {
        this.currentPlayingRadio.isPlaying = false;
        if (this.hls) {
          this.hls.destroy();
          this.hls = null;
        }
        this.audio.pause();
      }

      if (url.endsWith('.m3u8')) {
        if (Hls.isSupported()) {
          this.hls = new Hls();
          this.hls.loadSource(url);
          this.hls.attachMedia(this.audio);
          this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            this.audio.play();
          });
        } else if (this.audio.canPlayType('application/vnd.apple.mpegurl')) {
          this.audio.src = url;
          this.audio.play();
        }
      } else {
        this.audio.src = url;
        this.audio.play();
      }

      this.currentPlayingRadio = radio;
    },
    togglePlayback(radio) {
      if (radio.isPlaying) {
        this.audio.pause();
        if (this.hls) {
          this.hls.stopLoad();
        }
      } else {
        this.playAudio(radio.url, radio);
      }
      radio.isPlaying = !radio.isPlaying;
    },
    toggleFavorite(radio) {
      radio.isFavorite = !radio.isFavorite;
      this.favoriteRadios = this.radios.filter(r => r.isFavorite); // Aggiorna l'array delle radio preferite
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      // Mappa tutte le radio impostando isPlaying a false prima di salvarle
      const radiosToSave = this.radios.map(radio => ({
        ...radio,
        isPlaying: false // Assicura che isPlaying sia sempre false quando salvi nel localStorage
      }));
      localStorage.setItem('radios', JSON.stringify(radiosToSave));
    },
    getRadioImage(radio) {
      if (radio.isPlaying) {
        return 'https://whiz-kid.de/images/sound.gif';
   
      } else {
        return radio.imageUrl ? radio.imageUrl : "https://cdn-icons-png.freepik.com/256/508/508206.png?semt=ais_hybrid";
      }
    }
  },
  created() {
    this.getRadios();
  }
};
</script>


<style>
/* Stili CSS se necessario */
</style>




