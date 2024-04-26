// HelloPoint2.js
// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size; 
    void main() {
      gl_Position = a_Position;
      gl_PointSize = u_Size;
    }`

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor;
    }`

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
var g_shapesList = [];
var g_selectedType = POINT;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    
    canvas.onmousedown = function(ev){ click(ev) }
    canvas.onmousemove = function(ev){ click(ev) }

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
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

    const clearButton = document.getElementById("clearButton");
    if (!clearButton) {
        console.log('Failed to retrieve the clearButton element');
        return;
    }
    clearButton.addEventListener("click", clearCanvas);

    const pointButton = document.getElementById("pointButton");
    if (!pointButton) {
        console.log('Failed to retrieve the pointButton element');
        return;
    }
    pointButton.addEventListener("click", function() { g_selectedType = POINT; });

    const triangleButton = document.getElementById("triangleButton");
    if (!triangleButton) {
        console.log('Failed to retrieve the triangleButton element');
        return;
    }
    triangleButton.addEventListener("click", function() { g_selectedType = TRIANGLE; });

    const circleButton = document.getElementById("circleButton");
    if (!circleButton) {
        console.log('Failed to retrieve the circleButton element');
        return;
    }
    circleButton.addEventListener("click", function() { g_selectedType = CIRCLE; });

    const picButton = document.getElementById("picButton");
    if (!picButton) {
        console.log('Failed to retrieve the picButton element');
        return;
    }
    picButton.addEventListener("click", drawPicture);
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
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}
function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapesList.length;
    for (var i = 0; i < len; i++)  {
        g_shapesList[i].render();
    }
} 

function click(ev) {
    if (ev.buttons != 1) {
        return;
    }
    console.log(g_selectedType);
    
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    let p;
    if (g_selectedType == TRIANGLE) {
        p = new Triangle();
    }
    else if (g_selectedType == CIRCLE) {
        p = new Circle();
        p.segments = getSliderSegments();
    }
    else {
        p = new Point();
    }
    p.position = [x, y, 0];
    p.color = getSliderColors();
    p.size = getSliderSize();
    g_shapesList.push(p);
    renderAllShapes();
}

function getSliderColors()
{
    const rSlider = document.getElementById("rSlider");
    if (!rSlider) {
        console.log('Failed to retrieve the red slider element');
        return;
    }
    const gSlider = document.getElementById("gSlider");
    if (!gSlider) {
        console.log('Failed to retrieve the green slider element');
        return;
    }
    const bSlider = document.getElementById("bSlider");
    if (!bSlider) {
        console.log('Failed to retrieve the blue slider element');
        return;
    }
    let result = [rSlider.value, gSlider.value, bSlider.value, 1.0];
    console.log(result);
    return result;
}

function getSliderSize()
{
    const sSlider = document.getElementById("sSlider");
    if (!sSlider) {
        console.log('Failed to retrieve the slider size element');
        return;
    }
    let result = sSlider.value;
    return result;
}

function getSliderSegments()
{
    const segmentSlider = document.getElementById("segmentSlider");
    if (!segmentSlider) {
        console.log('Failed to retrieve the segmentSlider element');
        return;
    }
    let result = segmentSlider.value;
    return result;
}

function clearCanvas()
{
    g_shapesList = [];
    renderAllShapes();
}

function drawPicture()
{
    g_shapesList = [];

    // Water and Sediment
    createPictureTriangle([-1.0, 0.0], [1.0, 0.0], [1.0, -1.0], [0.0, .05, 0.8, 1.0]);
    createPictureTriangle([-1.0, 0.0], [1.0, -1.0], [-1.0, -1.0], [0.3, 0.25, 0.25, 1.0]);
    createPictureTriangle([-13/15, -1/15], [-10/15, -1/15], [-10/15, -3.0], [0.3, 0.25, 0.25, 1.0]);

    // Dock
    createPictureTriangle([-12/15, 4/15], [-10/15, -1/15], [-12/15, -1/15], [0.4, 0.25, 0.2, 1.0]);
    createPictureTriangle([-12/15, 4/15], [-10/15, 4/15], [-10/15, -1/15], [0.4, 0.25, 0.2, 1.0]);
    createPictureTriangle([-15/15, 6/15], [-6/15, 6/15], [-6/15, 4/15], [0.5, 0.27, 0.23, 1.0]);
    createPictureTriangle([-15/15, 6/15], [-6/15, 4/15], [-15/15, 4/15], [0.5, 0.27, 0.23, 1.0]);

    // Fish 1
    createPictureTriangle([3/15, -4/15], [4/15, -3/15], [4/15, -5/15], [0.45, 0.05, 0.6, 1.0]);
    createPictureTriangle([4/15, -3/15], [5/15, -4/15], [4/15, -5/15], [0.45, 0.05, 0.6, 1.0]);
    createPictureTriangle([5/15, -4/15], [6/15, -3/15], [6/15, -5/15], [0.45, 0.05, 0.6, 1.0]);

    // Fish 2
    createPictureTriangle([11/15, -7/15], [12/15, -8/15], [11/15, -9/15], [0.35, 0.6, 0.3, 1.0]);
    createPictureTriangle([12/15, -8/15], [13/15, -7/15], [13/15, -9/15], [0.35, 0.6, 0.3, 1.0]);
    createPictureTriangle([13/15, -7/15], [14/15, -8/15], [13/15, -9/15], [0.35, 0.6, 0.3, 1.0]);

    // Moon Base
    createPictureTriangle([10/15, 13/15], [12/15, 12/15], [10/15, 11/15], [0.85, 0.85, 0.9, 1.0]);
    createPictureTriangle([10/15, 13/15], [11/15, 14/15], [12/15, 12/15], [0.85, 0.85, 0.9, 1.0]);
    createPictureTriangle([11/15, 14/15], [13/15, 14/15], [12/15, 12/15], [0.85, 0.85, 0.9, 1.0]);
    createPictureTriangle([12/15, 12/15], [13/15, 14/15], [14/15, 13/15], [0.85, 0.85, 0.9, 1.0]);
    createPictureTriangle([12/15, 12/15], [14/15, 13/15], [14/15, 11/15], [0.85, 0.85, 0.9, 1.0]);
    createPictureTriangle([12/15, 12/15], [14/15, 11/15], [13/15, 10/15], [0.85, 0.85, 0.9, 1.0]);
    createPictureTriangle([12/15, 12/15], [13/15, 10/15], [11/15, 10/15], [0.85, 0.85, 0.9, 1.0]);
    createPictureTriangle([10/15, 11/15], [12/15, 12/15], [11/15, 10/15], [0.85, 0.85, 0.9, 1.0]);

    // Moon Craters
    createPictureTriangle([11/15, 12/15], [12/15, 12/15], [12/15, 13/15], [0.8, 0.8, 0.85, 1.0])
    
    createPictureTriangle([11/15, 11/15], [12/15, 10/15], [11/15, 10/15], [0.8, 0.8, 0.85, 1.0])
    createPictureTriangle([13/15, 12/15], [14/15, 12/15], [14/15, 11/15], [0.8, 0.8, 0.85, 1.0])
    createPictureTriangle([13/15, 14/15], [14/15, 13/15], [13/15, 13/15], [0.8, 0.8, 0.85, 1.0])

    renderAllShapes();
}
function createPictureTriangle(v1, v2, v3, color)
{
    var newTriangle = new PaintTriangle();
    newTriangle.v1 = v1;
    newTriangle.v2 = v2;
    newTriangle.v3 = v3;
    newTriangle.color = color;
    g_shapesList.push(newTriangle);
}
