
function make_scene_11(loader, scene_name="scene1-1"){      
    
    var scene1 = new Scene(scene_name);
    var bg = new Node("background");
    bg.drawSelf = ()=>{background(color("#FEFFD2"));}
   
    var cat  = new Node("cat");
    var cat_body = new SpriteNode(loader.get_handle("cat-body.png"));
    var cat_tail = new SpriteNode(loader.get_handle("cat-body.png"));
    var cat_face = new Node("cat_face");
    var cat_eye1 = new SpriteNode(loader.get_handle(["cat-eye.png", "cat-eye-hovered.png"]));
    var cat_eye2 = new SpriteNode(loader.get_handle(["cat-eye.png", "cat-eye-hovered.png"]));
    var cat_mouth = new SpriteNode(loader.get_handle(["cat-mouth.png", "cat-mouth-hovered.png"]));
    var cat_antenna_left = new SpriteNode(loader.get_handle("cat-antenna-left.png"));
    var cat_antenna_right = new SpriteNode(loader.get_handle("cat-antenna-right.png"));
    var title = new SpriteNode(loader.get_handle("title.png"));
    var btn_go = new SpriteNode(loader.get_handle(["btn-go.png","btn-go-hovered.png"]),false, true);
    var water = new Node("water")
    //helper components
    //const tk = mouseTracker();
  

    // controll constants
    const waterLevelAvg = 338;
    
    // scene1
    scene1.reloadSelf = function(){
      this.activate()
      this.show()
      scene1.alpha = 1.0
      //scene1.tintColor = [0.0,0.0,0.0]
    }
    scene1.unloadSelf = function(){
      this.deactivate()
      this.hide()
    }
    scene1.updateSelf = function(){
      if(this.accTime < 3000){
        const v = this.accTime / 3000
        this.alpha = v
        //this.tintColor = [v,v,v]
      }
      else{
        this.alpha = null
        this.tintColor = null
      }
    }
    scene1.addChild(bg);
    scene1.addChild(cat);
    scene1.addChild(water);
    scene1.addChild(title);
    scene1.addChild(btn_go);
    //scene1.addChild(tk);

    // title
    rectMode(CENTER);
    title.setScale(0.7);
    title.setTranslate(488.1, 133.14);

    // button
    btn_go.setTranslate(663, 495);
    
    btn_go.onMouseEnter = function(){
      btn_go.nextSprite();
      cat_eye1.nextSprite();
      cat_eye2.nextSprite();
      cat_antenna_right.setRotate(0.2,[0,100]);
      cat_antenna_left.setRotate(0.1,[0,100]);
      cursor_pointer();

    }
    btn_go.onMouseExit = function(){
      btn_go.prevSprite();
      cat_eye1.prevSprite();
      cat_eye2.prevSprite();
      cat_antenna_left.setRotate(0);
      cat_antenna_right.setRotate(0);
      cursor_default();
    }
    btn_go.onMouseClick = function(){
      cursor_default()
      console.log("go to scene 1-2")
      PubSub.publish("scene1-2","reload")
      scene1.unload()
    }

    cat.addChild(cat_body);
    cat.addChild(cat_tail);
    cat_body.addChild(cat_face);
    cat_face.addChild(cat_eye1);
    cat_face.addChild(cat_eye2);
    cat_face.addChild(cat_mouth);
    cat_face.addChild(cat_antenna_left);
    cat_face.addChild(cat_antenna_right);

    cat.setTranslate(0, 214.48);
    
    cat_body.setTranslate(-478.43, 0);
    cat_body.setScale(0.7);   // To prevent the parent scale from affecting the children's global position. We set the children's scale rather than the parent scale.  
    cat_body.updateSelf = function(){
      var float_height = (water.state.drift11 + water.state.drift12)/2 / this.scale;
      var float_theta = atan2(water.state.drift12-water.state.drift11,530);
      this.setTranslate(this.translation[0], float_height/2);
      this.setRotate(float_theta,[750,100]);
    }

    cat_tail.setTranslate(964.08, 0);
    cat_tail.setScale(0.7);   // To prevent the parent scale from affecting the children's global position. We set the children's scale rather than the parent scale. 
    cat_tail.updateSelf = function(){
      var float_height = (water.state.drift21 + water.state.drift22)/2 / this.scale;
      var float_theta = atan2(water.state.drift22-water.state.drift21,530);
      this.setTranslate(this.translation[0], float_height/2);
      this.setRotate(float_theta, [250,100]);
    }

    cat_face.setTranslate(1000,110);
    
    // update eyes-cursor tracing
    cat_eye1.updateSelf = function(){
      const mouseDiff = [mouseX - (this.accX+24), mouseY - (this.accY+3)];
      const th = atan2(mouseDiff[1], mouseDiff[0]);
      if(this.spriteIndex == 0){
        cat_eye1.setRotate(th,[4,4]);
      }
      else{
        cat_eye1.setRotate(0);
      }
      cat_eye1.setTranslate(50,3)
    }

    cat_eye2.updateSelf = function(){
      const mouseDiff = [mouseX - (this.accX+82), mouseY - (this.accY+3)];
      const th = atan2(mouseDiff[1], mouseDiff[0]);
      if(this.spriteIndex == 0){
        cat_eye2.setRotate(th,[4,4]);
      }
      else{
        cat_eye2.setRotate(0);
      }
      cat_eye2.setTranslate(120,3);
    }
    
    cat_mouth.setTranslate(60,96);
    cat_antenna_right.setTranslate(120,-200)
    cat_antenna_left.setTranslate(70,-220)
    
    water.state.drift11 = 0;
    water.state.drift12 = 0;
    water.state.drift21 = 0;
    water.state.drift22 = 0;
    water.drawSelf = function(){
      const water_col = color('#37CADE');
      water_col.setAlpha(0.48*255*this.accAlpha);

      const bodyStart = 0;
      const bodyEnd = cat_body.translation[0] + cat_body.drawnSize[0];
      const tailStart = cat_tail.translation[0];
      const tailEnd = DEFAULT_WIDTH - 10;

      const waterStep = 10
      fill(water_col);
      noStroke();
      beginShape();
      for(let i = 0; i <= DEFAULT_WIDTH; i+=waterStep){
        let water_level = 0
        water_level += cos(this.accTime/700+i/65)
        water_level += cos(-this.accTime/300+i/150)*10
        water_level += sin(this.accTime/2000+i/400)*10
        water_level += sin((i-mouseX+ this.accTime/200)/200)*50 * exp(-(abs(mouseX - i))/DEFAULT_WIDTH)
        vertex(i, water_level + waterLevelAvg);
        // store water level value for cat body drifting
        if(i>=bodyStart && i <bodyStart+waterStep){
          this.state.drift11 = water_level;
        }
        else if(i >= bodyEnd && i < bodyEnd + waterStep){
          this.state.drift12 = water_level;
        }
        else if(i >= tailStart && i < tailStart + waterStep){
          this.state.drift21 = water_level;
        }
        else if(i >= tailEnd && i < tailEnd + waterStep){
          this.state.drift22 = water_level;
        }
      }
      vertex(DEFAULT_WIDTH, waterLevelAvg);
      vertex(DEFAULT_WIDTH, DEFAULT_HEIGHT);
      vertex(0, DEFAULT_HEIGHT);
      endShape(CLOSE);
      
    }
    //water.setTranslate(0, windowHeight*2/3);
    return scene1;
} 

