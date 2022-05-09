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