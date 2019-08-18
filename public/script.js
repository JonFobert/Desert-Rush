/***********************************************************
						OVERVIEW:
	The main loop of this game uses request animation frame.
	See the function "main" at the bottom.
	The physics run at 60 fps.
***********************************************************/

const canvas = document.querySelector('.game');
const context = canvas.getContext('2d');
context.scale(10, 10);

const canvasInstruct = document.querySelector('.instructions');
const contextInstruct = canvasInstruct.getContext('2d');
const startButton = document.querySelector('.start');
const startScreen = document.querySelector('.start-menu');


//background images

let backgroundFive = document.createElement("img");
backgroundFive.src = "assets/background5.png"
let backgroundFiveX = 0

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

let zombieImg = document.createElement("img");
zombieImg.src = "assets/zombieWalk.png";
let zombieSpriteW = 80, zombieSpriteH = 90;

//Objects for the player and zombies (the enemies the player jumps over)

const player = {
	x: 5,
	y: 36.7,
	width: 6,
	height: 9,
	velocityY: 0,
	score: 0
};

class Zombie {
	constructor(x) {
		this.type = 'zombie'
		this.x = x
		this.y = 38
		this.width = 4
		this.height = 8
		this.counted = false
	}
	drawzombieSprite(zombie) {
		context.drawImage(zombieImg,
						  //source rectangle
						  cycle * zombieSpriteW, 0, zombieSpriteW, zombieSpriteH,
						  //destination rectange. -1 to compensate for blank left of sprite
						  zombie.x-2, zombie.y-1, zombieSpriteW/10, zombieSpriteH/10);
	}

	checkCollision(player, zombie) {
		if(((player.x + player.width) > zombie.x && player.x < (zombie.x + zombie.width)||
			player.x < (zombie.x + zombie.width) && (player.x + player.width) < zombie.width) &&
			((player.y + player.height) > zombie.y && player.y < (zombie.y + zombie.height)||
			player.y < (zombie.y + zombie.height) && (player.y + player.height) < zombie.height)) {
			return true;
		}
	}
}

let classZombieOne = new Zombie(115)
let classZombieTwo = new Zombie(200)
let classZombieThree = new Zombie(250)
let classZombieFour = new Zombie(300)


const zombieOne = {
	type: 'zombie',
	draw: drawzombieSprite,
	x: 115,
	y: 38,
	width: 4,
	height: 8,
	counted: false,
	collided: checkCollision,
};

const zombieTwo = {
	type: 'zombie',
	draw: drawzombieSprite,
	x: 200,
	y: 38,
	width: 4,
	height: 8,
	counted: false,
	collided: checkCollision,
};

const zombieThree = {
	type: 'zombie',
	draw: drawzombieSprite,
	x: 250,
	y: 38,
	width: 4,
	height: 8,
	counted: false,
	collided: checkCollision,
};

const zombieFour = {
	type: 'zombie',
	draw: drawzombieSprite,
	x: 300,
	y: 38,
	width: 4,
	height: 8,
	counted: false,
	collided: checkCollision,
};

let classZombies = [classZombieOne, classZombieTwo, classZombieThree, classZombieFour]
let zombies = [zombieOne, zombieTwo, zombieThree, zombieFour];

/************************************************************
				Game starting conditions
The zombie animation should be on 
the first cycle and the first frame of the first cycle.
The game's physics run at 60 fps and it has been been zero 
frames since a zombie was last replaced. 
When replaced the first zombie will be between position 
240+30 and 240+60.
*************************************************************/

let zombieFrameInCycle = 0;
let cycle = 0;
let lastReplace = 300;
let physicsFrames = 0
const gravityAccelY = 70.0;
let zombieSpeed = 0.35;
let zombieAcceleration = 0.1;
let lowEndSpacing = 40;
let highEndSpacing = 110;
let runGame = false;
let drawnOnce = false

/***********************************************
				draw function:
The draw is the function called every frame
It computes and displays every frame and resets
the game if the player collides with a zombie
***********************************************/

