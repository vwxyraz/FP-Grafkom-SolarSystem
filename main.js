const canvas = document.querySelector('#canvas');
const sceneManager = new scene(canvas);

bindEventListeners();
render();

function bindEventListeners() {
    window.onresize = resizeCanvas;
    resizeCanvas();
}

function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    sceneManager.onWindowResize();
}

function render(time) {
    // convert time into seconds
    time *= 0.001;
    requestAnimationFrame(render);
    sceneManager.update(time);
}
