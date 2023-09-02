class Ray {
	constructor(x, y, head) {
		this.pos = createVector(x, y);
		angleMode(DEGREES);
		this.dir = createVector(1, 1);
		this.dir.setHeading(head);
	}

	show() {
		// stroke(200);
		// strokeWeight(1);
		// line(this.pos.x, this.pos.y, this.pos.x + this.dir.x * 50, this.pos.y + this.dir.y * 50);
		
		noStroke();
		fill(200);
		ellipseMode(CENTER);
		ellipse(this.pos.x, this.pos.y, 5, 5);
	}

	update(x, y) {
		this.pos.x = x;
		this.pos.y = y;
	}

	lookAt(x, y) {
		this.dir.x = x - this.pos.x;
		this.dir.y = y - this.pos.y;
		this.dir.normalize();
	}

	move (steps) {
		let newPos = p5.Vector.add(p5.Vector.mult(this.dir, steps), this.pos);
		// if (!isWall(newPos))
		// 	return true;
		// else return false;
	}

	cast (walls) {
		let target = null;
		let closest = null;
		let closestDist = Infinity;
		for (let wall of walls) {

			let x1 = this.pos.x;
			let x2 = x1 + this.dir.x;
			let x3 = wall.x1;
			let x4 = wall.x2;
			let y1 = this.pos.y;
			let y2 = y1 + this.dir.y;
			let y3 = wall.y1;
			let y4 = wall.y2;
	
			let num = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
			let denum = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
			if (denum == 0)
				return;
	
			let t = num/denum;
			num = (x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2);
			let u = num/denum;
	
			if (u >= 0 && u <= 1 && t >= 0)
			{
					let target = createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
					let dist = this.pos.dist(target);
					if (dist < closestDist) {
						closest = target;
						closestDist = dist;
					}
				}
		}

		if (closest != null && closestDist != Infinity)
		{
			fill(200, 0, 0, 200);
			noStroke();
			ellipse(closest.x, closest.y, 5, 5);
			stroke(200);
			strokeWeight(1);
			line(this.pos.x, this.pos.y, closest.x, closest.y);
			// let d = p5.Vector.dist(this.pos, closest);
			return closest;
		}

	}
}
