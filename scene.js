import * as THREE from './js/three.module.js';

function scene(canvas) {

    // scene setup
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    const scene = buildScene();
    const renderer = buildRender(screenDimensions);
    const camera = buildCamera(screenDimensions);
    const sceneSubjects = createSceneSubjects(scene);

    const cameraControls = new MyCameraControls(camera, canvas);

    //scene.background = new THREE.Color('black');

    function buildScene() {
        const scene = new THREE.Scene();
//         scene.background = new THREE.Color("#000");
        
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

        return scene;
    }

    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.set(0, 300, 750);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        return camera;
    }

    function createSceneSubjects(scene) {
        const sceneSubjects = [
            new SolarSystem(scene),
        ];

        return sceneSubjects;
    }

    // It is called by the main at every frame.
    this.update = function (time) {
        for (let i = 0; i < sceneSubjects.length; i++)
            sceneSubjects[i].update(time);


        let x = sceneSubjects[0];
        cameraControls.update();
        renderer.render(scene, camera);
    }

    // Updates the aspect ratio of the camera and the size of the Renderer. 
    // It is called by the main each time the window is resized.
    this.onWindowResize = function () {
        const { width, height } = canvas;

        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

}
