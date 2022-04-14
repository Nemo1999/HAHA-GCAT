var sm;

function preload(){
  huninn_font = loadFont("assets/jf-openhuninn-1.1/jf-openhuninn-1.1.ttf");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  sm = new getSceneManager();
  sm.add_scene(make_scene("scene1"));
}

function draw(){
  sm.update(deltaTime)
  sm.render()
}


function make_scene(scene_name="scene1"){
  loader = new SpriteLoader("assets/Scene1/Scene1.json");    
  var scene1 = new Scene(scene_name);
  var bg = new Node("background");
  bg.draw_self = ()=>{background(0);}
  var bubble = new Node("Bubble");
  bubble.state.x = windowWidth/2;
  bubble.state.y = windowHeight/2;
  bubble.state.r = 100;

  bubble.draw_self = function(){
    push();
    fill("red");
    circle(this.state.x,this.state.y,this.state.r)
    pop();
  }

  bubble.update_self=function(deltaT){
    console.log("update bubble", this.state.y);
    this.state.y -= deltaT / 10;
  }
  
  scene1.add_child(bg);
  scene1.add_child(bubble);
  

  loader.load().then(function(loader){
    PubSub.publish(scene_name, "activate");
    PubSub.publish(scene_name, "show");
  })
  console.log(scene1)
  return scene1;
} 