Volcano Rush
=================

This is a side scrolling game. The objective is to jump over the zombies and lava as the appear from the right side of the screen. 1 Point is awarded for every one of these obstacles that you jump over. If the player collides with a zombie or with lava the game is over.

## Rules

 - When you are approaching lava, zombies will pause and wait for you to jump over the lava
 - Zombies will space themselves out automatically. If one zombie gets too close the zombie in front will start moving faster than the zombie behind

## Optimizations
- Broke the game into three canvases:
    - One for the static background
    - One for the dynamic background
    - One for the game sprite
- Used clearRect only on necessary areas:
    - the bottom ~1/2 of the game for the dynamic background
    - around the game sprites for the sprites 
- Moved all calculations and rendering to integers instead of floats
    - This is mostly to avoid subpixel rendering when drawing an image
- removing a canvas that rendered text (rendering text is bad for performance)
- turned off transparency in the static canvas

Acknowledgments
---------------
Character art from Kenney.nl
Background art from OpenGameArt.org
Favicon from https://www.iconfinder.com/josyanimator