function make_scene_12(loader,loader_buttons ,scene_name="scene1-2"){
  // Config Constants
  const leafNum = 100


  // Defining Nodes
  const scene2 = new Scene(scene_name);
  const bg = new Node("bg",false);
  const leaf_background = new SpriteNode(loader.get_handle("leaf-background.png"),false);
  //const tk = mouseTracker(sm);
  const btn_start = new SpriteNode(loader_buttons.get_handle(["btn-start.png", "btn-start-hovered.png"]),false, true);
  const agreebox = new SpriteNode(loader_buttons.get_handle(["agreebox.png","agreebox-checked.png"]),false, true);
  const text = new SizeNode("text box", 506, 416, false, true)
  const leaf_scatter = new Node("leaf-scatter", false)
  const leaf_nodes = []
  const leaf_names = ["leaf-gray.png", "leaf-green.png", "leaf-light-green.png", "leaf-texture-gray.png", "leaf-texture-light-green.png"]
  for(i=0;i<leafNum;i++){
    leaf_nodes.push(new SpriteNode(loader.get_handle(leaf_names[i%leaf_names.length])))
    leaf_nodes[i].setTranslate(int(random(DEFAULT_WIDTH)), int(random(DEFAULT_HEIGHT)))
    leaf_nodes[i].setRotate(random(Math.PI*2))
    leaf_scatter.addChild(leaf_nodes[i])
  }
  const scroll_handle = new SpriteNode(loader.get_handle("scroll-bar-handle.png"), false, true)
  const scroll_bar = new SpriteNode(loader.get_handle("scroll-bar.png"),false, false)

  // define text node
  text.state.element = document.getElementById("user-agreement");
  text.reloadSelf = function(){
    // show the text element
    text.state.element.style.display = "block";
  }

  text.unloadSelf = function(){
    console.log("unload text Node")
    text.state.element.style.display = "none"
  }

  text.onMouseScroll = function(delta){
    let textdiv = this.state.element;
    textdiv.scrollTop += delta;
    update_box_btn()
    
    // calculate new position of scroll handle
    const maxY = scroll_bar.translation[1] + scroll_bar.size[1] - scroll_handle.size[1]
    const minY = scroll_bar.translation[1]
    const newY = minY + (maxY-minY) * textdiv.scrollTop  / ((text.state.element.scrollHeight - text.state.element.offsetHeight))
    scroll_handle.setTranslate(scroll_handle.translation[0], newY)
  } 
  

  scroll_bar.setTranslate(1023, 219);
  scroll_bar.setSize(12, 362)

  scroll_handle.setTranslate(1023, 219);
  scroll_handle.onMouseEnter = function(){
    cursor_pointer()
  }

  scroll_handle.onMouseExit = function(){
    if(! scroll_handle.isDragging){
      cursor_default()
    }
  }
  scroll_handle.onMouseDragEnd = function(){
    cursor_default()
  }
  scroll_handle.onMousePress = function(){
    this.state.pressedPos = this.translation
  }
  scroll_handle.onMouseDrag = function(event, currentPoint, startPoint){
    const dY = event.movementY / this.parent.scale;
    const maxY = scroll_bar.translation[1] + scroll_bar.size[1] - scroll_handle.size[1]
    const minY = scroll_bar.translation[1]

    console.log('dY :>> ', dY);
    console.log('maxY :>> ', maxY);
    console.log('minY :>> ', minY);

    const newY = constrain(this.translation[1] + dY, minY, maxY)
    const scrollAmount = (newY - minY) / (maxY - minY) * (text.state.element.scrollHeight - text.state.element.offsetHeight)
    // scroll the text element
    text.state.element.scrollTop  = scrollAmount
    // update the visibility of agreebox based on the scroll position
    update_box_btn()
    // translate the scroll handle
    this.setTranslate(this.translation[0], newY)
  }

  function update_box_btn(){
    const textdiv = text.state.element
    const offset = 10
    if(textdiv.scrollTop + offset>= textdiv.scrollHeight - textdiv.offsetHeight){
      console.log("scroll to the end")
      btn_start.show()
      btn_start.activate()
      agreebox.show()
      agreebox.activate()
    }
    else{
      console.log("not yet")
      btn_start.hide()
      btn_start.deactivate()
      agreebox.hide()
      agreebox.deactivate()
    }
  }
  
  scene2.reloadSelf = function(){
    this.show()
    this.activate()
  }
  scene2.unloadSelf = function(){
    console.log("unload Scene2")
    this.deactivate()
    this.hide()
  }
  scene2.addChild(bg);
  bg.addChild(leaf_scatter);
  bg.addChild(leaf_background);
  scene2.addChild(text)
  scene2.addChild(btn_start);
  scene2.addChild(agreebox);
  scene2.addChild(scroll_bar);
  scene2.addChild(scroll_handle);

  //scene2.addChild(tk);
  
 
  btn_start.setCenter(DEFAULT_WIDTH/2, DEFAULT_HEIGHT*0.6);
  btn_start.hide();
  btn_start.deactivate();
  agreebox.setCenter(DEFAULT_WIDTH/2, DEFAULT_HEIGHT*0.5);
  agreebox.hide();
  agreebox.deactivate();

  agreebox.onMouseEnter = function(){
    cursor_pointer()
  }
  agreebox.onMouseExit = function(){
    cursor_default()
  }
  agreebox.onMouseClick = function(){
    this.nextSprite()
    
  }

  btn_start.onMouseEnter = function(){
    this.nextSprite()
    cursor_pointer();
  }
  btn_start.onMouseExit = function(){
    this.prevSprite()
    cursor_default();
  }
  btn_start.onMouseClick = function(){
    
    if(agreebox.spriteIndex == 1){
      cursor_default()
      PubSub.publish("scene2-1", "reload")
      console.log("unloading scene1-2")
      scene2.unload();
    }
  }

  leaf_background.setTranslate(360.42, 0);
  leaf_background.setScale(0.72);

  return scene2;
}