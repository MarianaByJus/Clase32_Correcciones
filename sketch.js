const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
let engine;
let world;

var tower;
var canon;
var bomba;
var balls = [];
var boats = [];
var Brokenboatanimation = [];
var brokenboatData;
var brokensheet;

var boatAnimation = [];
var boatSpritedata, boatSpritesheet;
var ground; 

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  //towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png");
brokenboatData = loadJSON("assets/boat/broken_boat.json");
brokensheet = loadImage("assets/boat/broken_boat.png");

}


function setup() {
  canvas = createCanvas(1200,600);

  engine = Engine.create();
  world = engine.world;

  angle = -PI/4;
  ground = new Ground(0, height-1, width*2, 1);
  canon = new Canon(180, 110, 100, 50, angle);   
  tower = new Tower(150,350,160,310);
  //bomba = new Bomba(canon.x, canon.y); 
  //barco = new Barco(width, height -100, 200, 200, -100);   

  var boatFrames = boatSpritedata.frames;
  for (var i = 0; i < boatFrames.length; i++) {
    var pos = boatFrames[i].position;
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    boatAnimation.push(img);
  }
  var brokenboatframes = brokenboatData.frames; 
  for( var i= 0; i < brokenboatframes.length; i++){
    var pos = brokenboatframes[i].position; 
    var img = brokensheet.get(pos.x, pos.y, pos.w, pos.h);
    Brokenboatanimation.push(img); 
  }     
}

function draw() {

  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);
  ground.display();

  showBoats();

  for(var i = 0; i < balls.length; i++){
    showBomba(balls[i],i);
    for(var j = 0; j < boats.length; j++){
      if(balls[i] !== undefined && boats[j] !== undefined){
        var collision = Matter.SAT.collides(balls[i].body,boats[j].body);
        if(collision.collided){
          boats[j].remove(j);

          Matter.World.remove(world,balls[i].body);
          balls.splice(i,1);
          i--;
        } 

      }
    }
  }
  tower.display();
  canon.display();
  //bomba.display();
 //barco.display();
}

//muestra la torre(desafío 4)
 //Matter.Body.setVelocity(barco.body, { 
   //x: -0.9, 
   //y:0 
 //})

function keyPressed(){
  if (keyCode === DOWN_ARROW){
    var bomba = new Bomba(canon.x, canon.y);
    bomba.trajectory = [];
    Matter.Body.setAngle(bomba.body, canon.angle);
    balls.push(bomba);
     }
}


function showBomba(bomba, index){
  //if(bomba.body.position.x >  )
  bomba.display();
 if (bomba.body.position.x >= width || bomba.body.position.y >= height -50){
   Matter.World.remove(world,bomba.body);
   balls.splice(index,1);
 }
} 

function showBoats() {
  if (boats.length > 0) {
    if (
      boats.length < 4 &&
      boats[boats.length - 1].body.position.x < width - 300
    ) {
      var positions = [-40, -60, -70, -20];
      var position = random(positions);
      var barco = new Barco(
        width,
        height - 100,
        170,
        170,
        position,
        boatAnimation
      );

      boats.push(barco);
    }

    for (var i = 0; i < boats.length; i++) {
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });

      boats[i].display();
      boats[i].animate();

    }
  } 
  else {
    var barco = new Barco(width, height - 60, 170, 170, -60, boatAnimation);
    boats.push(barco);
  }
}

function keyReleased(){

  if (keyCode === DOWN_ARROW){
    balls[balls.length-1].shoot();
    cannonExplosion.play();

    balls[balls.length - 1].shoot();
    
  }
}