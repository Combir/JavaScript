let flying_nlo = {
    x: 600,
    y: 400,
    width: 250,
    height: 100,
    color_1: '#AFF0F0',
    color_2: '#969696',

    draw_signal: function(){
        fill(255);
        for(let i = 0; i < 10; i++)
            circle(this.x - this.width/2 + i * 27, this.y, 10);
    },

    change_pos: function(direction){
        this.x += direction;
    },

    draw_fly: function(){
        fill(this.color_1);
        arc(this.x, this.y - this.height/2, this.width/2, this.height, PI, TWO_PI);
        fill(this.color_2);
        arc(this.x, this.y, this.width, this.height + 10, PI, TWO_PI);
        fill(50);
        arc(this.x, this.y, this.width, this.height/2, 0, PI);
        this.draw_signal();
    },

    beam: function(){
        fill(255,255,100,150);

        beginShape();
        vertex(this.x - this.width/8, this.y + 10);
        vertex(this.x + this.width/8, this.y + 10);
        vertex(this.x + this.width/4, height - 100);
        vertex(this.x - this.width/4, height - 100);
        endShape();
    },

    is_in_beam: function(cow) {
        let beamLeft = this.x - this.width / 4;
        let beamRight = this.x + this.width / 4;
        return cow.x > beamLeft && cow.x < beamRight && cow.y > this.y;
    },

    is_in_body: function(cow) {
        let bodyLeft = this.x - this.width / 2;
        let bodyRight = this.x + this.width / 2;
        let bodyTop = this.y - this.height / 2;
        let bodyBottom = this.y + this.height / 2;
        return cow.x > bodyLeft && cow.x < bodyRight && cow.y > bodyTop && cow.y < bodyBottom;
    }
}

let cows = [];

function Cow(x, y, direction)
{
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.isFalling = false;
    this.isSucked = false;

    this.walk = function()
    {
        this.x += this.direction;
    }

    this.draw = function()
    {
        push();
        translate(this.x, this.y);
        if (this.direction > 0)
        {
            scale(-1, 1);
        }

        fill(255, 250, 250);
        rect(0, -10, 10, 5);

        rect(0, -5, 2, 5);
        rect(8, -5, 2, 5);

        rect(-4, -12, 4, 4);

        fill(0);
        rect(4, -9, 3, 3);
        rect(6, -10, 2, 2);

        pop();
    }

    this.update = function()
    {
        if (this.isFalling && this.y < height - 100) {
            this.y += 5; 
        }

        // Stop falling when the cow hits the ground
        if (this.y >= height - 100) {
            this.y = height - 100;
            this.isFalling = false;
            this.isSucked = false; 
        }

        if (!this.isSucked) {
            this.walk();
        }
    }
}

let caughtCows = 0; 

function CowManager()
{
    let countCows = 10;

    this.update = function()
    {
        while(cows.length < countCows)
        {
            cows.push(new Cow(random(0, width) , height - 100, random(-2, 2)));
        }

        for (let i = 0; i < cows.length; i++)
        {
            if (flying_nlo.is_in_beam(cows[i])) {
                cows[i].y -= 5; 
                cows[i].isFalling = false; 
                cows[i].isSucked = true;  
            } else {
                if (cows[i].y < height - 100) {
                    cows[i].isFalling = true;
                }
            }

            if (flying_nlo.is_in_body(cows[i])) {
                cows.splice(i, 1);
                countCows--;
                caughtCows++; 
                i--; 
            }

            cows[i].update();
        }

    }

    this.draw = function()
    {
        for(let i = 0; i < cows.length; i++)
            cows[i].draw();

        fill(255);
        textSize(32);
        textAlign(RIGHT);
        text("Caught Cows: " + caughtCows, width - 20, 40);
    }

    return this;
}

function setup() {
    createCanvas(1000, 1000);
    frameRate(20);
    noStroke();
}

function draw(){
    background(50,100, 80);

    let cowManager = new CowManager();
    cowManager.update();
    cowManager.draw();

    fill(0,50,0);
    rect(0, height - 100, width, 100);

    flying_nlo.draw_fly();
    flying_nlo.beam();

    if (keyIsDown(LEFT_ARROW))
        flying_nlo.change_pos(-4);
    if (keyIsDown(RIGHT_ARROW))
        flying_nlo.change_pos(4);
}
