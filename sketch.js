let img;
let particles = [];

function preload() {
	img = loadImage('1.jpg');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	img.resize(width, height);
	img.loadPixels();

	for (let y = 0; y < img.height; y += 10) {
		for (let x = 0; x < img.width; x += 10) {
			let index = (x + y * img.width) * 4;
			let r = img.pixels[index];
			let g = img.pixels[index + 1];
			let b = img.pixels[index + 2];
			let a = img.pixels[index + 3];

			if (a > 0) {
				let col = color(r, g, b, a);
				let particle = new Particle(
					random(width),
					random(height),
					x,
					y,
					col
				);
				particles.push(particle);
			}
		}
	}
}

function draw() {
	background(0);

	for (let particle of particles) {
		particle.behaviors();
		particle.update();
		particle.show();
	}
}

class Particle {
	constructor(x, y, targetX, targetY, col) {
		this.pos = createVector(x, y);
		this.target = createVector(targetX, targetY);
		this.vel = p5.Vector.random2D();
		this.acc = createVector();
		this.maxSpeed = 5;
		this.maxForce = 0.3;
		this.color = col;
	}

	behaviors() {
		let arrive = this.arrive(this.target);
		let mouse = createVector(mouseX, mouseY);
		let flee = this.flee(mouse);

		arrive.mult(1);
		flee.mult(5);

		this.applyForce(arrive);
		this.applyForce(flee);
	}

	applyForce(force) {
		this.acc.add(force);
	}

	update() {
		this.pos.add(this.vel);
		this.vel.add(this.acc);
		this.acc.mult(0);
	}

	show() {
		stroke(this.color);
		strokeWeight(2);
		point(this.pos.x, this.pos.y);
	}

	arrive(target) {
		let desired = p5.Vector.sub(target, this.pos);
		let distance = desired.mag();
		let speed = this.maxSpeed;

		if (distance < 100) {
			speed = map(distance, 0, 100, 0, this.maxSpeed);
		}

		desired.setMag(speed);
		let steer = p5.Vector.sub(desired, this.vel);
		steer.limit(this.maxForce);

		return steer;
	}

	flee(target) {
		let desired = p5.Vector.sub(target, this.pos);
		let distance = desired.mag();

		if (distance < 50) {
			desired.setMag(this.maxSpeed);
			desired.mult(-1);
			let steer = p5.Vector.sub(desired, this.vel);
			steer.limit(this.maxForce);

			return steer;
		} else {
			return createVector(0, 0);
		}
	}
}
