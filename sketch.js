let data = {};
let countriesToShow = {};
let customFont;

let weiss = "#fff";
let blau = "#0012ff";
let rot = "#ffcccc";
let gruen = "#ccffcc";
let schwarz = "#101d40";

let hoverText = "";
let hoverX = 0;
let hoverY = 0;

let buttonHeight = 48;
let buttonWidth = 320;
let buttons = [];

function preload() {
  data = loadJSON("compiled_data.json", () =>
    console.log("JSON erfolgreich geladen.")
  );
}

function setup() {
  console.log(windowWidth * 2.5);
  let canvas = createCanvas(4100, 3326);
  canvas.parent("compare");
  customFont = "Noto Sans";
  textSize(12);
  noLoop();

  let checkboxes = {
    "WB6 average": select("#WB6average"),
    Albania: select("#albania"),
    "Bosnia and Herzegovina": select("#bosnia"),
    Kosovo: select("#kosovo"),
    Montenegro: select("#montenegro"),
    "North Macedonia": select("#northmacedonia"),
    Serbia: select("#serbia"),
  };

  Object.keys(checkboxes).forEach((country) => {
    countriesToShow[country] = checkboxes[country].elt.checked;
    checkboxes[country].changed(() => {
      updateCountriesToShow(checkboxes);
    });
  });
}

function updateCountriesToShow(checkboxes) {
  Object.keys(checkboxes).forEach((country) => {
    countriesToShow[country] = checkboxes[country].elt.checked;
  });
  let trueCount = Object.values(countriesToShow).filter(
    (value) => value === true
  ).length;
  resizeCanvas(trueCount * 590, windowHeight * 3);
  console.log("Number of true values in countriesToShow:", trueCount);

  redraw();
}

function draw() {
  background(blau);
  textFont(customFont);
  fill(weiss);
  noStroke();
  rect(0, 0, 4100, 442);

  hoverText = "";
  buttons = [];

  let dataArray = Object.values(data);

  let yStart = 494;
  let height = 46;
  let stripeWidth = 7;
  let startX = 50;
  let totalWidth = 520;
  let spacingX = 580;
  let overallYStart = yStart - 300;

  let currentX = startX;

  for (let countryIndex = 0; countryIndex < dataArray.length; countryIndex++) {
    let country = dataArray[countryIndex];
    let countryLabel = country.label;

    if (!countriesToShow[countryLabel]) continue;

    let dimensions = country.dimensions;
    drawCountryButton(countryLabel, currentX, yStart - 444);
    let overallScores = calculateAverageScores(dimensions);
    drawOverallVisualization(currentX, overallYStart, overallScores);

    let y = yStart;
    for (let dim of dimensions) {
      let dimLabel = dim.label;
      let scores = dim.scores;

      let numStripes = [
        Math.round(scores["2018"] * 10),
        Math.round(scores["2021"] * 10),
        Math.round(scores["2024"] * 10),
      ];

      let diff2018to2021 = (scores["2021"] - scores["2018"]).toFixed(2);
      let diff2021to2024 = (scores["2024"] - scores["2021"]).toFixed(2);

      strokeWeight(0);
      textSize(12);
      fill(weiss);
      textSize(8);

      let spacing2018 = totalWidth / (numStripes[0] - 1);
      stroke(weiss);
      for (let i = 0; i < numStripes[0]; i++) {
        let x = currentX + i * spacing2018;
        rect(x, y, stripeWidth, height);
      }
      checkHover(currentX, y, totalWidth, height, scores["2018"]);
      y += height;

      push();
      translate(currentX - 10, y + height / 2);
      noStroke();
      fill(weiss);
      textSize(12);
      text(`${diff2018to2021}`, -20, 0);
      pop();

      let spacing2021 = totalWidth / (numStripes[1] - 1);
      let absDiff2018to2021 = Math.abs(scores["2021"] - scores["2018"]);

      if (absDiff2018to2021 < 0.05) {
        fill(weiss);
      } else if (scores["2021"] > scores["2018"]) {
        fill(gruen);
      } else if (scores["2021"] < scores["2018"]) {
        fill(rot);
      }

      for (let i = 0; i < numStripes[1]; i++) {
        let x = currentX + i * spacing2021;
        rect(x, y, stripeWidth, height);
      }
      checkHover(currentX, y, totalWidth, height, scores["2021"]);
      y += height;

      push();
      noStroke();
      translate(currentX - 10, y + height / 2);
      fill(weiss);
      textSize(12);
      text(`${diff2021to2024}`, -20, 0);
      pop();

      let spacing2024 = totalWidth / (numStripes[2] - 1);
      let absDiff2021to2024 = Math.abs(scores["2024"] - scores["2021"]);

      if (absDiff2021to2024 < 0.05) {
        fill(weiss);
      } else if (scores["2024"] > scores["2021"]) {
        fill(gruen);
      } else if (scores["2024"] < scores["2021"]) {
        fill(rot);
      }

      for (let i = 0; i < numStripes[2]; i++) {
        let x = currentX + i * spacing2024;
        rect(x, y, stripeWidth, height);
      }
      checkHover(currentX, y, totalWidth, height, scores["2024"]);

      y += 80 + 20;
    }
    currentX += spacingX;
  }

  if (hoverText !== "") {
    fill(weiss);
    stroke(blau);
    strokeWeight(4);
    rect(hoverX - 22, hoverY - 22, 66, 44);
    fill(schwarz);
    textSize(18);
    noStroke();
    text(hoverText, hoverX, hoverY);
  }
}

