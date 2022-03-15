var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

// Canvas properties
canvas.width=700;
canvas.height=550;
document.body.appendChild(canvas);

var perm = [];
while (perm.length < 255){
    while(perm.includes(val = Math.floor(Math.random()*255)));
    perm.push(val);
}

var lerp = (a, b, t) => a + (b - a) * t;

var noise = x => {
    x = x * 0.01 % 255;
    return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

var player = new function(){
    this.x = canvas.width / 2;
    this.y = 0;
    this.ySpeed = 0;
    this.rot = 0;
    this.rSpeed = 0;
    
    this.img = new Image();
    this.img.src =  "moto.png";
    this.draw = function(){
        var player1 = canvas.height -  noise(t + this.x) * 0.25;
        var player2 = canvas.height -  noise(t + 5 + this.x) * 0.25;
        var grounded = 0;

        if (player1 - 15 > this.y)
        {
            this.ySpeed += 0.1;
        }
        else
        {
            this.ySpeed -= this.y - (player1 - 15);
            this.y = player1 - 15;
            grounded = 1;
        }

        if (!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5)
        {
            playing = false;
            this.rSpeed = 5;
            k.ArrowUp = 1;
            this.x -= speed * 5;
        }

        var angle = Math.atan2((player2 - 15) - this.y, (this.x + 5) - this.x);
        this.y += this.ySpeed;

        if (grounded && playing)
        {
            this.rot -= (this.rot - angle) * 0.5;
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }

        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05; 
        this.rot -= this.rSpeed * 0.1;

        if (this.rot > Math.PI)
        {
            this.rot = -Math.PI;
        }
        if(this.rot < -Math.PI)
        {
            this.rot = Math.PI;
        }

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.rot);
        context.drawImage(this.img, -15, -15, 30, 30);
        context.restore();
    }
}

var t = 0;
var speed = 0;
var k ={ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0};
var playing = true;
function loop(){
    speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
    t += 10 * speed;
    context.fillStyle = "#19f"
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "black";
    context.beginPath();
    context.moveTo(0, canvas.height);

    for(let i=0; i < canvas.width; i++)
    {
        context.lineTo(i, canvas. height - noise(t+ i) * 0.25);
    }

    context.lineTo(canvas.width, canvas.height);
    context.fill();

    player.draw();
    requestAnimationFrame(loop);
}

onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;

loop();