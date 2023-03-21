let bricks;
let isVertical;
let brickHImg;
let brickVImg;
let cursorX = 0;
let cursorY = 0;
let brickHeight = 0;
let brickWidth = 0;
let arial;
let showGrid = false;
let buttonWidth = 80;
let buttonHeight = 40;
let buttonX;
let buttonY;
let buttonStrokeWeight = 3;
let buttonTextSize = 18;
let demolishButtonX;
let demolishButtonY;

function preload() {
  brickHImg = loadImage("Brick_H_a.png");
  brickVImg = loadImage("Brick_V_A.png");
  arial = loadFont("Arial.ttf");
}

function setup() {
  createCanvas(1000, 1000);
  bricks = [];
  isVertical = [];
  brickHeight = brickHImg.height;
  brickWidth = brickHImg.width;
  showGrid = false;
  buttonWidth = brickWidth * 2; // set buttonWidth to 2 brick widths
  buttonHeight = brickHeight; // set buttonHeight to 1 brick height
  buttonX = width - buttonWidth - 10;
  buttonY = height - buttonHeight - 10;
  buttonX = buttonX - buttonX % (brickWidth / 2); // snap buttonX to grid
  buttonY = buttonY - buttonY % (brickHeight / 2); // snap buttonY to grid
  demolishButtonX = buttonX - buttonWidth - brickWidth / 2;
  demolishButtonY = buttonY;
}

function draw() {
  background(255);
  if (showGrid) {
    drawGrid();
  }
  for (let i = 0; i < bricks.length; i++) {
    let brickPos = bricks[i];
    let vertical = isVertical[i];
    if (vertical) {
      image(brickVImg, brickPos.x, brickPos.y, brickVImg.width, brickVImg.height);
    } else {
      image(brickHImg, brickPos.x, brickPos.y, brickHImg.width, brickHImg.height);
    }
  }

  // Draw cursor
  stroke(0, 255, 0);
  strokeWeight(2);
  noFill();
  rect(cursorX, cursorY, brickWidth, brickHeight);

  // Draw grid button
  strokeWeight(buttonStrokeWeight);
  stroke(0);
  fill(255);
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(buttonTextSize);
  textFont(arial);
  text("Grid", buttonX + buttonWidth/2, buttonY + buttonHeight/2);
  
  // Draw demolish button
  strokeWeight(buttonStrokeWeight);
  stroke(0);
  fill(255);
  rect(demolishButtonX, demolishButtonY, buttonWidth, buttonHeight);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(buttonTextSize);
  textFont(arial);
  text("Demolish", demolishButtonX + buttonWidth/2, demolishButtonY + buttonHeight/2);
}

function mousePressed() {
    if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
      showGrid = !showGrid;
    } else if (mouseX >= demolishButtonX && mouseX <= demolishButtonX + buttonWidth && mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
      // Clear all bricks and vertical flags
      bricks = [];
      isVertical = [];
  
      // Reset cursor position
      cursorX = 0;
      cursorY = 0;
  
      // Snap button and cursor to grid
      buttonX = buttonX - buttonX % (brickWidth / 2);
      demolishButtonX = demolishButtonX - demolishButtonX % (brickWidth / 2);
      cursorX = cursorX - cursorX % (brickWidth / 2);
      cursorY = cursorY - cursorY % (brickHeight / 2);
    } else {
      cursorX = mouseX - mouseX % (brickWidth / 2);
      cursorY = mouseY - mouseY % (brickHeight / 2);
    }
  
    // Snap buttons to grid
    buttonX = buttonX - buttonX % (brickWidth / 2);
    buttonY = buttonY - buttonY % (brickHeight / 2);
    demolishButtonX = demolishButtonX - demolishButtonX % (brickWidth / 2);
  }

  function drawGrid() {
    stroke(0, 255, 255);
    strokeWeight(1);
    for (let x = brickWidth / 2; x < width; x += brickWidth / 2) {
      line(x, 0, x, height);
    }
    for (let y = brickHeight / 2; y < height; y += brickHeight / 2) {
      line(0, y, width, y);
    }
  }
  
  function keyPressed() {
    if (keyCode === LEFT_ARROW) {
      cursorX -= brickWidth / 2;
      if (cursorX < 0) {
        cursorX = 0;
      }
    } else if (keyCode === RIGHT_ARROW) {
      cursorX += brickWidth / 2;
      if (cursorX > width - brickWidth) {
        cursorX = width - brickWidth;
      }
    } else if (keyCode === UP_ARROW) {
      cursorY -= brickHeight / 2;
      if (cursorY < 0) {
        cursorY = 0;
      }
    } else if (keyCode === DOWN_ARROW) {
      cursorY += brickHeight / 2;
      if (cursorY > height - brickHeight) {
        cursorY = height - brickHeight;
      }
    } else if (key === 'a' || key === 'A') {
      let vertical = false;
      let brickSize = brickWidth;
  
      // Check if the 'Shift' key is held down
      if (keyIsDown(SHIFT)) {
        vertical = true;
        brickSize = brickHeight; // Update brick size for vertical bricks
      }
  
      for (let i = 0; i < bricks.length; i++) {
        let brickPos = bricks[i];
        if (brickPos.x === cursorX && brickPos.y === cursorY) {
          bricks.splice(i, 1);
          isVertical.splice(i, 1);
          break;
        }
      }
      bricks.push(createVector(cursorX, cursorY));
      isVertical.push(vertical);
  
      // Update cursor position for added bricks
      if (vertical) {
        cursorX += brickSize / 4;
      } else {
        cursorX += brickSize / 2;
      }
    } else if (keyCode === BACKSPACE) {
      let closestBrickIndex = -1;
      let minDist = Infinity;
  
      for (let i = 0; i < bricks.length; i++) {
        let brickPos = bricks[i];
        let dist = dist(cursorX, cursorY, brickPos.x, brickPos.y);
  
        if (dist < minDist) {
          closestBrickIndex = i;
          minDist = dist;
        }
      }
  
      if (minDist < brickWidth) {
        bricks.splice(closestBrickIndex, 1);
        isVertical.splice(closestBrickIndex, 1);
      }
    } else if (key === 'p') {
      saveCanvas("screenshot-#####", "png");
    }
  }
  