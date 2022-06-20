

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
  loader2 = new SpriteLoader("TexturePacker/Scene2.json");


  // wait all loader to complete
  await Promise.all([loader1.load(), loader2.load()])

  /**
    create all scenes
  **/

  // Cover Scene
  scene11 = make_scene_11(loader1, "scene1-1")
  // User-Agree-Box scene
  scene12 = make_scene_12(loader1, "scene1-2")

  scene21 = make_scene_21(loader2, "scene2-1")
  scene22 = make_scene_22(loader2, "scene2-2")
  scene23 = make_scene_23(loader2, "scene2-3")
  scene24 = make_scene_24(loader2, "scene2-4")
  // add scenes to scene manager
  sm.addScene(scene11);
  sm.addScene(scene12);
  sm.addScene(scene21);
  sm.addScene(scene22);
  sm.addScene(scene23);
  
  // jump to specific page using url search parameter
  url = new URL(window.location.href)
  p = url.searchParams.get("page")
  console.log(url,p)
  if(p){
    PubSub.publish(p,"reload")
  }
  else{
    // activate scene1
    PubSub.publish("scene1-1","reload")
  }


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