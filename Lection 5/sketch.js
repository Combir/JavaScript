let dataTable;
let dropdown;

function preload() {
  dataTable = loadTable('gender-2018.csv', 'csv', 'header');
}

function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  textSize(12);

  dropdown = createSelect();
  dropdown.position(10, 10);
  dropdown.option('Select a company');

  for (let i = 0; i < dataTable.getRowCount(); i++) {
    let company = dataTable.getString(i, 'company');
    dropdown.option(company);
  }

  dropdown.changed(drawSelectedCompanyChart);
}

function drawSelectedCompanyChart() {
  clear();

  let selectedCompany = dropdown.value();
  if (selectedCompany === 'Select a company') {
    return;
  }

  for (let i = 0; i < dataTable.getRowCount(); i++) {
    let company = dataTable.getString(i, 'company');
    if (company === selectedCompany) {
      let female = dataTable.getNum(i, 'female');
      let male = dataTable.getNum(i, 'male');

      drawPieChart(width / 2, height / 2, 200, female, male, company);
      break;
    }
  }
}

function drawPieChart(x, y, diameter, femalePercent, malePercent, label) {
  let femaleAngle = map(femalePercent, 0, 100, 0, 360);
  let maleAngle = map(malePercent, 0, 100, 0, 360);

  fill(255, 102, 204);
  noStroke();
  arc(x, y, diameter, diameter, 0, femaleAngle, PIE);

  fill(102, 153, 255);
  arc(x, y, diameter, diameter, femaleAngle, femaleAngle + maleAngle, PIE);

  fill(0);
  noStroke();
  textSize(16);
  text(label, x, y + diameter / 2 + 20);
}