function draw(deltaTime, time) {
	drawnOnce = true
	context.clearRect(0, 0, 960, 540)
	drawBackground();
	if(player.velocityY !== 0) {
		gravity(deltaTime);
	}
	drawPlayerSprite(player);
	
	//physicsFrames counts how many 1/60ths of a second ago the zombie was replaced
	physicsFrames += deltaTime / (1000/60);
	classZombies.forEach(zombie => {
		//the physics run at 60 fps. The new zombie position will be the zombies 
		//old position - the zombies speed (the distance the zombie advances in
		//1/60th of a second) this is multiplied by how how many 1/60ths of a second
		//it has been since the last frame.
		zombie.x -= zombieSpeed * ((1000/60)/deltaTime);
		if (zombie.x < 96) {
			zombie.drawzombieSprite(zombie);

			if(zombie.checkCollision(player,zombie)) {
				endGame();
			}

			//if the zombie passes the player add one to the players score
			if (zombie.x < (5 - zombie.width) && zombie.type == 'zombie' && zombie.counted == false) {
				player.score++;
				updateScore();
				updateScoreOnServer()
				zombie.counted = true;
			}

			//once the zombie is off screen to the left replace the zombie 30 to 60 units
			//behind where the previous zombie was replaced. The zombies will over time get
			//placed further away from the player, but they will also move faster. This should
			//increase the difficulty as time goes on
			if (zombie.x < -4) {
				zombie.x = (lastReplace - physicsFrames * zombieSpeed) + randomIntFromInterval(lowEndSpacing, highEndSpacing);
				lastReplace = zombie.x;
				lowEndSpacing += 5 + zombieAcceleration;
				highEndSpacing += 5 + zombieAcceleration;
				physicsFrames = 0;
				zombie.counted = false;
				zombieSpeed += 0.07;
				zombieAcceleration += 0.13
			}
		}	
	});
}

/***********************************************************
  Functions to draw the player, background, and characters
***********************************************************/


function drawPlayer() {
	context.fillStyle = '#98C1D9';
	context.fillRect(player.x, player.y, player.width, player.height);
}

//The background consists of four images. 3 are 2x the width of the canvas. 
//these 3 images move to the left and loops, creating the illustion they are
//infinite. 
function drawBackground() {
	//IMAGE ONE
	context.drawImage(backgroundOne,
				  0, 0, canvas.width, canvas.height,
				  0, 0, canvas.width/10, canvas.height/10);

	//IMAGE TWO
	context.drawImage(backgroundTwo,
					  0, 0, canvas.width, canvas.height,
					  backgroundTwoX/10, 0, canvas.width/10, canvas.height/10);
	context.drawImage(backgroundTwo,
				 	  0, 0, canvas.width, canvas.height,
				 	  backgroundTwoX/10 + canvas.width/10, 0, canvas.width/10, canvas.height/10);
	backgroundTwoX -= 0.5;
	if (-backgroundTwoX == canvas.width) {
		backgroundTwoX = 0;
	}
	
	//IMAGE THREE
	context.drawImage(backgroundThree,
					  0, 0, canvas.width, canvas.height,
					  backgroundThreeX/10, 0, canvas.width/10, canvas.height/10);
	context.drawImage(backgroundThree,
				 	  0, 0, canvas.width, canvas.height,
				 	  backgroundThreeX/10 + canvas.width/10, 0, canvas.width/10, canvas.height/10);
	backgroundThreeX -= 1;
	if (-backgroundThreeX == canvas.width) {
		backgroundThreeX = 0;
	}

		//IMAGE FIVE
	context.drawImage(backgroundFive,
					  0, 0, canvas.width, canvas.height,
					  backgroundFiveX/10, 0, canvas.width/10, canvas.height/10);
	context.drawImage(backgroundFive,
				 	  0, 0, canvas.width, canvas.height,
				 	  backgroundFiveX/10 + canvas.width/10, 0, canvas.width/10, canvas.height/10);
	backgroundFiveX -= 2;
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
	zombieFrameInCycle++
	if (zombieFrameInCycle == 8) {
		cycle = (cycle + 1) % 2
		zombieFrameInCycle = 0;
	}
}

