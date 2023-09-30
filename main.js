let particle;
let walls = [];
function setup()
{
	createCanvas(innerWidth - 10, innerHeight - 10);
	background(0);
	console.clear();

	// ray = new Ray(100, 100);
	// boundary
	walls.push(new Wall(0,0, width, 0));
	walls.push(new Wall(0,0, 0, height));
	walls.push(new Wall(width,0, width, height));
	walls.push(new Wall(0,height, width, height));

	// other walls`
	walls.push(new Wall(10,300, 200, 400));
	walls.push(new Wall(300,200, 200, 250));
	walls.push(new Wall(500,100, 300, 300));
	walls.push(new Wall(100,200, 200, 250));

	particle = new Particle(100, 100, 15, 60);
}

function draw() 
{
	background(30);
	particle.show();
	// particle.lookAt(mouseX, mouseY);
	draw_map();

	particle.cast(walls);
	// particle.move();
}

function draw_map() {
	for (let wall of walls) {
		wall.show();
	}
}