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
 
 
 const geometrySphere = new THREE.SphereGeometry(3, 48 , 24);
 const materialDisco = new THREE.MeshPhysicalMaterial( {wireframe: false, map: loaderTexture.load('./texture/sun.jpg')} );
 materialDisco.color = new THREE.Color(0xffffff);
 const disco = new THREE.Mesh(geometrySphere, materialDisco);
 disco.position.y = 5;
 scene.add(disco);
 
 const refMat = new THREE.MeshBasicMaterial({
     envMap: sphereCamera.renderTarget.texture,
 });
 const refGeo = new THREE.SphereGeometry(3, 48 , 24);
 
 
 const geometryBox = new THREE.BoxGeometry(9, 0.2, 9);
 const materialBox = new THREE.MeshPhysicalMaterial( {wireframe: false} );
 materialBox.color = new THREE.Color(0xffffff);
 const cube = new THREE.Mesh(geometryBox, materialBox);
//  cube.position.y = 0;
 scene.add(cube);
 
 disco.castShadow = true;
 cube.receiveShadow = true;
 cube.castShadow = true;
 
 /*
  * Controls
  */ 
 const controls = new OrbitControls(camera, canvas);
;
 controls.autoRotateSpeed = 4;

 
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
 }
 tick();
