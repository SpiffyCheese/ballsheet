document.body.style.backgroundColor = "white";
let darkmodeToggle=false;
let smallballtoggle=false;
let outlierconst = 0.07;
let newr = []
let ravg = 9999;
let alpha = 255;
let show = false;
let oldx
let oldy;
let lastpicktime = 0;
let ballsHS = 0;
let reactionHS = 9999;
let eatenHS = 0;
let maxepsHS = 0;
let PRESSURE = 60;
let ballcounter;
let timedif = 0;
let reactions = [];
let lasttime;
let hs_avg = 0;
let startTime;
let overall = 0;
let EPSRANGE = 5;
let W = 800;
let H = 800;
let BALLSIZE = 60;
let CURSORSIZE = 30;
let time;
let score;
let xpos = H/2;
let ypos = W/2;
let scorePressure = 1;
let newdist = 0;
let scorePrise = 35;
let highScore = 0;
let eps = 0;
let ingame = true;
let timecheck = 0;
let newTime = 0;
let balance = 0;
let bestEPS = 0;
let noCheese = false;

let timesEat = [];
let costEat = [];

let TARGETCOLOR;
let BACKGROUNDCOLOR;
let MOUSECOLOR;
let WHITE;

let eatsound;

let newCursor=false;

function gameSetup()
{ 
  ballcounter = 0;
  xpos = H/2;
  ypos = W/2;
  overall = 0;
  time = 0;
  newTime = 0;
  score = 100;
  timecheck = 0;
  ingame = true;
  scorePressure = 0;
  textFont('Georgia');
  eps = 0;
  noCheese = false;
  timesEat.splice(0,timesEat.lenght);
  costEat.splice(0,costEat.lenght);
  reactions.length = 0;
  bestEPS = 0;
  lasttime = 0;
}

function preload()
{	
   if (getItem(0) != null)
   {
     highScore = getItem(0)/1000;
   }
   if (getItem(1) != null)
   {
    hs_avg = getItem(1)/1000;
   }
  if (getItem(2) != null)
   {
    eatenHS = getItem(2)/1000;
   }
  if (getItem(3) != null)
   {
    maxepsHS = getItem(3)/1000;
   }
  if (getItem(5) != null)
   {
    reactionHS = int(getItem(5));
   }
  if (getItem(6) != null)
   {
    ballsHS = getItem(6)/1000;   
   }

  eatsound = loadSound("idk.wav");
}

let cnv;
let ctx;
function setup() {
  frameRate(3000);
	objectColors();
  createCanvas(W, H);
  cnv = document.getElementById('defaultCanvas0');
  ctx = cnv.getContext('2d', { 
  desynchronized: true,
  preserveDrawingBuffer: true
});

	document.oncontextmenu = function() { return false; }
  textSize(30);
  textAlign(CENTER,CENTER);
  
  gameSetup();
}

function objectColors() {
  TARGETCOLOR = color(0,0,0);
  if (darkmodeToggle) TARGETCOLOR = color(255,255,255);
  BACKGROUNDCOLOR = color(255,255,255);
  if (darkmodeToggle) BACKGROUNDCOLOR = color(0,0,0);
  MOUSECOLOR = color(0,0,0);
  if (darkmodeToggle) MOUSECOLOR = color(255,255,255);
  WHITE = (255,255,255);
}

