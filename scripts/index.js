function preload(){
  huninn_font = loadFont("assets/jf-openhuninn-1.1/jf-openhuninn-1.1.ttf");
}
function setup() {
  loader = new spriteLoader(["assets/Scene1/Scene1.json", "assets/Scene2/Scene2.json"]);
  createCanvas(windowWidth, windowHeight);
  function show_img(){
    console.log("image_loaded")
    background(0);
    noStroke(); 
    fill(255);
    textSize(32);
    textFont(huninn_font)
    textAlign(CENTER);
    text("Click to start", width/2, height/2);
    [w, h] = loader.get_size("Scene1", "cat_small.png");
    loader.draw_sprite("Scene1", "cat_small.png", 0, 0, w, h);
  } 
  loader.load_all(null, show_img);
  
}

function draw(){
    
}