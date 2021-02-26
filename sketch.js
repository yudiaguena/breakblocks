function setup() {
  createCanvas(400, 400);
  for (let i = 0; i < 12; i++) {
    let p = new Vec2(90*(i%4)+50, 50*floor(i/4)+50);
    blocks.push(new Block(p, 20));
  }
} 

class Vec2 {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }
  add(b) {
    let a = this;
    return new Vec2(a.x + b.x, a.y + b.y);
  }
  mul(s) {
    let a = this;
    return new Vec2(s * a.x, s * a.y);
  }
  mag() {
    let a = this;
    return sqrt(a.x ** 2 + a.y ** 2);
  }
  sub(b) {
    let a = this;
    return new Vec2(a.x - b.x, a.y - b.y);
  }
  norm() {
    let a = this;
    return a.mul(1 / a.mag());
  }
  dot(b) {
    let a = this;
    return a.x * b.x + a.y * b.y;
  }

  reflect(w) {
    let v = this;
    let cosTheta = v.mul(-1).dot(w) / (v.mul(-1).mag() * w.mag());
    let n = w.norm().mul(v.mag() * cosTheta);
    let r = v.add(n.mul(2));
    return r;
  }
}

class Ball {
  constructor(_p, _v, _r) {
    this.p = _p; 
    this.v = _v; 
    this.r = _r; 
  }
}

class Block {
  constructor(_p, _r) {
    this.p = _p; 
    this.r = _r;
  }
}

class Paddle {
  constructor(_p, _r) {
    this.p = _p; 
    this.r = _r; 
  }
}

let ball = new Ball(
  new Vec2(200, 300),
  new Vec2(240, -60),
  15
);

let blocks = [];

let paddle = new Paddle(new Vec2(200, 320), 30);

function draw() {

  ball.p = ball.p.add(ball.v.mul(1 / 60));


  if ((ball.p.x < 15) || (ball.p.x > 385)) {
    ball.v.x = -ball.v.x;
  }

  if ((ball.p.y < 15) || (ball.p.y > 385)) {
    ball.v.y = -ball.v.y;
  }

  for (let block of blocks) {
    let d = block.p.sub(ball.p).mag(); 
    if (d < (ball.r + block.r)) {
      let w = ball.p.sub(block.p);
      let r = ball.v.reflect(w);
      ball.v = r;
      blocks.splice(blocks.indexOf(block), 1);
    }
  }


  paddle.p.x = mouseX;

  let d = paddle.p.sub(ball.p).mag(); 
  if (d < (ball.r + paddle.r)) {
    let w = ball.p.sub(paddle.p);
    let r = ball.v.reflect(w);
    ball.v = r;
    ball.p = paddle.p.add(w.norm().mul(ball.r + paddle.r));
  }

  background(220);
  circle(ball.p.x, ball.p.y, 2*ball.r);
  for (let b of blocks) {
    circle(b.p.x, b.p.y, 2*b.r);
  }
  circle(paddle.p.x, paddle.p.y, 2*paddle.r);
}
