function make_scene(sm, scene_name="scene1"){      
    loader = new SpriteLoader("assets/Scene1/Scene1.json");    
    var scene1 = new Scene(scene_name);
    
    var bg = new Node("background");
    bg.draw_self = ()=>{background(color("#FEFFD2"));}
    
    var cat = new SpriteNode(loader.get_handle("cat_small.png"));
    var cat_face = new SpriteNode(loader.get_handle(["cat_face1.png","cat_face2.png"]));
    cat.add_child(cat_face);
    cat.update_self = function(deltaT, dw, dh){
      cat.set_translate(-this.size[0]*0.52,windowHeight*0.25)
      if(this.acc_t < 250){
        this.scale = this.acc_t/100
      }else{
        this.scale = 2.5
      }
    }
    cat_face.set_translate(370, 87);
    cat_face.set_scale(0.5)
  
    var cat_tail = new SpriteNode(loader.get_handle("cat_small.png"));
    cat_tail.set_scale(2.5)
    cat_tail.update_self = function(dt,dw,dh){
      this.set_translate(windowWidth - this.size[0]*0.52, windowHeight*0.25)
    }
  
  
    var big_title = new SpriteNode(loader.get_handle("title_small.png")); 
    var sub_title = new SpriteNode(loader.get_handle("subTitle.png"));
  
    big_title.add_child(sub_title);
    big_title.update_self = function(dt,dw,dh){
      big_title.set_translate(dw/2- this.size[0]/2 ,dh*0.2);
      big_title.set_scale(2)
    }
    
    sub_title.set_translate(72, 158)
  
    
    var go_btn = new SpriteNode(loader.get_handle(["go_btn.png", "go_btn_hovered.png"]));
    go_btn.update_self = function(dt,dw,dh){
      this.set_translate(dw/2-this.size[0]/2, dh*0.7);
      if(this.mouse_hovered()){
        this.sp_index = 1;
        cat_face.sp_index = 0;
      }
      else{
        this.sp_index = 0;
        cat_face.sp_index = 1;
      }
    }
  
    var water = new Node("water")
    water.draw_self = function(){
      fill('rgba(10,10,255,0.3)');
      noStroke();
      beginShape();
      //rect(0,0,windowWidth, windowHeight/3);
      for(let i = 0; i < windowWidth; i+=10){
        vertex(i, windowHeight/3 + sin(i/10+this.acc_t/1000)*windowHeight/7);
      }
      endShape(CLOSE);
    }
    water.set_translate(0, windowHeight*2/3);
  
  
    scene1.add_child(bg);
    scene1.add_child(cat);
    scene1.add_child(cat_tail);
    scene1.add_child(big_title);
    scene1.add_child(go_btn);
    scene1.add_child(water);
    
  
    loader.load().then(function(loader){
      PubSub.publish(scene_name, "activate");
      PubSub.publish(scene_name, "show");
    })
    console.log(scene1)
    return scene1;
  } 