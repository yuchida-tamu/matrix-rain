var symbolSize = 15;
var streams = [];
var frame;
var xPos;
var yPos;

function updateMousePos(event) {
  xPos = event.clientX;
  yPos = event.clientY;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  let x = 0;
  let y = 0;
  for (let i = 0; i <= width / symbolSize; i++) {
    let stream = new CharStream();
    stream.generateSymbols(x, random(-1000, 0));
    streams.push(stream);
    x += symbolSize;
  }
  textSize(symbolSize);
  frame = document.querySelector("body");
  frame.addEventListener("mousemove", updateMousePos);
}

function draw() {
  background(0, 150);
  streams.forEach((s) => {
    s.render();
  });
}

function CharSymbol(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.value;
  this.switchInterval = round(random(2, 20));
  this.isActivated = false;
  this.colors = {
    r: 0,
    g: 255,
    b: 70,
  };

  this.setToRamdomSymbol = function () {
    if (frameCount % this.switchInterval == 0) {
      this.value = String.fromCharCode(0x30a0 + round(random(0, 96)));
    }
  };

  this.checkOverlap = function () {
    if (this.x <= xPos && this.x + symbolSize >= xPos) {
      this.isActivated =
        this.y >= yPos && this.y <= yPos + symbolSize ? true : false;
    } else {
      this.isActivated = false;
    }
  };

  this.changeColor = function () {};
  this.resetColor = function () {};
  this.shiftColorToGreen = function () {
    if (this.colors.r > 0) {
      this.colors.r = this.colors.r - 1;
    }
    if (this.colors.g < 255) {
      this.colors.g = this.colors.g + 1;
    }
  };

  this.setColorToGreen = function () {
    this.colors.r = 0;
    this.colors.g = 255;
    this.colors.b = 70;
  };
  this.setColorToRed = function () {
    this.colors.r = 255;
    this.colors.g = 0;
    this.colors.b = 70;
  };
  //   this.render = function () {
  //     if (!this.isActivated) {
  //       fill(255, 0, 70);
  //     } else {
  //       fill(0, 255, 70);
  //     }

  //     text(this.value, this.x, this.y);
  //     this.rain();
  //     this.setToRamdomSymbol();
  //   };
  this.rain = function () {
    if (this.y >= height) {
      this.y = 0;
      this.isActivated = false;
      this.setColorToGreen();
    } else {
      this.y += this.speed;
    }
  };
}

function CharStream() {
  this.symbols = [];
  this.totalSymbols = round(random(5, 30));
  this.speed = random(1, 10);
  this.baseColor = {
    r: 0,
    g: 255,
    b: 70,
  };

  this.generateSymbols = function (x, y) {
    for (let i = 0; i <= this.totalSymbols; i++) {
      let symbol = new CharSymbol(x, y, this.speed);
      symbol.setToRamdomSymbol();
      this.symbols.push(symbol);
      y -= symbolSize;
    }
  };

  this.render = function () {
    this.symbols.forEach((s) => {
      s.checkOverlap();
      if (s.isActivated) {
        s.setColorToRed();
        fill(s.colors.r, s.colors.g, s.colors.b);
      } else {
        s.shiftColorToGreen();
        fill(s.colors.r, s.colors.g, s.colors.b);
      }
      text(s.value, s.x, s.y);
      s.rain();
      s.setToRamdomSymbol();
    });
  };
}
