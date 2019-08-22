function calculateFrame(deltaTime, gameState, gameProperties, player, currentWave, completeWave, nextWave) {
	if(player.velocityY !== 0) {
		gravity(deltaTime, player, gameProperties.gravityAccelY);
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
				stopAllZombiesBeforeLava(enemy.x, currentWave)
				gameState.zombiesStopped = true
			}
			if(enemy.checkCollision(player,enemy)) {
				endGame(gameState);
			}
		}
		//50********
		if (enemy.x < (50 - enemy.width) && enemy.counted == false) {
			gameState.score++;
			updateScore(gameState.score);
			updateScoreOnServer(gameState.score, gameState.uuid)
			enemy.counted = true;
		}
		//60*********
		if (enemy.x < -60) {
			gameState.enemyLeftFrame = true;
			completeWave.push(enemy);
			currentWave.splice(i, 1)

			if (enemy.type === 'lava') {
				resumeAllZombies(currentWave)
				gameState.zombiesStopped = false
			}
			if (currentWave.length === 0) {
				gameState.waveOver = true
			}
		}	
	})
}

function stopAllZombiesBeforeLava(lavaX, currentWave) {
	currentWave.forEach((enemy) => {
		if (enemy.type==='zombie' && enemy.x > lavaX) {
			enemy.lastSpeed = enemy.speed;
			enemy.speed = 3
		}
	})
}

function resumeAllZombies(currentWave) {
	currentWave.forEach((enemy)=> {
		if (enemy.type==='zombie') {
			enemy.speed = enemy.lastSpeed;
		}
	})
}

function preventZombieOvertake(enemies) {
	let zombies = enemies.filter(enemy => enemy.type === 'zombie')
	if (zombies.length > 1) {
		for(let i = 0; i < zombies.length-1; i++) {
			if ( Math.abs(zombies[i].x - zombies[i+1].x) <= 400)
			{
				zombies[i].speed = 6;
				zombies[i+1].speed = 5;
			}
		}
		if (Math.abs(zombies[zombies.length-1].x - zombies[0].x) <= 400) {
			zombies[zombies.length-1].speed = 6;
			zombies[0].speed = 5;
		}
	}
}

function gravity(deltaTime, object, gravityAccelY) {
	let timeInSec = deltaTime/1000
	object.velocityY += gravityAccelY * timeInSec;
	object.y += object.velocityY * timeInSec;
	if (object.y > 367) {
    	object.y = 367; // assuming the ground is at height 367
    	object.velocityY = 0;
	}
}

//if the player hits the up arrow key give the player a -Y (upwards) velocity

function updateScore(score) {
	document.querySelector('.score').innerHTML = `Score: ${score}`
}

function endGame(gameState) { 
	//instead of reassigning post to api/highscores/:id then redirect in express.
	gameState.runGame = false;
	window.location.assign(`https://ancient-dawn-29299.herokuapp.com/highScores/${gameState.uuid}`)
}

function updateScoreOnServer(score, uuid) {
	let xhttp = new XMLHttpRequest();
	//asynchronous, may need a callback...
	xhttp.open("PUT", `https://ancient-dawn-29299.herokuapp.com/api/player/${uuid}`)
	xhttp.setRequestHeader("Content-Type", "application/json")
	xhttp.send(JSON.stringify({score: score}))
}

export default calculateFrame