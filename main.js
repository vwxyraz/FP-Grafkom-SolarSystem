import * as THREE from './js/three.module.js';
import { OrbitControls } from './js/OrbitControls.js';
import { GLTFLoader } from './js/GLTFLoader.js';
import { DragControls} from './js/DragControls.js';
import { CubeCamera, Light } from './js/three.module.js';
import { FlakesTexture } from './js/FlakesTexture.js';
import { RGBELoader } from './js/RGBELoader.js';
import { RoughnessMipmapper } from './js/RoughnessMipmapper.js';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();

// Background
const loaderBG = new THREE.CubeTextureLoader();
const bgTexture = loaderBG.load([
    './texture/px.png',
    './texture/nx.png',
    './texture/py.png',
    './texture/ny.png',
    './texture/pz.png',
    './texture/nz.png',
]);

// Texture
const loaderTexture = new THREE.TextureLoader();
const texture = loaderTexture.load(
    'texture/bg.jpg',
    () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
    });
// scene.fog = new THREE.FogExp2('0xffffff', 0.1);

/** 
 * lights 
 */

 const direcLight = new THREE.DirectionalLight(0xffffff, 1);
 direcLight.position.set(0, 10, 0);
 direcLight.target.position.set(0, 0, 0);
 direcLight.castShadow = true;
 direcLight.shadow.mapSize.width = 2048;
 direcLight.shadow.mapSize.height = 2048;
 scene.add(direcLight);
 const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
 scene.add(ambientLight);
 
 /**
  * Sizes
  */
 const sizes = {
     width: window.innerWidth,
     height: window.innerHeight
 }
 
 window.addEventListener('resize', () =>
 {
     // Update sizes
     sizes.width = window.innerWidth;
     sizes.height = window.innerHeight;
     
     // Update camera
     camera.aspect = sizes.width / sizes.height;
     camera.updateProjectionMatrix();
     
     // Update renderer
     renderer.setSize(sizes.width, sizes.height);
     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 })
 
 /**
  * Camera
  */
 // Base camera
 const camera = new THREE.PerspectiveCamera(85, sizes.width / sizes.height, 0.1, 100);
 camera.position.x = 0;
 camera.position.y = 6;
 camera.position.z = 10;
 scene.add(camera);
 
 const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
 let sphereCamera = new THREE.CubeCamera(1,500,cubeRenderTarget);
 sphereCamera.position.set(0, 3, 0);
 scene.add(sphereCamera);
 
 /**
  * Renderer
  */
 const renderer = new THREE.WebGLRenderer({
     canvas: canvas,
     alpha: true,
     antialias: true,
 })
 renderer.setSize(sizes.width, sizes.height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.PCFSoftShadowMap;
 renderer.toneMapping = THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure = 1;
 renderer.outputEncoding = THREE.sRGBEncoding;
 
 /**
  * SceneGraph
  */ 
 function dumpObject(obj, lines = [], isLast = true, prefix = '') {
     const localPrefix = isLast ? '└─' : '├─';
     lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
     const newPrefix = prefix + (isLast ? '  ' : '│ ');
     const lastNdx = obj.children.length - 1;
     obj.children.forEach((child, ndx) => {
         const isLast = ndx === lastNdx;
         dumpObject(child, lines, isLast, newPrefix);
     });
     return lines;
 }
 
 /*
  * Roughness Mipmapper
  */
 const roughnessMipmapper = new RoughnessMipmapper( renderer );
 
 
//  /**
//   * Object
//   */
//  const materials = [];
//  const loaderGLTF = new GLTFLoader();
//  loaderGLTF.load('./model/scene.gltf', function(gltf){
//      console.log(gltf);
//      const root = gltf.scene;
//      scene.add(root);
//      console.log(dumpObject(root).join('\n'));
//      root.traverse(function(object)
//      {
//          if ( object.isMesh ) 
//          {
//              object.castShadow = true;
//              object.receiveShadow = true;
//              roughnessMipmapper.generateMipmaps( object.material);
 
//          }
//      });
//  },  
//  function(xhr){
//      console.log((xhr.loaded/xhr.total * 100) + "% Loaded");
//  },
//  function(error){
//      console.log('An Error Occurred');
//  })
 
 
/*
 * Planets
 */

const loader = new THREE.TextureLoader();

// const scene = new THREE.Scene();
const geometry = new THREE.SphereGeometry(1, 48, 32);

//sun
const sunTexture = loader.load("texture/sun.jpg");
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
const sunMesh = new THREE.Mesh(geometry, sunMaterial);
sunMesh.position.set(0, 0, 0);
sunMesh.scale.setScalar(10);
scene.add(sunMesh);

//mercury
const mercuryTexture = loader.load("texture/mercury.jpg");
const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
const mercuryGroup = new THREE.Group();
const mercuryMesh = new THREE.Mesh(geometry, mercuryMaterial);
createPlanet(scene, mercuryMesh, mercuryGroup, 25, 0.8);

//venus
const venusTexture = loader.load("texture/venus.jpg");
const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
const venusGroup = new THREE.Group();
const venusMesh = new THREE.Mesh(geometry, venusMaterial);
createPlanet(scene, venusMesh, venusGroup, 28, 0.9);

//earth
const earthTexture = loader.load("texture/earth.jpg");
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture});
const earthGroup = new THREE.Group();
const earthMesh = new THREE.Mesh(geometry, earthMaterial);
createPlanet(scene, earthMesh, earthGroup, 31, 1);

