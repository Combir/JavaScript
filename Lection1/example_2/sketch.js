function Flying_nlo(x, y)
{
    this.x = x;
    this.y = y;
    this.width = 250;
    this.height = 100;
    this.color_1 = '#AFF0F0';
    this.color_2 = '#969696';
    this.neg_y_move = -1;
    this.pos_y_move = 1;
    this.neg_x_move = -2;
    this.pos_x_move = 2;
    
    
    this.draw_signal = function(){
        fill(255);
        for(let i = 0; i < 10; i++)
            circle(this.x - this.width/2 + i * 27, this.y, 10);
    },

    this.change_pos = function(){
        this.x += random(this.neg_x_move, this.pos_x_move);
        this.y += random(this.neg_y_move, this.pos_y_move);
    },

    this.draw_fly = function(){
        fill(this.color_1);
        arc(this.x, this.y - this.height/2, this.width/2, this.height, PI, TWO_PI);
        fill(this.color_2);
        arc(this.x, this.y, this.width, this.height + 10, PI, TWO_PI);
        fill(50);
        arc(this.x, this.y, this.width, this.height/2, 0, PI);
        this.draw_signal();  
    },

    this.beam = function(){
        fill(255,255,100,150);
        
        beginShape();
        vertex(this.x - this.width/4, this.y + 10);
        vertex(this.x + this.width/4, this.y + 10);
        vertex(this.x + this.width, height - 100);
        vertex(this.x - this.width, height - 100);
        endShape();
    }
    return this;
}

let mass_nlo = [];

function setup() {
    createCanvas(1000, 1000);
    frameRate(20);
    noStroke();
  
    for(let i = 0; i < 3; i++)
        mass_nlo.push(new Flying_nlo(random(0, width - 100), random(100, 200)));
}

function draw() {
    background(50,100, 80);
    
    // ground
    fill(0,50,0);
    rect(0, height - 100, width, 100);

    for (let i = 0; i < 3; i++)
    {
        console.log(mass_nlo[i]);
        mass_nlo[i].draw_fly();
        mass_nlo[i].change_pos();
        if (i % 2 == 0)
            mass_nlo[i].beam();
    }
   
}

