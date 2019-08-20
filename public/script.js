//TO DO: I think that one problem left is that zombies who are not stopped by the lava will
// Reset then run into the zombies stopped in front of them...


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

let lavaImg = document.createElement("img");
lavaImg.src = "assets/lavabig.png";
let lavaSpriteW = 88, lavaSpriteH = 88;

//Objects for the player and zombies (the enemies the player jumps over)

const player = {
	x: 50,
	y: 367,
	lastX: 50,
	lastY: 367,
	width: 60,
	height: 90,
	velocityY: 0,
	score: 0
};

class Lava {
	constructor(x) {
		this.type = 'lava';
		this.x = x;
		this.speed = 3;
		this.y = 452;
		this.lastX = x;
		this.lastY = 452;
		this.width = 34;
		this.height = 88;
		this.counted = false;
	}

	get hitBoxX() {
		return this.x + 25;
	} 

	drawSprite(lava) {
		context.clearRect(lava.lastX-2, lava.y-2, lavaSpriteW+4, lavaSpriteH+4);
		context.drawImage(
			lavaImg,
			//source rectangle
			0, 0, Math.round(lavaSpriteW), Math.round(lavaSpriteH),
			//destination rectange. -1 to compensate for blank left of sprite
			Math.round(lava.x), Math.round(lava.y), Math.round(lavaSpriteW), Math.round(lavaSpriteH)
		);
		lava.lastX = lava.x
	}

	checkCollision(player, lava) {
		if(((player.x + player.width) > lava.hitBoxX && player.x < (lava.hitBoxX + lava.width)||
			player.x < (lava.hitBoxX + lava.width) && (player.x + player.width) < lava.width) &&
			((player.y + player.height) > lava.y && player.y < (lava.y + lava.height)||
			player.y < (lava.y + lava.height) && (player.y + player.height) < lava.height)) {
			return true;
		}
	}
}

