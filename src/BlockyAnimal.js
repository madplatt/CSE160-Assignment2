// HelloPoint2.js
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix; 
    uniform mat4 u_GlobalRotationMatrix; 
    void main() {
      gl_Position = u_GlobalRotationMatrix * u_ModelMatrix * a_Position;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor;
    }`


// Global Variables
let canvas;
let gl;
let ANIM_1 = 1;
let ANIM_2 = 2;

let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotationMatrix;
var g_objList = [];
var g_globalAngleX = 0;
var g_globalAngleY = 0;
var g_animDisabled = false;
var g_j1Angle = 0;
var g_j2Angle = 1;
var g_startTime = performance.now()/1000.0;
var g_secondsPassed = performance.now()/1000.0 - g_startTime;
var g_fps;
var g_oldFrameCount = 0, g_frameCount = 0;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    setupHTMLElements();
    
    canvas.onmousedown = function(ev){ clickRotate(ev) }
    //canvas.onmousemove = function(ev){ click(ev) }

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var snake = new Snake();
    g_objList.push(snake);

    requestAnimationFrame(tick);
}

let sec = 0;
function tick()
{
    if (Math.round(g_secondsPassed) != sec)
    {
        sec = Math.round(g_secondsPassed);
        g_fps = (g_frameCount + g_oldFrameCount) / 2
        g_oldFrameCount = g_frameCount;
        g_frameCount = 0;
        console.log("FPS: " + g_fps);
    }
    
    g_secondsPassed = performance.now()/1000.0 - g_startTime;

    renderAllObjects();
    updateAllObjects();
    g_frameCount++;
    requestAnimationFrame(tick);
    
}


function setupWebGL() {
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }
    
    // Get the storage location of attribute variable
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of frag color variable
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
    // Get the storage location of frag color variable
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotationMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotationMatrix');
    if (!u_GlobalRotationMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotationMatrix');
        return;
    }
}

function setupHTMLElements() {
    const camSlider = document.getElementById("camSlider");
    if (!camSlider) {
        console.log('Failed to retrieve the camSlider element');
        return;
    }
    camSlider.addEventListener("mousemove", function() {g_globalAngleX = this.value; });

    const j1Slider = document.getElementById("j1Slider");
    if (!j1Slider) {
        console.log('Failed to retrieve the j1Slider element');
        return;
    }
    j1Slider.addEventListener("mousemove", function() {g_j1Angle = this.value; });

    const j2Slider = document.getElementById("j2Slider");
    if (!j2Slider) {
        console.log('Failed to retrieve the j2Slider element');
        return;
    }
    j2Slider.addEventListener("mousemove", function() {g_j2Angle = this.value; });

    const toggleButton = document.getElementById("toggleButton");
    if (!toggleButton) {
        console.log('Failed to retrieve the toggleButton element');
        return;
    }
    toggleButton.addEventListener("click", function() {g_animDisabled = !(g_animDisabled); });

}

function clickRotate(ev) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_globalAngleX = 90 * x;
    g_globalAngleY = 90 * y;
}


function renderAllObjects() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var len = g_objList.length;
    //console.log("Num Shapes " + len);
    for (var i = 0; i < len; i++)  {
        g_objList[i].render();
    }
    
} 

function updateAllObjects() {
    var grm = new Matrix4().rotate(-g_globalAngleX,0,1,0);
    grm.rotate(g_globalAngleY,1,0,0);
    gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, grm.elements);
    
    var len = g_objList.length;
    //console.log("Num Shapes " + len);
    for (var i = 0; i < len; i++)  {
        g_objList[i].update();
    }  
} 
