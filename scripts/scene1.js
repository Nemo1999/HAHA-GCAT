
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
    const tk = mouseTracker();
  

    // controll constants
    const waterLevelAvg = windowHeight * 0.7
    const ratio_catBody_windowWidth = 0.7
    const ratio_catHeightAboveWater_catHeight = 0.7
    const ratio_catTail_catBody = 670/cat_body.size[0]
    
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
    scene1.addChild(tk);

    
    
    title.updateSelf = function(){
      title.setCenter((windowWidth)/2, windowHeight*0.35);
    }
    btn_go.updateSelf = function(){
      this.setCenter(windowWidth/2, windowHeight*0.7);
    }
    
    
    btn_go.onMouseEnter = function(){
      btn_go.nextSprite();
      cat_eye1.nextSprite();
      cat_eye2.nextSprite();
      cat_antenna_right.setRotate(0.2,[0,100]);
      cat_antenna_left.setRotate(0.1,[0,100]);
    }
    btn_go.onMouseExit = function(){
      btn_go.prevSprite();
      cat_eye1.prevSprite();
      cat_eye2.prevSprite();
      cat_antenna_left.setRotate(0);
      cat_antenna_right.setRotate(0);
    }
    btn_go.onMouseClick = function(){
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
    
    cat_body.updateSelf = function(){
      var float_height = (water.state.drift11 + water.state.drift12)/2 / this.accScale;
      var float_theta = atan2(water.state.drift12-water.state.drift11,530);
      this.setTranslate(0, float_height/2);
      this.setRotate(float_theta/2,[750,100]);
    }

    cat_tail.updateSelf = function(){
      var w = windowWidth / this.accScale
      var float_height = (water.state.drift21 + water.state.drift22)/2 / this.accScale;
      var float_theta = atan2(water.state.drift22-water.state.drift21,530);
      this.setTranslate(w, float_height/2);
      this.setRotate(float_theta/2, [250,100]);
    }
    cat_face.setTranslate(1000,110);
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

    cat.updateSelf = function(){
        this.setScale(windowWidth*ratio_catBody_windowWidth / cat_body.size[0]);
        this.setTranslate(-cat_body.size[0]*this.accScale*ratio_catTail_catBody,
           windowHeight*0.7-cat_body.size[1]*this.accScale*ratio_catHeightAboveWater_catHeight);
        //console.log(cat)
    }
    
    water.state.drift11 = 0;
    water.state.drift12 = 0;
    water.state.drift21 = 0;
    water.state.drift22 = 0;
    water.drawSelf = function(){
      const water_col = color('#37CADE')
      water_col.setAlpha(0.48*255*this.accAlpha)
      const catLength = windowWidth * ratio_catBody_windowWidth
      const bodyStart = 0
      const bodyEnd = catLength * (1-ratio_catTail_catBody)
      const tailStart = windowWidth - catLength * ratio_catTail_catBody
      const tailEnd = windowWidth - 10
      const waterStep = 10
      fill(water_col);
      noStroke();
      beginShape();
      for(let i = 0; i < windowWidth; i+=waterStep){
        let water_level = 0
        water_level += cos(this.accTime/700+i/65)
        water_level += cos(-this.accTime/300+i/150)*10
        water_level += sin(this.accTime/2000+i/400)*30
        water_level += sin((i-mouseX+ this.accTime/200)/200)*50 * exp(-(abs(mouseX - i))/windowWidth*3)
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
      vertex(windowWidth, waterLevelAvg)
      vertex(windowWidth, windowHeight);
      vertex(0, windowHeight);
      endShape(CLOSE);
      
    }
    //water.setTranslate(0, windowHeight*2/3);
    return scene1;
} 

function make_scene_12(loader, scene_name="scene1-2"){
  // Config Constants
  const leafNum = 100


  // Defining Nodes
  const scene2 = new Scene(scene_name);
  const bg = new Node("bg",false);
  const leaf_background = new SpriteNode(loader.get_handle("leaf-background.png"),false);
  //const tk = mouseTracker(sm);
  const btn_start = new SpriteNode(loader.get_handle(["btn-start.png", "btn-start-hovered.png"]),false, true);
  const agreebox = new SpriteNode(loader.get_handle(["agreebox.png","agreebox-checked.png"]),false, true);
  const text = new SizeNode("text box", windowWidth*0.5, windowHeight*0.55, false, true)
  const leaf_scatter = new Node("leaf-scatter", false)
  const leaf_nodes = []
  const leaf_names = ["leaf-gray.png", "leaf-green.png", "leaf-light-green.png", "leaf-texture-gray.png", "leaf-texture-light-green.png"]
  for(i=0;i<leafNum;i++){
    leaf_nodes.push(new SpriteNode(loader.get_handle(leaf_names[i%leaf_names.length])))
    leaf_nodes[i].setTranslate(int(random(windowWidth)), int(random(windowHeight)))
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
  text.updateSelf = function(){
    text.state.ratio_offset_scroll = text.state.element.offsetHeight / text.state.element.scrollHeight 
    this.fitDrawnSize(windowWidth*0.36, windowHeight*0.55);
    this.setTranslate(windowWidth/2-this.drawnSize[0]/2, windowHeight/2-this.drawnSize[1]/2);
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
    scroll_handle.setTranslate(this.translation[0], newY)
  } 
  

  
  scroll_bar.updateSelf = function(){
    scroll_bar.setTranslate(windowWidth*0.68, windowHeight*0.22)
  }
  

  scroll_handle.setTranslate(windowWidth*0.68, windowHeight * 0.22)
  scroll_handle.updateSelf = function(){
    scroll_handle.fitDrawnSize(scroll_bar.size[0], scroll_bar.size[1]*text.state.ratio_offset_scroll)
    scroll_handle.setTranslate(windowWidth*0.68, this.translation[1])
  }
  
  scroll_handle.onMousePress = function(){
    this.state.pressedPos = this.translation
  }
  scroll_handle.onMouseDrag = function(self, currentPoint, startPoint){
    
    const dY = currentPoint[1] - startPoint[1]
    const maxY = scroll_bar.translation[1] + scroll_bar.size[1] - scroll_handle.size[1]
    const minY = scroll_bar.translation[1]
    const newY = constrain(this.state.pressedPos[1] + dY,minY, maxY)
    const scrollAmount = (newY - minY) / (maxY - minY) * (text.state.element.scrollHeight - text.state.element.offsetHeight)
    // scroll the text element
    text.state.element.scrollTop  = scrollAmount
    // update the visibility of agreebox based on the scroll position
    update_box_btn()
    // translate the scroll handle
    this.setTranslate(this.state.pressedPos[0], newY)
  }

  function update_box_btn(){
    const textdiv = text.state.element
    const offset = 100
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
  

  btn_start.setCenter(windowWidth/2, windowHeight*0.6);
  btn_start.hide();
  btn_start.deactivate();
  agreebox.setCenter(windowWidth/2, windowHeight*0.5);
  agreebox.hide();
  agreebox.deactivate();

  agreebox.onMouseClick = function(){
    this.nextSprite()
  }

  btn_start.onMouseEnter = function(){
    this.nextSprite()
  }
  btn_start.onMouseExit = function(){
    this.prevSprite()
  }
  btn_start.onMouseClick = function(){
    if(agreebox.spriteIndex == 1){
      PubSub.publish("scene2-1", "reload")
      console.log("unloading scene1-2")
      scene2.unload();
    }
  }

  leaf_background.updateSelf = function(){
    leaf_background.setCenter(windowWidth/2, windowHeight/2);
    leaf_background.fitDrawnSize(windowWidth*0.6 ,windowHeight);
  }

  bg.drawSelf = function(){
    background(color("#FEFFD2"))
  }
  return scene2;
}

function make_scene_21(loader, scene_name = "scene2-1"){
  scene = new Scene(scene_name);
  const bg = new Node("bg",false);
  const ground = new Node("ground", false);
  const cat = new SpriteNode(loader.get_handle("cat-travel.png"))
  const cloud = new Node("clouds", false)
  const cloud_small = new SpriteNode(loader.get_handle("cloud-small.png"))
  const cloud_medium = new SpriteNode(loader.get_handle("cloud-medium.png"))
  const cloud_large = new SpriteNode(loader.get_handle("cloud-large.png"))
  const grass_left = new SpriteNode(loader.get_handle("grass-left.png"))
  const grass_right = new SpriteNode(loader.get_handle("grass-right.png"))
  const rock = new SpriteNode(loader.get_handle(["rock.png", "rock-blink.png"]))
  const text = new SpriteNode(loader.get_handle("text-2-1.png"))

  scene.reloadSelf = function(){
    this.alpha = 0.0
    this.state.invokeNextScene = false
    this.activate()
    this.show()
  }
  scene.updateSelf = function(){
    if(this.accTime < 1500){
      this.alpha = this.accTime / 1500
    }
    else{
      this.alpha = null
    }

    if(this.accTime > 7000){
      if(this.state.invokeNextScene == false){
        PubSub.publish("scene2-2","reload")
        this.state.invokeNextScene = true
      }
      this.alpha = 1 - (this.accTime-7000) / 500
    }
    if(this.accTime > 7500){
      this.deactivate()
      this.hide()
    }
  }

  text.setTranslate(windowWidth*0.25, windowHeight*0.35)

  grass_left.setTranslate(windowWidth*0.2, windowHeight*0.85)
  grass_right.setTranslate(windowWidth*0.75, windowHeight*0.64)

  rock.setTranslate(windowWidth*0.6, windowHeight*0.9)
  rock.updateSelf = function(){
    const duty = this.accTime % 2000
    if(duty > 1200 && duty < 1500){
      this.setSprite(1)
    }
    else{
      this.setSprite(0)
    }
  }  

  ground.drawSelf = function(){
    noStroke();
    rectMode(CORNER)
    const ground_color = color("#D4BFA5")
    ground_color.setAlpha(this.accAlpha*255)
    fill(ground_color)
    rect(0,windowHeight*0.66, windowWidth, windowHeight)
  }

  bg.drawSelf = function(){
    background(color("#FEFFD2"))
  }

  cloud_small.updateSelf = function(){
    this.setScale(pulse(1, 1.1, 3000, 0.6, 0.4) (this.accTime))
  }
  cloud_medium.updateSelf = function(){
    this.setScale(pulse(1, 1.1, 3000, 0.5, 0.4)(this.accTime))
  }
  cloud_large.updateSelf = function(){
    this.setScale(pulse(1, 1.1, 3000, 0.4, 0.4)(this.accTime))
  }
  cloud_small.setTranslate(windowWidth*0.15, windowHeight*0.12)
  cloud_medium.setTranslate(windowWidth*0.26, windowHeight*0.20)
  cloud_large.setTranslate(windowWidth*0.70, windowHeight*0.10)
  
  cloud.updateSelf = function(){
    this.setTranslate(10*sin(this.accTime/600),10*cos(this.accTime/600))
  }

  cat.setTranslate(windowWidth*0.1,windowHeight*0.65)
  cat.updateSelf = function(){
    if(this.accTime < 7000){
      this.setTranslate(windowWidth*((0.5-0.1)*this.accTime/7000+0.1),windowHeight*0.65)
    }
  }


  cloud.addChild(cloud_small)
  cloud.addChild(cloud_medium)
  cloud.addChild(cloud_large)
  scene.addChild(bg);
  scene.addChild(ground);  
  scene.addChild(cloud)
  scene.addChild(grass_left);
  scene.addChild(grass_right);
  scene.addChild(text)
  scene.addChild(rock);
  scene.addChild(cat)
  return scene
}

function make_scene_22(loader, scene_name = "scene2-2"){
  const scene = new Scene(scene_name);
  const bg = new Node("bg",false);
  const water = new Node("water",false)
  const cat = new Node("cat", false);
  const birds = new Node("birds",false);
  const cat_head = new SpriteNode(loader.get_handle("cat-head.png"))
  const cat_antenna_left = new SpriteNode(loader.get_handle("antenna-left.png"))
  const cat_antenna_right = new SpriteNode(loader.get_handle("antenna-right.png"))
  const island = new SpriteNode(loader.get_handle("island.png"))
  const flag = new SpriteNode(loader.get_handle("flag.png"))
  const bird1 = new SpriteNode(loader.get_handle(["bird.png","bird-flap.png"]))
  const bird2 = new SpriteNode(loader.get_handle(["bird.png","bird-flap.png"]))
  const bird3 = new SpriteNode(loader.get_handle(["bird.png","bird-flap.png"]))
  const island_flag = new Node("island_and_flag",false)
  const text_22 = new SpriteNode(loader.get_handle("text-2-2.png"))
  
  text_22.setTranslate(windowWidth*0.55, windowHeight*0.20)

  scene.reloadSelf = function(){
    this.activate()
    this.show()
  }

  scene.updateSelf = function(){
    if(this.accTime < 1500){
      this.alpha = this.accTime / 1500
    }
    else{
      this.alpha = null
    }

    if(this.accTime > 7000){
      if(this.state.invokeNextScene == false){
        PubSub.publish("scene2-4","reload")
        this.state.invokeNextScene = true
      }
      this.alpha = 1 - (this.accTime-7000) / 500
    }
    if(this.accTime > 7500){
      this.deactivate()
      this.hide()
    }
  }

  birds.addChild(bird1)
  birds.addChild(bird2)
  birds.addChild(bird3)

  bird1.setTranslate(100,100)
  bird1.setScale(0.3)

  bird2.setTranslate(windowWidth*0.1 ,200)
  bird2.setScale(0.7)
  bird2.setRotate(-0.4)

  bird3.setTranslate(windowWidth*0.9, 200)
  bird3.setScale(0.5)
  bird3.setRotate(0.1)

  bird1.updateSelf = function(){
    const duty = this.accTime % 1000
    if(duty > 200 && duty < 500){
      if(this.spriteIndex == 0){
        this.setSprite(1)
        this.setTranslate(this.translation[0],this.translation[1]-10)
      }
    }
    else{
      if(this.spriteIndex == 1){
        this.setSprite(0)
        this.setTranslate(this.translation[0],this.translation[1]+10)
      }
    }
  } 

  bird2.updateSelf = function(){
    const duty = this.accTime % 1000
    if(duty > 100 && duty < 400){
      if(this.spriteIndex == 0){
        this.setSprite(1)
        this.setTranslate(this.translation[0],this.translation[1]-10)
      }
    }
    else{
      if(this.spriteIndex == 1){
        this.setSprite(0)
        this.setTranslate(this.translation[0],this.translation[1]+10)
      }
    }
  } 

  bird3.updateSelf = function(){
    const duty = this.accTime % 1000
    if(duty > 300 && duty < 600){
      if(this.spriteIndex == 0){
        this.setSprite(1)
        this.setTranslate(this.accX,this.accY-10)
      }
    }
    else{
      if(this.spriteIndex == 1){
        this.setSprite(0)
        this.setTranslate(this.translation[0],this.translation[1]+10)
      }
      
    }
  }  


  cat.setTranslate(windowWidth*0.1, windowHeight - cat_head.drawnSize[1])
  cat.addChild(cat_head);
  cat.addChild(cat_antenna_left);
  cat.addChild(cat_antenna_right);
  
  cat_antenna_left.setTranslate(360,-350)
  cat_antenna_right.setTranslate(540,-200)
  cat_head.setTranslate(0,0)

  
  island_flag.addChild(island)
  island_flag.addChild(flag)
  island_flag.setTranslate(windowWidth*0.6, windowHeight*0.61 - island.drawnSize[1]*0.7)
  flag.setTranslate(island.size[0]*0.6,flag.size[1]*-0.9)

  const waterLevelAvg = windowHeight * 0.6
  water.drawSelf = function(){
    const water_col = color('#37CADE')
    water_col.setAlpha(0.48*255*this.accAlpha)
    const waterStep = 10
    fill(water_col);
    noStroke();
    beginShape();
    for(let i = 0; i < windowWidth; i+=waterStep){
      let water_level = 0
      water_level += cos(this.accTime/700+i/65)
      water_level += cos(-this.accTime/300+i/150)*5
      water_level += sin(this.accTime/2000+i/400)*10
      vertex(i, water_level + waterLevelAvg);
    }
    vertex(windowWidth, waterLevelAvg)
    vertex(windowWidth, windowHeight);
    vertex(0, windowHeight);
    endShape(CLOSE);
    
  }
  
  bg.drawSelf = function(){
    background(color("#FEFFD2"))
  }

  scene.addChild(bg);
  scene.addChild(island_flag);
  scene.addChild(water);
  scene.addChild(cat);
  scene.addChild(birds);
  scene.addChild(text_22);
  return scene
}

function make_scene_23(loader, scene_name = "scene2-3"){
  const scene = new Scene(scene_name);
  const bg = new Node("bg",false);
  const diagnal_seperator = new SpriteNode(loader.get_handle("diagnal-seperator.png"));
  const water_top_left = new Node("water_top_left",false);
  const water_buttom_right = new Node("water_buttom_right",false);
  const fish_small = new SpriteNode(loader.get_handle("fish-small.png"));
  const fish_medium = new SpriteNode(loader.get_handle("fish-medium.png"));
  const fish_large = new SpriteNode(loader.get_handle("fish-large.png"));
  const text_231 = new SpriteNode(loader.get_handle("text-2-3-1.png"));
  const text_232 = new SpriteNode(loader.get_handle("text-2-3-2.png"));
  const cat_sweat = new SpriteNode(loader.get_handle(["cat-sweat-1.png", "cat-sweat-2.png"]));
  const cat_boat = new SpriteNode(loader.get_handle("cat-boat.png"));

  scene.reloadSelf = function(){
    this.activate()
    this.show()
  }
  scene.updateSelf = function(){
    if(this.accTime < 1500){
      this.alpha = this.accTime / 1500
    }
    else{
      this.alpha = null
    }

    if(this.accTime > 7000){
      if(this.state.invokeNextScene == false){
        PubSub.publish("scene2-4","reload")
        this.state.invokeNextScene = true
      }
      //this.alpha = 1 - (this.accTime-7000) / 500
    }
    if(this.accTime > 7500){
      this.deactivate()
      //this.hide()
    }
  }
  
  bg.drawSelf = function(){
    background(color("#FEFFD2"))
  }

  diagnal_seperator.setTranslate(windowWidth*1.1,- windowHeight*0.13)
  const window_diagnal_size = Math.sqrt(windowWidth*windowWidth + windowHeight*windowHeight)
  const window_diagnal_angle = Math.atan(windowWidth/windowHeight)
  diagnal_seperator.setSize(diagnal_seperator.size[0]*1.3, window_diagnal_size*1.1)
  diagnal_seperator.setRotate(window_diagnal_angle)

  cat_sweat.setTranslate(windowWidth*0.2, windowHeight*0.4 - cat_sweat.drawnSize[1])
  cat_boat.setTranslate(windowWidth*0.7, windowHeight*0.7 - cat_boat.drawnSize[1])

  water_top_left.drawSelf = function(){
    const waterLevelAvg = windowHeight * 0.4
    const water_col = color('#37CADE')
    water_col.setAlpha(0.48*255*this.accAlpha)
    const waterStep = 10
    fill(water_col);
    noStroke();
    beginShape();
    for(let i = 0; i < windowWidth * 0.59; i+=waterStep){
      let water_level = 0
      water_level += cos(this.accTime/700+i/65)
      water_level += cos(-this.accTime/300+i/150)*5
      water_level += sin(this.accTime/2000+i/400)*10
      vertex(i, water_level + waterLevelAvg);
    }
    vertex(windowWidth*0.6-10, waterLevelAvg)
    //vertex(windowWidth, windowHeight);
    vertex(0, windowHeight);
    endShape(CLOSE);
    
  }

  water_buttom_right.drawSelf = function(){
    const waterLevelAvg = windowHeight * 0.7
    const water_col = color('#37CADE')
    water_col.setAlpha(0.48*255*this.accAlpha)
    const waterStep = 10
    fill(water_col);
    noStroke();
    beginShape();
    for(let i = windowWidth*0.3+10 ; i < windowWidth; i+=waterStep){
      let water_level = 0
      water_level += cos(this.accTime/700+i/65)
      water_level += cos(-this.accTime/300+i/150)* 5
      water_level += sin(this.accTime/2000+i/400)* 10
      vertex(i, water_level + waterLevelAvg);
    }
    vertex(windowWidth, waterLevelAvg)
    vertex(windowWidth, windowHeight);
    vertex(0, windowHeight);
    vertex(windowWidth*0.3-10, windowHeight*0.7)
    endShape(CLOSE);
    
  }

  scene.addChild(bg);
  scene.addChild(water_top_left);
  scene.addChild(water_buttom_right);
  scene.addChild(diagnal_seperator)
  scene.addChild(cat_sweat)
  scene.addChild(cat_boat)
 
  return scene
}


function make_scene_24(loader, scene_name = "scene2-4"){
  scene = new Scene(scene_name);
  scene.reloadSelf = function(){
    this.activate()
    this.show()
  }
  scene.updateSelf = function(){
    if(this.accTime < 1500){
      this.alpha = this.accTime / 1500
    }
    else{
      this.alpha = null
    }

    if(this.accTime > 7000){
      if(this.state.invokeNextScene == false){
        PubSub.publish("scene3","reload")
        this.state.invokeNextScene = true
      }
      this.alpha = 1 - (this.accTime-7000) / 500
    }
    if(this.accTime > 7500){
      this.deactivate()
      this.hide()
    }
  }

  const bg = new Node("bg",false);
  bg.drawSelf = function(){
    background(color("#FEFFD2"))
  }
  scene.addChild(bg);
  return scene
}