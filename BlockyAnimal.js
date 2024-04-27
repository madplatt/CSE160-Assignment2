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
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotationMatrix;
let u_Size;
var g_shapesList = [];
var g_selectedType = POINT;
var g_globalAngle = 0;

function main() {
    setupWebGL();
    connectVariablesToGLSL();
    
    //canvas.onmousedown = function(ev){ click(ev) }
    //canvas.onmousemove = function(ev){ click(ev) }

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    renderAllShapes();
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
    
    const camSlider = document.getElementById("camSlider");
    if (!camSlider) {
        console.log('Failed to retrieve the camSlider element');
        return;
    }
    camSlider.addEventListener("mousemove", function() {g_globalAngle = this.value; renderAllShapes();});
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
function renderAllShapes() {
    var grm = new Matrix4().rotate(g_globalAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotationMatrix, false, grm.elements);


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //var len = g_shapesList.length;
    //for (var i = 0; i < len; i++)  {
    //    g_shapesList[i].render();
    //}

    var body = new Cube();

    body.color = [1,0,0,1];
    body.matrix.translate(-.1, -.1, -.1);
    body.matrix.rotate(25,1,0,0);
    body.matrix.scale(.2,.2,.2);
    


    //body.matrix.scale(.25, .7, .5);
    body.render();
} 
