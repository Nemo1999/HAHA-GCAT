

var sm;

function preload(){
  // create scene manager
  sm = new getSceneManager();
}

async function setup() {
  cv = createCanvas(windowWidth, windowHeight);
  //rectMode(CENTER)
  //textSize(32);
  //text('Loading', windowWidth/2, windowHeight/2);
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

p5.Renderer2D.prototype._getTintedImageCanvas = function(img) {
  if (!img.canvas) {
    return img;
  }

  if (!img.tintCanvas) {
    // Once an image has been tinted, keep its tint canvas
    // around so we don't need to re-incur the cost of
    // creating a new one for each tint
    img.tintCanvas = document.createElement('canvas');
  }

  // Keep the size of the tint canvas up-to-date
  if (img.tintCanvas.width !== img.canvas.width) {
    img.tintCanvas.width = img.canvas.width;
  }
  if (img.tintCanvas.height !== img.canvas.height) {
    img.tintCanvas.height = img.canvas.height;
  }

  // Goal: multiply the r,g,b,a values of the source by
  // the r,g,b,a values of the tint color
  const ctx = img.tintCanvas.getContext('2d');

  ctx.save();
  ctx.clearRect(0, 0, img.canvas.width, img.canvas.height);

  if (this._tint[0] < 255 || this._tint[1] < 255 || this._tint[2] < 255) {
    // Color tint: we need to use the multiply blend mode to change the colors.
    // However, the canvas implementation of this destroys the alpha channel of
    // the image. To accommodate, we first get a version of the image with full
    // opacity everywhere, tint using multiply, and then use the destination-in
    // blend mode to restore the alpha channel again.

    // Start with the original image
    ctx.drawImage(img.canvas, 0, 0);

    // This blend mode makes everything opaque but forces the luma to match
    // the original image again
    ctx.globalCompositeOperation = 'luminosity';
    ctx.drawImage(img.canvas, 0, 0);

    // This blend mode forces the hue and chroma to match the original image.
    // After this we should have the original again, but with full opacity.
    ctx.globalCompositeOperation = 'color';
    ctx.drawImage(img.canvas, 0, 0);

    // Apply color tint
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgb(${this._tint.slice(0, 3).join(', ')})`;
    ctx.fillRect(0, 0, img.canvas.width, img.canvas.height);

    // Replace the alpha channel with the original alpha * the alpha tint
    ctx.globalCompositeOperation = 'destination-in';
    ctx.globalAlpha = this._tint[3] / 255;
    ctx.drawImage(img.canvas, 0, 0);
  } else {
    // If we only need to change the alpha, we can skip all the extra work!
    ctx.globalAlpha = this._tint[3] / 255;
    ctx.drawImage(img.canvas, 0, 0);
  }

  ctx.restore();
  return img.tintCanvas;
};