function drawzombieSprite(zombie) {
	context.drawImage(zombieImg,
					  //source rectangle
					  cycle * zombieSpriteW, 0, zombieSpriteW, zombieSpriteH,
					  //destination rectange. -1 to compensate for blank left of sprite
					  zombie.x-2, zombie.y-1, zombieSpriteW/10, zombieSpriteH/10);
}

function drawzombie(zombie) {
	context.fillStyle = '#EE6C4D';
	context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
}

function drawText(xOffset) {
	contextInstruct.clearRect(0,0,960,540)
	contextInstruct.font = "32px Arial";
	contextInstruct.fillStyle = "#293241";
	contextInstruct.fillText(instructText, xOffset, 100);
}



/****************************************************
Functions to handle collision, placement, and jumping
****************************************************/

//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1) + min);
}

//modified version of: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
//Not currently being used. Might be a better way to randomize the placement of zombies
/*
function randomizeLastThree(array) {
	for(let i = 5; i > 3; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
*/

//check the for a collision between zombie and player. If they intersect return true
function checkCollision(player, zombie) {
	if(((player.x + player.width) > zombie.x && player.x < (zombie.x + zombie.width)||
		player.x < (zombie.x + zombie.width) && (player.x + player.width) < zombie.width) &&
		((player.y + player.height) > zombie.y && player.y < (zombie.y + zombie.height)||
		player.y < (zombie.y + zombie.height) && (player.y + player.height) < zombie.height)) {
		return true;
	}
}

//https://stackoverflow.com/questions/9960959/jumping-in-a-game
//function for gravity. If player is in the air accelerate in +Y (downward) direction.
//if player is on the ground keep the velocity 0.
function gravity(deltaTime) {
	let timeInSec = deltaTime/1000
	player.velocityY += gravityAccelY * timeInSec;
	player.y += player.velocityY * timeInSec;
	if (player.y > 36.7) {
    	player.y = 36.7; // assuming the ground is at height 36.7
    	player.velocityY = 0;
	}
}

//if the player hits the up arrow key give the player a -Y (upwards) velocity
document.addEventListener("keydown", e => {
	if (e.keyCode === 38 && player.velocityY === 0) {
		player.velocityY = -50
	}
});

function updateScore() {
	document.querySelector('.score').innerHTML = `Score: ${player.score}`
}

function endGame() {
	runGame = false;
	window.location.assign("http://localhost:3000/highScores")
}

/******************************
Menu/page display and operation
*******************************/

startButton.addEventListener("click", () => {
	runGame = true;
	startScreen.style.display = "none";
	requestAnimationFrame(main);
});

function updateScoreOnServer() {
	let xhttp = new XMLHttpRequest();
	//asynchronous, may need a callback...
	xhttp.open("PUT", "http://localhost:3000/api/player")
	xhttp.setRequestHeader("Content-Type", "application/json")
	xhttp.send(JSON.stringify({score: player.score}))
}

/******************************************************
				Main Animation Loop
	On loading the page the html displays the
	images and main menu. For the main animation loop:
	Fist, wait until all of the images are loaded.
	Once that is done check to see if the player has 
	hit the button to start or restart the game
*******************************************************/


//adapted from https://stackoverflow.com/questions/31299509/call-a-function-when-html5-canvas-is-ready
//because the images load asychronously, wait for  all the images to load before calling the 
//main animation frame for the first time

var images = [
            'assets/background5.png',
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
	requestAnimationFrame(main)
}

// Start to load all images
var i;
for(i = 0; i < imagesLoading; ++i) {
	loadImage(i);
}

//run this before the main animation loop in order to set the score to 0 when starting.
updateScore();

//resource for rAF and main loop: https://developer.mozilla.org/en-US/docs/Games/Anatomy
//main loop for the game. Keeps track of time and calls draw function to compute and 
//draw each frame once the player hits a button to start a game ("restart game" or "start game"). The
//main animation loop starts
let lastTime = 0;
function main(time) {
	if(runGame || !drawnOnce) {
		requestAnimationFrame(main);
		deltaTime = time - lastTime;
		lastTime = time;
		draw(deltaTime, time);
	}
}