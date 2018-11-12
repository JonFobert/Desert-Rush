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
	x: 55,
	y: 18,
	width: 4,
	height: 4,
	counted: false,
};

const baddieTwo = {
	x: 120,
	y: 18,
	width: 4,
	height: 4,
	counted: false,
};

const baddieThree = {
	x: 180,
	y: 18,
	width: 4,
	height: 4,
	counted: false,
};

let baddies = [baddieOne, baddieTwo, baddieThree];

let instructText = "UP arrow key to Jump";

let introComplete = true;

let currentFrame = 0
let lastReplace = 200;
framesSinceReplace = 0

function draw(deltaTime, time) {
	context.fillStyle = '#E0FBFC';
	context.fillRect(0, 0, canvas.width, canvas.height)
	contextInstruct.clearRect(0,0,500,300)
	contextInstruct.font = "24px Arial";
	contextInstruct.fillText(instructText, 120, 50);
	if(player.velocityY !== 0) {
		jump(deltaTime);
	}
	drawPlayer(player);
	if (introComplete == false) {
		introOnRails();
		return;
	}
	framesSinceReplace++
	baddies.forEach(baddie => {
		drawBaddie(baddie);
		baddie.x -= 1;
		if(checkCollision(player,baddie)) {
			player.score = 0;
			updateScore();
		}

		if (baddie.x < 7 && baddie.counted == false) {
			player.score++;
			updateScore();
			baddie.counted = true;
		}

		if (baddie.x < -4) {
			contextInstruct.clearRect(0, 0, 500, 300)
			instructText = "test";
			//place the baddie 20 to 50 units behind where the previous one was replaced
			baddie.x = (lastReplace - framesSinceReplace) + randomIntFromInterval(20, 50);
			lastReplace = baddie.x
			framesSinceReplace = 0
			console.log(baddie.x)
			baddie.counted = false;
		}	
	});
}
const introBaddie = {
	x: 80,
	y: 18,
	width: 4,
	height: 4
};
const introPad = {
	x: 130,
	y: 19,
	width: 6,
	height: 3,
	stomped: false
};

function introOnRails() {
	drawBaddie(introBaddie);
	drawPad(introPad);
	introBaddie.x -= 0.2;
	introPad.x -=0.2;
	if(checkCollision(player,introBaddie)) {
		player.score = 0;
		updateScore();
	}
	checkCollisionPad(player,introPad);
	
	if (introPad.x < -6) {
		if(introPad.stomped) {
			player.score += 2;
			updateScore();
		}
		return introComplete = true
	}
	else if (introBaddie.x < -4) {
		instructText = "Jump on green pads for bonus points";
		player.score = 1;
		updateScore();
	}
	else if (introBaddie.x < 50) {
		instructText = "Jump to avoid red enemies";
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

function drawPad(baddie) {
	context.fillStyle = '#99ED4B';
	context.fillRect(baddie.x, baddie.y, baddie.width, baddie.height);
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
		pad.stomped = true;
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

//draw()