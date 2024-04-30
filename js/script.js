
const canvas = document.getElementsByTagName('canvas')[0]
const ctx = canvas.getContext('2d')

const scoreEl = document.getElementsByClassName('scoreValue')[0]
const gameOverBoxEl = document.getElementsByClassName('gameOver-box')[0]
const gameOverScoreEl = document.getElementsByClassName('gameOver-score')[0]
const restartBtn = document.getElementsByClassName('restartGame-btn')[0]

const size = 30;

let direction, loop;
let score = 0;

const eatSound = new Audio('../assets/sounds/eat.mp3')

let position = [
  {x:210, y:210},
  {x:240, y:210},
]

const food = {
  x: randomNumber(19, 1, 30),
  y: randomNumber(19, 1, 30),
  color: randomColor()
}

function randomColor(){
  const r = randomNumber(255, 0, 1)
  const g = randomNumber(255, 0, 1)
  const b = randomNumber(255, 0, 1)

  return `rgb(${r},${g},${b})`
}

function randomNumber(max, min, mult){
  return Math.round(Math.random() * (max - min) + min) * mult
}

function verifyDeath(){

  const head = position[position.length -1]
  const indexHead = position.length -1

  const canvaslimit = canvas.width - size
  const allLimit = head.x < 0 || head.x > canvaslimit || head.y <0 || head.y > canvaslimit

  const bodyLimit = position.find((el, index)=>{
    return index < indexHead && el.x == head.x && el.y == head.y
  })

  if(allLimit || bodyLimit){
    gameOver()
  }
}

function gameOver(){
  direction = null
  gameOverScoreEl.innerHTML = score
  gameOverBoxEl.classList.remove('hidden')
  canvas.style.filter = 'blur(2px)'
}

function checkEat(){

  const head = position[position.length - 1]

  if(head.x == food.x && head.y == food.y){
    position.push(head)

    eatSound.play()

    score += 10
    scoreEl.innerHTML = score

    
    let x = randomNumber(19, 1, 30)
    let y = randomNumber(19, 1, 30)

    if(position.findIndex(value => value.x == x && value.y == y)){
      x = randomNumber(19, 1, 30)
      y = randomNumber(19, 1, 30)
    }

      food.x = x
      food.y = y
      food.color = randomColor()
  }
}

function drawFood(){

  const {x, y, color} = food

  ctx.shadowColor = color
  ctx.shadowBlur = 10
  ctx.fillStyle = color
  ctx.fillRect(x, y, size, size)
  ctx.shadowBlur = 0
}

function moveSnake(){

  if(!direction) return

  const head = position[position.length -1]

  switch(direction){

    case 'right':
      position.shift()
      position.push({x: head.x + size, y: head.y})
    break

    case 'left':
      position.shift()
      position.push({x: head.x - size, y: head.y})
    break

    case 'down':
      position.shift()
      position.push({x: head.x, y: head.y + size})
    break

    case 'up':
      position.shift()
      position.push({x: head.x, y: head.y - size})
    break

  }

}

function drawSnake(){

  ctx.fillStyle = 'rgb(0, 200, 0)'

  position.forEach((e , index)=>{

    if(index == position.length -1){
      ctx.fillStyle = 'rgb(0, 120, 0)'
    }

    ctx.fillRect(e.x, e.y, size, size)

  })
}

function drawGrid(){

  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgb(24, 24, 24)'

  for(let i = 30; i < canvas.width; i+=30){

    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()

    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()
  }

}

function gameLoop(){

  clearInterval(loop)

  ctx.clearRect(0, 0, 600, 600)
    verifyDeath()
    checkEat()
    drawFood()
    drawGrid()
    moveSnake()
    drawSnake()

    loop = setInterval(()=>{
      gameLoop()
    },300)

}

gameLoop()

document.addEventListener('keyup',(e)=>{

  switch(e.key){
    case'w':
    if(direction != 'down') direction = 'up';
    break;

    case's':

    if(direction != 'up') direction = 'down';
    break;

    case'd':

    if(direction != 'left') direction = 'right';
    break;

    case'a':

    if(direction != 'right') direction = 'left';
    break;
  }
})

restartBtn.addEventListener('click',()=>{
  score = 0
  gameOverScoreEl.innerHTML = score
  gameOverBoxEl.classList.add('hidden')
  canvas.style.filter = 'none'
  position = [
    {x:210, y:210},
    {x:240, y:210},
  ]
})