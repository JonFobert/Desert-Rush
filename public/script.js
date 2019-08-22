import calculateFrame from './modules/calculateFrame.js'
import {drawFrame, drawBackground, drawPlayerSprite} from './modules/drawFrame.js'

//canvses
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

let canvasesAndImages = {
	context: context,
	movingBackgroundCanvas: movingBackgroundCanvas,
	staticBackgroundCanvas: staticBackgroundCanvas,
	movingBackgroundContext: movingBackgroundContext,
	staticBackgroundContext: staticBackgroundContext,
	backgroundFive: backgroundFive,
	backgroundFiveX: backgroundFiveX,
	backgroundThree: backgroundThree,
	backgroundThreeX: backgroundThreeX,
	backgroundOne: backgroundOne,
	playerImg: playerImg,
	playerSpriteW: playerSpriteW,
	playerSpriteH: playerSpriteH,
	zombieImg: zombieImg,
	zombieSpriteW: zombieSpriteW,
	zombieSpriteH: zombieSpriteH,
	lavaImg: lavaImg,
	lavaSpriteW: lavaSpriteW,
	lavaSpriteH: lavaSpriteH
}


const gameProperties = {
	gravityAccelY: 680,
	zombieSpeedStart: 5
}

function getRandomTenDigit() {
	const array = new Uint32Array(1);
	window.crypto.getRandomValues(array);
	return array.toString();
}

const gameState = {
	runGame: false,
	uuid: getRandomTenDigit(),
	score: 0,
	frame: 0,
	enemyLeftFrame: false,
	zombiesStopped: false,
	waveOver: false,
	frameInAnimationCycle: 0,
    animationCycle: 0
};

const player = {
	x: 50,
	y: 367,
	lastX: 50,
	lastY: 367,
	width: 60,
	height: 90,
	velocityY: 0,
};

class Lava {
	constructor(resetPos) {
		this.type = 'lava';
		this.resetPos = resetPos
		this.x = resetPos;
		this.speed = 3;
		this.y = 452;
		this.lastX = resetPos;
		this.lastY = 452;
		this.width = 34;
		this.height = 88;
		this.counted = false;
		this.draw = false;
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
	constructor(resetPos) {
		this.type = 'zombie'
		this.resetPos = resetPos
		this.x = resetPos
		this.y = 380
		this.lastX = resetPos
		this.lastY = 380
		this.speed = 5
		this.lastSpeed = 3
		this.width = 40
		this.height = 80
		this.counted = false
		this.draw = false
	}
	drawSprite(zombie) {
		context.clearRect(zombie.lastX-2, zombie.y-12, zombieSpriteW+4, zombieSpriteH+16);
		context.drawImage(
			zombieImg,
			//source rectangle
			Math.round(gameState.animationCycle * zombieSpriteW), 0, Math.round(zombieSpriteW), Math.round(zombieSpriteH),
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

let currentWave = [classZombieOne, classZombieTwo, classLavaOne, classZombieThree, classZombieFour]
let completeWave = []
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

//Helper functions

function beginNewWave() {
	currentWave.forEach((enemy) => {
		enemy.x = enemy.resetPos;
		enemy.counted = false;
		if (enemy.type === 'zombie') {
			enemy.speed = randomIntFromInterval(gameProperties.zombieSpeedStart-1, gameProperties.zombieSpeedStart+2)
		}
	})
}

function playGame(deltaTime, time) {
	calculateFrame(deltaTime, gameState, gameProperties, player, currentWave, completeWave, nextWave)
	drawFrame(canvasesAndImages, gameState, player, currentWave)
	if(gameState.waveOver) {
		console.log('cleared!')
		currentWave = nextWave;
		nextWave = completeWave
		completeWave = []
		beginNewWave()
		gameState.waveOver = false
	}
}

function drawStaticBackground() {
	staticBackgroundContext.drawImage(backgroundOne,
		0, 0, staticBackgroundCanvas.width, staticBackgroundCanvas.height,
		0, 0, staticBackgroundCanvas.width, staticBackgroundCanvas.height);
}

//https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min,max) {
	return Math.floor(Math.random()*(max-min+1) + min);
}

/******************************
Event Listeners
*******************************/

document.addEventListener("keydown", e => {
	if (e.keyCode === 38 && player.velocityY === 0) {
		player.velocityY = -500
	}
});

startButton.addEventListener("click", () => {
	gameState.runGame = true;
	startScreen.style.display = "none";
	requestAnimationFrame(main);
});

function createNewDBScore() {
	let xhttp = new XMLHttpRequest();
	//asynchronous, may need a callback...
	xhttp.open("POST", `https://ancient-dawn-29299.herokuapp.com/api/player/${gameState.uuid}`)
	xhttp.setRequestHeader("Content-Type", "application/json")
	xhttp.send(JSON.stringify({score: gameState.score}))
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
	drawBackground(canvasesAndImages);
	drawPlayerSprite(canvasesAndImages, player, gameState.animationCycle);
	requestAnimationFrame(main)
}

// Start to load all images
var i;
for(i = 0; i < imagesLoading; ++i) {
	loadImage(i);
}

function initializeScore() {
	document.querySelector('.score').innerHTML = `Score: ${gameState.score}`
}

//run this before the main animation loop in order to set the score to 0 when starting.
initializeScore();
createNewDBScore();

//resource for rAF and main loop: https://developer.mozilla.org/en-US/docs/Games/Anatomy
//main loop for the game. Keeps track of time and calls draw function to compute and 
//draw each frame once the player hits a button to start a game ("restart game" or "start game"). The
//main animation loop starts
let lastTime = 0;
function main(time) {
	if(gameState.runGame) {
		requestAnimationFrame(main);
		let deltaTime = time - lastTime;
		lastTime = time;
		playGame(deltaTime, time);
	}
}


/******can be used for testing to draw the hitxboxes of objects******/
/*function drawzombie(zombie) {
	context.fillStyle = '#EE6C4D';
	context.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
}
function drawPlayer() {
	context.clearRect(player.x, player.y, player.width, player.height);
	context.fillStyle = '#98C1D9';
	context.fillRect(player.x, player.y, player.width, player.height);
}
function drawlava(lava) {
	context.fillStyle = '#EE6C4D';
	context.fillRect(lava.hitBoxX, lava.y, lava.width, lava.height);
}*/