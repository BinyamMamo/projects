let FOV = 60, res=10;
class Particle {

	constructor(x, y, r, h) {
		this.pos = createVector(x, y);
		this.rad = r;
		this.heading = h;
		this.clr = color(200, 200, 200);
		this.vel = 1.5;
	}

	show() {
		fill(this.clr);
		ellipseMode(CENTER);
		ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
		this.cast(walls);
	}

	lookAt(x, y) {
		let mouse = createVector(mouseX, mouseY);
		this.heading = mouse.heading();
	}

	draw_rect(loci) {
		if (loci != null) {
			for (let locus of loci) {
				rectMode(CENTER);
				let d = p5.Vector.dist(this.pos, locus);
				rect(locus.x, locus.y, res, d);
			}
		}
	}

	cast(walls) {
		let rays = [];
		for (let i = -1 * (FOV / 2); i <= FOV / 2; i += res) {
			angleMode(DEGREES);
			rays.push(new Ray(this.pos.x, this.pos.y, this.heading + i));
		}
		let loci = [];
		for (let ray of rays) {
			ray.show();
			loci.push(ray.cast(walls));
		}
		// this.draw_rect(loci);
		this.movement(walls);
	}



	move(steps, particle = this) {
		let x = steps * cos(particle.heading);
		let y = steps * sin(particle.heading);

		particle.pos.add(x, y);
	}

	turn(x) {
		this.heading += x;
	}

	changeX(c) {
		let v = p5.Vector.fromAngle(radians(this.heading));
		v.set(-1 * v.y, v.x);
		v.mult(c);
		this.pos.add(v);
	}

	changeY(y) {
		this.pos.y += y;
	}


	movement(walls) {
		if (keyIsDown(UP_ARROW) || keyIsDown(87))
			this.handleCollision(walls, this.move, this.vel);
		if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
			this.handleCollision(walls, this.move, -this.vel);
		if (keyIsDown(LEFT_ARROW))
			this.turn(-this.vel);
		if (keyIsDown(RIGHT_ARROW))
			this.turn(this.vel);

		if (keyIsDown(65))
			this.changeX(-0.25);
		if (keyIsDown(68))
			this.changeX(0.25);
	}

	handleCollision(walls, func, arg) {
		fill(100, 100);

		let particle = this;
		let circle = {
			x: this.pos.x, y: this.pos.y, r: this.rad
		};

		func(arg, particle);
		for (let wall of walls) {
			let line = {
				x1: wall.x1, y1: wall.y1,
				x2: wall.x2, y2: wall.y2
			};

			let collision = particle.checkCollision(circle, line);

			if (collision.isColliding) {
				let temp = particle.heading;
				particle.heading = collision.reflectVector.heading();
				func(abs(arg), particle);
				particle.heading = temp;
			}
		}
	}

	checkCollision(circle, line) {
		// Calculate the vectors from the line's start point to the end point and to the circle's center
		let lineVector = createVector(line.x2 - line.x1, line.y2 - line.y1);
		let circleVector = createVector(circle.x - line.x1, circle.y - line.y1);

		// Project the circle vector onto the line vector and get the scalar projection
		let scalarProjection = circleVector.dot(lineVector) / lineVector.mag();

		// Find the closest point on the line to the circle's center by adding the scaled line vector to the start point
		let closestPoint = p5.Vector.add(createVector(line.x1, line.y1), p5.Vector.mult(lineVector.normalize(), scalarProjection));

		// Check if the closest point is within the line segment by comparing its position with the start and end points
		// let isWithinLine = scalarProjection < 0 && scalarProjection < lineVector.mag();
		let isWithinLine = this.inRange(closestPoint, line);

		// Calculate the distance between the closest point and the circle's center
		let distance = p5.Vector.dist(closestPoint, createVector(circle.x, circle.y));

		// Compare the distance with the radius of the circle
		let isColliding = false;
		isColliding = (distance < circle.r) && isWithinLine;


		// Return an object with the collision status and the closest point
		let reflectVector = createVector(circle.x - closestPoint.x, circle.y - closestPoint.y);
		// if (isColliding) {
		// 	// this.clr = color(0, 0, 100);
		// }
		// else
		// 	this.clr = color(200, 200, 200);


		return {
			isColliding: isColliding,
			closestPoint: closestPoint,
			isWithinLine: isWithinLine,
			reflectVector: reflectVector
		};
	}

	inRange(pt, line) {
		let x1 = min(line.x1, line.x2);
		let x2 = max(line.x1, line.x2);

		let y1 = min(line.y1, line.y2);
		let y2 = max(line.y1, line.y2);

		let a = pt.x >= x1 && pt.x <= x2;
		let b = pt.y >= y1 && pt.y <= y2;

		return a && b;
	}
}
