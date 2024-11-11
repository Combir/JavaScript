let sound;
let isInitialised = false;
let isLoaded = false;
let fft;
let smoothedSpectrum = [];
let particles = [];
const maxParticles = 500;

function preload() {
    soundFormats('mp3', 'wav');
    sound = loadSound('assets/yee-king_track.mp3',
        () => {
            console.log("Sound loaded successfully");
            isLoaded = true;
        },
        (error) => {
            console.error("Error loading sound:", error);
        }
    );
    sound.setVolume(0.2);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textAlign(CENTER);
    textSize(32);
    colorMode(HSB, 360, 100, 100, 1);

    fft = new p5.FFT();

    for (let i = 0; i < 256; i++) {
        smoothedSpectrum.push(0);
    }

    for (let i = 0; i < 300; i++) {
        particles.push(createParticle());
    }

    console.log("Setup complete");
}

function draw() {
    background(0, 0, 0, 0.05);

    if (!isLoaded) {
        fill(255);
        text("Loading sound...", width / 2, height / 2);
    } else if (!isInitialised || !sound.isPlaying()) {
        fill(255);
        text("Press any key to play sound", width / 2, height / 2);
    } else {
        try {
            let spectrum = fft.analyze();
            updateSmoothedSpectrum(spectrum);
            drawBackground();
            drawVisualizer();
        } catch (error) {
            console.error("Error in draw function:", error);
            fill(255);
            text("Error occurred. Check console.", width / 2, height / 2);
        }
    }
}

function updateSmoothedSpectrum(spectrum) {
    for (let i = 0; i < smoothedSpectrum.length; i++) {
        let sum = 0;
        let count = 0;
        for (let j = Math.max(0, i - 2); j <= Math.min(spectrum.length - 1, i + 2); j++) {
            sum += spectrum[j];
            count++;
        }
        smoothedSpectrum[i] = sum / count;
    }
}

function drawBackground() {
    let bassEnergy = fft.getEnergy("bass");
    let trebleEnergy = fft.getEnergy("treble");

    for (let i = particles.length - 1; i >= 0; i--) {
        updateParticle(particles[i], bassEnergy);
        drawParticle(particles[i]);
        if (particles[i].lifespan < 0) {
            particles.splice(i, 1);
        }
    }

    if (random(1) < map(trebleEnergy, 0, 255, 0, 0.5) && particles.length < maxParticles) {
        particles.push(createParticle());
    }
}

function drawVisualizer() {
    let barWidth = width / smoothedSpectrum.length;
    noStroke();

    for (let i = 0; i < smoothedSpectrum.length; i++) {
        let barHeight = map(smoothedSpectrum[i], 0, 255, 0, height / 2);
        let hue = map(i, 0, smoothedSpectrum.length, 0, 360);
        fill(hue, 80, 100, 0.7);
        rect(i * barWidth, height - barHeight, barWidth, barHeight);
    }
}

function keyPressed() {
    if (!isInitialised) {
        isInitialised = true;
        if (isLoaded) {
            sound.loop();
            console.log("Sound playback started");
        } else {
            console.log("Sound not loaded yet");
        }
    } else {
        if (key == ' ') {
            if (sound.isPaused()) {
                sound.play();
                console.log("Sound resumed");
            } else {
                sound.pause();
                console.log("Sound paused");
            }
        }
    }
}

// Функция для создания частицы
function createParticle() {
    return {
        pos: createVector(random(width), random(height)),
        vel: createVector(random(-1, 1), random(-1, 1)),
        size: random(2, 6),
        color: color(random(360), 80, 100, 0.6),
        lifespan: 200
    };
}

// Функция для обновления частицы
function updateParticle(particle, energy) {
    particle.vel.mult(1.01 + energy / 1000);
    particle.pos.add(particle.vel);
    particle.lifespan -= 1.5;

    if (particle.pos.x < 0 || particle.pos.x > width) particle.vel.x *= -1;
    if (particle.pos.y < 0 || particle.pos.y > height) particle.vel.y *= -1;
}

// Функция для рисования частицы
function drawParticle(particle) {
    noStroke();
    let fadeAlpha = map(particle.lifespan, 0, 200, 0, 0.6);
    let particleColor = color(hue(particle.color), saturation(particle.color), brightness(particle.color), fadeAlpha);
    fill(particleColor);
    ellipse(particle.pos.x, particle.pos.y, particle.size);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
