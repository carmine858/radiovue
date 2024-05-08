<template>
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
      async getRadios() {
        try {
          const response = await fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=100&countrycode=IT&hidebroken=true&order=clickcount&reverse=true');
          const data = await response.json();
          this.radios = data;
          this.initMap(); // Inizializza la mappa dopo aver ottenuto i dati delle radio
        } catch (error) {
          console.error('Errore nel recupero dei dati delle radio:', error);
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
  
        // Aggiungi pin per ogni radio
        this.radios.forEach(radio => {
          // Carica un modello 3D per il pin della radio e posizionalo in base alle coordinate
          const loader = new Three.GLTFLoader();
          loader.load('radio_pin.glb', gltf => {
            const pin = gltf.scene;
            pin.position.set(radio.geo_long, radio.geo_lat, 0);
            scene.add(pin);
          });
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
  