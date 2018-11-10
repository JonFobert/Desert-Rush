const canvas = document.querySelector('#game');
const context = canvas.getContext('2d');
const canvasInstruct = document.querySelector('#instructions');
const contextInstruct = canvasInstruct.getContext('2d');
context.scale(10, 10);
//Colors: https://coolors.co/3d5a80-98c1d9-e0fbfc-ee6c4d-293241

const gravityAccelY = 70.0

const baddieOne = {
	x: 55,
	y: 20,
	width: 4,
	height: 4
};

const baddieTwo = {
	x: 200,
	y: 20,
	width: 4,
	height: 4
}

const baddieThree = {
	x: 230,
	y: 20,
	width: 4,
	height: 4
}

let baddies = [baddieOne, baddieTwo, baddieThree];

let instructText = "UP arrow key to Jump"

function draw(deltaTime) {
	context.fillStyle = '#E0FBFC';
	context.fillRect(0, 0, canvas.width, canvas.height)
	contextInstruct.font = "24px Arial";
	contextInstruct.fillText(instructText, 120, 50);
	if(player.velocityY !== 0) {
		jump(deltaTime)
	}
	drawPlayer(player);
	baddies.forEach(baddie => {
		drawBaddie(baddie);
		baddie.x -= 0.2
		if(checkCollision(player,baddie)) {
			player.score = 0
			updateScore();
		}
		if (baddie.x < -4) {
			contextInstruct.clearRect(0,0, 500, 300)
			instructText = "test";
			baddie.x = 55
			player.score++
			updateScore();
		}	
	});

}
const player = {
	x: 5,
	y: 20,
	width: 2,
	height: 2,
	velocityY: 0,
	score: 0
}

function drawPlayer() {
	context.fillStyle = '#98C1D9';
	context.fillRect(player.x, player.y, player.width, player.height)
}


function drawBaddie(baddie) {
	context.fillStyle = '#EE6C4D';
	context.fillRect(baddie.x, baddie.y, baddie.width, baddie.height);
}

function checkCollision(player, baddie) {
	if(((player.x + player.width) > baddie.x && player.x < (baddie.x + baddie.width)||
		player.x < (baddie.x + baddie.width) && (player.x + player.width) < baddie.width) &&
		((player.y + player.height) > baddie.y && player.y < (baddie.y + baddie.height)||
		player.y < (baddie.y + baddie.height) && (player.y + player.height) < baddie.height)) {
			return true
	}
}
//https://stackoverflow.com/questions/9960959/jumping-in-a-game
function jump(deltaTime) {
	//console.log(deltaTime)
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
	draw(deltaTime);
}

function updateScore() {
	document.querySelector('.score').innerHTML = `score: ${player.score}`
}
updateScore();
requestAnimationFrame(main);

//draw()