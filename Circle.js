class Circle{
    constructor(){
        this.type='circle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5;
        this.segments = 10;
    }

    render()
    {
        var x = this.position[0];
        var y = this.position[1];
        var drawSize = this.size / 200;
        var segments = this.segments;

        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        let alpha = 2 * Math.PI / segments;
        for (var angle = 0; angle < 2 * Math.PI; angle = angle + alpha)
        {
            let angle1 = angle;
            let angle2 = angle + alpha;
            let vec1 = [Math.cos(angle1) * drawSize, Math.sin(angle1) * drawSize];
            let vec2 = [Math.cos(angle2) * drawSize, Math.sin(angle2) * drawSize];
            let pt1 = [x + vec1[0], y + vec1[1]];
            let pt2 = [x + vec2[0], y + vec2[1]];
            drawTriangle([x, y, pt1[0], pt1[1], pt2[0], pt2[1]]);
        }
    }
}
