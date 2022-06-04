var sm;

function preload(){
  // create scene manager
  sm = new getSceneManager();
}

async function setup() {
  cv = createCanvas(windowWidth, windowHeight);
  rectMode(CENTER)
  textSize(32);
  text('Loading', windowWidth/2, windowHeight/2);
  // load huninn font
  huninn_font = loadFont("assets/jf-openhuninn-1.1/jf-openhuninn-1.1.ttf");
  // show loading page
  textFont(huninn_font);
  textSize(32);
  rectMode(CENTER)
  text('Loading', windowWidth/2, windowHeight/2);
  
  // create scene loaders
  loader1 = new SpriteLoader("TexturePacker/Scene1.json");


  // wait all loader to complete
  await Promise.all([loader1.load()])

  /**
    create all scenes
  **/

  // Cover Scene
  scene1 = make_scene_1(loader1, "scene1")
  // User-Agree-Box scene
  scene2 = make_scene_2(loader1, "scene2")

  scene3 = make_scene_3()
 
  // add scenes to scene manager
  sm.addScene(scene1);
  sm.addScene(scene2);
  sm.addScene(scene3);
  

  // activate scene1
  PubSub.publish("scene1","reload")
  /* activate and show are defined in reloadSelf callback
  PubSub.publish("scene1", "activate");
  PubSub.publish("scene1", "show");
  */
  return 
}

function draw(){
  
  //console.log(Array.from(sm.interactingNodes).map(n => n.name))
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