function calculateAverageScores(dimensions) {
  let total2018 = 0;
  let total2021 = 0;
  let total2024 = 0;
  let numDimensions = dimensions.length;

  for (let dim of dimensions) {
    total2018 += dim.scores["2018"];
    total2021 += dim.scores["2021"];
    total2024 += dim.scores["2024"];
  }

  return {
    2018: total2018 / numDimensions,
    2021: total2021 / numDimensions,
    2024: total2024 / numDimensions,
  };
}

function drawOverallVisualization(x, y, overallScores) {
  let height = 46;
  let stripeWidth = 7;
  let totalWidth = 520;

  fill(schwarz);
  textSize(18);
  text("Overall economy", x, y - 20);

  // 2018
  push();
  translate(x - 10, y + height / 2);
  rotate(-HALF_PI);
  fill(schwarz);
  pop();

  let numStripes2018 = Math.round(overallScores["2018"] * 10);
  let spacing2018 = totalWidth / (numStripes2018 - 1);
  fill(blau);
  noStroke();
  for (let i = 0; i < numStripes2018; i++) {
    let xPos = x + i * spacing2018;
    rect(xPos, y, stripeWidth, height);
  }
  checkHover(x, y, totalWidth, height, overallScores["2018"]);

  y += height;

  // 2021
  push();
  translate(x - 10, y + height / 2);
  rotate(-HALF_PI);
  fill(schwarz);
  pop();

  let numStripes2021 = Math.round(overallScores["2021"] * 10);
  let spacing2021 = totalWidth / (numStripes2021 - 1);
  fill(blau);
  for (let i = 0; i < numStripes2021; i++) {
    let xPos = x + i * spacing2021;
    rect(xPos, y, stripeWidth, height);
  }
  checkHover(x, y, totalWidth, height, overallScores["2021"]);

  y += height;

  // 2024
  push();
  translate(x - 10, y + height / 2);
  rotate(-HALF_PI);
  fill(schwarz);
  pop();

  let numStripes2024 = Math.round(overallScores["2024"] * 10);
  let spacing2024 = totalWidth / (numStripes2024 - 1);
  fill(blau);
  for (let i = 0; i < numStripes2024; i++) {
    let xPos = x + i * spacing2024;
    rect(xPos, y, stripeWidth, height);
  }
  checkHover(x, y, totalWidth, height, overallScores["2024"]);
}

function drawCountryButton(label, x, y) {
  fill(blau);
  stroke(blau);
  strokeWeight(4);
  rect(x, y, buttonWidth, buttonHeight);
  fill(weiss);
  textAlign(LEFT, CENTER);
  noStroke();
  textSize(18);
  text(label, x + 20, y + buttonHeight / 2);

  buttons.push({ label, x, y, width: buttonWidth, height: buttonHeight });
}

function mousePressed() {
  for (let button of buttons) {
    if (
      mouseX >= button.x &&
      mouseX <= button.x + button.width &&
      mouseY >= button.y &&
      mouseY <= button.y + button.height
    ) {
      let countryPage = button.label.toLowerCase().replace(/ /g, "") + ".html";
      window.location.href = countryPage;
    }
  }
}

function checkHover(x, y, totalWidth, h, value) {
  if (
    mouseY >= y &&
    mouseY <= y + h &&
    mouseX >= x &&
    mouseX <= x + totalWidth
  ) {
    hoverText = value.toFixed(2);
    hoverX = mouseX + 10;
    hoverY = mouseY - 10;
  }
}

function mouseMoved() {
  redraw();
}

function windowResized() {}