//mars 
const marsTexture = loader.load("texture/mars.jpg"); 
const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
const marsGroup = new THREE.Group();
const marsMesh = new THREE.Mesh(geometry, marsMaterial);
createPlanet(scene, marsMesh, marsGroup, 34, 0.8);

//jupiter
const jupiterTexture = loader.load("texture/jupiter.jpg");
const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
const jupiterGroup = new THREE.Group();
const jupiterMesh = new THREE.Mesh(geometry, jupiterMaterial);
createPlanet(scene, jupiterMesh, jupiterGroup, 55, 3.5);

//saturn
const saturnTexture = loader.load("texture/saturn.jpg");
const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
const saturnGroup = new THREE.Group();
const saturnMesh = new THREE.Mesh(geometry, saturnMaterial);
createPlanet(scene, saturnMesh, saturnGroup, 70, 2.9);

    // Saturns ring
    const innerRadius = 4;
    const outerRadius = 5.5;
    const thetaSegments = 60;
    const saturnBelt = new THREE.RingBufferGeometry(
        innerRadius, outerRadius, thetaSegments);
    const ringTexture = loader.load("texture/saturn_ring.png");
    const material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide, map: ringTexture
    });
    
    const mesh = new THREE.Mesh(saturnBelt, material);
    mesh.rotation.set(5,0,0);

    mesh.position.set(70, 0, 0);
    saturnGroup.add(mesh);

//uranus
const uranusTexture = loader.load("texture/uranus.jpg");
const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
const uranusGroup = new THREE.Group();
const uranusMesh = new THREE.Mesh(geometry, uranusMaterial);
createPlanet(scene, uranusMesh, uranusGroup, 80, 1.7);

//neptunus
const neptuneTexture = loader.load("texture/neptune.jpg");
const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
const neptuneGroup = new THREE.Group();
const neptuneMesh = new THREE.Mesh(geometry, neptuneMaterial);
createPlanet(scene, neptuneMesh, neptuneGroup, 86, 1.65);

function createPlanet(scene, mesh, group, x, scale) {
    mesh.position.set(x, 0, 0);
    mesh.scale.setScalar(scale);
    group.add(mesh);
    scene.add(group);
}

 
 /*
  * Controls
  */ 
 const controls = new OrbitControls(camera, canvas);

 controls.autoRotateSpeed = 4;

document.onKeyDown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up arrow
    }
    else if (e.keyCode == '40') {
        // down arrow
    }
    else if (e.keyCode == '37') {
       // left arrow
    }
    else if (e.keyCode == '39') {
       // right arrow
    }

}

 
 /**
  * Animate
  */
 const clock = new THREE.Clock();
 let speed = 0.01;
 const tick = () =>
 {
     const elapsedTime = clock.getElapsedTime();
 
     // Update Orbital Controls
     controls.update();
 
     // Render
     sphereCamera.update(renderer, scene);
     renderer.render(scene, camera);
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick);
     document.addEventListener("keydown", onKeyDown, false);
 }
 tick();
