<template>
  <v-container>
    <div class="text-h1 titolo">Online Radio</div><br>
    <v-text-field v-model="searchQuery" label="Cerca Radio" prepend-icon="mdi-magnify" variant="underlined"></v-text-field>

    <v-container>
      <v-row>
        <v-col v-for="(radio, index) in filterRadios" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card class="mx-auto" max-width="350" elevation="9" color="#ffffff">
            <v-avatar class="ma-3" rounded="0" size="125">
              <v-img :src="getRadioImage(radio)" height="125" width="auto"></v-img>
            </v-avatar>
            <div class="d-flex flex-column justify-space-between">
              <div>
                <v-card-title class="text-h5">{{ radio.name }}</v-card-title>
                <v-card-subtitle>{{ radio.Country }}</v-card-subtitle>
              </div>
              <v-card-actions>
                <v-btn :icon="radio.isPlaying ? 'mdi-stop' : 'mdi-play'" @click="togglePlayback(radio)"></v-btn>
                <v-btn :icon="radio.isFavorite ? 'mdi-heart' : 'mdi-heart-outline'" @click="toggleFavorite(radio)"></v-btn>
              </v-card-actions>
            </div>
          </v-card>
          <audio ref="audioPlayer"></audio>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import Hls from 'hls.js';

export default {
  name: 'HomeView',
  data() {
    return {
      radios: [],
     
      selectedRadio: null,
      searchQuery: '',

      audio: new Audio(),
      currentPlayingRadio: null,
      hls: null
    };
  },
  computed: {

    filterRadios() {
      return this.radios.filter(radio => {
        return radio.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    }
  },
  methods: {
    getRadios() {
      const storedRadios = localStorage.getItem('radios');
      if (storedRadios != this.radios.Country === "Italy") {
        localStorage.removeItem('radios');
      }

      if (storedRadios) {
        this.radios = JSON.parse(storedRadios);
      } else {
        fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=100&countrycode=IT&hidebroken=true&order=clickcount&reverse=true')
          .then(response => response.json())
          .then(data => {
            this.radios = data.map(Radio => ({
              name: Radio.name,
              imageUrl: Radio.favicon,
              Country: Radio.country,
              url: Radio.url,
              stationId: Radio.stationuuid,
              isPlaying: false,
              isFavorite: false,
            }));
            localStorage.removeItem('radios');

            this.saveToLocalStorage();
          });
      }
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
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      const radiosToSave = this.radios.map(radio => ({
        ...radio,
        isPlaying: false
      }));
      localStorage.setItem('radios', JSON.stringify(radiosToSave));
    },
    getRadioImage(radio) {
      if (radio.isPlaying) {
        return 'https://whiz-kid.de/images/sound.gif';
      } else {
        return radio.imageUrl ? radio.imageUrl : "https://www.svgrepo.com/download/2225/music.svg";
      }
    },

  },
  created() {
    this.getRadios();
  }
};
</script>

<style>
.card-background {
  background-color: #50717b;
}

.titolo {
  font-family: fantasy;
  font-style: italic;
  color: white;
  margin-top: -60px;
}
</style>

