<template>
    <div>
      <v-card v-if="selectedStation" class="radio-card">
        <v-card-title>{{ selectedStation.name }}</v-card-title>
        <v-img :src="selectedStation.favicon" class="radio-favicon" />
        <v-card-actions>
          <v-btn @click="playStation(selectedStation)">Play</v-btn>
        </v-card-actions>
      </v-card>
      <div ref="container"></div>
    </div>
  </template>
  
  <script>
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  import earthTexture from '../assets/earth.jpg';
  
  export default {
    name: 'ThreeDModelView',
    data() {
      return {
        camera: null,
        renderer: null,
        controls: null,
        earthRadius: 1,
        stations: [],
        selectedStation: null
      };
    },
    mounted() {
      this.init();
      this.fetchRadioStations();
      this.animate();
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleWindowResize);
    },
    methods: {
      async fetchRadioStations() {
        try {
          const response = await fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=10000&hidebroken=true&order=clickcount&reverse=true&has_extended_info=true');
          const data = await response.json();
          this.stations = data;
          this.addMarkers();
        } catch (error) {
          console.error('Error fetching radio stations:', error);
        }
      },
      addMarkers() {
        const scene = this.scene;
        const stations = this.stations;
  
        stations.forEach(station => {
          if (station.geo_lat !== null && station.geo_long !== null) {
            const latitude = parseFloat(station.geo_lat);
            const longitude = parseFloat(station.geo_long);
            const markerPosition = this.convertGeoTo3D(longitude, latitude);
  
            const markerGeometry = new THREE.SphereGeometry(0.003, 24, 24); 
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.copy(markerPosition);
            marker.position.normalize();
            marker.position.multiplyScalar(1);
            marker.station = station;
            scene.add(marker);
  
            marker.addEventListener('click', () => {
              this.selectedStation = station;
            });
          } else {
            console.warn('Invalid coordinates for station:', station);
          }
        });
      },
      init() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 2;
  
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.$refs.container.appendChild(this.renderer.domElement);
  
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
  
        const scene = new THREE.Scene();
  
        const geometry = new THREE.SphereGeometry(this.earthRadius, 64, 64);
        const texture = new THREE.TextureLoader().load(earthTexture);
        const material = new THREE.MeshPhongMaterial({ map: texture });
        const earth = new THREE.Mesh(geometry, material);
        scene.add(earth);
  
        const ambientLight = new THREE.AmbientLight(0xffffff);
        scene.add(ambientLight);
  
        this.scene = scene;
      },
      animate() {
        requestAnimationFrame(this.animate);
  
        if (this.controls) {
          this.controls.update();
        }
  
        if (this.renderer && this.scene && this.camera) {
          this.renderer.render(this.scene, this.camera);
        }
      },
      convertGeoTo3D(longitude, latitude) {
        const phi = (90 - latitude) * Math.PI / 180;
        const theta = (360 - longitude) * Math.PI / 180;
  
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
  
        return new THREE.Vector3(x, y, z);
      },
      playStation(station) {
        // Aggiungi qui la logica per avviare la stazione radio
        console.log('Playing station:', station);
      }
    }
  };
  </script>
  
  <style>
  .radio-card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 16px;
    background-color: white;
    z-index: 10;
  }
  
  .radio-favicon {
    width: 50px;
    height: 50px;
    margin: auto;
    display: block;
  }
  </style>
  