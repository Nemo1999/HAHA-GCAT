var sm;

function preload(){
  huninn_font = loadFont("assets/jf-openhuninn-1.1/jf-openhuninn-1.1.ttf");
}

function setup() {
  cv = createCanvas(windowWidth, windowHeight);
  /*
  function publishMouseMove(){
    PubSub.publish("mouseMove", {x:mouseX, y:mouseY});
  }
  cv.mouseMoved(publishMouseMove);
  */
  sm = new getSceneManager();
  //sm.add_scene(make_scene("scene1"));
  sm.addScene(test_scene(sm));
}

function draw(){
  sm.update(deltaTime);
  sm.render()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  sm.handleMousePress()
}
function mouseReleased(){
  sm.handleMouseRelease()
}
function mouseDragged(event){
  sm.handleMouseDrag(event)
}

function mouseWheel(event){
  sm.handleMouseScroll(event.delta)
  // disable page scrolling behavior
  return false
}


function test_scene(sm){
  var scene = new Scene("test_scene");
  var container = new SizeNode("contrainer", windowWidth/2, windowHeight/2);
  container.drawSelf = function(){
    fill(0);
    noStroke();
    rect(0,0,this.size[0], this.size[1]);
  }
  
  var ball = new SizeNode("ball", 100, 100)
  ball.state.color=color("#FF0000")
  ball.drawSelf = function(){
    fill(ball.state.color);
    noStroke();
    ellipse(this.size[0]/2,this.size[1]/2,this.size[0], this.size[1]);
  }
  ball.onMouseEnter = function(){
    this.setSize(this.size[0]+20,this.size[1]+20);
  }
  ball.onMouseExit = function(){
    this.setSize(this.size[0]-20,this.size[1]-20);
  }
  ball.onMousePress = function(){
    this.state.color = color("#00FF00");
  }
  ball.onMouseRelease = function(){
    this.state.color = color("#FF0000");
  }
  ball.onMouseDrag = function(self, currentPoint, startPoint){
    this.setTranslate(currentPoint[0]-this.size[0]/2, currentPoint[1]-this.size[1]/2);
  }
  ball.onMouseClick = function(){
    this.setSize(this.size[0]+20,this.size[1]+20);
  }

  container.addChild(ball);
  scene.addChild(container);
  scene.activate();
  scene.show()
  return scene;
}