function draw() {
 if (ingame) //game
 { 
   ingame = !checkIfLose();
   timeAndPressure(noCheese);
   textThings(); 
   makeEpsBalance();
   makeBalls();
   checkCollision();
 }
 else //gameover
 {
   background(WHITE);
   if (darkmodeToggle) background(0,0,0);
   setHighScores();
   if (newTime>0) makeGraph();
   if (newTime>0) gameOverText();
}
  
  function makeGraph()
  {
    let max_of_array = Math.max.apply(Math, reactions);
    let min_of_array = Math.min.apply(Math, reactions);
    let xup = W/20;
    let yup = H/20;
    let height = H/2.8;
    let width = 9*W/10;
    let step = width/(reactions.length-1);
    if (darkmodeToggle) fill(WHITE);
    verticalnums = 7;
    
    let dist = (max_of_array-min_of_array);
    for (let j = 0; j<verticalnums;j++)
    {
      textSize(30);
      text((min_of_array+j*(dist/(verticalnums))).toFixed(0),W/25,((verticalnums+-1.04*j)/(verticalnums))*height + 36);
    }
    let last = 0;
    strokeWeight(4);
    	for (let i=0; i<reactions.length; i++) 
        {
          let balanced_i = map(reactions[i], min_of_array, max_of_array, 0, H/3);
          if (i>0)
          {
            line((i-1)*step + xup, last, i*step+xup, height+yup - balanced_i);
          }
		  last = height+yup - balanced_i;
	    }
      strokeWeight(0);
      if (darkmodeToggle) stroke(WHITE);
      else stroke(0,0,0);
      
  }
function timeAndPressure(noCheese)
{
   if (noCheese)
   { 
     newTime = (performance.now() - startTime)/1000;
     hunger(newTime);
   }
}
  
function setHighScores()
{
  
  if (newTime > highScore)
   {
     highScore = newTime;
     storeItem(0, 1000*highScore);
   }
   if ((overall/newTime) > hs_avg)
   {
     hs_avg = (overall/newTime);
     storeItem(1, 1000*hs_avg);
   }
   if (overall > eatenHS)
   {
     eatenHS = overall;
     storeItem(2, 1000*eatenHS);
   }
   if (bestEPS > maxepsHS)
   {
     maxepsHS = bestEPS;
     storeItem(3, 1000*maxepsHS);
   }
   
   newr.length = 0;
   for (let i = 0;i<=reactions.length-1;i++)
   {
      newr.push(reactions[i]);
   }
  
   newr.sort();
   let outliers = int((ballcounter*outlierconst));
   let sum = 0;
  
   for (let i = outliers; i<=ballcounter-outliers-1;i++)
   {
        sum+=newr[i];
   }
   ravg = int(sum/(ballcounter-2*outliers));
   if(ravg == 0)
   {
     ravg = 9999;
   }
  
   if (ravg < reactionHS)
   {
     reactionHS = ravg;
     storeItem(5, reactionHS);
   }
  
  if (ballcounter > ballsHS)
  {
    ballsHS = ballcounter;
    storeItem(6, 1000*ballsHS);
  }
}

function gameOverText()
{
   fill(0,0,0);
   if (darkmodeToggle) fill(WHITE);
   textSize(55);
   textStyle(BOLD);
   text("GAME OVER", W/2, H/2);   
   textSize(30);
   
   let heightlevel = 22;
   
   let placeleft = 14;
   textAlign(LEFT,CENTER);
   textStyle(BOLD);
  
   text("Stats" ,W/placeleft,H-(H/heightlevel)*9);
   textStyle(ITALIC);
   text("Time" ,W/placeleft,H-(H/heightlevel)*8);
   text("React", W/placeleft, H-(H/heightlevel)*7);
   text("Avg pps", W/placeleft, H-(H/heightlevel)*6);
   text("Max pps", W/placeleft, H-(H/heightlevel)*5);
   textAlign(CENTER,CENTER);
   
   let placemiddle = 2;
   textStyle(BOLD);
   text("Now",W/placemiddle,H-(H/heightlevel)*9);
   textStyle(NORMAL);
   text((newTime).toFixed(2),W/placemiddle,H-(H/heightlevel)*8); 
   text(ravg, W/placemiddle, H-(H/heightlevel)*7);
   text((overall/newTime).toFixed(2), W/placemiddle, H-(H/heightlevel)*6);
   text(bestEPS.toFixed(0), W/placemiddle, H-(H/heightlevel)*5);
  
   let placeright = 8;
   textStyle(BOLD);
   text("Highscore",W-W/placeright,H-(H/heightlevel)*9);
   textStyle(NORMAL);
   text(highScore.toFixed(2),W-W/placeright,H-(H/heightlevel)*8);
   text(reactionHS, W-W/placeright, H-(H/heightlevel)*7);
   text(hs_avg.toFixed(2), W-W/placeright,H-(H/heightlevel)*6);
   text(maxepsHS.toFixed(0), W-W/placeright,H-(H/heightlevel)*5);

   textStyle(BOLD);
   textSize(20);
   
   //text("",W-W/placeright,H-(H/heightlevel)*4);
   text("Space: Play    D: darkMode    E: smallBall    F: ballFade    H:resetHS",W-W/placemiddle,H-(H/heightlevel)*3);
   //text("",W/placeleft, H-(H/heightlevel)*4);
 }
}

function checkIfLose()
{
  return (score < 0);
}

function hunger(frametime)
{
   timedif = frametime - lasttime;
   lasttime = frametime;
   
   scorePressure = PRESSURE*log(1+frametime);
   score -= timedif * scorePressure;
}

