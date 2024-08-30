// TODO: refactore the "draw wire" functions

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
let pad, amountX, amountY, grid, row, meshIsVisible; // Grid related variables
let roundness, wireThickness; // Wire related variables
let noiseScale, messAmount; // Weaving related variables

export default function sketch(p) {
  p.setup = function () {
    let cnv = p.createCanvas(canvasWidth, canvasHeight);
    cnv.parent(document.body);
    cnv.id("wire-fence");

    // Grid related variables
    grid = [];
    pad = canvasWidth > 768 ? 50 : 30;
    meshIsVisible = false;
    amountX = p.round(window.innerWidth / 65);
    amountY = p.round(window.innerHeight / 50);

    // Wire related variables
    roundness = 9;
    wireThickness = 3;
    noiseScale = 0.2; // Noise scale
    messAmount = 50; // Control the amount of distortion

    // Filling the grid with coordinates
    for (let j = 0; j <= amountY; j++) {
      row = []; // Emptying the row array before each new row
      for (let i = 0; i <= amountX; i++) {
        let x = p.map(i, 0, amountX, pad, canvasWidth - pad);
        let y = p.map(j, 0, amountY, pad, canvasHeight - pad);

        // Smoother effect using noise instead of random
        let noiseX = (p.noise(i * noiseScale, j * noiseScale) - 0.5) * messAmount;
        let noiseY = (p.noise(i * noiseScale + 100, j * noiseScale + 100) - 0.5) * messAmount; // Offset by 100 to get different noise

        row.push([
          x + noiseX,
          y + noiseY,
        ]);
      }
      grid.push(row);
    }
    p.noLoop();
  };

  p.draw = function () {
    p.background(0);
    p.stroke(255);
    for (let j = 0; j <= amountY; j++) {
      p.beginShape();
      for (let i = 0; i <= amountX; i++) {

        if (meshIsVisible) drawDebugMesh(i, j);

        p.strokeWeight(wireThickness);
        p.stroke(255);
        p.noFill();

        let weavingValue = (p.noise(i * noiseScale, j * noiseScale) + 0.5) * 2.5;

        // Even row
        if (j % 2 == 0 && j < amountY) drawEvenWire(i, j, weavingValue);
        // Odd Row
        if (j % 2 !== 0 && j < amountY) drawOddWire(i, j, weavingValue);
      }
      p.endShape();
    }
  };

  // Debug Mesh
  function drawDebugMesh(i, j) {
    let x = grid[j][i][0];
    let y = grid[j][i][1];

    p.strokeWeight(1);
    p.stroke(255, 0, 0);
    if (i < amountX) {
      let xn = grid[j][i + 1][0];
      let yn = grid[j][i + 1][1];
      p.line(x, y, xn, yn);
    }

    if (j < amountY) {
      let xn = grid[j + 1][i][0];
      let yn = grid[j + 1][i][1];
      p.line(x, y, xn, yn);
    }

    p.strokeWeight(10);
    p.stroke(0, 255, 0);
    p.point(x, y);
  }

  // Even Wire
  function drawEvenWire(i, j, weavingValue) {

    let x, y, ax, ay;

    if (i === 0) {
      p.vertex(grid[j][i][0], grid[j][i][1]);
    } else {
      const isEvenIndex = i % 2 === 0;

      if (isEvenIndex) {
        weavingValue *= -1;
        x = grid[j][i][0];
        y = grid[j][i][1];
        ax = grid[j + 1][i - 1][0];
        ay = grid[j + 1][i - 1][1];

      } else {
        x = grid[j + 1][i][0];
        y = grid[j + 1][i][1];
        ax = grid[j][i - 1][0];
        ay = grid[j][i - 1][1];
      }

      let x1 = ax + roundness;
      let y1 = ay - weavingValue;
      let x2 = x - roundness;
      let y2 = y + weavingValue;
      let x3 = x;
      let y3 = i === amountX ? y : y + weavingValue;

      p.bezierVertex(x1, y1, x2, y2, x3, y3);
    }
  }

  // Odd Wire
  function drawOddWire(i, j, weavingValue) {

    let x, y, ax, ay;

    if (i === 0) {
      p.vertex(grid[j + 1][i][0], grid[j + 1][i][1]);
    } else {
      const isEvenIndex = i % 2 === 0;

      if (isEvenIndex) {
        x = grid[j + 1][i][0];
        y = grid[j + 1][i][1];
        ax = grid[j][i - 1][0];
        ay = grid[j][i - 1][1];
      } else {
        weavingValue *= -1;
        x = grid[j][i][0];
        y = grid[j][i][1];
        ax = grid[j + 1][i - 1][0];
        ay = grid[j + 1][i - 1][1];
      }

      let x1 = ax + roundness;
      let y1 = ay - weavingValue;
      let x2 = x - roundness;
      let y2 = y + weavingValue;
      let x3 = x;
      let y3 = i === amountX ? y : y + weavingValue;

      p.bezierVertex(x1, y1, x2, y2, x3, y3);
    }
  }

  p.windowResized = function () {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    p.setup();
    p.resizeCanvas(canvasWidth, canvasHeight);
  };

}
