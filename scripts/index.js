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
  sm.add_scene(make_scene("scene1"));
}

function draw(){
  
  sm.update(deltaTime,windowWidth, windowHeight);
  sm.render()
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function make_scene(scene_name="scene1"){
  loader = new SpriteLoader("assets/Scene1/Scene1.json");    
  var scene1 = new Scene(scene_name);
  
  var bg = new Node("background");
  bg.draw_self = ()=>{background(color("#FEFFD2"));}
  
  var bubble = new Node("Bubble");
  bubble.state.x = width/2;
  bubble.state.y = windowHeight/2;
  bubble.state.r = 100;
  bubble.draw_self = function(){
    push();
    fill("red");
    circle(this.state.x,this.state.y,this.state.r)
    pop
  }
  bubble.update_self=function(deltaT){
    this.state.y -= deltaT / 10;
  }
  var cat2 = new SpriteNode(loader.get_handle("cat_small.png"));
  cat2.update_self = function(deltaT,dw,dh){
    cat2.set_translate(-this.size[0]*0.52,dh*0.35)
    if(this.acc_t < 250){
      this.scale = this.acc_t/100
    }else{
      this.scale = 2.5
    }
  }

  var cat = new Node("cat");
  var cat_face = new Node("cat-face");
  cat.add_child(cat_face);

  cat.set_scale(2.5);
  cat.update_self = function(dt,dw,dh){
    size = loader.get_size("cat_small.png");
    sc = cat.scale
    cat.set_translate(-sc*size[0]*0.52, dh*0.25);
    
    if(this.acc_t < 250){
      this.scale = this.acc_t/100
    }else{
      this.scale = 2.5
    }
  }
  cat.draw_self = function(){
    loader.draw("cat_small.png");
  }
  
  cat_face.state.possible_sprites = ["cat_face1.png", "cat_face2.png"];
  cat_face.state.current_sprite = 1
  cat_face.set_translate(370, 87);
  cat_face.set_scale(0.5)
  cat_face.draw_self = function(){
    loader.draw(cat_face.state.possible_sprites[cat_face.state.current_sprite]);
  }

  var cat_tail = new Node("cat-tail");
  cat_tail.set_translate(cat_tail.dw-470,cat_tail.dh*0.2);
  cat_tail.set_scale(2.5);
  cat_tail.update_self = function(dt,dw,dh){
    size = loader.get_size("cat_small.png");
    sc = this.scale
    this.set_translate(dw-sc*size[0]*0.52, dh*0.25);
  }
  cat_tail.draw_self = ()=>{
    loader.draw("cat_small.png");
  }

  var big_title = new Node("big-title");
  var sub_title = new Node("sub-title");
  var go_btn = new Node("go-btn");
  big_title.add_child(sub_title);

  big_title.update_self = (dt,dw,dh)=>{
    big_title.set_translate(dw/2 ,dh*0.2);
  }
  big_title.draw_self = ()=>{
    var tx, ty
    [tx,ty] = loader.get_size("title_small.png")
    loader.draw("title_small.png",-tx, 0, tx*2, ty*2);
  }
  sub_title.set_translate(72, 308)
  sub_title.draw_self = ()=>{
    loader.draw("subTitle.png");
  }
  
  go_btn.update_self = function(dt,dw,dh){

    size = loader.get_size("go_btn.png");
    sc = this.scale
    this.set_translate(dw/2-sc*size[0]*0.5, dh*0.7);

    
  }
  go_btn.draw_self = ()=>{
    loader.draw("go_btn.png");
  }
  

  scene1.add_child(bg);
  scene1.add_child(bubble);
  //scene1.add_child(cat);
  scene1.add_child(cat2)
  scene1.add_child(cat_tail);
  scene1.add_child(big_title);
  scene1.add_child(go_btn);
  

  loader.load().then(function(loader){
    PubSub.publish(scene_name, "activate");
    PubSub.publish(scene_name, "show");
  })
  console.log(scene1)
  return scene1;
} 