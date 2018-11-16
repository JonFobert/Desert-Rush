const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');
const canvasInstruct = document.querySelector('#instructions');
const contextInstruct = canvasInstruct.getContext('2d');
//consider getting rid of this to avoid float Baddie movement computation
context.scale(10, 10);
//Colors: https://coolors.co/3d5a80-98c1d9-e0fbfc-ee6c4d-293241

const gravityAccelY = 70.0;

const player = {
	x: 5,
	y: 20,
	width: 2,
	height: 2,
	velocityY: 0,
	score: 0
};

const baddieOne = {
	type: 'baddie',
	draw: drawBaddie,
	x: 55,
	y: 18,
	width: 4,
	height: 4,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
	}
};

const pad = {
	type: 'pad',
	draw: drawPad,
	x: 165,
	y: 19,
	width: 6,
	height: 3,
	counted: true,
	collided: checkCollisionPad,
	collideAction: function () {
		player.velocityY = -40;
		player.score += 2;
	}
};

const baddieTwo = {
	type: 'baddie',
	draw: drawBaddie,
	x: 100,
	y: 18,
	width: 4,
	height: 4,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
	}
};

const baddieThree = {
	type: 'baddie',
	draw: drawBaddie,
	x: 140,
	y: 18,
	width: 4,
	height: 4,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
	}
};

let actors = [baddieOne, baddieTwo, baddieThree, pad];

let introComplete = false;

let currentFrame = 0
let lastReplace = 200;
let framesSinceReplace = 0

function draw(deltaTime, time) {
	context.fillStyle = '#E0FBFC';
	context.fillRect(0, 0, canvas.width, canvas.height)
	if(player.velocityY !== 0) {
		jump(deltaTime);
	}
	drawPlayer(player);
	if (introComplete == false) {
		introOnRails();
		return;
	}
	framesSinceReplace++
	actors.forEach(actor => {
		actor.draw(actor);
		actor.x -= 0.2;
		if(actor.collided(player,actor)) {
			actor.collideAction();
			updateScore();
		}

		if (actor.x < 7 && actor.type == 'baddie' && actor.counted == false) {
			player.score++;
			updateScore();
			actor.counted = true;
		}

		if (actor.x < -4) {
			//place the baddie 20 to 40 units behind where the previous baddie was replaced
			actor.x = (lastReplace - framesSinceReplace * 0.2) + randomIntFromInterval(20, 40);
			lastReplace = actor.x
			framesSinceReplace = 0
			console.log(actor.x)
			actor.counted = false;
		}	
	});
}
const introBaddie = {
	x: 80,
	y: 18,
	width: 4,
	height: 4,
	counted: false
};
const introPad = {
	x: 130,
	y: 19,
	width: 6,
	height: 3,
	stomped: false,
	collided: checkCollisionPad
};

function introOnRails() {
	instructText = "UP arrow key to Jump";
	drawBaddie(introBaddie);
	drawPad(introPad);
	introBaddie.x -= 0.2;
	introPad.x -=0.2;
	if(checkCollision(player,introBaddie)) {
		player.score = 0;
		updateScore();
	}

	if (introPad.x < -6) {
		instructText = "";
		drawText(0)
		return introComplete = true
	}

	else if (introPad.x < 7) {
		if (introPad.collided(player, introPad)) {
			player.velocityY = -40
			player.score += 2
			updateScore();
		}
	}

	else if (introBaddie.x < -4) {
		instructText = "Bounce on green pads for bonus points";
		drawText(60);
		//player.score = 1;
		updateScore();
	}

	else if (introBaddie.x < 7 && introBaddie.counted === false) {
		player.score++;
		updateScore()
		introBaddie.counted = true;
	}
	else if (introBaddie.x < 50) {
		instructText = "Jump to avoid red enemies";
		drawText(100);
	}	
	else {
		drawText(120);
	}
};

function drawPlayer() {
	context.fillStyle = '#98C1D9';
	context.fillRect(player.x, player.y, player.width, player.height);
}

function drawBaddie(baddie) {
	context.fillStyle = '#EE6C4D';
	context.fillRect(baddie.x, baddie.y, baddie.width, baddie.height);
}

function drawPad(pad) {
	context.fillStyle = '#99ED4B';
	context.fillRect(pad.x, pad.y, pad.width, pad.height);
}

function drawText(xOffset) {
	contextInstruct.clearRect(0,0,500,300)
	contextInstruct.font = "24px Arial";
	contextInstruct.fillText(instructText, xOffset, 50);
}

//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1) + min);
}

function checkCollision(player, baddie) {
	if(((player.x + player.width) > baddie.x && player.x < (baddie.x + baddie.width)||
		player.x < (baddie.x + baddie.width) && (player.x + player.width) < baddie.width) &&
		((player.y + player.height) > baddie.y && player.y < (baddie.y + baddie.height)||
		player.y < (baddie.y + baddie.height) && (player.y + player.height) < baddie.height)) {
		return true;
	}
}

function checkCollisionPad(player, pad) {
	if(((player.x + player.width) > pad.x && player.x < (pad.x + pad.width)||
		player.x < (pad.x + pad.width) && (player.x + player.width) < pad.width) &&
		((player.y + player.height) - pad.y < 0.5 && (player.y + player.height) - pad.y > -0.5) 
		&& player.velocityY > 0) {
		return true
	}
}
//https://stackoverflow.com/questions/9960959/jumping-in-a-game
function jump(deltaTime) {
	let timeInSec = deltaTime/1000
	player.velocityY += gravityAccelY * timeInSec;
	player.y += player.velocityY * timeInSec;
	if (player.y > 20) {
    	player.y = 20; // assuming the ground is at height 20
    	player.velocityY = 0;
	}
}

document.addEventListener("keydown", e => {
	if (e.keyCode === 38 && player.velocityY === 0) {
		player.velocityY = -40
	}
});

//resource for rAF and main loop: https://developer.mozilla.org/en-US/docs/Games/Anatomy
let lastTime = 0;
function main(time) {
	requestAnimationFrame(main);
	deltaTime = time - lastTime;
	lastTime = time;
	draw(deltaTime, time);
}

function updateScore() {
	document.querySelector('.score').innerHTML = `score: ${player.score}`
}
updateScore();
requestAnimationFrame(main);