function textThings()
{
 
 background(BACKGROUNDCOLOR); 
 
 fill(WHITE);
 if (darkmodeToggle) fill(0,0,0);
 //rect(W/6,H/6,W-W/3,H-H/3);
  if(show)
  {
   fill(200-balance,balance*3+150,0, alpha);
   text(balance.toFixed(0),W/2,H-H/7);
   fill(300-score,score*2,0, alpha);
   textSize(40);
   text(int(score), W/2, H/12);
    
   if (reactions.length>0)
   {
     textSize(50);
     let r = reactions[reactions.length-1]
     fill(255,0,0, alpha);
     if (r<300) fill(255,255,0, alpha);
     if (r<240) fill(191,255,0, alpha);
     if (r<220) fill(128,255,0, alpha);
     if (r<200) fill(64,255,0, alpha);
     if (r<190) fill(0,255,0, alpha);
     if (r<180) fill(0,255,64, alpha);
     if (r<175) fill(0,255,128, alpha);
     if (r<170) fill(0,255,191, alpha);
     if (r<166) fill(0,255,255, alpha);
     text(int(r),W/2, H/2);
     textSize(40);
   }
  }
}

function makeEpsBalance()
{
 eps = getEps();
 if (eps > bestEPS)
 {
   bestEPS = eps;
 }  
   
 balance = eps-scorePressure;
}

function makeBalls()
{
  fill(MOUSECOLOR);
  if (darkmodeToggle) fill(WHITE);
 if (!newCursor) {ellipse(mouseX, mouseY, CURSORSIZE, CURSORSIZE);}
  if (show)
  {
    fill(0,balance*3+255,0);
  }
  else
  {
    fill(0,0,0);
    if (darkmodeToggle) fill(255,255,255);
  }
  ellipse(xpos, ypos, BALLSIZE, BALLSIZE);
}

function checkCollision()
{
  if (dist(mouseX, mouseY, xpos, ypos) < BALLSIZE/2 + CURSORSIZE/2) 
  {
   oldx = xpos;
   oldy = ypos;
    
   do
   {
     xpos = random(W/6+BALLSIZE,W-W/6-BALLSIZE);
     ypos = random(H/6+BALLSIZE+30,H-H/6-BALLSIZE-30);
   } while(
     !valueInCircle(xpos, ypos, oldx, oldy, W/2 - W/8)
     ||
     valueInCircle(xpos, ypos, oldx, oldy, W/8)
   );
    
   newdist = int(dist(oldx,oldy,xpos,ypos))/10; 
  
   if (!noCheese)
   {     
     startTime = performance.now();
     noCheese=true;
     
   }
   else
   {
     let r = 1000*(newTime-lastpicktime).toFixed(3)
    reactions.push(r);
     
    let cost = scorePrise;
     if (r < 100)
     {
       cost = cost * (r/100);
     }
    ballcounter++;
    score+= cost;
    timesEat.push(newTime);
    costEat.push(cost);
    overall += cost;
   }
  lastpicktime = newTime;
  eatsound.play();
  }
}

function valueInCircle(xvalue, yvalue, x, y, R)
{
  return (sqrt(abs(xvalue-x)*(abs(xvalue-x)) + (abs(yvalue-y)*abs(yvalue-y)))<R);    
}

function getEps()
{
  let sum = 0;
  
  for (let i = 0; i<=timesEat.length-1; i++)
  {
    if (timesEat[i] + EPSRANGE < newTime || timesEat[i] > newTime)
    {
      timesEat.splice(i, 1);
      costEat.splice(i, 1);
    }
  }  
  for (let j = 0; j<timesEat.length-1;j++)
  {
    sum+= costEat[j];
  }
  
  return sum/EPSRANGE;
}

function reset()
{
  if (ingame)
  {
    if (dist(mouseX, mouseY, W/20, H/20) < W/32)
    {
      score=-1;
    }
  }
  else
  {
    gameSetup();
  }
}
function keyPressed() {
  if (key === ' ') {
    if (ingame)
    score=-1; 
    setTimeout(reset, 1);
  }
  if (key === 'h')
  {
    for (let i = 0; i<=6; i++)
    {
     storeItem(i,0);
    }
    storeItem(5,9999);
    
   highScore = 0;
   bpsHS = 0;
   reactionHS = 9999;
   ballsHS = 0;
   maxepsHS = 0;
   eatenHS = 0;
   hs_avg = 0;
  }
  if (key === 'e')
  {
    smallballtoggle=!smallballtoggle;
    if (smallballtoggle) BALLSIZE=30;
    else BALLSIZE=60;
  }
  if (key === 'f')
  {
    show = !show;
  }
  if (key === 'd')
  {
    darkmodeToggle=!darkmodeToggle;
    document.body.style.backgroundColor = "white";
    if(darkmodeToggle) {
      document.body.style.backgroundColor = "black";
      background(0,0,0);
    }
    objectColors();
  }
}