<template>
  <div class="text-h1">WORLD RADIO</div>
  <div ref="container"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default {
  name: 'WorldView',
  data() {
      return {
          camera: null,
          renderer: null,
          controls: null,
          earthRadius: 1 
      };
  },
  mounted() {
      this.init();
      this.animate();

    

    // Fetch radio station data
    fetch('https://nl1.api.radio-browser.info/json/stations/search?limit=8000&hidebroken=true&order=clickcount&reverse=true&has_extended_info=true')
        .then(response => response.json())
        .then(data => {
            const italianRadioStations = data.filter(radio =>radio.geo_long !== null && radio.geo_lat !== null); // Aggiunto il controllo per i valori non null
            italianRadioStations.forEach(station => {
                const longitude = station.geo_long;
                const latitude = station.geo_lat;
                this.addMarker(longitude, latitude, 0.01); // Adjust marker size as needed
            });
            console.log(this.station);
        })
        .catch(error => {
            console.error('Error fetching radio station data:', error);
        });

    // Listen for window resize event
    window.addEventListener('resize', this.handleWindowResize);
  },
  methods: {
      init() {
          // Create a camera
          this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          this.camera.position.z = 5;

          // Create a renderer
          this.renderer = new THREE.WebGLRenderer();
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.$refs.container.appendChild(this.renderer.domElement);

          // Add OrbitControls
          this.controls = new OrbitControls(this.camera, this.renderer.domElement);
          this.controls.enableDamping = true;

          // Create a scene
          const scene = new THREE.Scene();

          
          const geometry = new THREE.SphereGeometry(this.earthRadius, 64, 64); // Increase segments for smoother surface
          const texture = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9ca15be5-bdef-4bda-8172-2eac787b4d57/dfwltmg-a476b52d-c2f5-48d0-ac1d-6e17a4dbc8a6.png/v1/fill/w_1280,h_640,q_80,strp/earth_texture_map___my_version_by_adamirman2810_dfwltmg-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvOWNhMTViZTUtYmRlZi00YmRhLTgxNzItMmVhYzc4N2I0ZDU3XC9kZndsdG1nLWE0NzZiNTJkLWMyZjUtNDhkMC1hYzFkLTZlMTdhNGRiYzhhNi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.27rjjsab6Qeolu03fgKUMyhDQZYT-zJ0eEE-G-vHFsE');
          const material = new THREE.MeshPhongMaterial({ map: texture });
          const earth = new THREE.Mesh(geometry, material);
          scene.add(earth);

          // Add ambient light
          const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
          scene.add(ambientLight);

          // Add directional light
          const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
          directionalLight.position.set(1, 1, 1).normalize();
          scene.add(directionalLight);

          // Set the scene to component data
          this.scene = scene;
      },
      addMarker(longitude, latitude, markerSize = 0.05) {
          // Only proceed if longitude and latitude are not null
       if (longitude !== null && latitude !== null) {
        // Create a marker
        const geometry = new THREE.SphereGeometry(markerSize, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const marker = new THREE.Mesh(geometry, material);

        // Convert latitude and longitude to radians
        const latRad = latitude * Math.PI / 180;
        const lonRad = (longitude + 180) * Math.PI / 180; // Normalizing longitude to [0, 360] range

        // Calculate the marker position on the sphere
        const x = this.earthRadius * Math.cos(latRad) * Math.cos(lonRad);
        const y = this.earthRadius * Math.cos(latRad) * Math.sin(lonRad);
        const z = this.earthRadius * Math.sin(latRad);

        marker.position.set(x, y, z);

        // Adjust marker rotation
        marker.lookAt(0, 0, 0);

        // Add the marker to the scene
        this.scene.add(marker);
    } else {
        console.error('Longitude or latitude is null');
    }
      },
      animate() {
          requestAnimationFrame(this.animate);

          // Update OrbitControls
          if (this.controls) {
              this.controls.update();
          }

          // Render the scene
          if (this.renderer && this.scene && this.camera) {
              this.renderer.render(this.scene, this.camera);
          }
      },
      handleWindowResize() {
          // Update camera aspect ratio and renderer size on window resize
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
  }
};
</script>
