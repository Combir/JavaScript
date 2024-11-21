let previousMouseX = -1;
let previousMouseY = -1;
let canvas;
let selectArea;
/**
 * selectMode - 0 Start
 * selectMode - 1 Press select area
 * selectMode - 2 press cut(pixels copied and cleared from canvas)
 */
let selectMode;
let editMode;
let selectButton, clearButton, editButton;
let pencilButton, thickPencilButton;
let colorButtons = [];
let selectedColor= 'black';
let currentShape =[];
let selectedPixels;
let pencilType = "regular";

function setup ( ) {
	canvas =createCanvas(800, 800);
	background(200);
	noFill();
	stroke(0);
	selectMode= 0;
	editMode=0;
	selectArea = {x:0,y:0, w: 100, h: 100};

	selectButton = createButton('Select area');
	clearButton = createButton('Clear');
	editButton = createButton('Create Shape');
	pencilButton = createButton('Regular Pencil');
	thickPencilButton = createButton('Thick Pencil');

	const colors = ['black', 'red', 'blue', 'green', 'yellow', 'purple'];
	for (let col of colors) {
		let colorButton = createButton('');
		colorButton.style('background-color', col);
		colorButton.style('width', '30px');
		colorButton.style('height', '30px');
		colorButton.mousePressed(() => selectedColor = col);
		colorButtons.push(colorButton);
	}

	selectButton.mousePressed(handleSelectButton);
	clearButton.mousePressed(() => {
		background(200);
		previousMouseX = -1;
		previousMouseY = -1;
	});
	editButton.mousePressed(handleEditButton);
	pencilButton.mousePressed(() => pencilType = "regular");
	thickPencilButton.mousePressed(() => pencilType = "thick");
}

function draw() {
	if (!mouseIsPressed && selectMode === 0 && editMode === 0) {
		previousMouseX = mouseX;
		previousMouseY = mouseY;
	}

	if (mouseIsPressed && editMode === 0) {
		if (selectMode === 0 && mousePressOnCanvas(canvas)) {
			if (previousMouseX === -1) {
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			} else {
				stroke(selectedColor);
				strokeWeight(pencilType === "thick" ? 8 : 2);
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		} else if (selectMode === 1) {
			updatePixels();
			noStroke();
			fill(255, 0, 0, 100);
			rect(selectArea.x, selectArea.y, selectArea.w, selectArea.h);
		}
	}

	if (editMode > 0) {
		updatePixels();
		if (mouseIsPressed && mousePressOnCanvas(canvas) && editMode === 2) {
			for (let i = 0; i < currentShape.length; i++) {
				if (dist(currentShape[i].x, currentShape[i].y, mouseX, mouseY) < 15) {
					currentShape[i].x = mouseX;
					currentShape[i].y = mouseY;
				}
			}
		}
		beginShape();
		for (let i = 0; i < currentShape.length; i++) {
			vertex(currentShape[i].x, currentShape[i].y);
			if (editMode === 2) {
				fill('red');
				ellipse(currentShape[i].x, currentShape[i].y, 10, 10);
			}
		}
		if (editMode === 0) {
			fill(selectedColor);
		}
		endShape(CLOSE);
	}
}

function mousePressed() {
	switch (selectMode) {
		case 1:
			selectArea.x = mouseX;
			selectArea.y = mouseY;
			break;
		case 2:
			image(selectedPixels, mouseX, mouseY);
			break;
	}
}

function mouseDragged() {
	if (selectMode === 1) {
		let width = mouseX - selectArea.x;
		let height = mouseY - selectArea.y;
		selectArea.w = width;
		selectArea.h = height;
	}
}

function mouseReleased() {
	if (mousePressOnCanvas(canvas) && editMode === 1) {
		currentShape.push({x: mouseX, y: mouseY});
	}
}

function handleSelectButton() {
	switch (selectMode) {
		case 0:
			selectMode += 1;
			selectButton.html('Cut');
			loadPixels();
			break;
		case 1:
			selectMode += 1;
			selectButton.html('End Paste');
			updatePixels();
			selectedPixels = get(selectArea.x, selectArea.y, selectArea.w, selectArea.h);
			fill(200);
			noStroke();
			rect(selectArea.x, selectArea.y, selectArea.w, selectArea.h);
			break;
		case 2:
			selectMode = 0;
			loadPixels();
			previousMouseX = -1;
			previousMouseY = -1;
			selectArea = {x: 0, y: 0, w: 100, h: 100};
			selectButton.html('Select area');
			break;
	}
}

function handleEditButton() {
	switch (editMode) {
		case 0:
			editMode = 1;
			editButton.html("Edit Vertices");
			break;
		case 1:
			editMode = 2;
			editButton.html("Finish Shape");
			break;
		case 2:
			editMode = 0;
			editButton.html('Create Shape');
			loadPixels();
			draw();
			currentShape = [];
			break;
	}
}

function mousePressOnCanvas(canvas) {
	return (
		mouseX > 0 &&
		mouseX < canvas.width &&
		mouseY > 0 &&
		mouseY < canvas.height
	);
}
