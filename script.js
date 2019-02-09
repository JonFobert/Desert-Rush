//Write the README



const canvas = document.querySelector('.game');
const context = canvas.getContext('2d');
const canvasInstruct = document.querySelector('.instructions');
const contextInstruct = canvasInstruct.getContext('2d');
context.scale(10, 10);
const startButton = document.querySelector('.start');
const startScreen = document.querySelector('.start-menu');
const gameOverScreen = document.querySelector('.game-over');
const restartButton = document.querySelector('.restart');
const leaderboardButton = document.querySelector('.leaderboardbtn')
const leaderboardScreen = document.querySelector('.leaderboardScreen')
const returnToMenuButton = document.querySelector('.returnToMenu')
//Colors: https://coolors.co/3d5a80-98c1d9-e0fbfc-ee6c4d-293241

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
	y: 38,
	width: 4,
	height: 8,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
		actorSpeed = 0.3;
	}
};


const baddieTwo = {
	type: 'baddie',
	draw: drawBaddieSprite,
	drawTwo: drawBaddie,
	x: 160,
	y: 38,
	width: 4,
	height: 8,
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
	y: 38,
	width: 4,
	height: 8,
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
	y: 38,
	width: 4,
	height: 8,
	counted: false,
	collided: checkCollision,
	collideAction: function () {
		player.score = 0;
		actorSpeed = 0.3;
	}
};

let actors = [baddieOne, baddieTwo, baddieThree, baddieFour];


/************************************************************
				Game starting conditions
The intro is not complete. The actor animation should be on 
the first cycle and the first frame of the first cycle.
The game's physics run at 60 fps and it has been been zero 
frames since a baddie was last replaced. 
When replaced the first baddie will be between position 
240+30 and 240+60.
*************************************************************/
let introComplete = false;
let actorFrameInCycle = 0
let cycle = 0
let lastReplace = 240;
let physicsFrames = 0
const gravityAccelY = 70.0;
let actorSpeed = 0.3
let lowEndSpacing = 30
let highEndSpacing = 60
let StartButtonPressed = false;
let runGame = true;
let leaderboardArr = [['JOE', 4], ['RIO', 3], ['SAM', 2], ['ALY', 1], ['RGE', 0]];
leaderboardSort(leaderboardArr).reverse();


//the draw function. This function draws the graphics on screen
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
	//physics Frames counts how many 1/60ths of a second ago the baddie was replaced
	physicsFrames += deltaTime / (1000/60);
	actors.forEach(actor => {
		//the physics run at 60 fps. The new actor position will be the actors 
		//old position - the actors speed (the distance the actor advances in
		//1/60th of a second) this is multiplied by how how many 1/60ths of a second
		//it has been since the last frame.
		actor.x -= actorSpeed * ((1000/60)/deltaTime);
		if (actor.x < 96) {
			actor.draw(actor);
			console.log(actor.x)

			if(actor.collided(player,actor)) {
				resetGame();
			}

			//if the baddie passes the player add one to the players score
			if (actor.x < (5 - actor.width) && actor.type == 'baddie' && actor.counted == false) {
				player.score++;
				updateScore();
				actor.counted = true;
			}

			//once the baddie is off screen to the left replace the baddie 30 to 60 units
			//behind where the previous baddie was replaced. The baddies will over time get
			//placed further away from the player, but they will also move faster. This should
			//increase the difficulty as time goes on
			if (actor.x < -4) {
				actor.x = (lastReplace - physicsFrames * actorSpeed) + randomIntFromInterval(lowEndSpacing, highEndSpacing);
				lastReplace = actor.x
				lowEndSpacing += 3
				highEndSpacing += 3
				physicsFrames = 0;
				console.log(actor.x)
				actor.counted = false;
				actorSpeed += 0.03;
			}
		}	
	});
}
const introBaddie = {
	x: 100,
	y: 38,
	width: 4,
	height: 8,
	counted: false
};


/**********************************************
			Intro
Intro is one Baddie and the instructions on how
to play the game
**********************************************/
function introOnRails() {
	instructText = "";
	introBaddie.x -= actorSpeed * ((1000/60)/deltaTime);
	//introPad.x -= actorSpeed
	drawBaddieSprite(introBaddie);
	if(checkCollision(player,introBaddie)) {
		resetGame();
	}

	if (introBaddie.x < -36) {
		instructText = "";
		drawText(0)
		introBaddie.counted = false;
		actorSpeed += 0.02
		return introComplete = true;
	}

	else if (introBaddie.x < -4) {
		instructText = "";
		drawText(60);
	}

	else if (introBaddie.x < (5 - introBaddie.width) && introBaddie.counted === false) {
		player.score++;
		updateScore()
		introBaddie.counted = true;
	}
	else if (introBaddie.x < 50) {
		instructText = "Jump to avoid zombies";
		drawText(320);
	}	

	else if (introBaddie.x < 95) {
		instructText = "UP arrow key to jump"
		drawText(330);
	}
	else {
		if (!StartButtonPressed) {
			runGame = false
		}
	}
};





/********************************************
  DRAWING THE CHARACTER, BADDIES AND PLAYER 
********************************************/


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
	actorFrameInCycle++
	if (actorFrameInCycle == 8) {
		cycle = (cycle + 1) % 2
		actorFrameInCycle = 0
	}
}


function drawBaddieSprite(baddie) {
	context.drawImage(baddieImg,
					  //source rectangle
					  cycle * baddieSpriteW, 0, baddieSpriteW, baddieSpriteH,
					  //destination rectange. -1 to compensate for blank left of sprite
					  baddie.x-2, baddie.y-1, baddieSpriteW/10, baddieSpriteH/10);
}

