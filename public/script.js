/***********************************************************
						OVERVIEW:
	The main loop of this game uses request animation frame.
	See the function "main" at the bottom.
	The physics run at 60 fps.
***********************************************************/

const canvas = document.querySelector('.game');
const context = canvas.getContext('2d',);

const movingBackgroundCanvas = document.querySelector('.background')
const movingBackgroundContext = movingBackgroundCanvas.getContext('2d',);

const staticBackgroundCanvas = document.querySelector('.static')
const staticBackgroundContext = staticBackgroundCanvas.getContext('2d', { alpha: false });

const startButton = document.querySelector('.start');
const startScreen = document.querySelector('.start-menu');


//background images

let backgroundFive = document.createElement("img");
backgroundFive.src = "assets/background5.png"
let backgroundFiveX = 0

let backgroundThree = document.createElement("img");
backgroundThree.src = "assets/background3.png"
let backgroundThreeX = 0

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
	x: 50,
	y: 367,
	width: 60,
	height: 90,
	velocityY: 0,
	score: 0
};

class Zombie {
	constructor(x) {
		this.type = 'zombie'
		this.x = x
		this.y = 380
		this.width = 40
		this.height = 80
		this.counted = false
	}
	drawZombieSprite(zombie) {
		context.clearRect(Math.round(zombie.x-5), Math.round(zombie.y-10), Math.round(zombieSpriteW), Math.round(zombieSpriteH));
		context.drawImage(
			zombieImg,
			//source rectangle
			Math.round(cycle * zombieSpriteW), 0, Math.round(zombieSpriteW), Math.round(zombieSpriteH),
			//destination rectange. -1 to compensate for blank left of sprite
			Math.round(zombie.x-20), Math.round(zombie.y-10), Math.round(zombieSpriteW), Math.round(zombieSpriteH));
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

/*
let classZombieOne = new Zombie(1150)
let classZombieTwo = new Zombie(2000)
let classZombieThree = new Zombie(2500)
let classZombieFour = new Zombie(3000)
*/


let classZombieOne = new Zombie(1000)
let classZombieTwo = new Zombie(1400)
let classZombieThree = new Zombie(1800)
let classZombieFour = new Zombie(2200)

let classZombies = [classZombieOne, classZombieTwo, classZombieThree, classZombieFour]

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
let lastReplace = 2200;
let physicsFrames = 0
const gravityAccelY = 800;
let zombieSpeedMedian = 3
let zombieSpeed = 3;
let lowEndSpacing = 2;
let highEndSpacing = 20;
let runGame = false;

/***********************************************
				draw function:
The draw is the function called every frame
It computes and displays every frame and resets
the game if the player collides with a zombie
***********************************************/

function draw(deltaTime, time) {
	deltaTime = Math.round(deltaTime);
	context.clearRect(0, 190, 960, 350)
	movingBackgroundContext.clearRect(0, 0, 960, 350)
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
		if (zombie.x < 960) {
			zombie.drawZombieSprite(zombie);

			if(zombie.checkCollision(player,zombie)) {
				endGame();
			}

			//if the zombie passes the player add one to the players score
			if (zombie.x < (50 - zombie.width) && zombie.type == 'zombie' && zombie.counted == false) {
				player.score++;
				updateScore();
				updateScoreOnServer()
				zombie.counted = true;
			}

			//once the zombie is off screen to the left replace the zombie 30 to 60 units
			//behind where the previous zombie was replaced. The zombies will over time get
			//placed further away from the player, but they will also move faster. This should
			//increase the difficulty as time goes on
			if (zombie.x < -40) {
				//Starting at 2200, 
				zombie.x = lastReplace + randomIntFromInterval(lowEndSpacing, highEndSpacing);
				lastReplace = zombie.x;
				physicsFrames = 0;
				zombie.counted = false;		
				zombieSpeed = randomIntFromInterval(zombieSpeedMedian, zombieSpeedMedian+2);
				console.log(zombieSpeed)
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

function drawStaticBackground() {
	staticBackgroundContext.drawImage(backgroundOne,
		0, 0, staticBackgroundCanvas.width, staticBackgroundCanvas.height,
		0, 0, staticBackgroundCanvas.width, staticBackgroundCanvas.height);
}

//The background consists of four images. 3 are 2x the width of the canvas. 
//these 3 images move to the left and loops, creating the illustion they are
//infinite. 
function drawBackground() {
	
	//IMAGE THREE
	movingBackgroundContext.drawImage(backgroundThree,
					  0, 0, movingBackgroundCanvas.width, movingBackgroundCanvas.height,
					  backgroundThreeX, 0, movingBackgroundCanvas.width, movingBackgroundCanvas.height);
	movingBackgroundContext.drawImage(backgroundThree,
				 	  0, 0, movingBackgroundCanvas.width, movingBackgroundCanvas.height,
				 	  backgroundThreeX + movingBackgroundCanvas.width, 0, movingBackgroundCanvas.width, movingBackgroundCanvas.height);
	backgroundThreeX -= 1;
	if (-backgroundThreeX == movingBackgroundCanvas.width) {
		backgroundThreeX = 0;
	}

		//IMAGE FIVE
	movingBackgroundContext.drawImage(backgroundFive,
					  0, 0, movingBackgroundCanvas.width, movingBackgroundCanvas.height,
					  backgroundFiveX, 0, movingBackgroundCanvas.width, movingBackgroundCanvas.height);
	movingBackgroundContext.drawImage(backgroundFive,
				 	  0, 0, movingBackgroundCanvas.width, movingBackgroundCanvas.height,
				 	  backgroundFiveX + movingBackgroundCanvas.width, 0, movingBackgroundCanvas.width, movingBackgroundCanvas.height);
	backgroundFiveX -= 2;
	if (-backgroundFiveX == movingBackgroundCanvas.width) {
		backgroundFiveX = 0;
	}
}

function drawPlayerSprite() {
	context.clearRect(Math.round(player.x), Math.round(player.y), Math.round(playerSpriteW), Math.round(playerSpriteH))
	context.drawImage(playerImg,
					  //source rectangle
					  Math.round(cycle * playerSpriteW), 0, Math.round(playerSpriteW), Math.round(playerSpriteH),
					  //destination rectange. -1 to compensate for blank left of sprite
					  Math.round(player.x), Math.round(player.y), Math.round(playerSpriteW), Math.round(playerSpriteH));
	zombieFrameInCycle++
	if (zombieFrameInCycle == 8) {
		cycle = (cycle + 1) % 2
		zombieFrameInCycle = 0;
	}
}

function drawzombie(zombie) {
	context.fillStyle = '#EE6C4D';
	context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
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

//https://stackoverflow.com/questions/9960959/jumping-in-a-game
//function for gravity. If player is in the air accelerate in +Y (downward) direction.
//if player is on the ground keep the velocity 0.
function gravity(deltaTime) {
	let timeInSec = deltaTime/1000
	player.velocityY += gravityAccelY * timeInSec;
	player.y += player.velocityY * timeInSec;
	if (player.y > 367) {
    	player.y = 367; // assuming the ground is at height 367
    	player.velocityY = 0;
	}
}

//if the player hits the up arrow key give the player a -Y (upwards) velocity
document.addEventListener("keydown", e => {
	if (e.keyCode === 38 && player.velocityY === 0) {
		player.velocityY = -600
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
	drawStaticBackground()
	drawBackground();
	drawPlayerSprite();
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
	if(runGame) {
		requestAnimationFrame(main);
		deltaTime = time - lastTime;
		lastTime = time;
		draw(deltaTime, time);
	}
}