const WIDTH = 400;
const HEIGHT = 400;
const BALL_RADIUS = 15;
const BLOCK_RADIUS = 20;
const PADDLE_RADIUS = 30;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  for (let i = 0; i < 12; i++) {
    let p = new Vec2(90 * (i % 4) + 50, 50 * floor(i / 4) + 50);
    blocks.push(new Block(p, BLOCK_RADIUS));
  }
}

class Vec2 {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }

  // Adiciona um vetor a este vetor
  add(b) {
    let a = this;
    return new Vec2(a.x + b.x, a.y + b.y);
  }

   // Multiplica este vetor por um escalar
  mul(s) {
    let a = this;
    return new Vec2(s * a.x, s * a.y);
  }

  // Retorna a magnitude deste vetor
  mag() {
    let a = this;
    return sqrt(a.x ** 2 + a.y ** 2);
  }

// Subtrai um vetor deste vetor
  sub(b) {
    let a = this;
    return new Vec2(a.x - b.x, a.y - b.y);
  }

  // Normaliza este vetor
  norm() {
    let a = this;
    return a.mul(1 / a.mag());
  }

  // Calcula o produto escalar deste vetor com outro vetor
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
  new Vec2(WIDTH / 2, HEIGHT - 100),
  new Vec2(240, -60),
  BALL_RADIUS
);

let blocks = [];

let paddle = new Paddle(new Vec2(WIDTH / 2, HEIGHT - 50), PADDLE_RADIUS);

function draw() {
  if (blocks.length === 0) {
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(0);
    text("You Win!", WIDTH / 2, HEIGHT / 2);
    noLoop();
    return;
  }

  if (ball.y + ball.radius >= height) {
    fill(255, 0, 0);
    textSize(32);
    text("You lost", width/2, height/2);
    noLoop();
  }  

  ball.p = ball.p.add(ball.v.mul(1 / 60));

  if ((ball.p.x - BALL_RADIUS < 0) || (ball.p.x + BALL_RADIUS > WIDTH)) {
    ball.v.x = -ball.v.x;
  }

  if ((ball.p.y - BALL_RADIUS < 0) || (ball.p.y + BALL_RADIUS > HEIGHT)) {
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