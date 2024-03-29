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

//EVENT HANDLER
const LEFT = 37, RIGHT = 39, UP = 38, DOWN = 40; 

let onMouseClick = function(e) {
    ADD *= -1;
    let x = e.clientX;
    let y = e.clientY;
    console.log(x + ", " + y);
    
};

let onKeyDown = function(e) {
    if(e.keyCode == LEFT) 
        planets.forEach(group => group.position.x += 0.2);
    else if(e.keyCode == RIGHT)
        planets.forEach(group => group.position.x -= 0.2);
    else if(e.keyCode == UP)
        planets.forEach(group => group.position.z -= 0.2);
    else if(e.keyCode == DOWN)
        planets.forEach(group => group.position.z += 0.2);
    else
        return;
};


window.addEventListener("keydown", onKeyDown, false);
 
 
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

// // Orbit
// var maker, spline;
// var matrix = new THREE.Matrix4();
// var up = new THREE.Vector3(0, 1, 0);
// var axis = new THREE.Vector3();

// // Orbit Variable 
// var mercpath, venpath, earthpath, marspath,
//     juppath, satpath, urapath, neppath;

// // var planetObj = [];
// var pathObj = [];
// // the getPoint starting variable 
// var mt= 0, vet= 0, eat= 0, mat= 0, jupt= 0, satt= 0, urat= 0, nept = 0;
// // Ellipse class, which extends the virtual base class Curve
// function Ellipse( xRadius, yRadius ) {
//     THREE.Curve.call( this );
//     // add radius 
//     this.xRadius = xRadius;
//     this.yRadius = yRadius;
// }

// Ellipse.prototype = Object.create( THREE.Curve.prototype );
// Ellipse.prototype.constructor = Ellipse;

// // getPoint function for the subClass
// Ellipse.prototype.getPoint = function (t) {
//     var radians = 2 * Math.PI * t;
//     return new THREE.Vector3(this.xRadius * Math.cos( radians ),0,
//                             this.yRadius * Math.sin( radians ));
// };

// // params
// var pathSegments = 128;
// var tubeRadius = 0.03;
// var radiusSegments = 3;
// var closed = true;

// // material
// var mat_path = new THREE.MeshPhongMaterial({color: 'white',});

// // mercury orbit mesh
// mercpath = new Ellipse( 15, 10 );
// var mercgeometry = new THREE.TubeBufferGeometry( mercpath, pathSegments, tubeRadius, radiusSegments, closed );
// mesh = new THREE.Mesh( mercgeometry, mat_path );
// scene.add( mesh );
// pathObj.push(mesh);

function createOrbit() {
    const orbit = new THREE.Group();

    for (let i = 0, j = arguments.length; i < j; i++) {
        arguments[i].add(orbit);
    }

    return orbit;
}

function createOrbitLine(distanceX, scene, astrionomicalBodies) {
    const innerRadius = distanceX - 1;
    const outerRadius = distanceX + 1;
    const thetaSegments = 80;
    const geometry = new THREE.RingBufferGeometry(innerRadius, outerRadius, thetaSegments);
    const material = new THREE.MeshBasicMaterial({
//         color: 0xf5e96c,
        color: 0xff0000,
        opacity: 0.2,
        transparent: true,
        side: THREE.DoubleSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;

    scene.add(mesh);
}
 
 
 
/*
 * Planets
 */

let planets = [];

const loader = new THREE.TextureLoader();

// const scene = new THREE.Scene();
const geometry = new THREE.SphereGeometry(1, 48, 32);

//sun
const sunTexture = loader.load("texture/sun.jpg");
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
const sunGroup = new THREE.Group();
const sunMesh = new THREE.Mesh(geometry, sunMaterial);
createPlanet(scene, sunMesh, sunGroup, 0, 10);

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

createPlanet(scene, saturnMesh, saturnGroup, 70, 2.9);

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
    planets.push(group);
    scene.add(group);
}

 
 /*
  * Controls
  */ 
 const controls = new OrbitControls(camera, canvas);

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
     
     
    window.addEventListener("keydown", onKeyDown, false);
 

     
 }
 tick();
