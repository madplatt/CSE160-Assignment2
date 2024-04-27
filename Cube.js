class Cube {
    constructor(){
        this.type='cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render()
    {
        var color = this.color;
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // Front
        drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
        drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

        // Back
        drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);
        drawTriangle3D([0,0,1, 0,1,1, 1,1,1]);

        gl.uniform4f(u_FragColor, color[0] * .9, color[1] * .9, color[2] * .9, color[3]);
        // Left Side
        drawTriangle3D([1,0,0, 1,0,1, 1,1,1]);
        drawTriangle3D([1,0,0, 1,1,1, 1,1,0]);

        // Right Side
        drawTriangle3D([0,1,0, 0,1,1, 0,0,1]);
        drawTriangle3D([0,1,0, 0,0,1, 0,0,0]);

        gl.uniform4f(u_FragColor, color[0] * .8, color[1] * .8, color[2] * .8, color[3]);

        // Top
        drawTriangle3D([1,1,0, 1,1,1, 0,1,0]);
        drawTriangle3D([1,1,1, 0,1,1, 0,1,0]);

        // Bottom
        drawTriangle3D([0,0,0, 0,0,1, 1,0,1]);
        drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);  
    }
}


function drawTriangle3D(vertices) {
    var n = 3;

    var vBuffer = gl.createBuffer();
    if (!vBuffer)   {
        console.log('Failed to create triangle buffer');
        return -1;
    }
    //console.log(vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position); 

    gl.drawArrays(gl.TRIANGLES, 0, n);
}
