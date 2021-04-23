class StarSpace {
  constructor(canvas, options = {}) {
    const { count = 3000, size = 1, speed = 0.1, bgColor = "black" } = options;

    this.canvas = canvas;
    this.context = null;

    this.stars = [];
    this.size = size;
    this.count = count;
    this.speed = speed;
    this.bgColor = bgColor;
    this.width = 0;
    this.height = 0;
    this.prevTime = null;

    requestAnimationFrame((time) => this.init(time));
  }

  init(time) {
    this.initCanvas();
    this.updateSize();
    this.listenerResize();
    this.createStar();
    this.prevTime = time;
    requestAnimationFrame((time) => this.tick(time));
  }

  initCanvas() {
    if (!this.canvas) {
      throw new Error("Canvas not found!");
    }
    this.context = this.canvas.getContext("2d");
  }

  updateSize() {
    this.canvas.width = this.width = document.body.clientWidth;
    this.canvas.height = this.height = document.body.clientHeight;
  }

  updateBackgroundColor() {
    this.context.fillStyle = this.bgColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  listenerResize() {
    window.onresize = () => {
      this.updateSize();
    };
  }

  // 產生隨機座標的星星
  createStar() {
    this.stars = [];
    for (let i = 0; i < this.count; i++) {
      const position = {
        x: Math.random() * 1600 - 800,
        y: Math.random() * 900 - 450,
        z: Math.random() * 1000,
      };
      this.stars.push(position);
    }
  }

  // 繪製星星
  drawStar(x, y, brightness) {
    const intensity = brightness * 255;
    const rgb = `rgb(${intensity}, ${intensity}, ${intensity})`;
    this.context.beginPath();
    this.context.fillStyle = rgb;
    this.context.arc(x, y, this.size, 0, Math.PI * 2);
    this.context.fill();
  }

  // 移動星星
  moveStars(distance) {
    this.stars.forEach((star) => {
      star.z -= distance;
      while (star.z <= 1) {
        star.z += 1000;
      }
    });
  }

  tick(time) {
    const elapsed = time - this.prevTime;
    this.prevTime = time;

    this.moveStars(elapsed * this.speed);

    this.updateBackgroundColor();

    const cx = this.width / 2;
    const cy = this.height / 2;

    for (var i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      const x = cx + star.x / (star.z * 0.001);
      const y = cy + star.y / (star.z * 0.001);

      if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
        continue;
      }

      const d = star.z / 1000.0;
      const b = 1 - d * d;

      this.drawStar(x, y, b);
    }

    requestAnimationFrame((time) => this.tick(time));
  }
}

// demo
const starSpace = new StarSpace(document.getElementById("canvas"), {
  count: 3000,
  size: 1.5,
  speed: 0.13,
  bgColor: "black",
});
