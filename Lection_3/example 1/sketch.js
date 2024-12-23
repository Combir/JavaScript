let sound;
let isInitialised;
let isLoaded = false;
let fft;

function preload() {
    soundFormats('mp3', 'wav');
    sound = loadSound('assets/yee-king_track.mp3', () => {
        console.log("Sound is loaded!");
        isLoaded = true;
    });
    isInitialised = false;
    sound.setVolume(0.2);
}

function setup() {
    createCanvas(1024, 512);
    textAlign(CENTER);
    textSize(32);
    fft = new p5.FFT();
}

function draw() {
    background(0);
    fill(255);
    
    if (isInitialised && !sound.isPlaying()) {
        text("Press any key to play sound", width / 2, height / 2);
    } else if (sound.isPlaying()) {
        let freqs = fft.analyze();
        
        noStroke();
        for (let i = 2; i < freqs.length - 2; i++) {
            let avg = (freqs[i - 2] + freqs[i - 1] + freqs[i] + freqs[i + 1] + freqs[i + 2]) / 5;

            let h = map(avg, 0, 255, 0, height);

            let col = map(i, 0, freqs.length, 0, 255);
            fill(col, 255 - col, 150);

            rect(i * (width / freqs.length), height - h, width / freqs.length, h);
        }
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;
        if (isLoaded) sound.loop();
    } else {
        if (key == ' ') {
            if (sound.isPaused()) sound.play();
            else sound.pause();
        }
    }
}
