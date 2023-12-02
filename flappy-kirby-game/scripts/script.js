const gameName = document.getElementById('flappy-kirby')
const startGame = document.getElementById('start')
const gameOver = document.getElementById('end')

const playAgain = document.getElementById('play-again')
const yesBtn = document.getElementById('yes')
const noBtn = document.getElementById('no')

const birdElement = document.getElementById('bird')
const birdRect = birdElement.getBoundingClientRect()
const windowHeight = window.innerHeight

let birdX = 300
let birdY = 200
let birdSpeedX = 0
let birdSpeedY = 0
let birdGravity = 0
let birdGravitySpeed = 0
let isFlying = false // Flag to track if the bird is flying

let pipeX = 0
let topPipeX = 0
let topPipeY = 0
let botPipeX = 0
let botPipeY = 0
let pipeSpeedX = 2
let pipeSpeedY = 0
let pipeGravity = 0.05
let pipeGravitySpeed = 0
let pipes

let interval = null
let collisionFlag = false; // Flag to track if there is a collision
let floorFlag = false; // Flag to track if bird has hit the bottom of the screen

function addNewPipes() {
  generatePipe()
}

// Start game upon keydown and bird starts falling 
document.addEventListener('keydown', function () {
  startGame.style.display = 'none'
  score.style.display = 'block'
  gameName.style.display = 'none'
  birdGravity = 0.05

  if (!isFlying) {
    // Start the game and initiate the interval only once
    // adds pipes every 2.5secs
    interval = setInterval(addNewPipes, 2500)
    isFlying = true
  }
})

// Makes bird fall by default
function startFall() {
  birdGravitySpeed += birdGravity
  // birdGravitySpeed = birdGravitySpeed + birdGravity;

  birdX += birdSpeedX
  birdY += birdSpeedY + birdGravitySpeed

  // Updates position of the bird element
  birdElement.style.transform = `translate(${birdX}px, ${birdY}px)`

// stops bird from falling once it hits the bottom of the window
  if (birdY + birdRect.height >= windowHeight) {
    // if it hits the 'ground', dislay following
    gameOver.style.display = 'block'
    playAgain.style.display = 'block'
    // stop the pipes from generating once bird hits 'ground'
    floorFlag = true;
    return;
  }

  window.requestAnimationFrame(startFall)

  collisionDetection()
  
}

startFall()

// Makes bird go up on any keydown
document.addEventListener('keydown', function () {
  // When key is pressed, change gravity to make the bird go up
  birdGravitySpeed = 0 // Reset birdGravitySpeed
  birdSpeedY = -2.5 // Sets jump strength
})
// Makes bird fall again when key is released
document.addEventListener('keyup', function () {
  // Restore original gravity when key is released
  birdGravity = 0.05
})

function genRanNum(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const score = document.getElementById('score')
let totalScore = 0;
let betweenBars = false;

// Collision Detection
function collisionDetection() {
    // if collision detected, stop generating pipes 
    if (collisionFlag){
        return;
    }

  const birdRect = birdElement.getBoundingClientRect()
  const allTopPipes = document.querySelectorAll('.top-pipe')
  const allBotPipes = document.querySelectorAll('.bot-pipe')

  for (i = 0; i < allTopPipes.length; i++) {
    const topPipeRect = allTopPipes[i].getBoundingClientRect()
    const botPipeRect = allBotPipes[i].getBoundingClientRect()

    // Checks for collision between the bird and pipes
    if (
      birdRect.right > topPipeRect.left &&
      birdRect.left < topPipeRect.right &&
      birdRect.bottom > topPipeRect.top &&
      birdRect.top < topPipeRect.bottom
    ) {
      gameOver.style.display = 'block'
      playAgain.style.display = 'block'
      collisionFlag = true;
    } 

    if (
      birdRect.right > botPipeRect.left &&
      birdRect.left < botPipeRect.right &&
      birdRect.bottom > botPipeRect.top &&
      birdRect.top < botPipeRect.bottom
    ) {
      gameOver.style.display = 'block'
      playAgain.style.display = 'block'
      collisionFlag = true;
    }

    // SCORE COUNTER
    const gapTop = topPipeRect.bottom;
    const gapBottom = botPipeRect.top;

    // Determines if bird is between the bars...

    if (
        birdRect.right > topPipeRect.left && 
        birdRect.right < topPipeRect.right && 
        birdRect.bottom > gapTop && 
        birdRect.top < gapBottom
    ) {
        
        betweenBars = true;
    }
    
    // Determine when the bird passed the bars...
    // Check if the bird's left edge is greater than the pipes' right edge
    if (birdRect.left > topPipeRect.right && betweenBars) {
        // Bird has passed the bars
        console.log('Bird has passed the bars!');
        betweenBars = false; // Reset betweenBars flag

        // Add to the score or perform any other action
        totalScore++; // Increment the score
        score.textContent = totalScore; // Update the displayed score
    }
  }
}

function generatePipe() {

    if (collisionFlag){
        return;
    }
    if (floorFlag){
        return;
    }

// set random gap with minimum gap of 6vh to allow bird to always pass through 
  let ranGap = Math.floor(Math.random() * 85 + 6);

  const minTopPipeHeight = 10 // Minimum height for top pipe
  const maxTopPipeHeight = 85 - ranGap // Maximum height for top pipe with a 6vh gap

  // Generate random heights for the top and bottom pipes
  const topPipeHeight = genRanNum(minTopPipeHeight, maxTopPipeHeight)
  const bottomPipeHeight = 85 - topPipeHeight - ranGap // Ensure a 6vh gap

  // Create top pipe
  const topPipeDiv = document.createElement('div')
  topPipeDiv.className = 'top-pipe'
  topPipeDiv.classList.add('pipe-animation')
  topPipeDiv.style.height = `${topPipeHeight}vh`

  // Create bottom pipe
  const botPipeDiv = document.createElement('div')
  botPipeDiv.className = 'bot-pipe'
  botPipeDiv.classList.add('pipe-animation')
  botPipeDiv.style.height = `${bottomPipeHeight}vh`

  // Append both div elements to the body
  document.body.appendChild(topPipeDiv)
  document.body.appendChild(botPipeDiv)

  return {
    topPipeEl: topPipeDiv,
    botPipeEl: botPipeDiv,
  }
}

// // Get the viewport height in pixels
// const viewportHeightInPixels = window.innerHeight
// console.log(viewportHeightInPixels)

// // Now, you can use this value to convert "vh" to pixels
// const vhValueInPixels = (viewportHeightInPixels * 10) / 100 // 1vh = 1% of the viewport height
// console.log(vhValueInPixels)

// const pixels = 16
// const vhValueBird = (pixels * 100) / viewportHeightInPixels
// console.log(vhValueBird)

// Game Over/Restart Buttons
yesBtn.addEventListener('click', function(){
    gameOver.style.display = 'none'
    playAgain.style.display = 'none'
    startGame.style.display = 'block'
    // reload screen when button is pressed to restart the game
    location.reload();
})