function drawBaddie(baddie) {
	context.fillStyle = '#EE6C4D';
	context.fillRect(baddie.x, baddie.y, baddie.width, baddie.height);
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
//Not currently being used. Might be a better way to randomize the placement of Baddies
function randomizeLastThree(array) {
	for(let i = 5; i > 3; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

//check the for a collision between baddie and player. If they intersect return true
function checkCollision(player, baddie) {
	if(((player.x + player.width) > baddie.x && player.x < (baddie.x + baddie.width)||
		player.x < (baddie.x + baddie.width) && (player.x + player.width) < baddie.width) &&
		((player.y + player.height) > baddie.y && player.y < (baddie.y + baddie.height)||
		player.y < (baddie.y + baddie.height) && (player.y + player.height) < baddie.height)) {
		return true;
	}
}

//check the for a collision between pad and player. If they intersect return true
function checkCollisionPad(player, pad) {
	if(((player.x + player.width) > pad.x && player.x < (pad.x + pad.width)||
		player.x < (pad.x + pad.width) && (player.x + player.width) < pad.width) &&
		((player.y + player.height) - pad.y < 0.5 && (player.y + player.height) - pad.y > -0.5) 
		&& player.velocityY > 0) {
		return true
	}
}
//https://stackoverflow.com/questions/9960959/jumping-in-a-game
//function for gravity. If player is in the air accelerate in +Y (downward) direction.
//if player is on the ground keep the velocity 0.
function jump(deltaTime) {
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

//resource for rAF and main loop: https://developer.mozilla.org/en-US/docs/Games/Anatomy
//main loop for the code. Keeps track of time and calls draw function to draw each frame
let lastTime = 0;
function main(time) {
	if(runGame) {
		requestAnimationFrame(main);
		deltaTime = time - lastTime;
		lastTime = time;
		draw(deltaTime, time);
		console.log(deltaTime)
	}
}

function updateScore() {
	document.querySelector('.score').innerHTML = `Score: ${player.score}`
}

function displayFinalScore() {
	document.querySelector('#gameOverScore').innerHTML = `Final Score: ${player.score}`
}

function resetGame() {
	StartButtonPressed = false;
	runGame = false;
	createLeaderboard();
	displayFinalScore();
	baddieOne.x = 115;
	baddieTwo.x = 160;
	baddieThree.x = 200;
	baddieFour.x = 240;
	introBaddie.x = 100;
	introComplete = false;
	gameOverScreen.style.display = "block";
	nextActorFrame = 0;
	cycle = 0;
	lastReplace = 240;
	physicsFrames = 0;
}

startButton.addEventListener("click", () => {
	StartButtonPressed = true;
	runGame = true;
	startScreen.style.display = "none";
	requestAnimationFrame(main);
});

leaderboardButton.addEventListener("click", () => {
	startScreen.style.display = "none";
	leaderboardScreen.style.display = "block"
	displayLeaderboard();
});

returnToMenuButton.addEventListener("click", () => {
	startScreen.style.display = "block";
	leaderboardScreen.style.display = "none"
});

restartButton.addEventListener("click", () => {
	player.score = 0;
	updateScore();
	StartButtonPressed = true;
	runGame = true;
	gameOverScreen.style.display = "none";
	requestAnimationFrame(main); 
	actorSpeed = 0.3;
});

function leaderboardSort(boardArray) {
	boardArray = boardArray.sort( (a, b) => {
		return a[1] - b[1];
	})
	return boardArray
}


function createLeaderboard() {
	if (player.score > leaderboardArr[4][1]) {
		displayNameEntry()
	}
	displayLeaderboard()
}

function displayNameEntry() {
	document.querySelector('.nameEntry').innerHTML = 
	`HIGH SCORE! <br>
	 NAME: <input type="text" placeholder= "_ _ _" id="nameField" autocomplete="off" maxlength="3">
		`
}

document.querySelector('.nameEntry').addEventListener("submit", e => {
	e.preventDefault();
	leaderboardArr.pop()
	leaderboardArr.push([nameField.value.toUpperCase(), player.score]);
	leaderboardSort(leaderboardArr).reverse()
	displayLeaderboard()
	e.target.style.display= "none"
	document.querySelector('.nameEntryBuffer').style.display = "block";
});



function displayLeaderboard() {
	document.querySelector('.leaderboardDirect').innerHTML = `
		HIGH SCORES
		<br>
		<table class = 'gameOverTable'>
			<tr>
				<th id="firstColumn">RANK</th>
				<th>NAME</th>
				<th>SCORE</th>
			<tr>
				<td>1ST</td>
				<td>${leaderboardArr[0][0]}</td>
				<td>${leaderboardArr[0][1]}</td>
			</tr>
			<tr>
				<td>2ND</td>
				<td>${leaderboardArr[1][0]}</td>
				<td>${leaderboardArr[1][1]}</td>
			</tr>
			<tr>
				<td>3RD</td>
				<td>${leaderboardArr[2][0]}</td>
				<td>${leaderboardArr[2][1]}</td>
			</tr>
			<tr>
				<td>4TH</td>
				<td>${leaderboardArr[3][0]}</td>
				<td>${leaderboardArr[3][1]}</td>
			</tr>
			<tr>
				<td>5TH</td>
				<td>${leaderboardArr[4][0]}</td>
				<td>${leaderboardArr[4][1]}</td>
			</tr>
		</table>`
	document.querySelector('.leaderboardEndGame').innerHTML = document.querySelector('.leaderboardDirect').innerHTML
}

updateScore();

//adapted from https://stackoverflow.com/questions/31299509/call-a-function-when-html5-canvas-is-ready
//because the images load asychronously, wait for 
//all the images to load before calling the first 
//frame which will be the background of the start menu
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


