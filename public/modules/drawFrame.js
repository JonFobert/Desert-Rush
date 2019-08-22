
function drawFrame(canvasesAndImages, gameState, player, currentWave) {
    canvasesAndImages.movingBackgroundContext.clearRect(0, 0, 960, 350)
    drawBackground(canvasesAndImages);
    determineAnimationCycle(gameState);
    if(gameState.enemyLeftFrame) {
        //clear Rect around the enemy that left the frame.
        canvasesAndImages.context.clearRect(-50, 400, 200, 200);
        gameState.enemyLeftFrame = false;
    }
	drawPlayerSprite(canvasesAndImages, player, gameState.animationCycle);
	currentWave.forEach((enemy, i) => {
		if (enemy.draw) {
			enemy.drawSprite(enemy)
		}
	})
}

function drawBackground(cAndI) {
	cAndI.movingBackgroundContext.drawImage(cAndI.backgroundThree,
					  0, 0, cAndI.movingBackgroundCanvas.width, cAndI.movingBackgroundCanvas.height,
					  cAndI.backgroundThreeX, 0, cAndI.movingBackgroundCanvas.width, cAndI.movingBackgroundCanvas.height);
	cAndI.movingBackgroundContext.drawImage(cAndI.backgroundThree,
				 	  0, 0, cAndI.movingBackgroundCanvas.width, cAndI.movingBackgroundCanvas.height,
				 	  cAndI.backgroundThreeX + cAndI.movingBackgroundCanvas.width, 0, cAndI.movingBackgroundCanvas.width, cAndI.movingBackgroundCanvas.height);
	cAndI.backgroundThreeX -= 1;
	if (-cAndI.backgroundThreeX == cAndI.movingBackgroundCanvas.width) {
		cAndI.backgroundThreeX = 0;
	}

    cAndI.movingBackgroundContext.drawImage(cAndI.backgroundFive,
					  0, 0, cAndI.movingBackgroundCanvas.width, cAndI.movingBackgroundCanvas.height,
					  cAndI.backgroundFiveX, 0, cAndI.movingBackgroundCanvas.width, cAndI.movingBackgroundCanvas.height);
	cAndI.movingBackgroundContext.drawImage(cAndI.backgroundFive,
				 	  0, 0, cAndI.movingBackgroundCanvas.width, cAndI.movingBackgroundCanvas.height,
				 	  cAndI.backgroundFiveX + cAndI.movingBackgroundCanvas.width, 0, cAndI.movingBackgroundCanvas.width, cAndI.movingBackgroundCanvas.height);
	cAndI.backgroundFiveX -= 3;
	if (-cAndI.backgroundFiveX == cAndI.movingBackgroundCanvas.width) {
		cAndI.backgroundFiveX = 0;
	}
}

function drawPlayerSprite(cAndI, player, animationCycle) {
	cAndI.context.clearRect(player.lastX-2, player.lastY-2, cAndI.playerSpriteW+4,cAndI.playerSpriteH+4)
	cAndI.context.drawImage(
		cAndI.playerImg,
		//source rectangle
		Math.round(animationCycle * cAndI.playerSpriteW), 0, Math.round(cAndI.playerSpriteW), Math.round(cAndI.playerSpriteH),
		//destination rectange. -1 to compensate for blank left of sprite
		Math.round(player.x), Math.round(player.y), Math.round(cAndI.playerSpriteW), Math.round(cAndI.playerSpriteH)
    );
	player.lastX = player.x;
    player.lastY = player.y;
	//zombieFrameInCycle++
	//if (zombieFrameInCycle == 8) {
	//	cycle = (cycle + 1) % 2
    //	zombieFrameInCycle = 0;
}

function determineAnimationCycle(gameState) {
    gameState.frameInAnimationCycle++;
    if(gameState.frameInAnimationCycle == 8) {
        gameState.animationCycle = (gameState.animationCycle + 1) % 2;
        gameState.frameInAnimationCycle = 0;
    }
}

export { drawFrame, drawBackground, drawPlayerSprite }