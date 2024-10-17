let data;
let countryData;
let customFont;

let weiss = "#fff";
let blau = "#0012ff";
let schwarz = "#101d40";

let barWidth = 7;
let chartHeight = 126;
let chartWidth = 400;
let margin = 100;
let rows = 4;

function preload() {
  data = loadJSON("compiled_data.json", () =>
    console.log("JSON successfully loaded.")
  );
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-container");
  customFont = "Noto Sans";

  let countryLabel = document.title;

  let dataArray = Object.values(data);
  countryData = dataArray.find((c) => c.label === countryLabel);

  if (!countryData) {
    console.error(`Data for ${countryLabel} not found.`);
    return;
  }

  let totalDimensions = countryData.dimensions.length;
  let canvasHeight =
    Math.ceil(totalDimensions / rows) * (chartHeight + margin) + margin;

  resizeCanvas(windowWidth, canvasHeight);
  noLoop();
  background(blau);

  let x = 50;
  let y = 50;

  for (let i = 0; i < totalDimensions; i++) {
    let dimensionLabel = countryData.dimensions[i].label;
    drawStripeChart(dimensionLabel, x, y, 2024);

    if ((i + 1) % rows == 0) {
      x = 50;
      y += chartHeight + margin;
    } else {
      x += chartWidth + margin;
    }
  }
}

function drawStripeChart(dimension, xOffset, yOffset, year) {
  let dimensionData;
  textFont(customFont);

  for (let i = 0; i < countryData.dimensions.length; i++) {
    if (countryData.dimensions[i].label === dimension) {
      dimensionData = countryData.dimensions[i];
      break;
    }
  }

  let score = dimensionData.scores[year];
  let numStripes = Math.round(score * 10);
  let spacing = chartWidth / (numStripes - 1);

  noStroke();
  textSize(18);
  fill(weiss);
  textAlign(LEFT);
  text(dimension, xOffset, yOffset + 20);

  for (let i = 0; i < numStripes; i++) {
    let xPos = xOffset + i * spacing;
    fill(weiss);
    rect(xPos, yOffset + 30, barWidth, chartHeight);
  }

  textSize(60);
  fill(weiss);
  textAlign(RIGHT);
  text(score.toFixed(1), xOffset + chartWidth + 8, yOffset + chartHeight - 110);

  let subdimensions = dimensionData.subdimensions;
  let subBarOffsetY = yOffset + chartHeight + 20;

  for (let sub of subdimensions) {
    let subdimLabel = sub.label;
    let subScore = sub.score;

    let barLength = map(subScore, 0, 5, 0, 300);

    fill(weiss);
    textSize(14);
    textAlign(LEFT);
    text(subdimLabel, xOffset, subBarOffsetY + 15);

    rect(xOffset + 150, subBarOffsetY, barLength, 20);

    textAlign(LEFT);
    text(
      subScore.toFixed(1),
      xOffset + 150 + barLength + 10,
      subBarOffsetY + 15
    );

    subBarOffsetY += 35;
  }
}
