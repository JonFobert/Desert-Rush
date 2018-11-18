const canvas = document.querySelector('.game');
const context = canvas.getContext('2d');
const canvasInstruct = document.querySelector('.instructions');
const contextInstruct = canvasInstruct.getContext('2d');
context.scale(10, 10);
const startButton = document.querySelector('.start');
const startScreen = document.querySelector('.start-menu');
//Colors: https://coolors.co/3d5a80-98c1d9-e0fbfc-ee6c4d-293241
/*sprite ideas:
https://www.kenney.nl/assets/platformer-characters-1
https://www.kenney.nl/assets/platformer-art-extended-enemies
*/

//background images

let backgroundFive = document.createElement("img");
backgroundFive.src = "assets/background5.png"
let backgroundFiveX = 0

let backgroundFour = document.createElement("img");
backgroundFour.src = "assets/background4.png"
let backgroundFourX = 0

let backgroundThree = document.createElement("img");
backgroundThree.src = "assets/background3.png"
let backgroundThreeX = 0

let backgroundTwo = document.createElement("img");
backgroundTwo.src = "assets/background2.png"
let backgroundTwoX = 0

let backgroundOne = document.createElement("img");
backgroundOne.src = "assets/background1.png"

//sprite images
let playerImg = document.createElement("img");
playerImg.src = "assets/playerWalk.png";
let playerSpriteW = 80, playerSpriteH = 93;

let baddieImg = document.createElement("img");
baddieImg.src = "assets/zombieWalk.png";
let baddieSpriteW = 80, baddieSpriteH = 90;


const gravityAccelY = 70.0;
let actorSpeed = 0.3
let StartButtonPressed = false;
let runGame = true;

const player = {
	x: 5,
	y: 36.7,
	width: 6,
	height: 9,
	velocityY: 0,
	score: 0
};

const baddieOne = {
	type: 'baddie',
	draw: drawBaddieSprite,
	drawTwo: drawBaddie,
	x: 115,
	y: 37,
	width: 5,
	height: 9,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
		actorSpeed = 0.3;
	}
};

/*const pad = {
	type: 'pad',
	draw: drawPad,
	x: 165,
	y: 37,
	width: 5,
	height: 3,
	counted: true,
	collided: checkCollisionPad,
	collideAction: function () {
		player.velocityY = -40;
		player.score += 2;
	}
};*/

const baddieTwo = {
	type: 'baddie',
	draw: drawBaddieSprite,
	drawTwo: drawBaddie,
	x: 160,
	y: 37,
	width: 5,
	height: 9,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
		actorSpeed = 0.3;
	}
};

const baddieThree = {
	type: 'baddie',
	draw: drawBaddieSprite,
	drawTwo: drawBaddie,
	x: 200,
	y: 37,
	width: 5,
	height: 9,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
		actorSpeed = 0.3;
	}
};

const baddieFour = {
	type: 'baddie',
	draw: drawBaddieSprite,
	drawTwo: drawBaddie,
	x: 240,
	y: 37,
	width: 5,
	height: 9,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
		actorSpeed = 0.3;
	}
};

let actors = [baddieOne, baddieTwo, baddieThree, baddieFour];

let introComplete = false;
let nextActorFrame = 0
let cycle = 0
let lastReplace = 200;
let framesSinceReplace = 0

function draw(deltaTime, time) {
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawBackground();
	if(player.velocityY !== 0) {
		jump(deltaTime);
	}
	drawPlayerSprite(player);
	if (introComplete == false) {
		introOnRails();
		return;
	}
	framesSinceReplace++;
	actors.forEach(actor => {
		actor.x -= actorSpeed;
		if (actor.x < 96) {
			actor.draw(actor);
			//actor.drawTwo(actor);

			if(actor.collided(player,actor)) {
				actor.collideAction();
				updateScore();
				StartButtonPressed = false
			}

			if (actor.x < 7 && actor.type == 'baddie' && actor.counted == false) {
				player.score++;
				updateScore();
				actor.counted = true;
			}

			if (actor.x < -4) {
				//place the baddie 20 to 40 units behind where the previous baddie was replaced
				actor.x = (lastReplace - framesSinceReplace * actorSpeed) + randomIntFromInterval(30, 60);
				lastReplace = actor.x
				framesSinceReplace = 0;
				console.log(actor.x)
				actor.counted = false;
				actorSpeed += 0.02;
			}
		}	
	});
}
const introBaddie = {
	x: 100,
	y: 37,
	width: 5,
	height: 9,
	counted: false
};
const introPad = {
	x: 130,
	y: 34,
	width: 6,
	height: 3,
	stomped: false,
	collided: checkCollisionPad
};

function introOnRails() {
	instructText = "";
	introBaddie.x -= 0.3;
	introPad.x -=0.3;
	drawBaddieSprite(introBaddie);
	//drawPad(introPad);
	if(checkCollision(player,introBaddie)) {
		player.score = 0;
		updateScore();
		StartButtonPressed = false
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
		instructText = "";
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
		instructText = "Jump to avoid zombies";
		drawText(320);
	}	

	else if (introBaddie.x < 95) {
		drawText(330);
	}
	else {
		if (!StartButtonPressed) {
			runGame = false
		}
	}
};

function drawPlayer() {
	context.fillStyle = '#98C1D9';
	context.fillRect(player.x, player.y, player.width, player.height);
}

