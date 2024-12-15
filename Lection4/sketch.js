let myBar;
let studentData;

function preload() {
	studentData = loadTable('students.csv', 'csv', 'header');
}

function setup() {
	createCanvas(800, 800);
	myBar = new Bar(10, 10, 700, 700);
	myBar.setupAxis(0, 20, 0, 100, 1, 10); // Changed xMax to number of bars + padding
	let quizMarks = studentData.getColumn('quiz').map(Number);
	let projectMarks = studentData.getColumn('project').map(Number);
	myBar.addBars(quizMarks, projectMarks, 0.8, 'orange'); // Reduced bar width for better spacing
}

function draw() {
	noLoop();
}

function Bar(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.setupAxis = function(xMin, xMax, yMin, yMax, xTickSpacing, yTickSpacing) {
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;

		stroke(0);
		strokeWeight(1);
		fill(0);

		let yPadding = 15;
		this.plotHeight = this.height - yPadding;
		this.plotY = this.y;

		let widestYTick = 0;
		for (let i = yMin; i <= yMax; i += yTickSpacing) {
			widestYTick = max(widestYTick, textWidth(i));
		}

		let xPadding = widestYTick + 5;
		this.plotWidth = this.width - xPadding;
		this.plotX = this.x + xPadding;

		// Draw axes
		line(this.plotX, this.plotY + this.plotHeight,
			this.plotX + this.plotWidth, this.plotY + this.plotHeight);
		line(this.plotX, this.plotY, this.plotX, this.plotY + this.plotHeight);

		// Draw x-axis ticks
		this.scaledXTickSpacing = map(xTickSpacing, 0, xMax, 0, this.plotWidth);
		let xTickValue = xMin;
		textAlign(CENTER, TOP);
		for (let i = this.plotX; i <= this.plotX + this.plotWidth; i += this.scaledXTickSpacing) {
			line(i, this.plotY + this.plotHeight, i, this.plotY + this.plotHeight + yPadding * 0.66);
			text(xTickValue + 1, i, this.plotY + this.plotHeight + yPadding * 0.66);
			xTickValue += xTickSpacing;
		}

		// Draw y-axis ticks
		this.scaledYTickSpacing = map(yTickSpacing, 0, yMax, 0, this.plotHeight);
		let yTickValue = yMax;
		textAlign(RIGHT, CENTER);
		for (let i = this.plotY; i < this.plotY + this.plotHeight; i += this.scaledYTickSpacing) {
			line(this.plotX, i, this.plotX - 5, i);
			text(yTickValue, this.plotX - 5, i);
			yTickValue -= yTickSpacing;
		}
	};

	this.addBar = function(index, yValue, totalBars, barWidth, colour) {
		if (yValue >= this.yMin && yValue <= this.yMax) {
			// Calculate x position based on index
			let spacing = this.plotWidth / (totalBars + 1);
			let pointX = this.plotX + spacing * (index + 1);

			let pointY = map(yValue, this.yMin, this.yMax,
				this.plotY + this.plotHeight, this.plotY);

			let actualBarWidth = spacing * barWidth;

			fill(colour);
			stroke(0);
			strokeWeight(1);

			// Draw bar
			rect(pointX - actualBarWidth/2, pointY,
				actualBarWidth, this.plotHeight - pointY);

			// Add value label on top of the bar
			fill(0);
			noStroke();
			textAlign(CENTER, BOTTOM);
			text(yValue, pointX, pointY - 5);
		}
	};

	this.addBars = function(xValues, yValues, barWidth, colour) {
		if (xValues.length === yValues.length) {
			for (let i = 0; i < yValues.length; i++) {
				this.addBar(i, yValues[i], yValues.length, barWidth, colour);
			}
		} else {
			console.log("Error: The data arrays aren't the same length");
		}
	};
}