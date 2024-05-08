<template>
  <div class="text-h1">WORLD RADIO</div>
  <div id="world-map"></div>
</template>

<script>
import * as Three from 'three'; // Importa Three.js o la libreria scelta
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Importa i controlli della telecamera

export default {
  name: 'WorldView',
  data() {
    return {
      radios: [] // Array per memorizzare i dati delle radio
    };
  },
  mounted() {
    this.getRadios(); // Carica i dati delle radio quando il componente viene montato
  },
  methods: {
    getRadios() {
      const storedRadios = localStorage.getItem('radios');
      if (storedRadios) {
        this.radios = JSON.parse(storedRadios);
        this.initMap(); // Inizializza la mappa con i dati delle radio memorizzate
      } else {
        fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=8000&hidebroken=true&order=clickcount&reverse=true&has_extended_info=true')
          .then(response => response.json())
          .then(data => {
            // Filtra le radio con valori validi per geo_lat e geo_long
            this.radios = data.filter(radio => radio.geo_lat !== null && radio.geo_long !== null)
              .map(radio => ({
                name: radio.name,
                imageUrl: radio.favicon,
                geo_lat: radio.geo_lat,
                geo_long: radio.geo_long,
                url: radio.url,
                stationId: radio.stationuuid,
                isPlaying: false,
                isFavorite: false,
              }));
            console.log(this.radios); // Usa il nome corretto dell'array
            this.initMap();
          })
          .catch(error => {
            console.error('Errore nel recupero dei dati delle radio:', error);
          });
      }
    },
    initMap() {
      const container = document.getElementById('world-map');
      const scene = new Three.Scene();
      const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      const renderer = new Three.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);

      // Crea una sfera per la Terra
      const geometry = new Three.SphereGeometry(50, 32, 32); // Dimensioni della sfera e dettaglio della griglia
      const texture = new Three.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9ca15be5-bdef-4bda-8172-2eac787b4d57/dfwltmg-a476b52d-c2f5-48d0-ac1d-6e17a4dbc8a6.png/v1/fill/w_1280,h_640,q_80,strp/earth_texture_map___my_version_by_adamirman2810_dfwltmg-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvOWNhMTViZTUtYmRlZi00YmRhLTgxNzItMmVhYzc4N2I0ZDU3XC9kZndsdG1nLWE0NzZiNTJkLWMyZjUtNDhkMC1hYzFkLTZlMTdhNGRiYzhhNi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.27rjjsab6Qeolu03fgKUMyhDQZYT-zJ0eEE-G-vHFsE'); // Carica la texture della Terra
      const material = new Three.MeshBasicMaterial({ map: texture }); // Applica la texture alla sfera
      const earth = new Three.Mesh(geometry, material);
      scene.add(earth);

      // Applica la texture a un materiale
      const iconTexture = new Three.TextureLoader().load('radio/src/assets/map_pin.svg');

      // Crea una geometria per l'icona, ad esempio un piano
      const iconGeometry = new Three.PlaneGeometry(10, 10); // Imposta le dimensioni dell'icona come preferisci

      // Crea un materiale per l'icona
      const iconMaterial = new Three.MeshBasicMaterial({ map: iconTexture });

      // Per ogni radio, crea e posiziona un map pin
      this.radios.forEach(radio => {
        // Crea una mesh utilizzando la geometria e il materiale dell'icona
        const iconMesh = new Three.Mesh(iconGeometry, iconMaterial);

        // Imposta la posizione dell'icona utilizzando le coordinate geo_lat e geo_long della radio
        iconMesh.position.set(radio.geo_long, radio.geo_lat, 0); // Assicurati che 0 sia l'altezza corretta

        // Aggiungi l'icona alla scena
        scene.add(iconMesh);
      });

      camera.position.z = 100;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    }
  }
};
</script>

<style>
#world-map {
  width: 100%;
  height: 100vh;
}
</style>
