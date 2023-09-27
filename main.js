// class Person {
//   name;
//   constructor(name) {
//     this.name = name;
//   }

//   introduceSelf() {
//     console.log(`hi, I'm ${this.name}`);
//   }
// }

// class Professor extends Person {
//   teaches;
//   constructor(name, subject) {
//     super(name);
//     this.subject = subject;
//   }

//   grade(paper) {}

//   introduceSelf() {
//     console.log(`Hi, I'm ${this.name} and i teach ${this.subject}`);
//   }
// }

// class Student extends Person {
//   #year;

//   constructor(name, year) {
//     super(name);
//     this.#year = year;
//   }

//   introduceSelf() {
//     console.log(`Hi, I'm ${this.name} and I'm in ${this.#year} year`);
//   }

//   isJuniorYear() {
//     return this.#year > 1;
//   }
// }

// const tom = new Professor("Tom", "Math");
// console.log(tom.name);
// tom.introduceSelf();

// const zach = new Student("Zach", "second");
// zach.introduceSelf();
// const s = zach.isJuniorYear();
// console.log(s);
// // zach.#

// class Shape {
//   name;

//   constructor(name) {
//     this.name = name;
//   }

//   calcPerimeter() {}
// }

// class Square extends Shape {
//   constructor(sideLength) {
//     super("square");
//     this.sides = 4;
//     this.sideLength = sideLength;
//   }

//   calcPerimeter() {}

//   calcArea() {
//     return this.sideLength * this.sideLength;
//   }
// }

// const square = new Square(5);
// console.log(square.name);
// console.log(square.calcPerimeter());
// const triangle = new Shape("triangle", "3 sides", 3);
// triangle.calcPerimeter();
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size, exists) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = exists = true;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 40;

    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          if (this.x - this.size > 0) {
            this.x -= this.velX;
          }
          break;
        case "d":
          if (this.x + this.size < width) {
            this.x += this.velX;
          }
          break;
        case "w":
          if (this.y - this.size > 0) {
            this.y -= this.velY;
          }
          break;
        case "s":
          if (this.y + this.size < height) {
            this.y += this.velY;
          }
          break;
      }
    });
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.size = 0;
          ball.exists = false;
        }
      }
    }
  }
}

let balls = [];

function pushBalls() {
  while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
      random(0 + size, width - size),
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    );

    balls.push(ball);
  }
}
pushBalls();
const evilCircle = new EvilCircle(80, 80);

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  evilCircle.draw();
  evilCircle.collisionDetect();
  const para = document.querySelector("span");
  let score = 25;

  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
    if (!ball.exists) {
      score -= 1;
    }
    para.textContent = score;
  }

  if (!score) {
    toggleOverView(true);
    cancelAnimationFrame(loop);
  }
  console.log("loop");
  requestAnimationFrame(loop);
}

function toggleOverView(isGameOver) {
  const over = document.querySelector(".overlay");
  const game = document.querySelector(".game");
  if (!isGameOver) {
    over.classList.add("op-0");
    game.classList.remove("d-none");
    loop();
  } else {
    over.classList.remove("op-0");
    game.classList.add("d-none");
  }
}
const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", () => {
  balls = [];
  pushBalls();
  toggleOverView(false);
});

loop();