class Zombie {
	constructor(x) {
		this.type = 'zombie'
		this.x = x
		this.y = 380
		this.lastX = x
		this.lastY = 380
		this.speed = 5
		this.lastSpeed = 3
		this.width = 40
		this.height = 80
		this.counted = false
	}
	drawSprite(zombie) {
		context.clearRect(zombie.lastX-2, zombie.y-12, zombieSpriteW+4, zombieSpriteH+16);
		context.drawImage(
			zombieImg,
			//source rectangle
			Math.round(cycle * zombieSpriteW), 0, Math.round(zombieSpriteW), Math.round(zombieSpriteH),
			//destination rectange. -1 to compensate for blank left of sprite
			Math.round(zombie.x-20), Math.round(zombie.y-10), Math.round(zombieSpriteW), Math.round(zombieSpriteH)
		);
		zombie.lastX = zombie.x
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


let classZombieOne = new Zombie(1000)
let classZombieTwo = new Zombie(1600)
let classLavaOne = new Lava(2200)
let classZombieThree = new Zombie(2800)
let classZombieFour = new Zombie(3400)

let classZombieFive = new Zombie(1000)
let classZombieSix = new Zombie(1600)
let classLavaTwo = new Lava(2200)
let classZombieSeven = new Zombie(2800)
let classZombieEight = new Zombie(3400)

let enemies = [classZombieOne, classZombieTwo, classLavaOne, classZombieThree, classZombieFour]
let complete = []
let nextWave = [classZombieFive, classLavaTwo, classZombieSix, classZombieSeven, classZombieEight]

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
let lastReplacedZombiePos = 3400;
let physicsFrames = 0
const gravityAccelY = 800;
let zombieSpeedStart = 5
let lowEndSpacing = 0;
let highEndSpacing = 0;
let runGame = false;
let lastReplacedZombieSpeed = 5;
let timeSinceLastZombieReplace = 0
let zombiesStopped = false
/***********************************************
				draw function:
The draw is the function called every frame
It computes and displays every frame and resets
the game if the player collides with a zombie
***********************************************/

function draw(deltaTime, time) {
	//context.clearRect(0, 190, 960, 350)
	movingBackgroundContext.clearRect(0, 0, 960, 350)
	drawBackground();
	if(player.velocityY !== 0) {
		gravity(deltaTime);
	}
	drawPlayerSprite(player);
	
	function preventZombieOvertake(enemies) {
		for(let i = 0; i < enemies.length-1; i++) {
			if (( Math.abs(enemies[i].x - enemies[i+1].x) <= 400) && 
				  enemies[i].type === 'zombie' &&
				  enemies[i+1].type ==='zombie') 
			{
				enemies[i].speed = 5;
				enemies[i+1].speed = 3;
				console.log('adjusted zombie')
			}
		}
		if( (Math.abs(enemies[enemies.length-1].x - enemies[0].x) <= 400) &&
			enemies[enemies.length-1].type === 'zombie' &&
			enemies[0].type ==='zombie')
		{
			enemies[enemies.length-1].speed = 5;
			enemies[0].speed = 3;
			console.log('adjusted zombie')
		}
	}

	function stopAllZombiesBeforeLava(lavaX) {
		enemies.forEach((enemy) => {
			if (enemy.type==='zombie' && enemy.x > lavaX) {
				enemy.lastSpeed = enemy.speed;
				enemy.speed = 3
				console.log('stopped zombies')
			}
		})
	}

	function resumeAllZombies() {
		enemies.forEach((enemy)=> {
			if (enemy.type==='zombie') {
				enemy.speed = enemy.lastSpeed;
				console.log(enemy.lastSpeed)
			}
		})
	}

	if (!zombiesStopped) {
		preventZombieOvertake(enemies)
	}

	//physicsFrames counts how many 1/60ths of a second ago the zombie was replaced
	timeSinceLastZombieReplace += ((1000/60)/deltaTime)
	physicsFrames += deltaTime / (1000/60);
	enemies.forEach((enemy, i) => {

		//the physics run at 60 fps. The new zombie position will be the zombies 
		//old position - the zombies speed (the distance the zombie advances in
		//1/60th of a second) this is multiplied by how how many 1/60ths of a second
		//it has been since the last frame.
		if (enemy.type === 'zombie') {
			enemy.x -= enemy.speed * ((1000/60)/deltaTime);
		} else {
			enemy.x -= enemy.speed * ((1000/60)/deltaTime)
		}
		if (enemy.x < 960) {
			enemy.drawSprite(enemy);
			if (enemy.type === 'lava' && (!zombiesStopped)) {
				stopAllZombiesBeforeLava(enemy.x)
				zombiesStopped = true
			}

			if(enemy.checkCollision(player,enemy)) {
				endGame();
			}

			//if the enemy passes the player add one to the players score
			if (enemy.x < (50 - enemy.width) && enemy.counted == false) {
				player.score++;
				updateScore();
				updateScoreOnServer()
				enemy.counted = true;
			}

			//once the enemy is off screen to the left replace the enemy 30 to 60 units
			//behind where the previous enemy was replaced. The enemys will over time get
			//placed further away from the player, but they will also move faster. This should
			//increase the difficulty as time goes on
			if (enemy.x < -60) {
				lastReplacedZombiePos = lastReplacedZombiePos //- lastReplacedZombieSpeed * timeSinceLastZombieReplace
				enemy.x = Math.round(lastReplacedZombiePos + randomIntFromInterval(lowEndSpacing, highEndSpacing));
				context.clearRect(enemy.lastX-2, enemy.y-12, 100, 100);
				lastReplacedZombiePos = enemy.x;
				lastReplacedZombieSpeed = enemy.speed
				physicsFrames = 0;
				enemy.counted = false;
				console.log(`replaced position: ${enemy.x}`)
				if (enemy.type === 'zombie') {
					enemy.speed = randomIntFromInterval(zombieSpeedStart-1, zombieSpeedStart+2);
					if(zombiesStopped) {
						stopAllZombiesBeforeLava(enemy.x)
					}
				} else {
					resumeAllZombies()
					zombiesStopped = false
				}
			}
		}	
	});
}

/***********************************************************
  Functions to draw the player, background, and characters
***********************************************************/


function drawPlayer() {
	context.clearRect(player.x, player.y, player.width, player.height);
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
	backgroundFiveX -= 3;
	if (-backgroundFiveX == movingBackgroundCanvas.width) {
		backgroundFiveX = 0;
	}
}

function drawPlayerSprite() {
	context.clearRect(player.lastX-2, player.lastY-2, playerSpriteW+4,playerSpriteH+4)
	context.drawImage(
		playerImg,
		//source rectangle
		Math.round(cycle * playerSpriteW), 0, Math.round(playerSpriteW), Math.round(playerSpriteH),
		//destination rectange. -1 to compensate for blank left of sprite
		Math.round(player.x), Math.round(player.y), Math.round(playerSpriteW), Math.round(playerSpriteH)
	);
	player.lastX = player.x;
	player.lastY = player.y;	
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

function drawlava(lava) {
	context.fillStyle = '#EE6C4D';
	context.fillRect(lava.hitBoxX, lava.y, lava.width, lava.height);
}

/****************************************************
Functions to handle collision, placement, and jumping
****************************************************/

//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1) + min);
}

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