function drawBackground() {
	context.drawImage(backgroundOne,
				  0, 0, canvas.width, canvas.height,
				  0, 0, canvas.width/10, canvas.height/10)
	
	//IMAGE TWO
	context.drawImage(backgroundTwo,
					  0, 0, canvas.width, canvas.height,
					  backgroundTwoX/10, 0, canvas.width/10, canvas.height/10)
	context.drawImage(backgroundTwo,
				 	  0, 0, canvas.width, canvas.height,
				 	  backgroundTwoX/10 + canvas.width/10, 0, canvas.width/10, canvas.height/10)
	backgroundTwoX -= 0.5
	if (-backgroundTwoX == canvas.width) {
		backgroundTwoX = 0;
	}
	
	//IMAGE THREE
	context.drawImage(backgroundThree,
					  0, 0, canvas.width, canvas.height,
					  backgroundThreeX/10, 0, canvas.width/10, canvas.height/10)
	context.drawImage(backgroundThree,
				 	  0, 0, canvas.width, canvas.height,
				 	  backgroundThreeX/10 + canvas.width/10, 0, canvas.width/10, canvas.height/10)
	backgroundThreeX -= 1
	if (-backgroundThreeX == canvas.width) {
		backgroundThreeX = 0;
	}
	/*
		//IMAGE FOUR
	context.drawImage(backgroundFour,
					  0, 0, canvas.width, canvas.height,
					  backgroundFourX/10, 0, canvas.width/10, canvas.height/10)
	context.drawImage(backgroundFour,
				 	  0, 0, canvas.width, canvas.height,
				 	  backgroundFourX/10 + canvas.width/10, 0, canvas.width/10, canvas.height/10)
	backgroundFourX -= 2
	if (-backgroundFourX == canvas.width) {
		backgroundFourX = 0;
	}*/
		//IMAGE FIVE
	context.drawImage(backgroundFive,
					  0, 0, canvas.width, canvas.height,
					  backgroundFiveX/10, 0, canvas.width/10, canvas.height/10)
	context.drawImage(backgroundFive,
				 	  0, 0, canvas.width, canvas.height,
				 	  backgroundFiveX/10 + canvas.width/10, 0, canvas.width/10, canvas.height/10)
	backgroundFiveX -= 2
	if (-backgroundFiveX == canvas.width) {
		backgroundFiveX = 0;
	}
}

function drawPlayerSprite() {
	context.drawImage(playerImg,
					  //source rectangle
					  cycle * playerSpriteW, 0, playerSpriteW, playerSpriteH,
					  //destination rectange. -1 to compensate for blank left of sprite
					  player.x-1, player.y, playerSpriteW/10, playerSpriteH/10);
	nextActorFrame++
	if (nextActorFrame == 8) {
		cycle = (cycle + 1) % 2
		nextActorFrame = 0
	}
}


function drawBaddieSprite(baddie) {
	context.drawImage(baddieImg,
					  //source rectangle
					  cycle * baddieSpriteW, 0, baddieSpriteW, baddieSpriteH,
					  //destination rectange. -1 to compensate for blank left of sprite
					  baddie.x-1, baddie.y, baddieSpriteW/10, baddieSpriteH/10);
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
	contextInstruct.clearRect(0,0,960,540)
	contextInstruct.font = "32px Arial";
	contextInstruct.fillStyle = "#293241";
	contextInstruct.fillText(instructText, xOffset, 100);
}

//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1) + min);
}

//modified version of: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function randomizeLastThree(array) {
	for(let i = 5; i > 3; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
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
	if (player.y > 36.7) {
    	player.y = 36.7; // assuming the ground is at height 20
    	player.velocityY = 0;
	}
}

document.addEventListener("keydown", e => {
	if (e.keyCode === 38 && player.velocityY === 0) {
		player.velocityY = -50
	}
});

//resource for rAF and main loop: https://developer.mozilla.org/en-US/docs/Games/Anatomy
let lastTime = 0;
function main(time) {
	if(runGame) {
		requestAnimationFrame(main);
		deltaTime = time - lastTime;
		lastTime = time;
		draw(deltaTime, time);
	}
}

function updateScore() {
	document.querySelector('.score').innerHTML = `Score: ${player.score}`
}

startButton.addEventListener("click", () => {
	StartButtonPressed = true
	runGame = true
	startScreen.style.display = "none"
	requestAnimationFrame(main);
});

//adapted from https://stackoverflow.com/questions/31299509/call-a-function-when-html5-canvas-is-ready
var images = [
            'assets/background5.png',
            'assets/background4.png',
            'assets/background3.png',
            'assets/background2.png',
            'assets/background1.png',
            'assets/playerWalk.png',
            'assets/zombieWalk.png'
          ];
          var imagesLoading = images.length;
          
          // Image loader.
          var loadImage = function(i) {
             var img = new Image();
             img.onload = function() {
               images[i] = img;
               --imagesLoading;
               // Call the complete callback when all images loaded.
               if (imagesLoading === 0) {
                 workDone();
               }
             };
             img.src = images[i];
          };
          
          // Call upon all images loaded.
          var workDone = function() {
            // Clear canvas
            requestAnimationFrame(main)
        	}
           
          // Start to load all images.
          var i;
          for(i = 0; i < imagesLoading; ++i) {
            loadImage(i);
          }


updateScore();
