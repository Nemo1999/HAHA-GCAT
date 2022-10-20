

var sm;

function preload(){
  // create scene manager
  sm = new getSceneManager();
}

async function setup() {

  cv = createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT);
  cv.elt.style.zIndex = 1000;
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
  const loader1 = new SpriteLoader("TexturePacker/Scene1.json");
  const loader2 = new SpriteLoader("TexturePacker/Scene2.json");
  const loader3 = new SpriteLoader("TexturePacker/Scene3.json");
  const loader_buttons = new SpriteLoader("TexturePacker/Buttons.json");
  const loader_cats = new SpriteLoader("TexturePacker/Cats.json");

  // wait all loader to complete
  await Promise.all([loader1.load(), loader2.load(), loader3.load(), loader_buttons.load(), loader_cats.load()]);

  /**
    create all scenes
  **/

  // Cover Scene
  const scene11 = make_scene_11(loader1, "scene1-1")
  // User-Agree-Box scene
  const scene12 = make_scene_12(loader1, loader_buttons ,"scene1-2")

  const scene21 = make_scene_21(loader2, "scene2-1")
  const scene22 = make_scene_22(loader2, "scene2-2")
  const scene23 = make_scene_23(loader2, "scene2-3")
  const scene24 = make_scene_24(loader2, "scene2-4")
  
  const scene31 = make_scene_31(loader3, loader_cats, loader_buttons , "scene3-1")
  const scene32 = make_scene_32(loader3, "scene3-2")

  const scene40 = make_scene_40(loader_cats)


  // add scenes to scene manager
  sm.addScene(scene11);
  sm.addScene(scene12);
  sm.addScene(scene21);
  sm.addScene(scene22);
  sm.addScene(scene23);
  sm.addScene(scene24);
  sm.addScene(scene31);
  sm.addScene(scene32);
  sm.addScene(scene40);

  resetCanvasSize();
  
  // jump to specific page using url search parameter
  let url = new URL(window.location.href)
  let p = url.searchParams.get("page")
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


  //test textNode
  /*
  const textN  = textNode("hellotextNode \nffffffffffffffffffffffffffffffffffff\nffffffffffffffffffffffffffffffffffffff", windowWidth/2, windowHeight/2, 50)
  console.log(textN)
  */
  return 
}

function draw(){
  
  //console.log(Array.from(sm.interactingNodes).map(n => n.name))
  sm.update(deltaTime);
  sm.render()
}

/**
 * Reset the canvas size with respect to the window size.
 */
function resetCanvasSize() {
  let winAspectRatio = windowHeight / windowWidth;
  // 比較視窗縱橫比及畫布縱橫比，若視窗縱橫比較大則代表視窗高度比預期的高度高，以視窗寬及畫布寬的比例作為縮放比：反之則計算高比例
  let scale = winAspectRatio > cvAspectRatio? windowWidth / DEFAULT_WIDTH : windowHeight / DEFAULT_HEIGHT;
  resizeCanvas(DEFAULT_WIDTH * scale, DEFAULT_HEIGHT * scale);
  sm.scenes.forEach(scene => {
    scene.setScale(scale);
  });
}

/**
 * This will be called on window size changed.
 */
function windowResized() {
  resetCanvasSize();
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