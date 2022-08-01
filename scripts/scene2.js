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
    
    textNode = new TextNode("你是一隻喜歡到處旅遊的綠毛蟲，世界各地都有你的足跡。", true)
    textNode.onMouseEnter = function(){
      console.log("enter text node!!")
    }
    textNode.onMouseExit = function(){
      console.log("exit text node!!")
    }
    textNode.setTranslate(windowWidth*0.25, windowHeight*0.35)

    cloud.addChild(cloud_small)
    cloud.addChild(cloud_medium)
    cloud.addChild(cloud_large)
    scene.addChild(bg);
    scene.addChild(ground);  
    scene.addChild(cloud)
    scene.addChild(grass_left);
    scene.addChild(grass_right);
    //scene.addChild(text)
    scene.addChild(rock);
    scene.addChild(cat)
    scene.addChild(textNode)
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
    //const text_22 = new SpriteNode(loader.get_handle("text-2-2.png"))
    
    const text_22 = new TextNode("你的下個目的地是偶布吉島，\n然而在你眼前還有一條長長的河流。")
    text_22.setTranslate(windowWidth*0.55, windowHeight*0.20)
    

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
          PubSub.publish("scene2-3","reload")
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
    //const text_231 = new SpriteNode(loader.get_handle("text-2-3-1.png"));
    //const text_232 = new SpriteNode(loader.get_handle("text-2-3-2.png"));
    const cat_sweat = new SpriteNode(loader.get_handle(["cat-sweat-1.png", "cat-sweat-2.png"]));
    const cat_boat = new SpriteNode(loader.get_handle("cat-boat.png"));
    
    const text_231 = new TextNode("不管是努力用小小的身體游泳")
    const text_232 = new TextNode("還是收集木板來過河")

    scene.reloadSelf = function(){
      this.activate()
      this.show()
      this.state.invokeNextScene = false
      this.alpha = 0.0
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
    
    bg.drawSelf = function(){
      background(color("#FEFFD2"))
    }

    diagnal_seperator.setTranslate(windowWidth*1.1,- windowHeight*0.13)
    const window_diagnal_size = Math.sqrt(windowWidth*windowWidth + windowHeight*windowHeight)
    const window_diagnal_angle = Math.atan(windowWidth/windowHeight)
    diagnal_seperator.setSize(diagnal_seperator.size[0]*1.3, window_diagnal_size*1.1)
    diagnal_seperator.setRotate(window_diagnal_angle)
  
    fish_small.setTranslate(windowWidth*0.3, windowHeight*0.5)
    fish_small.updateSelf = function(){
        // the fish moves toward left, so we decrease the x coordinate gradually
        this.setTranslate(this.translation[0]-0.5,this.translation[1])
    }
        
    fish_medium.setTranslate(windowWidth *0.1, windowHeight * 0.7)
    fish_medium.updateSelf = function(){
        // the fish moves toward left, so we decrease the x coordinate gradually
        this.setTranslate(this.translation[0]-0.5,this.translation[1])
    }
    fish_large.setTranslate(windowWidth *0.15, windowHeight * 0.73)
    fish_large.updateSelf = function(){
        // the fish moves toward left, so we decrease the x coordinate gradually
        this.setTranslate(this.translation[0]-0.5,this.translation[1])
    }

    text_231.setTranslate(windowWidth*0.3, windowHeight*0.1)
    text_232.setTranslate(windowWidth*0.7, windowHeight*0.4)

    cat_sweat.setTranslate(windowWidth*0.2, windowHeight*0.5 - cat_sweat.drawnSize[1])
    cat_boat.setTranslate(windowWidth*0.7, windowHeight*0.8 - cat_boat.drawnSize[1])
  
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
    scene.addChild(fish_small);
    scene.addChild(fish_medium);
    scene.addChild(fish_large);
    scene.addChild(text_231);
    scene.addChild(text_232);
   
    return scene
  }
  
  
  function make_scene_24(loader, scene_name = "scene2-4"){
    
    scene = new Scene(scene_name);
    const tree_brown = new SpriteNode(loader.get_handle("tree-brown.png"));
    const tree_dark_green = new SpriteNode(loader.get_handle("tree-dark-green.png"));
    const tree_dark_green_small =  new SpriteNode(loader.get_handle("tree-dark-green.png"));
    const tree_light_green = new SpriteNode(loader.get_handle("tree-light-green.png"));
    const tree_brown_2 = new SpriteNode(loader.get_handle("tree-brown.png"));
    const island_cheer = new SpriteNode(loader.get_handle("island-cheer.png"));
    //const text_24 = new SpriteNode(loader.get_handle("text-2-4.png"));
    const flag_cheer = new SpriteNode(loader.get_handle("flag-cheer.png"));
    const cat_cheer = new SpriteNode(loader.get_handle("cat-cheer.png"));
    const coconut1 = new SpriteNode(loader.get_handle("coconut.png"));
    const coconut2 = new SpriteNode(loader.get_handle("coconut.png"));
    const coconut3 = new SpriteNode(loader.get_handle("coconut.png"));
    
    const text_24 = new TextNode("想辦法過河，前往偶布吉島吧！");

    scene.reloadSelf = function(){
      this.activate()
      this.show()
      this.state.invokeNextScene = false
      this.alpha = 0.0
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
          PubSub.publish("scene3-1","reload")
          this.state.invokeNextScene = true
        }
        this.alpha = 1 - (this.accTime-7000) / 500
      }
      if(this.accTime > 7500){
        this.deactivate()
        this.hide()
      }
    }
    
    text_24.setTranslate(windowWidth*0.5 - text_24.drawnSize[0]/2, windowHeight*0.25 - text_24.drawnSize[1]/2)
    
    cat_cheer.updateSelf = function(){
      this.setTranslate(windowWidth*0.4, pulse(windowHeight-this.drawnSize[1]-island_cheer.drawnSize[1]+20, windowHeight*0.3, 1000)(this.accTime))
    }

    tree_brown.setTranslate(windowWidth*-0.0, windowHeight - tree_brown.drawnSize[1])
    tree_dark_green.setTranslate(windowWidth*0.05, windowHeight -100 - tree_dark_green.drawnSize[1])
    tree_light_green.setTranslate(windowWidth*0.8, windowHeight -100 - tree_light_green.drawnSize[1])
    tree_brown_2.setTranslate(windowWidth*0.75, windowHeight -50 - tree_brown_2.drawnSize[1])
    tree_dark_green_small.setScale(0.5)
    tree_dark_green_small.setTranslate(windowWidth*0.8, windowHeight -50 - tree_dark_green_small.drawnSize[1])
    
    
    tree_dark_green.addChild(coconut1)
    tree_dark_green.addChild(coconut2)
    tree_dark_green.addChild(coconut3)
    coconut1.setTranslate(tree_dark_green.drawnSize[0]*0.45, 400)
    coconut2.setTranslate(tree_dark_green.drawnSize[0]*0.55, 410)
    coconut3.setTranslate(tree_dark_green.drawnSize[0]*0.9, 700)

    flag_cheer.setTranslate(windowWidth*0.55, windowHeight - island_cheer.drawnSize[1] - flag_cheer.drawnSize[1])

    island_cheer.setSize(windowWidth, island_cheer.drawnSize[1])
    island_cheer.setCenter(windowWidth*0.5,  windowHeight - island_cheer.drawnSize[1]*0.5)


    const bg = new Node("bg",false);
    bg.drawSelf = function(){
      background(color("#FEFFD2"))
    }
    scene.addChild(bg);
    scene.addChild(island_cheer);
    scene.addChild(tree_dark_green);
    scene.addChild(tree_light_green);
    scene.addChild(tree_brown_2);
    scene.addChild(tree_brown);
    scene.addChild(tree_dark_green_small);
    scene.addChild(flag_cheer);
    scene.addChild(cat_cheer);
    scene.addChild(text_24);

    return scene
  }