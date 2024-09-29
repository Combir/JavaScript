let flying_nlo = {}

function setup() {
    createCanvas(1000, 1000);
    frameRate(20);
    noStroke();

    flying_nlo = {
        x: 600,
        y: 400,
        width: 250,
        height: 100,
        color_1: '#AFF0F0',
        color_2: '#969696',
        neg_y_move: -1,
        pos_y_move: 1,
        neg_x_move: -2,
        pos_x_move: 2,
        
        
        draw_signal: function(){
            fill(255);
            for(let i = 0; i < 10; i++)
                circle(this.x - this.width/2 + i * 27, this.y, 10);
        },

        change_pos: function(){
            this.x += random(this.neg_x_move, this.pos_x_move);
            this.y += random(this.neg_y_move, this.pos_y_move);
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
            vertex(this.x - this.width/4, this.y + 10);
            vertex(this.x + this.width/4, this.y + 10);
            vertex(this.x + this.width, height - 100);
            vertex(this.x - this.width, height - 100);
            endShape();
        }
 
    }
}

function draw() {
    background(50,100, 80);
    
    // ground
    fill(0,50,0);
    rect(0, height - 100, width, 100);

    flying_nlo.change_pos();
    flying_nlo.draw_fly();
    flying_nlo.beam();
   
}

