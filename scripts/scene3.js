function make_scene_31(loader, loader_cat, loader_buttons, scene_name = "scene3-1"){
    
    scene = new Scene(scene_name);
    const harbour = new SpriteNode(loader.get_handle("harbour.png"));
    const btn_next = new SpriteNode(loader_buttons.get_handle(["btn-next.png","btn-next-hovered.png"]),false, true);
    const checkbox1 = new SpriteNode(loader_buttons.get_handle(["checkbox-green.png","checkbox-green-checked.png"]),false, true);
    const checkbox2 = new SpriteNode(loader_buttons.get_handle(["checkbox-green.png","checkbox-green-checked.png"]),false, true);
    const question_31 = new SpriteNode(loader.get_handle("question3-1.png"));
    const option1 = new Node("option1",false);
    const option2 = new Node("option2",false);
    const answer_311 = new SpriteNode(loader.get_handle("answer3-1-1.png"));
    const answer_312 = new SpriteNode(loader.get_handle("answer3-1-2.png"));
    const cat_init = new SpriteNode(loader.get_handle("cat-init.png"));
    const backpack = new SpriteNode(loader.get_handle("backpack.png"));
    const water = new Node("water",false)
    
    const birds = new Node("birds",false);
    const bird1 = new SpriteNode(loader.get_handle(["bird.png","bird-flap.png"]))
    const bird2 = new SpriteNode(loader.get_handle(["bird.png","bird-flap.png"]))
    const bird3 = new SpriteNode(loader.get_handle(["bird.png","bird-flap.png"]))
    
    const cloud = new Node("clouds", false)
    const cloud_small = new SpriteNode(loader.get_handle("cloud-small.png"))
    const cloud_medium = new SpriteNode(loader.get_handle("cloud-medium.png"))
    const cloud_large = new SpriteNode(loader.get_handle("cloud-large.png"))

    question_31.setTranslate(windowWidth*0.2, windowHeight*0.1);
    option1.addChild(answer_311);
    option1.addChild(checkbox1);
    option2.addChild(answer_312);
    option2.addChild(checkbox2);
    answer_311.setTranslate(checkbox1.drawnSize[0]+10,0)
    answer_312.setTranslate(checkbox2.drawnSize[0]+10,0)
    option1.setTranslate(windowWidth*0.23, windowHeight*0.2);
    option2.setTranslate(windowWidth*0.23, windowHeight*0.3);

    birds.addChild(bird1)
    birds.addChild(bird2)
    birds.addChild(bird3)
  
    bird1.setTranslate(windowWidth*0.7,100)
    bird1.setScale(0.3)
  
    bird2.setTranslate(windowWidth*0.73 ,200)
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
    cloud.addChild(cloud_small)
    cloud.addChild(cloud_medium)
    cloud.addChild(cloud_large)
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

    const waterLevelAvg = windowHeight * 0.7
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

    harbour.setTranslate(0,this.windowHeight - harbour.drawnSize[1])

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
    }

    const bg = new Node("bg",false);
    bg.drawSelf = function(){
      background(color("#FEFFD2"))
    }
    scene.addChild(bg);
    scene.addChild(cloud)
    scene.addChild(birds)
    scene.addChild(question_31);
    scene.addChild(option1);
    scene.addChild(option2);
    scene.addChild(water);
    scene.addChild(harbour);
    return scene
  }