function calculateFrame(deltaTime, gameState, player, currentWave, completeWave, nextWave) {
	if(player.velocityY !== 0) {
		gravity(deltaTime);
	}

	if (!gameState.zombiesStopped) {
		preventZombieOvertake(currentWave)
	}

	currentWave.forEach((enemy, i) => {
		if (enemy.type === 'zombie') {
			enemy.x -= enemy.speed * ((1000/60)/deltaTime);
		} else {
			enemy.x -= enemy.speed * ((1000/60)/deltaTime)
		}
		//960*********
		if (enemy.x < 960) {
			enemy.draw = true
			if (enemy.type === 'lava' && (!gameState.zombiesStopped)) {
				stopAllZombiesBeforeLava(enemy.x)
				gameState.zombiesStopped = true
			}
			if(enemy.checkCollision(player,enemy)) {
				endGame();
			}
		}
		//50********
		if (enemy.x < (50 - enemy.width) && enemy.counted == false) {
			gameState.score++;
			updateScore();
			updateScoreOnServer()
			enemy.counted = true;
		}
		//60*********
		if (enemy.x < -60) {
			//context.clearRect(enemy.lastX-2, enemy.y-12, 100, 100);
			completeWave.push(enemy);
			currentWave.splice(i, 1)

			if (enemy.type === 'lava') {
				resumeAllZombies()
				gameState.zombiesStopped = false
			}
			if (currentWave.length === 0) {
				console.log('next Wave!')
				console.log(`current wave: ${currentWave}`)
				console.log(`complete wave: ${completeWave}`)
				console.log(`next wave: ${nextWave}`)
				gameState.waveOver = true
				/*currentWave = nextWave;
				nextWave = completeWave
				completeWave = []
				console.log(`CurrentWave to calculate function: ${currentWave}`)
				console.log(`currentWave to beginNewWave(): ${currentWave}`)
				beginNewWave()*/
			}
		}	
	})
}

function stopAllZombiesBeforeLava(lavaX) {
	currentWave.forEach((enemy) => {
		if (enemy.type==='zombie' && enemy.x > lavaX) {
			enemy.lastSpeed = enemy.speed;
			enemy.speed = 3
			console.log('stopped zombies')
		}
	})
}

function resumeAllZombies() {
	currentWave.forEach((enemy)=> {
		if (enemy.type==='zombie') {
			enemy.speed = enemy.lastSpeed;
			console.log(enemy.lastSpeed)
		}
	})
}

function preventZombieOvertake(enemies) {
	let zombies = enemies.filter(enemy => enemy.type === 'zombie')
	if (zombies.length > 1) {
		for(let i = 0; i < zombies.length-1; i++) {
			if ( Math.abs(zombies[i].x - zombies[i+1].x) <= 400)
			{
				zombies[i].speed = 5;
				zombies[i+1].speed = 6;
				console.log('adjusted zombie')
			}
		}
		if (Math.abs(zombies[zombies.length-1].x - zombies[0].x) <= 400) {
			zombies[zombies.length-1].speed = 5;
			zombies[0].speed = 6;
			console.log('adjusted zombie')
		}
	}
}

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
		player.velocityY = -500
	}
});

function updateScore() {
	document.querySelector('.score').innerHTML = `Score: ${gameState.score}`
}

function endGame() {
	//instead of reassigning post to api/highscores/:id then redirect in express.
	runGame = false;
	window.location.assign(`http://localhost:3000/highScores/${gameState.uuid}`)
}

function updateScoreOnServer() {
	let xhttp = new XMLHttpRequest();
	//asynchronous, may need a callback...
	xhttp.open("PUT", `http://localhost:3000/api/player/${gameState.uuid}`)
	xhttp.setRequestHeader("Content-Type", "application/json")
	xhttp.send(JSON.stringify({score: gameState.score}))
}


export default calculateFrame