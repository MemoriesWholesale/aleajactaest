
const gameBoard = document.getElementById('gameboard')
const cube = document.querySelector('.cube');

const mouse = {
    x:undefined,
    y:undefined
};
let prevx = mouse.x;
let prevy = mouse.y;

function startThrow(){
    window.addEventListener('mousemove',shakeDice);
};

window.addEventListener('mousedown',startThrow)

function shakeDice(e){
    prevx = mouse.x;
    prevy = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    window.addEventListener('mouseup',releaseDice)
};

function releaseDice(e) {
    gameBoard.removeEventListener('mousemove',shakeDice);
    gameBoard.removeEventListener('mouseup',releaseDice);
    const dice = document.createElement('div');
    dice.setAttribute('id',`${e.x+e.y}`)
    dice.className = 'cube-box';
    dice.style.left = e.clientX + 'px';
    console.log(dice.style.left)
    console.log(e.x)
    dice.style.top = e.clientY + 'px';
    gameBoard.appendChild(dice);
    dice.innerHTML = `
    <div class="cube" id="cube${e.x+e.y}">
    <div class="cube-face front prevent-select">I</div>
    <div class="cube-face back prevent-select">II</div>
    <div class="cube-face left prevent-select">III</div>
    <div class="cube-face right prevent-select">IV</div>
    <div class="cube-face top prevent-select">V</div>
    <div class="cube-face bottom prevent-select">VI</div>
    </div>
    `
    rollDice(dice,e.clientX-prevx,e.clientY-prevy,1000,e.x+e.y)
};


function rollDice(dice,vx,vy,z,id){
    let rotateX = z-(vy * 15);
    let rotateY = z+(vx * 15);
    const childCube = document.getElementById(`cube${id}`)
    childCube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${vx}px,${vy}px,0px)`
    z --;
    // randomizer = 20*Math.random()/(1000-z)
    vx+=z/5000;
    vy+=z/5000;
    setTimeout(()=>{
    if (z > 0){
        rollDice(dice,vx,vy,z,id)
    }else{
        landDice(vx,vy,rotateX,rotateY,id)
    }},1)
}

function landDice(vx,vy,rotateX,rotateY,id){
    const childCube = document.getElementById(`cube${id}`)
    console.log(childCube.style.transform)
    childCube.style.transform = `rotateX(${rotateX-rotateX%90}deg) rotateY(${rotateY-rotateY%90}deg) translate3d(${vx}px,${vy}px,0px)`
    setTimeout(()=>{
        tallyScore(rotateX-rotateX%90,rotateY-rotateY%90)
        console.log(rotateX,rotateY)
    },1000)
}

function tallyScore(rotateX,rotateY){
    const xRing = ['I','IV','II','III']
    const yRingI = ['I','V','II','VI']
    const yRingIV = ['IV','V','III','VI']
    const yRingII = ['II','V','I','VI']
    const yRingIII = ['III','V','IV','VI']
    let x = (rotateX/90)%4
    let yRing;
    switch(xRing[x]){
        case 'I':
            yRing = yRingI;
            break;
        case 'IV':
            yRing = yRingIV;
            break;
        case 'II':
            yRing = yRingII;
            break;
        case 'III':
            yRing = yRingIII;
            break;}
    console.log(yRing)
    let y = (rotateY/90)%4;
    let score = yRing[y];
    console.log(score)

        
   





}



let caesarState = undefined;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvas_width = canvas.width = 550;
const canvas_height = canvas.height = 700;

let happybtn = document.getElementById('happy')
happybtn.addEventListener('click',function(){caesarState='happy';animate()})
let neutralbtn = document.getElementById('neutral')
neutralbtn.addEventListener('click',function(){caesarState='neutral';animate()})
let madbtn = document.getElementById('mad')
madbtn.addEventListener('click',function(){caesarState='mad';animate()})

var caesarImage = new Image();
caesarImage.src = './images/caesarsprites.png';
const spriteWidth = 478;
const spriteHeight = 715;
let gameFrame = 0;
const staggerFrame = 10;
const spriteAnimations = [];
const animationStates = [
    {
        name: 'mad',
        frames: 11
    },
    {
        name: 'neutral',
        frames: 13
    },
    {
        name: 'happy',
        frames: 14
    }   
];
animationStates.forEach((state,index)=>{
    let frames = {
        loc: []
    }
    for (let j = 0; j < state.frames; j++){
        let positionx = j * spriteWidth;
        let positiony = index * spriteHeight;
        frames.loc.push({x: positionx,y: positiony});
    }
    spriteAnimations[state.name] = frames;
})
function animate(){
    ctx.clearRect(0,0,canvas_width,canvas_height);
    let position = Math.floor(gameFrame/staggerFrame) % spriteAnimations[caesarState].loc.length;
    let framex = spriteWidth * position;
    let framey = spriteAnimations[caesarState].loc[position].y;
    ctx.drawImage(caesarImage, framex,framey,spriteWidth,spriteHeight,0,0,spriteWidth,spriteHeight);
    gameFrame++;
    if(position < spriteAnimations[caesarState].loc.length){
    requestAnimationFrame(animate);}
};
