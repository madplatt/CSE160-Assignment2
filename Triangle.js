class Triangle{
    constructor(){
        this.type='triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5;
    }

    render()
    {
        var x = this.position[0];
        var y = this.position[1];
        var size = this.size / 200;
        gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.uniform1f(u_Size, this.size);
        drawTriangle([x, y, x + size, y, x, y + size]);
    }
}


function drawTriangle(vertices) {
    var n = 3;

    var vBuffer = gl.createBuffer();
    if (!vBuffer)   {
        console.log('Failed to create triangle buffer');
        return -1;
    }
    console.log(vertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(a_Position); 

    gl.drawArrays(gl.TRIANGLES, 0, n);
}
